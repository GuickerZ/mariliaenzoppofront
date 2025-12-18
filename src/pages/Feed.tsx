import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/post/PostCard";
import { PostForm } from "@/components/forms/PostForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, TrendingUp, Clock, Users, Plus, Filter } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { listCommunities, type Community } from "@/api/community";
import { listRandomPosts, type Post as ApiPost } from "@/api/posts";
import { createCommunityPost } from "@/api/community";

function calculateReadTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function Feed() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [filterCommunity, setFilterCommunity] = useState("all");
  const [showPostForm, setShowPostForm] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState<boolean>(false);
  const [communitiesError, setCommunitiesError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
        const data = await listCommunities();
        setCommunities(Array.isArray(data) ? data : []);
      } catch (e) {
        setCommunitiesError("Não foi possível carregar as comunidades.");
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetchCommunities();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const data = await listRandomPosts();
        const withRead = data.map(p => ({ ...p, readTime: calculateReadTime(p.content) }));
        setPosts(withRead);
      } catch (e) {
        setPostsError("Não foi possível carregar as reflexões.");
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  const handleNewPost = async (newPost: { content: string; community: string; readTime: number }) => {
    try {
      const created = await createCommunityPost(newPost.community, { content: newPost.content });
      const withRead = { ...created, author: user?.email || created.author, readTime: calculateReadTime(created.content) };
      setPosts([withRead, ...posts]);
      setShowPostForm(false);
      toast({
        title: "Reflexão publicada!",
        description: "Sua reflexão foi compartilhada com a comunidade.",
      });
    } catch (e) {
      toast({
        title: "Erro ao publicar",
        description: "Não foi possível publicar sua reflexão agora.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filterCommunity === "all") return true;
    if (filterCommunity === "joined") {
      return user?.communities.includes(post.community ?? "");
    }
    return (post.community ?? "") === filterCommunity;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    switch (sortBy) {
      case "recent":
        return dateB.getTime() - dateA.getTime();
      case "oldest":
        return dateA.getTime() - dateB.getTime();
      case "readTime":
        return (a.readTime ?? 1) - (b.readTime ?? 1);
      default:
        return 0;
    }
  });

  const allCommunities = Array.from(new Set(posts.map(post => post.community)));

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Feed de Reflexões</h1>
            <p className="text-muted-foreground text-sm">
              Conteúdo consciente das suas comunidades
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => setShowPostForm(!showPostForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span>Nova reflexão</span>
            </Button>
          )}
        </div>

        {/* Post Form */}
        {showPostForm && user && (
          <PostForm 
            onSubmit={handleNewPost}
            communities={(communities || []).map((c) => ({ id: c.id, name: c.name }))}
          />
        )}

        {/* Filters and Sorting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros e ordenação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Comunidade</label>
                <Select value={filterCommunity} onValueChange={setFilterCommunity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as comunidades</SelectItem>
                    {user && (
                      <SelectItem value="joined">Minhas comunidades</SelectItem>
                    )}
                    {allCommunities.map(community => (
                      <SelectItem key={community} value={community}>
                        {community}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigas</SelectItem>
                    <SelectItem value="readTime">Tempo de leitura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="glass-card">
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-lg font-semibold">{sortedPosts.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">reflexões</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-3 sm:p-4 text-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-lg font-semibold">
                {sortedPosts.reduce((sum, post) => sum + post.readTime, 0)}min
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">leitura</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-3 sm:p-4 text-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-lg font-semibold">
                {new Set(sortedPosts.map(post => post.author)).size}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">autores</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4 sm:space-y-6">
          {postsError && (
            <Card>
              <CardContent className="p-8 text-center text-destructive">{postsError}</CardContent>
            </Card>
          )}
          {loadingPosts ? (
            <Card>
              <CardContent className="p-8 text-center">Carregando reflexões...</CardContent>
            </Card>
          ) : sortedPosts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma reflexão encontrada com os filtros aplicados.
                </p>
                {!user && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Faça login para ver conteúdo personalizado das suas comunidades.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            sortedPosts.map(post => (
              <PostCard key={post.id} {...post} readTime={post.readTime ?? calculateReadTime(post.content)} />
            ))
          )}
        </div>

        {/* Load More */}
        {sortedPosts.length > 0 && (
          <div className="text-center">
            <Button variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Carregar mais reflexões</span>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}