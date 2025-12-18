import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { joinCommunity, listCommunityPosts, getCommunity, createCommunityPost, type CommunityDetailResponse } from "@/api/community";
import type { PostDTO } from "@/api/posts";
import { PostCard } from "@/components/post/PostCard";
import { useUser } from "@/contexts/UserContext";
import { getMyCommunities } from "@/api/me";
import { MessageSquare, Users, ArrowLeft, Plus } from "lucide-react";
import { PostForm } from "@/components/forms/PostForm";

function calculateReadTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, updateUser } = useUser();

  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [community, setCommunity] = useState<CommunityDetailResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const detail = await getCommunity(id);
        setCommunity(detail);
        const postsData = await listCommunityPosts(id);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (e) {
        setError("Não foi possível carregar a comunidade.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
  
  const isMember = community?.isMember === true;

  const handleJoin = async () => {
    if (!id) return;
    try {
      setJoining(true);
      await joinCommunity(id);
      setCommunity(prev => prev ? { ...prev, isMember: true } : prev);
      
      // Atualiza as comunidades do usuário no contexto
      const myCommunities = await getMyCommunities();
      const communityNames = myCommunities.map(c => c.name);
      updateUser({ communities: communityNames });
    } finally {
      setJoining(false);
    }
  };

  const handleNewPost = async (newPost: { content: string; community: string; readTime: number }) => {
    try {
      const created = await createCommunityPost(id!, { content: newPost.content });
      setPosts(prev => [created, ...prev]);
      setShowForm(false);
    } catch {
      // fallback: optimistic add only if API fails silently
      setPosts(prev => [
        {
          id: Math.random().toString(36).slice(2),
          content: newPost.content,
          createdAt: new Date().toISOString(),
          author: user?.email || 'Você',
          community: community?.community?.name || '',
        } as unknown as PostDTO,
        ...prev,
      ]);
      setShowForm(false);
    }
  };

  console.log(community);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/communities"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-2xl font-bold">Comunidade</h1>
          </div>
          <div className="flex items-center gap-2">
            {!isMember && (
              <Button onClick={handleJoin} disabled={joining}>
                {joining ? 'Entrando...' : 'Tornar-se membro'}
              </Button>
            )}
            {isMember && (
              <Button variant="outline" onClick={() => setShowForm(v => !v)}>
                <Plus className="h-4 w-4 mr-1" /> Nova reflexão
              </Button>
            )}
          </div>
        </div>

        {community && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{community.community.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {community.community?.description && (
                <p className="text-sm text-muted-foreground">{community.community.description}</p>
              )}
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> {community.membersCount ?? 0} membros
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> {community.discussionsCount ?? 0} discussões
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {showForm && isMember && (
          <PostForm
            onSubmit={handleNewPost}
            communities={[{ id: id!, name: community?.community?.name || 'Comunidade' }]}
            hideCommunitySelect
          />
        )}

        {loading && (
          <Card>
            <CardContent className="p-4">Carregando comunidade...</CardContent>
          </Card>
        )}
        {!loading && error && (
          <Card>
            <CardContent className="p-4 text-destructive">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Nenhuma discussão ainda.
                </CardContent>
              </Card>
            ) : (
              posts.map((p: PostDTO) => {
                const author = typeof p.author === 'string' ? p.author : (p.author?.name ?? 'Autor');
                const createdAt = p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt);
                const content = p.content ?? '';
                const communityName = typeof p.community === 'string' ? p.community : (p.community?.name ?? community?.community?.name ?? 'Comunidade');
                return (
                  <PostCard
                    key={p.id}
                    id={String(p.id)}
                    author={author}
                    content={content}
                    createdAt={createdAt}
                    community={communityName}
                    readTime={calculateReadTime(content)}
                    edited={p.edited}
                    editHistory={p.editHistory}
                  />
                );
              })
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
