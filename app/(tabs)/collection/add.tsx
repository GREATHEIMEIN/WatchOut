// 컬렉션에 시계 추가 화면

import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useCollectionStore } from '@/store/useCollectionStore';
import { supabase } from '@/lib/supabase';

interface WatchOption {
  id: number;
  brand: string;
  model: string;
  referenceNumber: string;
}

export default function AddCollectionScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToCollection } = useCollectionStore();

  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [watches, setWatches] = useState<WatchOption[]>([]);
  const [selectedWatch, setSelectedWatch] = useState<WatchOption | null>(null);

  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // 브랜드 목록 로드
  useEffect(() => {
    loadBrands();
  }, []);

  // 브랜드 선택 시 모델 로드
  useEffect(() => {
    if (selectedBrand) {
      loadWatches(selectedBrand);
    } else {
      setWatches([]);
      setSelectedWatch(null);
    }
  }, [selectedBrand]);

  const loadBrands = async () => {
    const { data } = await supabase
      .from('watches')
      .select('brand')
      .order('brand');

    if (data) {
      const uniqueBrands = Array.from(new Set(data.map((w: any) => w.brand)));
      setBrands(uniqueBrands);
    }
  };

  const loadWatches = async (brand: string) => {
    const { data } = await supabase
      .from('watches')
      .select('id, brand, model, reference_number')
      .eq('brand', brand)
      .order('model');

    if (data) {
      setWatches(
        data.map((w: any) => ({
          id: w.id,
          brand: w.brand,
          model: w.model,
          referenceNumber: w.reference_number,
        })),
      );
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('오류', '로그인이 필요합니다');
      return;
    }

    if (!selectedWatch) {
      Alert.alert('오류', '시계를 선택해주세요');
      return;
    }

    setLoading(true);

    const { success, error } = await addToCollection({
      user_id: user.id,
      watch_id: selectedWatch.id,
      purchase_price: purchasePrice ? parseInt(purchasePrice.replace(/,/g, '')) : null,
      purchase_date: purchaseDate || null,
      note: note || null,
    });

    setLoading(false);

    if (success) {
      Alert.alert('등록 완료', '컬렉션에 추가되었습니다', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('오류', error || '등록에 실패했습니다');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="시계 추가" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 브랜드 선택 */}
        <View style={styles.section}>
          <Text style={styles.label}>
            브랜드 <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {brands.map((brand) => {
              const isActive = selectedBrand === brand;
              return (
                <TouchableOpacity
                  key={brand}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setSelectedBrand(brand)}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {brand}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 모델 선택 */}
        {selectedBrand && (
          <View style={styles.section}>
            <Text style={styles.label}>
              모델 <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.watchList}>
              {watches.map((watch) => {
                const isActive = selectedWatch?.id === watch.id;
                return (
                  <TouchableOpacity
                    key={watch.id}
                    style={[styles.watchItem, isActive && styles.watchItemActive]}
                    onPress={() => setSelectedWatch(watch)}
                  >
                    <View style={styles.watchInfo}>
                      <Text style={styles.watchModel}>{watch.model}</Text>
                      <Text style={styles.watchRef}>{watch.referenceNumber}</Text>
                    </View>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* 구매 정보 */}
        {selectedWatch && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>구매 금액 (선택)</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 15000000"
                placeholderTextColor={COLORS.sub}
                keyboardType="number-pad"
                value={purchasePrice}
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, '');
                  setPurchasePrice(num ? parseInt(num).toLocaleString() : '');
                }}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>구매 날짜 (선택)</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 2024-01-15"
                placeholderTextColor={COLORS.sub}
                value={purchaseDate}
                onChangeText={setPurchaseDate}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>메모 (선택)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="구매 장소, 상태 등 메모를 남겨보세요"
                placeholderTextColor={COLORS.sub}
                multiline
                numberOfLines={4}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* 등록 버튼 */}
            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? '등록 중...' : '등록하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.red,
  },
  // 브랜드 칩
  chipRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.tag,
  },
  chipActive: {
    backgroundColor: COLORS.text,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.sub,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  // 모델 리스트
  watchList: {
    gap: 8,
  },
  watchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  watchItemActive: {
    borderColor: COLORS.accent,
  },
  watchInfo: {
    flex: 1,
    gap: 4,
  },
  watchModel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  watchRef: {
    fontSize: 12,
    color: COLORS.sub,
  },
  // 입력 필드
  input: {
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // 버튼
  buttonSection: {
    paddingHorizontal: SPACING.lg,
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
});
