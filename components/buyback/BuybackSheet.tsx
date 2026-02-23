// 즉시매입 신청 바텀시트 — v5 BuybackSheet 기반

import {
  Alert,
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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, BRANDS, CONDITIONS, KIT_OPTIONS } from '@/lib/constants';
import { useBuybackStore } from '@/store/useBuybackStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Condition } from '@/types';

const TOTAL_STEPS = 5;
const BRAND_OPTIONS = [...BRANDS, '기타'] as const;

interface BuybackSheetProps {
  visible: boolean;
  onClose: () => void;
}

const BuybackSheet = ({ visible, onClose }: BuybackSheetProps) => {
  const {
    step, formData, done,
    setStep, setFormField, toggleKit, setDone, reset, isStepValid,
  } = useBuybackStore();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // 로그인 체크
      const { isLoggedIn } = useAuthStore.getState();
      if (!isLoggedIn) {
        Alert.alert(
          '로그인 필요',
          '즉시매입 신청은 로그인 후 이용 가능합니다.\n로그인 화면은 MY 탭에서 접속할 수 있습니다.',
          [
            { text: '확인', onPress: handleClose },
          ]
        );
        return;
      }

      // Supabase에 즉시매입 신청 제출
      const { submitRequest } = useBuybackStore.getState();
      const { success } = await submitRequest();

      if (success) {
        setDone(true);
      } else {
        Alert.alert('오류', '신청 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // 완료 화면
  const renderCompletion = () => (
    <View style={styles.completionContainer}>
      <Ionicons name="checkmark-circle" size={48} color={COLORS.green} />
      <Text style={styles.completionTitle}>즉시매입 신청 완료</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryBrand}>{formData.brand} {formData.model}</Text>
        {formData.ref !== '' && <Text style={styles.summaryRef}>{formData.ref}</Text>}
        <Text style={styles.summaryDetail}>
          {formData.condition}급
          {formData.year ? ` · ${formData.year}` : ''}
          {formData.kits.length > 0 ? ` · ${formData.kits.join(', ')}` : ''}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📞 빠른 시간 내에 연락드리겠습니다</Text>
        <Text style={styles.infoSubText}>출장 방문 → 현장 감정 → 즉시 입금</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleClose}>
        <Text style={styles.confirmButtonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );

  // Step 1: 브랜드 선택
  const renderStep1 = () => (
    <View>
      <Text style={styles.stepQuestion}>어떤 브랜드인가요?</Text>
      <View style={styles.brandGrid}>
        {BRAND_OPTIONS.map((brand) => {
          const isSelected = formData.brand === brand;
          return (
            <TouchableOpacity
              key={brand}
              style={[styles.brandButton, isSelected && styles.brandButtonSelected]}
              onPress={() => setFormField('brand', brand)}
            >
              <Text style={[styles.brandButtonText, isSelected && styles.brandButtonTextSelected]}>
                {brand}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // Step 2: 모델 정보
  const renderStep2 = () => (
    <View>
      <Text style={styles.stepQuestion}>모델 정보를 알려주세요</Text>

      <Text style={styles.inputLabel}>모델명 *</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 서브마리너 데이트"
        placeholderTextColor={COLORS.sub}
        value={formData.model}
        onChangeText={(v) => setFormField('model', v)}
      />

      <Text style={styles.inputLabel}>레퍼런스 번호</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 126610LN"
        placeholderTextColor={COLORS.sub}
        value={formData.ref}
        onChangeText={(v) => setFormField('ref', v)}
      />

      <Text style={styles.inputLabel}>연식</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 2023년"
        placeholderTextColor={COLORS.sub}
        value={formData.year}
        onChangeText={(v) => setFormField('year', v)}
      />

      <Text style={styles.hintText}>※ 정확하지 않아도 괜찮아요</Text>
    </View>
  );

  // Step 3: 컨디션 + 구성품
  const renderStep3 = () => (
    <View>
      <Text style={styles.stepQuestion}>상태와 구성품</Text>

      <Text style={styles.inputLabel}>컨디션 *</Text>
      <View style={styles.conditionRow}>
        {CONDITIONS.map((cond) => {
          const isSelected = formData.condition === cond.value;
          return (
            <TouchableOpacity
              key={cond.value}
              style={[styles.conditionButton, isSelected && styles.conditionButtonSelected]}
              onPress={() => setFormField('condition', cond.value as Condition)}
            >
              <Text style={[styles.conditionLabel, isSelected && styles.conditionLabelSelected]}>
                {cond.label}
              </Text>
              <Text style={styles.conditionDesc}>{cond.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.inputLabel, { marginTop: SPACING.base }]}>구성품 (있는 것만 선택)</Text>
      <View style={styles.kitWrap}>
        {KIT_OPTIONS.map((kit) => {
          const isSelected = formData.kits.includes(kit);
          return (
            <TouchableOpacity
              key={kit}
              style={[styles.kitChip, isSelected && styles.kitChipSelected]}
              onPress={() => toggleKit(kit)}
            >
              <Text style={[styles.kitChipText, isSelected && styles.kitChipTextSelected]}>
                {isSelected ? `✓ ${kit}` : kit}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // Step 4: 사진 첨부
  const renderStep4 = () => {
    const photoLabels = ['전면 *', '후면 *', '측면'];
    return (
      <View>
        <Text style={styles.stepQuestion}>사진 첨부</Text>
        <View style={styles.photoGrid}>
          {photoLabels.map((label) => (
            <TouchableOpacity
              key={label}
              style={styles.photoBox}
              onPress={() => Alert.alert('준비 중', '사진 기능은 다음 업데이트에서!')}
            >
              <Ionicons name="camera-outline" size={28} color={COLORS.sub} />
              <Text style={styles.photoLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.hintText}>최소 2장 (전면, 후면 필수)</Text>
      </View>
    );
  };

  // Step 5: 연락처
  const renderStep5 = () => (
    <View>
      <Text style={styles.stepQuestion}>연락처</Text>

      <Text style={styles.inputLabel}>연락받으실 번호 *</Text>
      <TextInput
        style={styles.inputField}
        placeholder="010-0000-0000"
        placeholderTextColor={COLORS.sub}
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(v) => setFormField('phone', v)}
      />

      <Text style={styles.inputLabel}>희망 거래 지역</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 서울 강남"
        placeholderTextColor={COLORS.sub}
        value={formData.location}
        onChangeText={(v) => setFormField('location', v)}
      />
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
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
                  <Text style={styles.sheetTitle}>즉시매입 신청</Text>
                  <Text style={styles.sheetSubtitle}>출장방문 · 현장감정 · 즉시입금</Text>
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
                    {step < TOTAL_STEPS ? '다음' : '즉시매입 신청하기'}
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

export default BuybackSheet;

const styles = StyleSheet.create({
  // 오버레이
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  // 시트
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
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
    marginBottom: SPACING.lg,
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
    maxHeight: 400,
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
    marginTop: SPACING.md,
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
  hintText: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: SPACING.sm,
  },
  // Step 1: 브랜드 그리드
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  brandButton: {
    width: '48%',
    padding: 14,
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
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  brandButtonTextSelected: {
    fontWeight: '700',
  },
  // Step 3: 컨디션
  conditionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  conditionButton: {
    flex: 1,
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
  // Step 3: 구성품
  kitWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  kitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.tag,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  kitChipSelected: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  kitChipText: {
    fontSize: 13,
    color: COLORS.text,
  },
  kitChipTextSelected: {
    fontWeight: '600',
  },
  // Step 4: 사진
  photoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  photoBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: RADIUS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoLabel: {
    fontSize: 11,
    color: COLORS.sub,
    fontWeight: '500',
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
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  summaryBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryRef: {
    fontSize: 13,
    color: COLORS.sub,
    marginTop: 2,
  },
  summaryDetail: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 4,
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
