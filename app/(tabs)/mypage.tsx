// MY 탭 화면

import { StyleSheet, View } from 'react-native';
import Header from '@/components/common/Header';
import { COLORS } from '@/lib/constants';

export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Header title="MY" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
