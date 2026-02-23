// 매물 등록 화면

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, SPACING, RADIUS, BRANDS, CONDITIONS, KIT_OPTIONS } from '@/lib/constants';
import { requireAuth } from '@/lib/authGuard';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Condition, ItemType } from '@/types';

const BRAND_OPTIONS = [...BRANDS, '기타'] as const;
const METHOD_OPTIONS = ['직거래', '택배', '둘 다'] as const;
const ACCESSORY_CATEGORIES = ['스트랩/브레이슬릿', '와인더/보관함', '공구/도구', '보호필름/케이스'];

const TABS: { key: ItemType; label: string }[] = [
  { key: 'watch', label: '시계' },
  { key: 'accessory', label: '시계용품' },
];

export default function TradeCreateScreen() {
  const router = useRouter();
  const { formData, setFormField, toggleFormKit, resetForm, isFormValid } = useTradeStore();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const isWatch = formData.itemType === 'watch';

  // 로그인 체크
  useEffect(() => {
    const { isLoggedIn } = useAuthStore.getState();
    if (!requireAuth(router, isLoggedIn, '매물 등록')) router.back();
  }, []);

  // 사진 선택 + 업로드
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
      const { uploadImages } = useTradeStore.getState();
      const urls = await uploadImages([uri]);
      if (urls.length > 0) {
        const newPhotos = [...formData.photos];
        newPhotos[index] = urls[0];
        // 빈 슬롯 제거하지 않고 인덱스 유지
        while (newPhotos.length <= index) newPhotos.push('');
        newPhotos[index] = urls[0];
        setFormField('photos', newPhotos.filter(Boolean));
      } else {
        Alert.alert('오류', '사진 업로드에 실패했습니다');
      }
      setUploadingIndex(null);
    }
  };

  const handleTabChange = (tab: ItemType) => {
    resetForm();
    setFormField('itemType', tab);
  };

  const handleSubmit = async () => {
    const { createTradePost } = useTradeStore.getState();
    const { success, error } = await createTradePost();

    if (success) {
      Alert.alert('등록 완료', '매물이 등록되었습니다', [
        {
          text: '확인',
          onPress: () => {
            resetForm();
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert('등록 실패', error || '매물 등록 중 문제가 발생했습니다');
    }
  };

  const handleBack = () => {
    resetForm();
    router.back();
  };

  // 시계 폼
  const renderWatchForm = () => (
    <View>
      {/* 판매/구매 선택 */}
      <Text style={styles.sectionLabel}>거래 유형 *</Text>
      <View style={styles.typeRow}>
        {[
          { key: 'sell' as const, label: '판매', icon: 'pricetag-outline' as const },
          { key: 'buy' as const, label: '구매', icon: 'search-outline' as const },
        ].map((opt) => {
          const active = formData.type === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.typeButton, active && styles.typeButtonActive]}
              onPress={() => setFormField('type', opt.key)}
            >
              <Ionicons name={opt.icon} size={18} color={active ? COLORS.text : COLORS.sub} />
              <Text style={[styles.typeButtonText, active && styles.typeButtonTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 브랜드 선택 */}
      <Text style={styles.sectionLabel}>브랜드 *</Text>
      <View style={styles.brandGrid}>
        {BRAND_OPTIONS.map((brand) => {
          const selected = formData.brand === brand;
          return (
            <TouchableOpacity
              key={brand}
              style={[styles.brandButton, selected && styles.brandButtonSelected]}
              onPress={() => setFormField('brand', brand)}
            >
              <Text style={[styles.brandButtonText, selected && styles.brandButtonTextSelected]}>
                {brand}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 기타 브랜드 직접 입력 */}
      {formData.brand === '기타' && (
        <View style={{ marginTop: SPACING.md }}>
          <Text style={styles.inputLabel}>브랜드명 *</Text>
          <TextInput
            style={styles.inputField}
            placeholder="브랜드명을 입력해주세요"
            placeholderTextColor={COLORS.sub}
            value={formData.brand !== '기타' && !BRAND_OPTIONS.includes(formData.brand as any) ? formData.brand : ''}
            onChangeText={(v) => setFormField('brand', v.trim() || '기타')}
          />
        </View>
      )}

      {/* 모델명 */}
      <Text style={styles.inputLabel}>모델명 *</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 서브마리너 데이트"
        placeholderTextColor={COLORS.sub}
        value={formData.model}
        onChangeText={(v) => setFormField('model', v)}
      />

      {/* 레퍼런스 */}
      <Text style={styles.inputLabel}>레퍼런스 번호</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 126610LN"
        placeholderTextColor={COLORS.sub}
        value={formData.referenceNumber}
        onChangeText={(v) => setFormField('referenceNumber', v)}
      />

      {/* 연식 + 컨디션 */}
      <View style={styles.twoCol}>
        <View style={styles.colHalf}>
          <Text style={styles.inputLabel}>연식</Text>
          <TextInput
            style={styles.inputField}
            placeholder="예: 2023"
            placeholderTextColor={COLORS.sub}
            value={formData.year}
            onChangeText={(v) => setFormField('year', v)}
          />
        </View>
        <View style={styles.colHalf}>
          <Text style={styles.inputLabel}>컨디션</Text>
          <View style={styles.conditionRow}>
            {CONDITIONS.map((cond) => {
              const selected = formData.condition === cond.value;
              return (
                <TouchableOpacity
                  key={cond.value}
                  style={[styles.conditionChip, selected && styles.conditionChipSelected]}
                  onPress={() => setFormField('condition', cond.value as Condition)}
                >
                  <Text style={[styles.conditionChipText, selected && styles.conditionChipTextSelected]}>
                    {cond.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 구성품 */}
      <Text style={styles.sectionLabel}>구성품</Text>
      <View style={styles.kitWrap}>
        {KIT_OPTIONS.map((kit) => {
          const selected = formData.kit.includes(kit);
          return (
            <TouchableOpacity
              key={kit}
              style={[styles.kitChip, selected && styles.kitChipSelected]}
              onPress={() => toggleFormKit(kit)}
            >
              <Text style={[styles.kitChipText, selected && styles.kitChipTextSelected]}>
                {selected ? `✓ ${kit}` : kit}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 가격 */}
      <Text style={styles.inputLabel}>희망 가격 (원) *</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 12800000"
        placeholderTextColor={COLORS.sub}
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(v) => setFormField('price', v)}
      />

      {/* 거래방법 + 지역 */}
      <View style={styles.twoCol}>
        <View style={styles.colHalf}>
          <Text style={styles.inputLabel}>거래방법</Text>
          <View style={styles.methodRow}>
            {METHOD_OPTIONS.map((m) => {
              const selected = formData.method === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodChip, selected && styles.methodChipSelected]}
                  onPress={() => setFormField('method', m)}
                >
                  <Text style={[styles.methodChipText, selected && styles.methodChipTextSelected]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.colHalf}>
          <Text style={styles.inputLabel}>지역</Text>
          <TextInput
            style={styles.inputField}
            placeholder="예: 서울 강남"
            placeholderTextColor={COLORS.sub}
            value={formData.location}
            onChangeText={(v) => setFormField('location', v)}
          />
        </View>
      </View>

      {renderCommonFields()}
    </View>
  );

  // 시계용품 폼
  const renderAccessoryForm = () => (
    <View>
      {/* 카테고리 */}
      <Text style={styles.sectionLabel}>카테고리 *</Text>
      <View style={styles.kitWrap}>
        {ACCESSORY_CATEGORIES.map((cat) => {
          const selected = formData.category === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.kitChip, selected && styles.kitChipSelected]}
              onPress={() => setFormField('category', cat)}
            >
              <Text style={[styles.kitChipText, selected && styles.kitChipTextSelected]}>
                {selected ? `✓ ${cat}` : cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 제목 */}
      <Text style={styles.inputLabel}>제목 *</Text>
      <TextInput
        style={styles.inputField}
        placeholder="예: 롤렉스 오이스터 순정 스트랩"
        placeholderTextColor={COLORS.sub}
        value={formData.title}
        onChangeText={(v) => setFormField('title', v)}
      />

      {/* 가격 + 컨디션 */}
      <View style={styles.twoCol}>
        <View style={styles.colHalf}>
          <Text style={styles.inputLabel}>가격 (원) *</Text>
          <TextInput
            style={styles.inputField}
            placeholder="예: 450000"
            placeholderTextColor={COLORS.sub}
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(v) => setFormField('price', v)}
          />
        </View>
        <View style={styles.colHalf}>
          <Text style={styles.inputLabel}>컨디션</Text>
          <View style={styles.conditionRow}>
            {CONDITIONS.map((cond) => {
              const selected = formData.condition === cond.value;
              return (
                <TouchableOpacity
                  key={cond.value}
                  style={[styles.conditionChip, selected && styles.conditionChipSelected]}
                  onPress={() => setFormField('condition', cond.value as Condition)}
                >
                  <Text style={[styles.conditionChipText, selected && styles.conditionChipTextSelected]}>
                    {cond.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {renderCommonFields()}
    </View>
  );

  // 공통 필드: 사진 + 상세 설명
  const renderCommonFields = () => (
    <View>
      {/* 사진 첨부 */}
      <Text style={styles.sectionLabel}>사진 (최소 3장)</Text>
      <View style={styles.photoGrid}>
        {['사진 1 *', '사진 2 *', '사진 3 *', '추가', '추가'].map((label, i) => {
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
                  <Text style={styles.photoLabel}>{label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 상세 설명 */}
      <Text style={styles.inputLabel}>상세 설명</Text>
      <TextInput
        style={[styles.inputField, styles.textArea]}
        placeholder="시계/용품에 대한 상세 설명을 입력해주세요"
        placeholderTextColor={COLORS.sub}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        value={formData.description}
        onChangeText={(v) => setFormField('description', v)}
      />
    </View>
  );

  const valid = isFormValid();

  return (
    <View style={styles.container}>
      <Header title="매물 등록" onBack={handleBack} />

      {/* 카테고리 탭 */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = formData.itemType === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.formScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isWatch ? renderWatchForm() : renderAccessoryForm()}
          {/* 하단 여백 */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 하단 등록 버튼 */}
      <View style={styles.submitBar}>
        <TouchableOpacity
          style={[styles.submitButton, !valid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!valid}
          activeOpacity={0.8}
        >
          <Text style={[styles.submitButtonText, !valid && styles.submitButtonTextDisabled]}>
            매물 등록하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // 탭
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.sub,
  },
  tabTextActive: {
    fontWeight: '700',
    color: COLORS.text,
  },

  // 폼
  formScroll: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },

  // 섹션 라벨
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },

  // 거래 유형
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  typeButtonActive: {
    borderWidth: 2,
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.sub,
  },
  typeButtonTextActive: {
    fontWeight: '700',
    color: COLORS.text,
  },

  // 브랜드 그리드
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  // 2열 배치
  twoCol: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  colHalf: {
    flex: 1,
  },

  // 컨디션 칩
  conditionRow: {
    flexDirection: 'row',
    gap: 4,
  },
  conditionChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  conditionChipSelected: {
    borderWidth: 2,
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  conditionChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },
  conditionChipTextSelected: {
    fontWeight: '700',
    color: COLORS.text,
  },

  // 구성품
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

  // 거래 방법
  methodRow: {
    flexDirection: 'row',
    gap: 4,
  },
  methodChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  methodChipSelected: {
    borderWidth: 2,
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  methodChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.sub,
  },
  methodChipTextSelected: {
    fontWeight: '700',
    color: COLORS.text,
  },

  // 사진
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  photoBox: {
    width: '30%',
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
    fontSize: 10,
    color: COLORS.sub,
    fontWeight: '500',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.card,
  },

  // 하단 등록 버튼
  submitBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.text,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: COLORS.sub,
  },
});
