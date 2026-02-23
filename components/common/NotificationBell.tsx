// 알림 벨 아이콘 — 뱃지 포함, 알림 목록으로 이동

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants';
import { useNotificationStore } from '@/store/useNotificationStore';

const NotificationBell = ({ color }: { color?: string }) => {
  const router = useRouter();
  const { unreadCount } = useNotificationStore();

  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => router.push('/notifications')}
      activeOpacity={0.7}
    >
      <Ionicons
        name="notifications-outline"
        size={22}
        color={color ?? COLORS.text}
      />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : String(unreadCount)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationBell;

const styles = StyleSheet.create({
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 11,
  },
});
