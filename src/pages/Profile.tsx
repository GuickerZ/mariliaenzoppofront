import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/PostCard";
import { User, Calendar, Clock, MessageSquare, TrendingUp, Edit } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { listMyPosts, type Post as ApiPost } from "@/api/posts";
import { getMyWeeklyActivity, getMyInsights, type WeeklyActivityItem, type MyInsights } from "@/api/me";

function calculateReadTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Dados agora vêm da API: getMyInsights() e getMyWeeklyActivity()

export default function Profile() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState<ApiPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [weekly, setWeekly] = useState<WeeklyActivityItem[] | null>(null);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);
  const [insights, setInsights] = useState<MyInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchMyPosts = async () => {
      try {
        setLoadingPosts(true);
        const data = await listMyPosts();
        if (!mounted) return;
        const withRead = data.map(p => ({ ...p, readTime: p.readTime ?? calculateReadTime(p.content) }));
        setUserPosts(withRead);
      } catch (e) {
        if (!mounted) return;
        setPostsError("Não foi possível carregar suas reflexões.");
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    };
    fetchMyPosts();
    
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const fetchActivity = async () => {
      try {
        setLoadingWeekly(true);
        setWeeklyError(null);
        const data = await getMyWeeklyActivity();
        if (!mounted) return;
        setWeekly(data);
      } catch (e) {
        if (!mounted) return;
        setWeeklyError("Não foi possível carregar sua atividade semanal.");
      } finally {
        if (mounted) setLoadingWeekly(false);
      }
    };
    const fetchInsights = async () => {
      try {
        setLoadingInsights(true);
        setInsightsError(null);
        const data = await getMyInsights();
        if (!mounted) return;
        setInsights(data);
      } catch (e) {
        if (!mounted) return;
        setInsightsError("Não foi possível carregar seus insights.");
      } finally {
        if (mounted) setLoadingInsights(false);
      }
    };
    fetchActivity();
    fetchInsights();
    
    return () => { mounted = false; };
  }, []);

  if (!user) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Você precisa estar logado para ver seu perfil.
            </p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <Card className="glass-card border-border/30 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-[3px]">
                  <div className="h-full w-full rounded-2xl bg-background flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold gradient-text">{user.email.split('@')[0]}</h1>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Membro desde {formatDistanceToNow(user.joinedAt, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {user.communities.map(community => (
                    <Badge key={community} variant="secondary">
                      {community}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-4">
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="glass-card border-border/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xl font-bold">{loadingInsights ? '...' : (insights?.totalPosts ?? 0)}</div>
              <div className="text-sm text-muted-foreground">reflexões</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-border/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-secondary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-xl font-bold">{loadingInsights ? '...' : (insights?.totalDiscussions ?? 0)}</div>
              <div className="text-sm text-muted-foreground">discussões</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-border/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-accent/10 flex items-center justify-center">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="text-xl font-bold">{loadingInsights ? '...' : (insights?.communitiesJoined ?? 0)}</div>
              <div className="text-sm text-muted-foreground">comunidades</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-border/30">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xl font-bold">{loadingInsights ? '...' : (insights?.averageReadTime ?? 0)}min</div>
              <div className="text-sm text-muted-foreground">leitura média</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Minhas reflexões</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Suas reflexões</h2>
              <Badge variant="outline">{userPosts.length} publicadas</Badge>
            </div>
            
            <div className="space-y-4">
              {postsError && (
                <Card>
                  <CardContent className="p-6 text-center text-destructive">{postsError}</CardContent>
                </Card>
              )}
              {loadingPosts ? (
                <Card>
                  <CardContent className="p-6 text-center">Carregando reflexões...</CardContent>
                </Card>
              ) : (
                userPosts.map(post => (
                  <PostCard key={post.id} {...post} readTime={post.readTime ?? calculateReadTime(post.content)} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-semibold">Atividade semanal</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Reflexões por dia da semana</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingWeekly ? (
                  <div className="p-2 text-center text-muted-foreground">Carregando atividade...</div>
                ) : weeklyError ? (
                  <div className="p-2 text-center text-destructive">{weeklyError}</div>
                ) : (
                  (() => {
                    const max = Math.max(...(weekly ?? []).map(d => d.posts), 1);
                    return (
                      <div className="space-y-3">
                        {(weekly ?? []).map(day => {
                          const ratio = day.posts / max;
                          const widthPct = day.posts === 0 ? 0 : Math.min(100, Math.max(8, ratio * 100));
                          return (
                            <div key={day.day} className="flex items-center space-x-3">
                              <div className="w-16 text-sm text-muted-foreground">
                                {day.day}
                              </div>
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${widthPct}%` }}
                                />
                              </div>
                              <div className="text-sm font-medium w-8">
                                {day.posts}
                              </div>
                            </div>
                          );
                        })}
                        {(weekly ?? []).length === 0 && (
                          <div className="text-sm text-muted-foreground text-center">Sem atividade registrada nesta semana.</div>
                        )}
                      </div>
                    );
                  })()
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <h2 className="text-xl font-semibold">Insights pessoais</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tempo de uso consciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Limite diário</span>
                      <span className="text-sm font-medium">{user.dailyTimeLimit}min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Leitura média</span>
                      <span className="text-sm font-medium">{loadingInsights ? '...' : (insights?.averageReadTime ?? 0)}min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dias dentro do limite</span>
                      <span className="text-sm font-medium">—</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engajamento consciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Feedbacks dados</span>
                      <span className="text-sm font-medium">{loadingInsights ? '...' : (insights?.feedbacksGiven ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Qualidade média</span>
                      <span className="text-sm font-medium">{loadingInsights ? '...' : (insights?.feedbackQualityAvg ?? 0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Discussões iniciadas</span>
                      <span className="text-sm font-medium">{loadingInsights ? '...' : (insights?.discussionsStarted ?? 0)}</span>
                    </div>
                  </div>
                  {insightsError && (
                    <div className="text-xs text-destructive mt-2">{insightsError}</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}