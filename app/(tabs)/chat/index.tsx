// 채팅방 목록 화면

import { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRelativeTime } from '@/lib/format';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

export default function ChatListScreen() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const { chatRooms, isLoading, fetchChatRooms } = useChatStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchChatRooms();
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <Header title="채팅" right={<View />} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {!isLoggedIn ? (
          <View style={styles.loginCard}>
            <Ionicons name="chatbox-outline" size={48} color={COLORS.sub} />
            <Text style={styles.loginTitle}>로그인이 필요합니다</Text>
            <Text style={styles.loginSub}>로그인하고 판매자와 채팅해보세요</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>로그인하기</Text>
            </TouchableOpacity>
          </View>
        ) : chatRooms.length === 0 && !isLoading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-outline" size={52} color={COLORS.sub} />
            <Text style={styles.emptyText}>채팅 내역이 없습니다</Text>
            <Text style={styles.emptySub}>매물 상세에서 판매자에게 메시지를 보내보세요</Text>
          </View>
        ) : (
          chatRooms.map((room, index) => {
            const myUnread = room.buyerId === user?.id ? room.buyerUnread : room.sellerUnread;
            return (
              <TouchableOpacity
                key={room.id}
                style={[
                  styles.roomItem,
                  index < chatRooms.length - 1 && styles.roomBorder,
                ]}
                onPress={() => router.push(`/chat/${room.id}`)}
                activeOpacity={0.7}
              >
                {/* 아바타 */}
                <View style={styles.avatarWrap}>
                  {room.counterpartAvatar ? (
                    <Image source={{ uri: room.counterpartAvatar }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarInitial}>
                        {room.counterpartNickname.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* 내용 */}
                <View style={styles.roomContent}>
                  <View style={styles.roomTop}>
                    <Text style={styles.nickname}>{room.counterpartNickname}</Text>
                    <Text style={styles.timeText}>{formatRelativeTime(room.lastMessageAt)}</Text>
                  </View>
                  <Text style={styles.tradeName} numberOfLines={1}>
                    {room.tradeBrand} {room.tradeModel}
                  </Text>
                  <View style={styles.roomBottom}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {room.lastMessage ?? '채팅이 시작되었습니다.'}
                    </Text>
                    {myUnread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>
                          {myUnread > 99 ? '99+' : String(myUnread)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
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
  // 로그인 유도
  loginCard: {
    alignItems: 'center',
    paddingTop: 100,
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  loginSub: {
    fontSize: 13,
    color: COLORS.sub,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.button,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // 빈 상태
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.sub,
    textAlign: 'center',
  },
  // 채팅방 아이템
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.card,
    gap: SPACING.md,
  },
  roomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.sub,
  },
  roomContent: {
    flex: 1,
    gap: 3,
  },
  roomTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.sub,
  },
  tradeName: {
    fontSize: 11,
    color: COLORS.sub,
  },
  roomBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  lastMessage: {
    fontSize: 13,
    color: COLORS.sub,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
