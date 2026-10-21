
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  useWindowDimensions,
  Alert,
} from "react-native";

const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "Hey! 👋 Welcome to ChatWave.",
    sender: "other",
    time: "09:40 AM",
  },
  {
    id: "2",
    text: "A simple place to connect and chat. Send your first message!",
    sender: "other",
    time: "09:40 AM",
  },
];

const EMOJIS = ["😀", "😂", "❤️", "😍", "👍", "🔥", "🎉", "👋"];

export default function App() {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef(null);
  const typingTimerRef = useRef(null);
  const replyTimerRef = useRef(null);

  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  useEffect(() => {
    if (messages.length > 2) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimerRef.current);
      clearTimeout(replyTimerRef.current);
    };
  }, []);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const addMessage = (text, sender) => ({
    id: `${Date.now()}-${Math.random()}`,
    text,
    sender,
    time: getCurrentTime(),
  });

  const sendMessage = () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) return;

    // Cancel any previous simulated reply timers.
    clearTimeout(typingTimerRef.current);
    clearTimeout(replyTimerRef.current);

    setMessages((previous) => [
      ...previous,
      addMessage(trimmedMessage, "me"),
    ]);

    setMessageText("");
    setShowEmojis(false);
    setIsTyping(true);

    // Demo only: simulate the other person's response.
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);

      replyTimerRef.current = setTimeout(() => {
        setMessages((previous) => [
          ...previous,
          addMessage(
            "Thanks for your message! 👋 This is a ChatWave demo reply.",
            "other"
          ),
        ]);
      }, 450);
    }, 1500);
  };

  const insertEmoji = (emoji) => {
    setMessageText((previous) => previous + emoji);
  };

  const clearConversation = () => {
    Alert.alert(
      "Clear conversation?",
      "This will remove all messages from the current chat.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearTimeout(typingTimerRef.current);
            clearTimeout(replyTimerRef.current);

            setMessages([]);
            setIsTyping(false);
            setMessageText("");
            setShowEmojis(false);
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isMine = item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        {!isMine && (
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>CW</Text>
          </View>
        )}

        <View
          style={[
            styles.messageContent,
            isMine
              ? styles.myMessageContent
              : styles.otherMessageContent,
            { maxWidth: isCompact ? "84%" : "78%" },
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isMine ? styles.myBubble : styles.otherBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMine
                  ? styles.myMessageText
                  : styles.otherMessageText,
              ]}
            >
              {item.text}
            </Text>
          </View>

          <View
            style={[
              styles.messageMeta,
              isMine
                ? styles.myMessageMeta
                : styles.otherMessageMeta,
            ]}
          >
            <Text
              style={[
                styles.messageTime,
                isMine
                  ? styles.myMessageTime
                  : styles.otherMessageTime,
              ]}
            >
              {item.time}
            </Text>

            {isMine && (
              <Text style={styles.readReceipt}>✓✓</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1237A5"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>C</Text>
                <View style={styles.logoWave} />
              </View>

              <View style={styles.brandInfo}>
                <Text style={styles.brandName}>ChatWave</Text>
                <Text style={styles.brandSubtitle}>
                  Your conversations, connected.
                </Text>
              </View>
            </View>

            <View style={styles.headerBadge}>
              <View style={styles.headerBadgeDot} />
              <Text style={styles.headerBadgeText}>ONLINE</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactAvatarContainer}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>CW</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Chat Partner</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.contactStatus}>
                  {isTyping ? "Typing a message..." : "Active now · Ready to chat"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearConversation}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Clear conversation"
            >
              <Text style={styles.clearIcon}>⌫</Text>
              <Text style={styles.clearLabel}>CLEAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CHAT AREA */}
        <View style={styles.chatArea}>
          <View style={styles.conversationHeading}>
            <View style={styles.welcomeIcon}>
              <Text style={styles.welcomeEmoji}>👋</Text>
            </View>

            <Text style={styles.welcomeTitle}>
              Your conversation
            </Text>

            <Text style={styles.welcomeDescription}>
              Every great conversation starts with a hello.
            </Text>

            <View style={styles.todayDivider}>
              <View style={styles.dividerLine} />
              <View style={styles.todayBadge}>
                <Text style={styles.todayText}>TODAY</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>
          </View>

          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>
                Start a fresh conversation
              </Text>
              <Text style={styles.emptyDescription}>
                Your messages will appear here.
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === "ios" ? "interactive" : "on-drag"
              }
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({
                  animated: true,
                })
              }
              initialNumToRender={15}
            />
          )}

          {/* TYPING INDICATOR */}
          {isTyping && (
            <View style={styles.typingRow}>
              <View style={styles.smallAvatar}>
                <Text style={styles.smallAvatarText}>CW</Text>
              </View>

              <View style={styles.typingBubble}>
                <Text style={styles.typingDots}>● ● ●</Text>
                <Text style={styles.typingLabel}>
                  Chat Partner is typing
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* MESSAGE COMPOSER */}
        <View style={styles.composerArea}>
          {/* EMOJI PICKER */}
          {showEmojis && (
            <View style={styles.emojiPanel}>
              <Text style={styles.emojiTitle}>Choose an emoji</Text>

              <View style={styles.emojiGrid}>
                {EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.emojiButton}
                    onPress={() => insertEmoji(emoji)}
                    accessibilityRole="button"
                    accessibilityLabel={`Insert ${emoji}`}
                    key={emoji}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.composer}>
            <TouchableOpacity
              style={styles.emojiToggle}
              onPress={() => setShowEmojis((previous) => !previous)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Toggle emoji picker"
            >
              <Text style={styles.emojiToggleText}>😊</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Message Chat Partner..."
              placeholderTextColor="#94A3B8"
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={2000}
              returnKeyType="default"
              textAlignVertical="center"
              accessibilityLabel="Write a message"
              onFocus={() => setShowEmojis(false)}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !messageText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              activeOpacity={0.75}
              accessibilityLabel="Send message"
              accessibilityRole="button"
              accessibilityState={{
                disabled: !messageText.trim(),
              }}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerLock}>●</Text>
              <Text style={styles.footerText}>
                Made for meaningful conversations
              </Text>
            </View>

            <Text style={styles.footerBrand}>CHATWAVE</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1237A5",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F7FC",
  },

  // Header
  header: {
    backgroundColor: "#1237A5",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 19,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
    shadowColor: "#1237A5",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 21,
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: 8,
  },

  brandInfo: {
    flexShrink: 1,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    overflow: "hidden",
  },

  logoText: {
    color: "#2563EB",
    fontSize: 28,
    fontWeight: "900",
  },

  logoWave: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 15,
    height: 8,
    backgroundColor: "#BFDBFE",
    borderTopLeftRadius: 12,
  },

  brandName: {
    fontSize: 23,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },

  brandSubtitle: {
    color: "#C7D8FF",
    fontSize: 10,
    marginTop: 4,
  },

  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 20,
  },

  headerBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.11)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  contactAvatarContainer: {
    position: "relative",
  },

  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  contactAvatarText: {
    color: "#1D4ED8",
    fontWeight: "900",
    fontSize: 15,
  },

  onlineDot: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4ADE80",
    borderWidth: 2,
    borderColor: "#1237A5",
  },

  contactInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
  },

  contactName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#4ADE80",
    marginRight: 5,
  },

  contactStatus: {
    color: "#D7E4FF",
    fontSize: 10,
    flexShrink: 1,
  },

  clearButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 7,
  },

  clearIcon: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },

  clearLabel: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
    marginTop: 2,
    letterSpacing: 0.5,
  },

  // Conversation
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  conversationHeading: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 12,
  },

  welcomeIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#E0EAFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  welcomeEmoji: {
    fontSize: 22,
  },

  welcomeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172554",
    letterSpacing: -0.2,
  },

  welcomeDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: "#7B879B",
    textAlign: "center",
    marginTop: 5,
  },

  todayDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 13,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3E9F3",
  },

  todayBadge: {
    backgroundColor: "#E9EEF8",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 10,
  },

  todayText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1,
  },

  messageList: {
    flex: 1,
  },

  messageListContent: {
    paddingTop: 9,
    paddingBottom: 14,
    flexGrow: 1,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 14,
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  smallAvatar: {
    width: 29,
    height: 29,
    borderRadius: 11,
    backgroundColor: "#DCE8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 18,
  },

  smallAvatarText: {
    color: "#2456C7",
    fontSize: 8,
    fontWeight: "900",
  },

  messageContent: {
    flexShrink: 1,
  },

  otherMessageContent: {
    alignItems: "flex-start",
  },

  myMessageContent: {
    alignItems: "flex-end",
  },

  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 19,
  },

  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "#E8EDF6",
    elevation: 1,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  myBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 5,
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },

  otherMessageText: {
    color: "#334155",
  },

  myMessageText: {
    color: "#FFFFFF",
  },

  messageMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginHorizontal: 3,
  },

  otherMessageMeta: {
    justifyContent: "flex-start",
  },

  myMessageMeta: {
    justifyContent: "flex-end",
  },

  messageTime: {
    fontSize: 9,
  },

  otherMessageTime: {
    color: "#94A3B8",
  },

  myMessageTime: {
    color: "#8492AA",
  },

  readReceipt: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "900",
    marginLeft: 4,
  },

  // Typing indicator
  typingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 17,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "#E8EDF6",
  },

  typingDots: {
    color: "#2563EB",
    fontSize: 10,
    marginRight: 8,
    letterSpacing: 1,
  },

  typingLabel: {
    color: "#64748B",
    fontSize: 10,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  emptyEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#172554",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyDescription: {
    color: "#7B879B",
    fontSize: 12,
    marginTop: 7,
    textAlign: "center",
  },

  // Composer
  composerArea: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 10,
    borderTopWidth: 1,
    borderTopColor: "#E8EDF5",
  },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F5F7FB",
    borderRadius: 25,
    paddingLeft: 7,
    paddingRight: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E1E8F3",
  },

  emojiToggle: {
    width: 38,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 3,
  },

  emojiToggleText: {
    fontSize: 23,
  },

  input: {
    flex: 1,
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
    maxHeight: 110,
    minHeight: 42,
    paddingTop: 10,
    paddingBottom: 9,
    paddingRight: 8,
  },

  sendButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  sendButtonDisabled: {
    backgroundColor: "#A8C5FF",
    elevation: 0,
    shadowOpacity: 0,
  },

  sendIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 3,
    marginTop: -2,
  },

  // Emoji picker
  emojiPanel: {
    backgroundColor: "#F5F7FB",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E1E8F3",
    padding: 12,
    marginBottom: 10,
  },

  emojiTitle: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },

  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emojiButton: {
    width: "23%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },

  emojiText: {
    fontSize: 25,
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 11,
    paddingHorizontal: 3,
  },

  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: 8,
  },

  footerLock: {
    color: "#16A34A",
    fontSize: 8,
    marginRight: 6,
  },

  footerText: {
    color: "#94A3B8",
    fontSize: 9,
  },

  footerBrand: {
    color: "#64748B",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
