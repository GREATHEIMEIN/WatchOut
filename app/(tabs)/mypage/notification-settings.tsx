// 알림 설정 페이지 — 타입별 토글, AsyncStorage 저장

import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import type { NotificationType } from '@/store/useNotificationStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingItem {
  type: NotificationType;
  label: string;
  icon: IoniconsName;
  iconColor: string;
}

const SETTINGS: SettingItem[] = [
  { type: 'trade_interest',  label: '관심 매물 알림',       icon: 'heart-outline',            iconColor: COLORS.red },
  { type: 'price_alert',     label: '시세 변동 알림',       icon: 'trending-up-outline',       iconColor: COLORS.green },
  { type: 'comment',         label: '댓글 알림',            icon: 'chatbubble-outline',        iconColor: COLORS.accent },
  { type: 'system',          label: '시스템 알림',          icon: 'notifications-outline',     iconColor: COLORS.sub },
  { type: 'buyback_status',  label: '즉시매입 상태 알림',   icon: 'cash-outline',              iconColor: COLORS.orange },
  { type: 'exchange_status', label: '교환 요청 알림',       icon: 'swap-horizontal-outline',   iconColor: '#8B5CF6' },
  { type: 'chat',            label: '채팅 알림',            icon: 'chatbox-outline',           iconColor: COLORS.accent },
];

const STORAGE_KEY_PREFIX = 'notif_';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<NotificationType, boolean>>({
    trade_interest: true,
    price_alert: true,
    comment: true,
    system: true,
    buyback_status: true,
    exchange_status: true,
    chat: true,
  });

  // AsyncStorage에서 설정 로드
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const entries = await Promise.all(
          SETTINGS.map(async ({ type }) => {
            const val = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${type}`);
            return [type, val === null ? true : val === 'true'] as [NotificationType, boolean];
          }),
        );
        setSettings(Object.fromEntries(entries) as Record<NotificationType, boolean>);
      } catch (error) {
        console.error('알림 설정 로드 실패:', error);
      }
    };
    loadSettings();
  }, []);

  const handleToggle = async (type: NotificationType, value: boolean) => {
    setSettings((prev) => ({ ...prev, [type]: value }));
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${type}`, String(value));
    } catch (error) {
      console.error('알림 설정 저장 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="알림 설정" onBack={() => router.back()} right={<View />} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {SETTINGS.map((item, index) => (
            <View
              key={item.type}
              style={[styles.row, index < SETTINGS.length - 1 && styles.rowBorder]}
            >
              <View style={styles.rowLeft}>
                <Ionicons name={item.icon} size={22} color={item.iconColor} />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <Switch
                value={settings[item.type]}
                onValueChange={(value) => handleToggle(item.type, value)}
                trackColor={{ false: COLORS.border, true: COLORS.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>
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
  scrollContent: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: SPACING.base,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
});
