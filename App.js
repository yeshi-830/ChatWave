
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
} from "react-native";

export default function App() {
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef(null);
  const { width } = useWindowDimensions();

  const isCompact = width < 360;

  const [messages, setMessages] = useState([
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
  ]);

  useEffect(() => {
    if (messages.length > 2) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const sendMessage = () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) return;

    const now = new Date();

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text: trimmedMessage,
      sender: "me",
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      newMessage,
    ]);

    setMessageText("");
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
            isMine ? styles.myMessageContent : styles.otherMessageContent,
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
                isMine ? styles.myMessageText : styles.otherMessageText,
              ]}
            >
              {item.text}
            </Text>
          </View>

          <View
            style={[
              styles.messageMeta,
              isMine ? styles.myMessageMeta : styles.otherMessageMeta,
            ]}
          >
            <Text
              style={[
                styles.messageTime,
                isMine ? styles.myMessageTime : styles.otherMessageTime,
              ]}
            >
              {item.time}
            </Text>

            {isMine && <Text style={styles.readReceipt}>✓✓</Text>}
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
        {/* App header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>C</Text>
                <View style={styles.logoWave} />
              </View>

              <View>
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
                  Active now · Ready to chat
                </Text>
              </View>
            </View>

            <View style={styles.chatTypeBadge}>
              <Text style={styles.chatTypeIcon}>✦</Text>
              <Text style={styles.chatTypeLabel}>CHAT</Text>
            </View>
          </View>
        </View>

        {/* Conversation area */}
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
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            initialNumToRender={15}
          />
        </View>

        {/* Message composer */}
        <View style={styles.composerArea}>
          <View style={styles.composer}>
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

  chatTypeBadge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 13,
    marginLeft: 5,
  },

  chatTypeIcon: {
    color: "#BFDBFE",
    fontSize: 15,
  },

  chatTypeLabel: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 3,
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

  // Message composer
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
    paddingLeft: 16,
    paddingRight: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E1E8F3",
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
    marginBottom: 0,
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
