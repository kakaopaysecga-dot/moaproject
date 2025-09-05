import { useState, useEffect } from 'react';
import { Plus, Eye, MessageCircle, ThumbsUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PostCreateModal } from '@/components/board/PostCreateModal';
import { PostDetailModal } from '@/components/board/PostDetailModal';

interface AnonymousPost {
  id: string;
  title: string;
  content: string;
  author_nickname: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
}

export default function AnonymousBoard() {
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'most_viewed'>('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<AnonymousPost | null>(null);

  useEffect(() => {
    loadPosts();
  }, [sortBy]);

  const loadPosts = async () => {
    try {
      let query = supabase
        .from('anonymous_posts')
        .select('*')
        .eq('is_deleted', false);

      switch (sortBy) {
        case 'popular':
          query = query.order('like_count', { ascending: false });
          break;
        case 'most_viewed':
          query = query.order('view_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePostClick = async (post: AnonymousPost) => {
    // 조회수 증가
    await supabase
      .from('anonymous_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', post.id);
    
    setSelectedPost({ ...post, view_count: post.view_count + 1 });
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    loadPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">익명게시판</h1>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              글쓰기
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="제목이나 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'latest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('latest')}
              >
                최신순
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('popular')}
              >
                인기순
              </Button>
              <Button
                variant={sortBy === 'most_viewed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('most_viewed')}
              >
                조회순
              </Button>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? '검색 결과가 없습니다.' : '아직 작성된 글이 없습니다.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePostClick(post)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">
                        {post.title}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {post.author_nickname}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.view_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {post.like_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comment_count}
                        </div>
                      </div>
                      <span>
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                          locale: ko
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <PostCreateModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onPostCreated={handlePostCreated}
          />
        )}

        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            isOpen={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            onPostUpdated={loadPosts}
          />
        )}
      </div>
    </div>
  );
}