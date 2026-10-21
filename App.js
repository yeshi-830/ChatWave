
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
} from "react-native";

export default function App() {
  const [messageText, setMessageText] = useState("");

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

  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 2) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

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

          <Text
            style={[
              styles.messageTime,
              isMine ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {item.time}
            {isMine ? "  ✓✓" : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* ChatWave Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>C</Text>
              </View>

              <View>
                <Text style={styles.brandName}>ChatWave</Text>
                <Text style={styles.brandSubtitle}>
                  Stay connected
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
              <Text style={styles.contactStatus}>
                Active now · Ready to chat
              </Text>
            </View>

            <View style={styles.secureBadge}>
              <Text style={styles.secureBadgeText}>●</Text>
              <Text style={styles.secureBadgeLabel}>Chat</Text>
            </View>
          </View>
        </View>

        {/* Conversation */}
        <View style={styles.chatArea}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIcon}>
              <Text style={styles.welcomeEmoji}>👋</Text>
            </View>

            <Text style={styles.welcomeTitle}>Your conversation</Text>

            <Text style={styles.welcomeDescription}>
              Say hello and start a new conversation.
              Your messages will appear below.
            </Text>

            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>TODAY</Text>
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
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Message Composer */}
        <View style={styles.composerArea}>
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              placeholder="Write a message..."
              placeholderTextColor="#94A3B8"
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={2000}
              returnKeyType="default"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !messageText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              activeOpacity={0.8}
              accessibilityLabel="Send message"
              accessibilityRole="button"
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerDot} />
            <Text style={styles.footerText}>
              Your space to connect
            </Text>
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
    backgroundColor: "#F4F7FC",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },

  header: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#2563EB",
    fontSize: 27,
    fontWeight: "900",
  },

  brandName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  brandSubtitle: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 2,
  },

  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },

  headerBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#86EFAC",
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    padding: 13,
    borderRadius: 19,
  },

  contactAvatarContainer: {
    position: "relative",
  },

  contactAvatar: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  contactAvatarText: {
    color: "#1D4ED8",
    fontWeight: "900",
    fontSize: 16,
  },

  onlineDot: {
    position: "absolute",
    right: -1,
    bottom: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },

  contactName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  contactStatus: {
    color: "#DBEAFE",
    fontSize: 11,
    marginTop: 5,
  },

  secureBadge: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  secureBadgeText: {
    color: "#86EFAC",
    fontSize: 12,
  },

  secureBadgeLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    marginTop: 3,
  },

  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  welcomeCard: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 15,
  },

  welcomeIcon: {
    width: 49,
    height: 49,
    borderRadius: 17,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  welcomeEmoji: {
    fontSize: 25,
  },

  welcomeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#172554",
    textAlign: "center",
  },

  welcomeDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    maxWidth: 260,
  },

  todayBadge: {
    marginTop: 14,
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
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
    paddingTop: 8,
    paddingBottom: 15,
    flexGrow: 1,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 18,
  },

  smallAvatarText: {
    color: "#2563EB",
    fontSize: 9,
    fontWeight: "900",
  },

  messageContent: {
    maxWidth: "80%",
  },

  otherMessageContent: {
    alignItems: "flex-start",
  },

  myMessageContent: {
    alignItems: "flex-end",
  },

  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 19,
  },

  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "#E8EEF7",
  },

  myBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 5,
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

  messageTime: {
    fontSize: 10,
    marginTop: 5,
    marginHorizontal: 3,
  },

  otherMessageTime: {
    color: "#94A3B8",
  },

  myMessageTime: {
    color: "#64748B",
  },

  composerArea: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: Platform.OS === "ios" ? 8 : 12,
    borderTopWidth: 1,
    borderTopColor: "#E8EEF7",
  },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F1F5F9",
    borderRadius: 25,
    paddingLeft: 17,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  input: {
    flex: 1,
    color: "#0F172A",
    fontSize: 14,
    maxHeight: 110,
    minHeight: 42,
    paddingTop: 11,
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
    marginLeft: 5,
  },

  sendButtonDisabled: {
    backgroundColor: "#93C5FD",
  },

  sendIcon: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginLeft: 3,
    marginTop: -2,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },

  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },

  footerText: {
    color: "#94A3B8",
    fontSize: 10,
  },
  footerBrand: {
    color: "#64748B",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginLeft: 5,
  },
});
