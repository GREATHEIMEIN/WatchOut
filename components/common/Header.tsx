// 공통 헤더 컴포넌트 — v5 Header 참고

import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  dark?: boolean;
}

const Header = ({ title, onBack, right, dark }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12 },
        dark && styles.containerDark,
      ]}
    >
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={dark ? '#FFFFFF' : COLORS.text}
            />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
      </View>
      <View style={styles.right}>
        {right ?? <NotificationBell color={dark ? '#FFFFFF' : undefined} />}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  containerDark: {
    backgroundColor: COLORS.headerBg,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  iconButton: {
    padding: 4,
  },
});
