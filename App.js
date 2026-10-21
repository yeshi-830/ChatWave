
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

const EMOJIS = [
  "😀", "😂", "😍", "🥰", "😊", "😎",
  "😭", "😢", "😡", "🤔", "🙌", "👏",
  "❤️", "🔥", "👍", "👎", "🙏", "🎉",
  "💯", "✨", "💙", "👋", "😴", "🤝",
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    text: "Welcome to ChatWave! 👋",
    time: "Now",
    sender: "other",
  },
  {
    id: "welcome-2",
    text: "Send a message to get started. 💙",
    time: "Now",
    sender: "other",
  },
];

export default function App() {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef(null);
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 380;

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [messages, isTyping]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text: trimmedMessage,
      time: getCurrentTime(),
      sender: "me",
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      newMessage,
    ]);

    setMessageText("");
    setShowEmojis(false);
    setIsTyping(true);

    // Demo response only. This is not a real online chat connection.
    setTimeout(() => {
      const replies = [
        "Thanks for your message! 😊",
        "That's great! 💙",
        "I'm here! 👋",
        "Nice! Tell me more. ✨",
        "Awesome! 🔥",
      ];

      const reply = {
        id: `${Date.now()}-${Math.random()}`,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: getCurrentTime(),
        sender: "other",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        reply,
      ]);

      setIsTyping(false);
    }, 1600);
  };

  const addEmoji = (emoji) => {
    setMessageText((previousText) => previousText + emoji);
  };

  const clearConversation = () => {
    Alert.alert(
      "Clear conversation",
      "Are you sure you want to clear all messages?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setMessages([]);
            setIsTyping(false);
            setShowEmojis(false);
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          isMyMessage
            ? styles.myMessageRow
            : styles.otherMessageRow,
        ]}
      >
        {!isMyMessage && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>C</Text>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isMyMessage
              ? styles.myMessageBubble
              : styles.otherMessageBubble,
            {
              maxWidth: width * (isSmallScreen ? 0.76 : 0.72),
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage
                ? styles.myMessageText
                : styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>

          <Text
            style={[
              styles.messageTime,
              isMyMessage
                ? styles.myMessageTime
                : styles.otherMessageTime,
            ]}
          >
            {item.time}
            {isMyMessage ? "  ✓✓" : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2563EB"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>C</Text>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>ChatWave</Text>

              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.headerSubtitle}>
                  {isTyping ? "Typing a message..." : "Online"}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearConversation}
            accessibilityLabel="Clear conversation"
            accessibilityRole="button"
          >
            <Text style={styles.clearButtonText}>CLEAR</Text>
          </TouchableOpacity>
        </View>

        {/* Chat area */}
        <View style={styles.chatArea}>
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIcon}>💬</Text>
              </View>

              <Text style={styles.emptyTitle}>
                No messages yet
              </Text>

              <Text style={styles.emptySubtitle}>
                Start a conversation with ChatWave.
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          )}

          {/* Typing indicator */}
          {isTyping && (
            <View style={styles.typingRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>C</Text>
              </View>

              <View style={styles.typingBubble}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}
        </View>

        {/* Emoji picker */}
        {showEmojis && (
          <View style={styles.emojiPanel}>
            <View style={styles.emojiPanelHeader}>
              <Text style={styles.emojiPanelTitle}>
                Choose an emoji
              </Text>

              <TouchableOpacity
                onPress={() => setShowEmojis(false)}
                accessibilityLabel="Close emoji picker"
              >
                <Text style={styles.closeEmojiButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emojiGrid}>
              {EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiButton}
                  onPress={() => addEmoji(emoji)}
                  accessibilityLabel={`Add ${emoji}`}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Message input */}
        <View style={styles.inputArea}>
          <TouchableOpacity
            style={[
              styles.emojiToggle,
              showEmojis && styles.emojiToggleActive,
            ]}
            onPress={() => setShowEmojis((previous) => !previous)}
            accessibilityLabel="Open emoji picker"
            accessibilityRole="button"
          >
            <Text style={styles.emojiToggleText}>😊</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Write a message..."
            placeholderTextColor="#94A3B8"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={2000}
            onFocus={() => setShowEmojis(false)}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
            returnKeyType="send"
            accessibilityLabel="Message input"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !messageText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!messageText.trim()}
            accessibilityLabel="Send message"
            accessibilityRole="button"
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with 💙 using ChatWave
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  header: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerAvatarText: {
    color: "#2563EB",
    fontSize: 23,
    fontWeight: "800",
  },

  headerInfo: {
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },

  headerSubtitle: {
    color: "#DBEAFE",
    fontSize: 12,
  },

  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginLeft: 8,
  },

  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  chatArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  messagesList: {
    paddingHorizontal: 14,
    paddingTop: 22,
    paddingBottom: 18,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 3,
  },

  avatarText: {
    color: "#2563EB",
    fontWeight: "800",
    fontSize: 14,
  },

  messageBubble: {
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 8,
    borderRadius: 17,
    minWidth: 85,
  },

  myMessageBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 5,
  },

  otherMessageBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },

  myMessageText: {
    color: "#FFFFFF",
  },

  otherMessageText: {
    color: "#1E293B",
  },

  messageTime: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },

  myMessageTime: {
    color: "#DBEAFE",
  },

  otherMessageTime: {
    color: "#94A3B8",
  },

  typingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 14,
    paddingBottom: 12,
  },

  typingBubble: {
    height: 38,
    minWidth: 65,
    borderRadius: 17,
    borderBottomLeftRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#64748B",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  emptyIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyIcon: {
    fontSize: 37,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
  },

  emojiPanel: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  emojiPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  emojiPanelTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  closeEmojiButton: {
    fontSize: 18,
    color: "#64748B",
    paddingHorizontal: 6,
  },

  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emojiButton: {
    width: "12.5%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
  },

  emojiText: {
    fontSize: 24,
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 8,
  },

  emojiToggle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },

  emojiToggleActive: {
    backgroundColor: "#DBEAFE",
  },

  emojiToggleText: {
    fontSize: 23,
  },

  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: "#F1F5F9",
    borderRadius: 22,
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 15,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },

  sendButtonDisabled: {
    backgroundColor: "#93C5FD",
  },

  sendButtonText: {
    fontSize: 23,
    color: "#FFFFFF",
    fontWeight: "800",
    transform: [{ rotate: "-25deg" }],
    marginLeft: -2,
  },

  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
  },

  footerText: {
    fontSize: 10,
    color: "#94A3B8",
  },
});
