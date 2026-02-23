// 탭 네비게이션 레이아웃 — 5개 탭 (홈, 교환거래, 즉시매입(센터), 사고/팔기, MY)
// 시세/커뮤니티는 탭에서 숨기고 router.push로만 접근

import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '@/lib/constants';

// 즉시매입 센터 원형 버튼
const CenterTabButton = (props: BottomTabBarButtonProps) => {
  const { onPress, accessibilityState } = props;
  const focused = accessibilityState?.selected ?? false;

  return (
    <TouchableOpacity
      style={styles.centerTabBtn}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.centerTabInner, focused && styles.centerTabInnerFocused]}>
        <Ionicons name="cash" size={22} color="#FFFFFF" />
        <Text style={styles.centerTabLabel}>즉시매입</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* 홈 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 교환거래 */}
      <Tabs.Screen
        name="exchange"
        options={{
          title: '교환거래',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'repeat' : 'repeat-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 즉시매입 — 센터 원형 버튼 */}
      <Tabs.Screen
        name="buyback"
        options={{
          title: '즉시매입',
          tabBarButton: (props) => <CenterTabButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="cash" size={22} color={focused ? COLORS.gold : 'rgba(255,255,255,0.45)'} />
          ),
        }}
      />

      {/* 사고/팔기 (구 시계거래) */}
      <Tabs.Screen
        name="trade"
        options={{
          title: '사고/팔기',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'pricetag' : 'pricetag-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* MY */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'MY',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 시세 — 탭 바에서 숨김 */}
      <Tabs.Screen name="price" options={{ href: null }} />

      {/* 커뮤니티 — 탭 바에서 숨김 */}
      <Tabs.Screen name="community" options={{ href: null }} />

      {/* 컬렉션 — 탭 바에서 숨김 */}
      <Tabs.Screen name="collection" options={{ href: null }} />

      {/* 채팅 — 탭 바에서 숨김 */}
      <Tabs.Screen name="chat" options={{ href: null }} />

      {/* 알림 — 탭 바에서 숨김 */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.tabBg,
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderTopWidth: 1,
    paddingTop: 6,
    height: Platform.OS === 'ios' ? 88 : 64,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  // 즉시매입 센터 버튼
  centerTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
  },
  centerTabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginBottom: 2,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  centerTabInnerFocused: {
    backgroundColor: '#E8C55A',
  },
  centerTabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});
