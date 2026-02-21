// 즉시매입 탭 화면

import { StyleSheet, View } from 'react-native';
import Header from '@/components/common/Header';
import { COLORS } from '@/lib/constants';

export default function BuybackScreen() {
  return (
    <View style={styles.container}>
      <Header title="즉시매입" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
