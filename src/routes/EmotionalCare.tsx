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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        console.error('Session error:', sessionError);
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
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
        console.error('Function invocation error:', response.error);
        throw new Error(response.error.message || 'AI 응답을 받는데 실패했습니다.');
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
        description: error instanceof Error ? error.message : '메시지 전송에 실패했습니다.',
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              감정케어 AI
            </h1>
          </div>
          <p className="text-gray-600 text-lg">당신의 마음을 따뜻하게 돌봐드립니다 ✨</p>
          <div className="mt-4 flex justify-center">
            <div className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-pink-200">
              <span className="text-sm text-gray-700">💝 언제든 편안하게 이야기해주세요</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conversation History Sidebar */}
          <div className="lg:col-span-1 animate-slide-in-right">
            <Card className="backdrop-blur-sm bg-white/80 border-pink-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  이전 대화
                </CardTitle>
                <Button 
                  onClick={startNewConversation} 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover-scale" 
                  variant="default"
                >
                  ✨ 새 대화 시작
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {conversations.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-pink-300" />
                    <p className="text-sm">아직 대화가 없어요</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <Button
                      key={conv.id}
                      variant={currentConversationId === conv.id ? "default" : "ghost"}
                      className={`w-full justify-start text-left h-auto p-4 transition-all duration-300 hover-scale ${
                        currentConversationId === conv.id 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                          : 'hover:bg-pink-50 hover:border-pink-200'
                      }`}
                      onClick={() => loadMessages(conv.id)}
                    >
                      <div className="truncate">
                        <div className="font-medium text-sm truncate">{conv.title}</div>
                        <div className={`text-xs ${currentConversationId === conv.id ? 'text-pink-100' : 'text-muted-foreground'}`}>
                          {new Date(conv.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 animate-scale-in">
            <Card className="h-[700px] flex flex-col backdrop-blur-sm bg-white/90 border-pink-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg border-b border-pink-100">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="relative">
                    <Heart className="w-6 h-6 text-pink-500" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  감정 상담
                  <span className="text-sm font-normal text-gray-500 ml-2">• 온라인</span>
                </CardTitle>
                <div className="flex flex-wrap gap-3 mt-4">
                  {emotionOptions.map(({ emotion, icon: Icon, color, value }) => (
                    <Badge
                      key={value}
                      variant={selectedEmotion === value ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-300 hover-scale px-4 py-2 ${
                        selectedEmotion === value 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105' 
                          : `${color} hover:shadow-md border-2`
                      }`}
                      onClick={() => setSelectedEmotion(selectedEmotion === value ? '' : value)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-6">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-16 animate-fade-in">
                      <div className="relative mb-6">
                        <Heart className="w-16 h-16 mx-auto text-pink-300 animate-pulse" />
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-pink-100 rounded-full opacity-30 animate-ping"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">안녕하세요! 🌸</h3>
                      <p className="text-gray-600 mb-4">오늘 기분은 어떠신가요?</p>
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 max-w-md mx-auto border border-pink-100">
                        <p className="text-sm text-gray-600">위에서 현재 감정을 선택하고 대화를 시작해보세요.</p>
                        <p className="text-xs text-gray-500 mt-2">💝 편안한 마음으로 이야기해주세요</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white ml-4'
                              : 'bg-white text-gray-800 border border-pink-100 mr-4'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                <Heart className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs text-gray-500 font-medium">감정케어 AI</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          {message.emotion_detected && (
                            <div className="mt-3 flex justify-end">
                              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                                {emotionOptions.find(e => e.value === message.emotion_detected)?.emotion} 
                                {emotionOptions.find(e => e.value === message.emotion_detected)?.icon && 
                                  React.createElement(emotionOptions.find(e => e.value === message.emotion_detected)!.icon, { className: "w-3 h-3 ml-1" })
                                }
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-white p-4 rounded-2xl shadow-lg border border-pink-100 mr-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white animate-pulse" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse flex space-x-1">
                              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">마음을 읽고 있어요...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="마음속 이야기를 들려주세요... 💭"
                    disabled={isLoading}
                    className="flex-1 border-pink-200 focus:border-pink-400 focus:ring-pink-400 bg-white/80 backdrop-blur-sm"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={isLoading || !inputValue.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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