// 교환거래 신청 바텀시트 — 4단계 스텝 폼

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, BRANDS } from '@/lib/constants';
import { useExchangeStore } from '@/store/useExchangeStore';
import { useAuthStore } from '@/store/useAuthStore';

const TOTAL_STEPS = 4;
const BRAND_OPTIONS = [...BRANDS, '기타'] as const;
const CONDITION_OPTIONS = [
  { value: 'S', label: 'S급', desc: '미착용·새상품' },
  { value: 'A', label: 'A급', desc: '양호한 상태' },
  { value: 'B', label: 'B급', desc: '사용감 있음' },
  { value: 'C', label: 'C급', desc: '수리 필요' },
];
const KIT_OPTIONS = ['풀세트', '풀박스', '시계만'] as const;
const CONTACT_METHODS = ['전화', '문자', '카카오톡'] as const;

interface ExchangeSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ExchangeSheet = ({ visible, onClose }: ExchangeSheetProps) => {
  const {
    step, formData, done,
    setStep, setFormField, setDone, reset, isStepValid,
  } = useExchangeStore();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleClose = () => {
    reset();
    onClose();
  };

  // 사진 슬롯별 선택 + 업로드
  const handlePickPhoto = async (index: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setUploadingIndex(index);
      const uri = result.assets[0].uri;
      const { uploadPhotos } = useExchangeStore.getState();
      const urls = await uploadPhotos([uri]);
      if (urls.length > 0) {
        const newPhotos = [...formData.photos];
        newPhotos[index] = urls[0];
        setFormField('photos', newPhotos);
      } else {
        Alert.alert('오류', '사진 업로드에 실패했습니다');
      }
      setUploadingIndex(null);
    }
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    // 마지막 단계 — 로그인 체크 후 제출
    const { isLoggedIn } = useAuthStore.getState();
    if (!isLoggedIn) {
      Alert.alert(
        '로그인 필요',
        '교환거래 신청은 로그인 후 이용 가능합니다.\n로그인 화면은 MY 탭에서 접속할 수 있습니다.',
        [{ text: '확인', onPress: handleClose }]
      );
      return;
    }

    const { submitRequest } = useExchangeStore.getState();
    const { success } = await submitRequest();
    if (success) {
      setDone(true);
    } else {
      Alert.alert('오류', '신청 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // 완료 화면
  const renderCompletion = () => {
    const myBrand = formData.myBrand === '기타' ? formData.myCustomBrand : formData.myBrand;
    const wantedBrand = formData.wantedBrand === '기타' ? formData.wantedCustomBrand : formData.wantedBrand;
    return (
      <View style={styles.completionContainer}>
        <Ionicons name="checkmark-circle" size={52} color={COLORS.green} />
        <Text style={styles.completionTitle}>교환거래 신청 완료!</Text>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryHalf}>
              <Text style={styles.summaryLabel}>내 시계</Text>
              <Text style={styles.summaryValue}>{myBrand}</Text>
              <Text style={styles.summaryModel}>{formData.myModel}</Text>
              <Text style={styles.summaryGrade}>{formData.myCondition}급</Text>
            </View>
            <View style={styles.summaryArrow}>
              <Ionicons name="repeat" size={22} color={COLORS.sub} />
            </View>
            <View style={styles.summaryHalf}>
              <Text style={styles.summaryLabel}>원하는 시계</Text>
              <Text style={styles.summaryValue}>{wantedBrand}</Text>
              <Text style={styles.summaryModel}>{formData.wantedModel}</Text>
              {formData.wantedCondition !== '' && (
                <Text style={styles.summaryGrade}>희망 {formData.wantedCondition}급</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📞 1~2 영업일 내에 연락드립니다</Text>
          <Text style={styles.infoSubText}>전문가 검토 → 딜 제시 → 거래 확정</Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleClose}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Step 1 — 내 시계 정보
  const renderStep1 = () => (
    <View>
      <Text style={styles.stepQuestion}>교환할 내 시계는?</Text>

      <Text style={styles.inputLabel}>브랜드 *</Text>
      <View style={styles.brandGrid}>
        {BRAND_OPTIONS.map((brand) => {
          const isSelected = formData.myBrand === brand;
          return (
            <TouchableOpacity
              key={brand}
              style={[styles.brandButton, isSelected && styles.brandButtonSelected]}
              onPress={() => setFormField('myBrand', brand)}
            >
              <Text style={[styles.brandButtonText, isSelected && styles.brandButtonTextSelected]}>
                {brand}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* '기타' 선택 시 직접 입력 */}
      {formData.myBrand === '기타' && (
        <TextInput
          style={[styles.inputField, { marginTop: SPACING.sm }]}
          placeholder="브랜드명 직접 입력"
          placeholderTextColor={COLORS.sub}
          value={formData.myCustomBrand}
          onChangeText={(v) => setFormField('myCustomBrand', v)}
        />
      )}

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>모델명 *</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: Submariner Date, Royal Oak"
        placeholderTextColor={COLORS.sub}
        value={formData.myModel}
        onChangeText={(v) => setFormField('myModel', v)}
      />

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>컨디션 *</Text>
      <View style={styles.conditionGrid}>
        {CONDITION_OPTIONS.map((cond) => {
          const isSelected = formData.myCondition === cond.value;
          return (
            <TouchableOpacity
              key={cond.value}
              style={[styles.conditionButton, isSelected && styles.conditionButtonSelected]}
              onPress={() => setFormField('myCondition', cond.value)}
            >
              <Text style={[styles.conditionLabel, isSelected && styles.conditionLabelSelected]}>
                {cond.label}
              </Text>
              <Text style={styles.conditionDesc}>{cond.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // Step 2 — 원하는 시계
  const renderStep2 = () => (
    <View>
      <Text style={styles.stepQuestion}>원하는 시계는?</Text>

      <Text style={styles.inputLabel}>브랜드 *</Text>
      <View style={styles.brandGrid}>
        {BRAND_OPTIONS.map((brand) => {
          const isSelected = formData.wantedBrand === brand;
          return (
            <TouchableOpacity
              key={brand}
              style={[styles.brandButton, isSelected && styles.brandButtonSelected]}
              onPress={() => setFormField('wantedBrand', brand)}
            >
              <Text style={[styles.brandButtonText, isSelected && styles.brandButtonTextSelected]}>
                {brand}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {formData.wantedBrand === '기타' && (
        <TextInput
          style={[styles.inputField, { marginTop: SPACING.sm }]}
          placeholder="브랜드명 직접 입력"
          placeholderTextColor={COLORS.sub}
          value={formData.wantedCustomBrand}
          onChangeText={(v) => setFormField('wantedCustomBrand', v)}
        />
      )}

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>모델명 *</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: Daytona, Speedmaster"
        placeholderTextColor={COLORS.sub}
        value={formData.wantedModel}
        onChangeText={(v) => setFormField('wantedModel', v)}
      />

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>희망 컨디션 (선택)</Text>
      <View style={styles.conditionGrid}>
        {CONDITION_OPTIONS.map((cond) => {
          const isSelected = formData.wantedCondition === cond.value;
          return (
            <TouchableOpacity
              key={cond.value}
              style={[styles.conditionButton, isSelected && styles.conditionButtonSelected]}
              onPress={() =>
                setFormField('wantedCondition', isSelected ? '' : cond.value)
              }
            >
              <Text style={[styles.conditionLabel, isSelected && styles.conditionLabelSelected]}>
                {cond.label}
              </Text>
              <Text style={styles.conditionDesc}>{cond.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>추가 요청사항 (선택)</Text>
      <TextInput
        style={[styles.inputField, styles.textArea]}
        placeholder="예: 특정 색상, 연도 등 추가 조건이 있으면 입력해주세요"
        placeholderTextColor={COLORS.sub}
        multiline
        numberOfLines={3}
        value={formData.wantedNote}
        onChangeText={(v) => setFormField('wantedNote', v)}
      />
    </View>
  );

  // Step 3 — 사진 + 상세
  const renderStep3 = () => (
    <View>
      <Text style={styles.stepQuestion}>시계 사진 및 상세 정보</Text>

      <Text style={styles.inputLabel}>사진 첨부 (최대 5장)</Text>
      <View style={styles.photoGrid}>
        {[...Array(5)].map((_, i) => {
          const uploadedUri = formData.photos[i];
          const isUploading = uploadingIndex === i;
          return (
            <TouchableOpacity
              key={i}
              style={styles.photoBox}
              onPress={() => handlePickPhoto(i)}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color={COLORS.accent} />
              ) : uploadedUri ? (
                <Image source={{ uri: uploadedUri }} style={styles.photoImage} />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={24} color={COLORS.sub} />
                  {i === 0 && <Text style={styles.photoLabel}>전면</Text>}
                  {i === 1 && <Text style={styles.photoLabel}>후면</Text>}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.hintText}>※ 사진이 있으면 더 빠른 검토가 가능합니다</Text>

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>구매 연도</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 2021년"
        placeholderTextColor={COLORS.sub}
        value={formData.year}
        onChangeText={(v) => setFormField('year', v)}
      />

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>구성품</Text>
      <View style={styles.kitRow}>
        {KIT_OPTIONS.map((kit) => {
          const isSelected = formData.kits === kit;
          return (
            <TouchableOpacity
              key={kit}
              style={[styles.kitChip, isSelected && styles.kitChipSelected]}
              onPress={() => setFormField('kits', isSelected ? '' : kit)}
            >
              <Text style={[styles.kitChipText, isSelected && styles.kitChipTextSelected]}>
                {isSelected ? `✓ ${kit}` : kit}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>특이사항 (선택)</Text>
      <TextInput
        style={[styles.inputField, styles.textArea]}
        placeholder="스크래치, 수리 이력 등 시계 상태에 대한 추가 내용"
        placeholderTextColor={COLORS.sub}
        multiline
        numberOfLines={3}
        value={formData.note}
        onChangeText={(v) => setFormField('note', v)}
      />
    </View>
  );

  // Step 4 — 연락처 + 확인
  const renderStep4 = () => {
    const myBrand = formData.myBrand === '기타' ? formData.myCustomBrand : formData.myBrand;
    const wantedBrand = formData.wantedBrand === '기타' ? formData.wantedCustomBrand : formData.wantedBrand;
    return (
      <View>
        <Text style={styles.stepQuestion}>연락처 확인</Text>

        <Text style={styles.inputLabel}>연락처 *</Text>
        <TextInput
          style={styles.inputField}
          placeholder="010-0000-0000"
          placeholderTextColor={COLORS.sub}
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(v) => setFormField('phone', v)}
        />

        <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>카카오톡 ID (선택)</Text>
        <TextInput
          style={styles.inputField}
          placeholder="카카오톡 아이디 입력"
          placeholderTextColor={COLORS.sub}
          value={formData.kakaoId}
          onChangeText={(v) => setFormField('kakaoId', v)}
        />

        <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>선호 연락 방법</Text>
        <View style={styles.contactMethodRow}>
          {CONTACT_METHODS.map((method) => {
            const isSelected = formData.contactMethod === method;
            return (
              <TouchableOpacity
                key={method}
                style={[styles.methodChip, isSelected && styles.methodChipSelected]}
                onPress={() => setFormField('contactMethod', method)}
              >
                <Text style={[styles.methodChipText, isSelected && styles.methodChipTextSelected]}>
                  {method}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 신청 요약 박스 */}
        <View style={styles.requestSummary}>
          <Text style={styles.requestSummaryTitle}>신청 요약</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryHalf}>
              <Text style={styles.summaryLabel}>내 시계</Text>
              <Text style={styles.summaryValue}>{myBrand}</Text>
              <Text style={styles.summaryModel}>{formData.myModel}</Text>
              <Text style={styles.summaryGrade}>{formData.myCondition}급</Text>
            </View>
            <View style={styles.summaryArrow}>
              <Ionicons name="repeat" size={20} color={COLORS.sub} />
            </View>
            <View style={styles.summaryHalf}>
              <Text style={styles.summaryLabel}>원하는 시계</Text>
              <Text style={styles.summaryValue}>{wantedBrand}</Text>
              <Text style={styles.summaryModel}>{formData.wantedModel}</Text>
              {formData.wantedCondition !== '' && (
                <Text style={styles.summaryGrade}>희망 {formData.wantedCondition}급</Text>
              )}
            </View>
          </View>
        </View>

        {/* 개인정보 동의 체크박스 */}
        <TouchableOpacity
          style={styles.agreeRow}
          onPress={() => setFormField('agreePrivacy', !formData.agreePrivacy)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, formData.agreePrivacy && styles.checkboxChecked]}>
            {formData.agreePrivacy && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.agreeText}>
            개인정보 수집 및 이용에 동의합니다 <Text style={styles.agreeRequired}>(필수)</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  const valid = isStepValid();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* 배경 터치로 닫기 */}
        <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={handleClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.sheet}
        >
          {/* 핸들 바 */}
          <View style={styles.handleBar}>
            <View style={styles.handle} />
          </View>

          {done ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderCompletion()}
            </ScrollView>
          ) : (
            <>
              {/* 헤더 */}
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>교환거래 신청</Text>
                  <Text style={styles.sheetSubtitle}>전문가 검토 · 딜 제시 · 거래 확정</Text>
                </View>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              {/* 진행률 바 */}
              <View style={styles.progressBar}>
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressSegment,
                      { backgroundColor: i < step ? COLORS.text : COLORS.border },
                    ]}
                  />
                ))}
              </View>

              {/* 스텝 콘텐츠 */}
              <ScrollView
                style={styles.stepContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderStep()}
                <View style={{ height: 20 }} />
              </ScrollView>

              {/* 하단 버튼 */}
              <View style={styles.buttonRow}>
                {step > 1 && (
                  <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
                    <Text style={styles.prevButtonText}>이전</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.nextButton, !valid && styles.nextButtonDisabled]}
                  onPress={handleNext}
                  disabled={!valid}
                >
                  <Text style={[styles.nextButtonText, !valid && styles.nextButtonTextDisabled]}>
                    {step < TOTAL_STEPS ? '다음' : '교환거래 신청하기'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ExchangeSheet;

const styles = StyleSheet.create({
  // 오버레이
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  // 시트
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  // 헤더
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 2,
  },
  // 진행률 바
  progressBar: {
    flexDirection: 'row',
    gap: 4,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  // 스텝 콘텐츠
  stepContent: {
    paddingHorizontal: SPACING.lg,
    minHeight: 280,
    maxHeight: 420,
  },
  stepQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.base,
  },
  // 입력 필드
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sub,
    marginBottom: 6,
    marginTop: SPACING.sm,
  },
  inputField: {
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  textArea: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: SPACING.xs,
  },
  // 브랜드 그리드
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  brandButton: {
    width: '48%',
    padding: 12,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  brandButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  brandButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  brandButtonTextSelected: {
    fontWeight: '700',
  },
  // 컨디션 2x2 그리드
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  conditionButton: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  conditionButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  conditionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  conditionLabelSelected: {
    fontWeight: '700',
  },
  conditionDesc: {
    fontSize: 10,
    color: COLORS.sub,
    marginTop: 2,
  },
  // 사진 그리드 (5장)
  photoGrid: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  photoBox: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  photoLabel: {
    fontSize: 9,
    color: COLORS.sub,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.card,
  },
  // 구성품 칩
  kitRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  kitChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: RADIUS.tag,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: 'center',
  },
  kitChipSelected: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  kitChipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  kitChipTextSelected: {
    fontWeight: '600',
  },
  // 연락 방법 칩
  contactMethodRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  methodChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: RADIUS.tag,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: 'center',
  },
  methodChipSelected: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.text,
  },
  methodChipText: {
    fontSize: 13,
    color: COLORS.text,
  },
  methodChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // 신청 요약 박스
  requestSummary: {
    marginTop: SPACING.base,
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
  },
  requestSummaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sub,
    marginBottom: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryHalf: {
    flex: 1,
  },
  summaryArrow: {
    paddingHorizontal: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.sub,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryModel: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 1,
  },
  summaryGrade: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: 2,
  },
  // 개인정보 동의
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.base,
    padding: SPACING.md,
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.button,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  agreeText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  agreeRequired: {
    color: COLORS.red,
    fontSize: 12,
  },
  // 하단 버튼
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.base,
  },
  prevButton: {
    flex: 0.4,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
  },
  prevButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.text,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: COLORS.sub,
  },
  // 완료 화면
  completionContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#E8F8EE',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  infoSubText: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 4,
  },
  confirmButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.text,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
