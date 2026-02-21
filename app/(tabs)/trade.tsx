// 시계거래 탭 화면

import { StyleSheet, View } from 'react-native';
import Header from '@/components/common/Header';
import { COLORS } from '@/lib/constants';

export default function TradeScreen() {
  return (
    <View style={styles.container}>
      <Header title="시계거래" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
