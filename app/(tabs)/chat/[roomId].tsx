// 채팅 화면 — Supabase Realtime 실시간 메시지 + 이미지 전송

import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createNotification } from '@/lib/notifications';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

// 날짜 구분선 레이블
const getDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return '오늘';
  if (sameDay(date, yesterday)) return '어제';
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 시간 포맷 (오전/오후 H:MM)
const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h < 12 ? '오전' : '오후';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm} ${hour}:${m}`;
};

export default function ChatRoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const numRoomId = Number(roomId);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const {
    chatRooms,
    currentMessages,
    fetchChatRooms,
    fetchMessages,
    sendMessage,
    sendImageMessage,
    markRoomAsRead,
    subscribeToRoom,
    unsubscribeFromRoom,
  } = useChatStore();

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const initialScrollDone = useRef(false);

  // 채팅방 정보
  const room = chatRooms.find((r) => r.id === numRoomId) ?? null;

  // 마운트: 방 목록 + 메시지 로드 + Realtime 구독 + 읽음 처리
  useEffect(() => {
    if (chatRooms.length === 0) fetchChatRooms();
    fetchMessages(numRoomId);
    markRoomAsRead(numRoomId);
    subscribeToRoom(numRoomId, () => {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => unsubscribeFromRoom();
  }, [numRoomId]);

  // 초기 메시지 로드 완료 후 1회 스크롤
  useEffect(() => {
    if (currentMessages.length > 0 && !initialScrollDone.current) {
      initialScrollDone.current = true;
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 50);
    }
  }, [currentMessages.length]);

  // 텍스트 메시지 전송
  const handleSend = async () => {
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setText('');
    await sendMessage(numRoomId, msg);

    // 상대방 채팅 알림
    if (room) {
      const counterpartId = room.buyerId === user?.id ? room.sellerId : room.buyerId;
      await createNotification(
        counterpartId,
        'chat',
        '새 메시지',
        `${user?.nickname ?? '상대방'}: ${msg.length > 30 ? msg.slice(0, 30) + '...' : msg}`,
        { screen: `/chat/${numRoomId}` },
      );
    }

    setSending(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // 이미지 선택 + 전송
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) return;

    setSending(true);
    await sendImageMessage(numRoomId, result.assets[0].uri);

    if (room) {
      const counterpartId = room.buyerId === user?.id ? room.sellerId : room.buyerId;
      await createNotification(
        counterpartId,
        'chat',
        '새 메시지',
        `${user?.nickname ?? '상대방'}: 사진을 보냈습니다`,
        { screen: `/chat/${numRoomId}` },
      );
    }

    setSending(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // 날짜 구분선 상태 (렌더링 중 추적)
  let lastDateLabel = '';

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {room?.counterpartNickname ?? '채팅'}
          </Text>
        </View>
        {room && (
          <TouchableOpacity
            style={styles.tradeButton}
            onPress={() => router.push(`/trade/${room.tradePostId}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.tradeButtonText} numberOfLines={1}>
              {room.tradeBrand} {room.tradeModel}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* 메시지 영역 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageArea}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
        >
          {currentMessages.map((msg) => {
            const isMine = msg.senderId === user?.id;
            const isSystem = msg.messageType === 'system';
            const isImage = msg.messageType === 'image';
            const dateLabel = getDateLabel(msg.createdAt);
            const showDate = dateLabel !== lastDateLabel;
            if (showDate) lastDateLabel = dateLabel;

            return (
              <View key={msg.id}>
                {/* 날짜 구분선 */}
                {showDate && (
                  <View style={styles.dateDivider}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateLabel}>{dateLabel}</Text>
                    <View style={styles.dateLine} />
                  </View>
                )}

                {/* 시스템 메시지 */}
                {isSystem ? (
                  <View style={styles.systemMessageWrap}>
                    <Text style={styles.systemMessage}>{msg.message}</Text>
                  </View>
                ) : isImage ? (
                  /* 이미지 메시지 */
                  <View
                    style={[
                      styles.messageBubbleWrap,
                      isMine ? styles.myBubbleWrap : styles.theirBubbleWrap,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => setViewerUri(msg.message)}
                      activeOpacity={0.9}
                    >
                      <Image
                        source={{ uri: msg.message }}
                        style={[
                          styles.imageBubble,
                          isMine ? styles.myImageBubble : styles.theirImageBubble,
                        ]}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <Text style={styles.msgTime}>{formatTime(msg.createdAt)}</Text>
                  </View>
                ) : (
                  /* 텍스트 메시지 */
                  <View
                    style={[
                      styles.messageBubbleWrap,
                      isMine ? styles.myBubbleWrap : styles.theirBubbleWrap,
                    ]}
                  >
                    <View
                      style={[
                        styles.bubble,
                        isMine ? styles.myBubble : styles.theirBubble,
                      ]}
                    >
                      <Text style={isMine ? styles.myBubbleText : styles.theirBubbleText}>
                        {msg.message}
                      </Text>
                    </View>
                    <Text style={styles.msgTime}>{formatTime(msg.createdAt)}</Text>
                  </View>
                )}
              </View>
            );
          })}
          <View style={{ height: 12 }} />
        </ScrollView>

        {/* 입력 영역 */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          {/* 파일첨부 버튼 */}
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleImagePick}
            disabled={sending}
            activeOpacity={0.7}
          >
            <Ionicons
              name="attach"
              size={22}
              color={sending ? COLORS.border : COLORS.sub}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="메시지를 입력하세요"
            placeholderTextColor={COLORS.sub}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit
          />
          <TouchableOpacity
            style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={18}
              color={text.trim() && !sending ? '#FFFFFF' : COLORS.sub}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 전체화면 이미지 뷰어 */}
      <Modal
        visible={viewerUri !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerUri(null)}
        statusBarTranslucent
      >
        <View style={styles.viewerOverlay}>
          <TouchableOpacity
            style={styles.viewerClose}
            onPress={() => setViewerUri(null)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          {viewerUri && (
            <Image
              source={{ uri: viewerUri }}
              style={styles.viewerImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  // 커스텀 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingBottom: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  tradeButton: {
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.tag,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    maxWidth: 130,
  },
  tradeButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.sub,
  },
  // 메시지 영역
  messageArea: {
    flex: 1,
  },
  messageContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
  },
  // 날짜 구분선
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.base,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.sub,
  },
  // 시스템 메시지
  systemMessageWrap: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  systemMessage: {
    fontSize: 12,
    color: COLORS.sub,
    backgroundColor: COLORS.tag,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.tag,
  },
  // 메시지 버블 공통
  messageBubbleWrap: {
    marginBottom: SPACING.sm,
    gap: 4,
  },
  myBubbleWrap: {
    alignItems: 'flex-end',
  },
  theirBubbleWrap: {
    alignItems: 'flex-start',
  },
  // 텍스트 버블
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: COLORS.text,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: COLORS.tag,
    borderBottomLeftRadius: 4,
  },
  myBubbleText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  theirBubbleText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  // 이미지 버블
  imageBubble: {
    width: 200,
    height: 200,
    borderRadius: 14,
  },
  myImageBubble: {
    borderBottomRightRadius: 4,
  },
  theirImageBubble: {
    borderBottomLeftRadius: 4,
  },
  msgTime: {
    fontSize: 11,
    color: COLORS.sub,
  },
  // 입력창
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  // 전체화면 이미지 뷰어
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
});
