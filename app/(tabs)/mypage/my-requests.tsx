// 매입/교환 신청 내역 화면

import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBuybackStore, REQUEST_STATUS_LABEL, REQUEST_STATUS_COLOR } from '@/store/useBuybackStore';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/format';

export default function MyRequestsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { myRequests, myRequestsLoading, fetchMyRequests } = useBuybackStore();

  useEffect(() => {
    if (user) fetchMyRequests(user.id);
  }, []);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>매입/교환 내역</Text>
        <View style={{ width: 26 }} />
      </View>

      {myRequestsLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={COLORS.sub} />
        </View>
      ) : myRequests.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="receipt-outline" size={44} color={COLORS.border} />
          <Text style={styles.emptyTitle}>신청 내역이 없습니다</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {myRequests.map((req, index) => {
            const statusLabel = REQUEST_STATUS_LABEL[req.status] ?? req.status;
            const statusColor = REQUEST_STATUS_COLOR[req.status] ?? COLORS.sub;
            const isBuyback = req.type !== 'exchange';

            return (
              <View key={req.id}>
                <View style={styles.requestRow}>
                  {/* 좌측 정보 */}
                  <View style={styles.requestLeft}>
                    {/* 타입 배지 */}
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor: isBuyback ? COLORS.text : '#1A1A2E' },
                    ]}>
                      <Text style={styles.typeBadgeText}>
                        {isBuyback ? '매입' : '교환'}
                      </Text>
                    </View>
                    <Text style={styles.requestName}>
                      {req.brand} {req.model}
                    </Text>
                    <Text style={styles.requestTime}>{formatRelativeTime(req.createdAt)}</Text>
                  </View>

                  {/* 우측 상태 배지 */}
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: `${statusColor}22` },
                  ]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {statusLabel}
                    </Text>
                  </View>
                </View>
                {index < myRequests.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: 15,
    color: COLORS.sub,
  },
  listContent: {
    padding: SPACING.lg,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  requestLeft: {
    flex: 1,
    gap: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  requestName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  requestTime: {
    fontSize: 11,
    color: COLORS.sub,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.tag,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
