// 내 컬렉션 메인 화면

import { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import SummaryCard from '@/components/collection/SummaryCard';
import CollectionCard from '@/components/collection/CollectionCard';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useCollectionStore } from '@/store/useCollectionStore';

export default function CollectionIndexScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { collections, loading, error, fetchMyCollection, getStats } =
    useCollectionStore();

  useEffect(() => {
    if (user) {
      fetchMyCollection(user.id);
    }
  }, [user]);

  const stats = getStats();

  return (
    <View style={styles.container}>
      <Header title="내 컬렉션" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 로딩 */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>컬렉션을 불러오는 중...</Text>
          </View>
        )}

        {/* 에러 */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color={COLORS.red} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => user && fetchMyCollection(user.id)}
            >
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 컬렉션 내용 */}
        {!loading && !error && (
          <>
            {collections.length > 0 ? (
              <>
                {/* 통계 카드 */}
                <View style={styles.section}>
                  <SummaryCard stats={stats} />
                </View>

                {/* 시계 리스트 */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>보유 시계</Text>
                  <View style={styles.listContainer}>
                    {collections.map((item, index) => (
                      <View key={item.id}>
                        <CollectionCard
                          item={item}
                          onPress={() => router.push(`/collection/${item.id}`)}
                        />
                        {index < collections.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="watch-outline" size={48} color={COLORS.sub} />
                <Text style={styles.emptyTitle}>컬렉션이 비어있습니다</Text>
                <Text style={styles.emptySubtitle}>
                  소유하신 시계를 등록해보세요
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => router.push('/collection/add')}
                >
                  <Text style={styles.emptyButtonText}>시계 추가하기</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* FAB 시계 추가 */}
      {!loading && !error && collections.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/collection/add')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.fabText}>시계 추가</Text>
        </TouchableOpacity>
      )}
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
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  listContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.lg,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  // 빈 상태
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.sub,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: SPACING.md,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.button,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // 로딩/에러
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.sub,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.sub,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.sm,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.button,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
