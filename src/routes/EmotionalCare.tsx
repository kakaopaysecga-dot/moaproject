import React, { useState, useEffect, useRef } from 'react';
import { Heart, Send, Smile, Frown, Meh, Angry, Zap, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion_detected?: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const emotionOptions = [
  { emotion: '행복', icon: Smile, color: 'bg-yellow-100 text-yellow-800', value: 'happy' },
  { emotion: '우울', icon: Frown, color: 'bg-blue-100 text-blue-800', value: 'sad' },
  { emotion: '보통', icon: Meh, color: 'bg-gray-100 text-gray-800', value: 'neutral' },
  { emotion: '화남', icon: Angry, color: 'bg-red-100 text-red-800', value: 'angry' },
  { emotion: '스트레스', icon: Zap, color: 'bg-orange-100 text-orange-800', value: 'stressed' },
  { emotion: '피곤', icon: Moon, color: 'bg-purple-100 text-purple-800', value: 'tired' },
];

const EmotionalCare: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, created_at')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: '오류',
        description: '메시지를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to UI immediately
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      emotion_detected: selectedEmotion,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No valid session');
      }

      const response = await supabase.functions.invoke('emotional-care-ai', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: {
          message: userMessage,
          conversationId: currentConversationId,
          emotion: selectedEmotion,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'API call failed');
      }

      const { response: aiResponse, conversationId: newConversationId } = response.data;

      // Update conversation ID if it's a new conversation
      if (newConversationId && !currentConversationId) {
        setCurrentConversationId(newConversationId);
        loadConversations(); // Refresh conversation list
      }

      // Remove temporary message and add both user and AI messages
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== tempMessage.id);
        return [
          ...filtered,
          {
            id: `user-${Date.now()}`,
            role: 'user',
            content: userMessage,
            emotion_detected: selectedEmotion,
            created_at: new Date().toISOString(),
          },
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: aiResponse,
            created_at: new Date().toISOString(),
          },
        ];
      });

      // Clear selected emotion after sending
      setSelectedEmotion('');

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      
      toast({
        title: '오류',
        description: '메시지 전송에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId('');
    setSelectedEmotion('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              감정케어 AI
            </h1>
          </div>
          <p className="text-gray-600">당신의 마음을 따뜻하게 돌봐드립니다</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversation History Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  이전 대화
                </CardTitle>
                <Button onClick={startNewConversation} className="w-full" variant="outline">
                  새 대화 시작
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {conversations.map((conv) => (
                  <Button
                    key={conv.id}
                    variant={currentConversationId === conv.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => loadMessages(conv.id)}
                  >
                    <div className="truncate">
                      <div className="font-medium text-sm truncate">{conv.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(conv.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">감정 상담</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {emotionOptions.map(({ emotion, icon: Icon, color, value }) => (
                    <Badge
                      key={value}
                      variant={selectedEmotion === value ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedEmotion === value ? 'bg-primary text-primary-foreground' : color
                      }`}
                      onClick={() => setSelectedEmotion(selectedEmotion === value ? '' : value)}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <Heart className="w-12 h-12 mx-auto mb-3 text-pink-300" />
                      <p>안녕하세요! 오늘 기분은 어떠신가요?</p>
                      <p className="text-sm mt-2">위에서 현재 감정을 선택하고 대화를 시작해보세요.</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.emotion_detected && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {emotionOptions.find(e => e.value === message.emotion_detected)?.emotion}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-pulse flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-500">생각하고 있어요...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="마음속 이야기를 들려주세요..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={isLoading || !inputValue.trim()}
                    className="px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionalCare;