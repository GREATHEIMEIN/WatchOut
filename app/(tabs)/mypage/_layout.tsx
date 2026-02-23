// MY 탭 서브 Stack — 탭바 유지
import { Stack } from 'expo-router';

export default function MyPageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="my-trades" />
      <Stack.Screen name="my-posts" />
      <Stack.Screen name="my-requests" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="notification-settings" />
    </Stack>
  );
}
