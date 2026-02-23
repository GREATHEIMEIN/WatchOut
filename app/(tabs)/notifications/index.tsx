// 알림 목록 화면

import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { useNotificationStore, type NotificationType } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRelativeTime } from '@/lib/format';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TYPE_ICON: Record<NotificationType, { name: IoniconsName; color: string; bg: string }> = {
  trade_interest: { name: 'heart',           color: COLORS.red,    bg: '#FFF0F0' },
  price_alert:    { name: 'trending-up',      color: COLORS.green,  bg: '#F0FFF4' },
  comment:        { name: 'chatbubble',        color: COLORS.accent, bg: '#F0F5FF' },
  system:         { name: 'notifications',     color: COLORS.sub,    bg: COLORS.tag },
  buyback_status: { name: 'cash',              color: COLORS.orange, bg: '#FFF8F0' },
  exchange_status:{ name: 'swap-horizontal',   color: '#8B5CF6',     bg: '#F5F0FF' },
  chat:           { name: 'chatbox',           color: COLORS.accent, bg: '#F0F5FF' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const handleItemPress = async (id: string, screen?: string) => {
    await markAsRead(id);
    if (screen) {
      router.push(screen as Parameters<typeof router.push>[0]);
    }
  };

  const ReadAllButton = (
    <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
      <Text style={styles.readAllText}>전체 읽음</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="알림" onBack={() => router.back()} right={ReadAllButton} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.length === 0 && !isLoading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={52} color={COLORS.sub} />
            <Text style={styles.emptyText}>알림이 없습니다</Text>
          </View>
        ) : (
          notifications.map((notif, index) => {
            const icon = TYPE_ICON[notif.type];
            return (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.item,
                  index < notifications.length - 1 && styles.itemBorder,
                  !notif.isRead && styles.itemUnread,
                ]}
                onPress={() => handleItemPress(notif.id, notif.data.screen)}
                activeOpacity={0.7}
              >
                {/* 타입 아이콘 */}
                <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name} size={20} color={icon.color} />
                </View>

                {/* 본문 */}
                <View style={styles.content}>
                  <Text style={styles.title} numberOfLines={1}>{notif.title}</Text>
                  <Text style={styles.body} numberOfLines={2}>{notif.body}</Text>
                  <Text style={styles.time}>{formatRelativeTime(notif.createdAt)}</Text>
                </View>

                {/* 읽지 않음 도트 */}
                {!notif.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sub,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    gap: SPACING.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemUnread: {
    backgroundColor: '#FAFCFF',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: 13,
    color: COLORS.sub,
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginTop: 6,
    flexShrink: 0,
  },
  readAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
    padding: 4,
  },
});
