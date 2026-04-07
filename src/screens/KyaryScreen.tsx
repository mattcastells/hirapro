import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { sendKyaryMessage, KyaryHistoryMessage } from '../services/kyary';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  pending?: boolean;
};

const createLocalId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export function KyaryScreen() {
  const { theme: activeTheme } = useAppTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const inputRef = useRef<TextInput>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const canSend = input.trim().length > 0 && !isSending;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages.length, isSending]);

  const clearConversation = () => {
    if (messages.length === 0 && !input) return;
    setMessages([]);
    setInput('');
    setErrorText(null);
  };

  const submit = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const pendingAssistantId = createLocalId('assistant-pending');
    const userMessage: ChatMessage = {
      id: createLocalId('user'),
      role: 'user',
      text,
    };
    const history: KyaryHistoryMessage[] = [
      ...messages.filter((m) => !m.pending),
      userMessage,
    ].map((m) => ({ role: m.role, text: m.text }));

    setMessages((current) => [
      ...current,
      userMessage,
      { id: pendingAssistantId, role: 'assistant', text: '', pending: true },
    ]);
    setInput('');
    setErrorText(null);
    setIsSending(true);

    try {
      const reply = await sendKyaryMessage(history);
      setMessages((current) => {
        const withoutPlaceholder = current.filter(
          (m) => m.id !== pendingAssistantId,
        );
        return [
          ...withoutPlaceholder,
          {
            id: createLocalId('assistant'),
            role: 'assistant',
            text: reply.text,
          },
        ];
      });
    } catch (error) {
      setMessages((current) =>
        current.filter((m) => m.id !== pendingAssistantId),
      );
      setErrorText(
        error instanceof Error
          ? error.message
          : 'No se pudo consultar a Kyary.',
      );
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <ScreenBackground
      scrollable={false}
      showBottomNav={!keyboardVisible}
    >
      <View style={styles.screen}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <AppText variant="title" style={styles.titleText}>
              Kyary
            </AppText>
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textMuted}
            >
              Asistente de japonés
            </AppText>
          </View>
          <Pressable
            onPress={clearConversation}
            disabled={messages.length === 0 && !input}
            style={({ pressed }) => [
              styles.resetButton,
              {
                backgroundColor: hexToRgba(
                  activeTheme.colors.backgroundSecondary,
                  Platform.OS === 'android' ? 0.9 : 0.28,
                ),
                borderColor: hexToRgba(activeTheme.colors.white, 0.08),
                opacity:
                  messages.length === 0 && !input ? 0.4 : pressed ? 0.7 : 1,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={16}
              color={activeTheme.colors.accentBlue}
            />
          </Pressable>
        </View>

        {messages.length === 0 ? (
          <GlassCard style={styles.emptyCard} contentStyle={styles.emptyContent}>
            <AppText
              variant="title"
              style={styles.emptyTitle}
            >
              Hola! Soy Kyary 🌸
            </AppText>
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textMuted}
              style={styles.emptyHint}
            >
              Preguntame sobre hiragana, katakana, vocabulario, gramática o
              cualquier duda sobre el japonés. Estoy para ayudarte!
            </AppText>
          </GlassCard>
        ) : null}

        <ScrollView
          ref={scrollRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.role === 'user'
                  ? styles.userRow
                  : styles.assistantRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user'
                    ? {
                        backgroundColor: hexToRgba(
                          activeTheme.colors.accentBlue,
                          0.14,
                        ),
                        borderColor: hexToRgba(
                          activeTheme.colors.accentBlue,
                          0.32,
                        ),
                      }
                    : {
                        backgroundColor: hexToRgba(
                          activeTheme.colors.backgroundSecondary,
                          Platform.OS === 'android' ? 0.92 : 0.42,
                        ),
                        borderColor: hexToRgba(
                          activeTheme.colors.white,
                          0.06,
                        ),
                      },
                ]}
              >
                {message.pending ? (
                  <PendingDots color={activeTheme.colors.textMuted} />
                ) : (
                  <AppText
                    variant="body"
                    color={
                      message.role === 'user'
                        ? activeTheme.colors.textPrimary
                        : activeTheme.colors.textPrimary
                    }
                    style={styles.messageText}
                  >
                    {message.text}
                  </AppText>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {errorText ? (
          <View
            style={[
              styles.errorBanner,
              {
                backgroundColor: hexToRgba('#FF6B5B', 0.12),
                borderColor: hexToRgba('#FF6B5B', 0.28),
              },
            ]}
          >
            <AppText variant="bodySmall" color="#FF8E8E">
              {errorText}
            </AppText>
          </View>
        ) : null}

        <GlassCard style={styles.composerCard} contentStyle={styles.composerContent}>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => void submit()}
              editable={!isSending}
              multiline
              numberOfLines={3}
              maxLength={800}
              placeholder="Preguntale a Kyary..."
              placeholderTextColor={activeTheme.colors.textMuted}
              selectionColor={activeTheme.colors.accentBlue}
              blurOnSubmit={false}
              returnKeyType="default"
              style={[
                styles.input,
                { color: activeTheme.colors.textPrimary },
              ]}
            />
          </View>
          <View style={styles.composerActions}>
            <PrimaryButton
              title={isSending ? 'PENSANDO...' : 'ENVIAR'}
              variant="primary"
              size="compact"
              disabled={!canSend}
              onPress={() => void submit()}
              style={styles.sendButton}
            />
          </View>
        </GlassCard>
      </View>
    </ScreenBackground>
  );
}

function PendingDots({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <View style={styles.pendingRow}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={[
            styles.pendingDot,
            { backgroundColor: color },
            {
              opacity: anim.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange:
                  i === 0
                    ? [0.3, 1, 0.3, 0.3]
                    : i === 1
                      ? [0.3, 0.3, 1, 0.3]
                      : [0.3, 0.3, 0.3, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    gap: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  titleLeft: {
    gap: 2,
  },
  titleText: {
    fontSize: 20,
  },
  resetButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    marginVertical: theme.spacing.sm,
  },
  emptyContent: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyHint: {
    textAlign: 'center',
    lineHeight: 20,
  },
  messagesScroll: {
    flex: 1,
    minHeight: 0,
  },
  messagesContent: {
    gap: 10,
    paddingBottom: theme.spacing.xs,
  },
  messageRow: {
    width: '100%',
  },
  userRow: {
    alignItems: 'flex-end',
  },
  assistantRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '88%',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs + 2,
  },
  messageText: {
    lineHeight: 21,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  composerCard: {},
  composerContent: {
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  inputRow: {
    width: '100%',
  },
  input: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    lineHeight: 21,
    maxHeight: 80,
    paddingVertical: 0,
    minHeight: 36,
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sendButton: {
    minWidth: 130,
  },
});
