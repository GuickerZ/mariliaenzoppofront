import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { HomeSidebar } from "@/components/layout/HomeSidebar";
import { PostCard } from "@/components/post/PostCard";
import { PostForm } from "@/components/forms/PostForm";
import { useUser } from "@/contexts/UserContext";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import {
  Brain,
  Users,
  TrendingUp,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPosts } from "@/api/routesApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyStats } from "@/api/me";
import { Post } from "@/types/bo";

const Index = () => {
  const { user, isLoadingUser } = useUser();
  const { isLimitReached } = useTimeTracking();

  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    totalPosts: number;
    totalCommunities: number;
    consecutiveDaysStreak: number;
  } | null>(null);

  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsFromAPI = await getPosts();

        const formattedPosts = postsFromAPI.map((post) => ({
          id: post.id.toString(),
          author: post.creator.name,
          content: post.content,
          createdAt: new Date(post.createdAt),
          readTime: Math.ceil(post.content.split(" ").length / 200),
          qualidade: typeof post.qualidade === "number" ? post.qualidade : 0,
          naoGostou: typeof post.naoGostou === "number" ? post.naoGostou : 0,
          hasLiked: Boolean((post as Post).hasLiked),
          hasDisliked: Boolean((post as Post).hasDisliked),
        }));

        setFeedPosts(formattedPosts);
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const data = await getMyStats();
        setStats(data);
      } catch {
        setStatsError("Não foi possível carregar suas estatísticas.");
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const visiblePosts = feedPosts.slice(0, 5);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-8 text-center">
              Carregando...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // LANDING PAGE (usuário não logado)
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center space-y-8">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-sm mb-6">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">
                Rede social anti-dependência
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Off
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Uma plataforma que inverte a lógica das redes sociais tradicionais.
              Sem curtidas públicas, sem feeds infinitos, sem algoritmos
              viciantes.
            </p>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-primary to-accent"
                asChild
              >
                <Link to="/login">Começar reflexão</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USUÁRIO LOGADO
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-6">
          <HomeSidebar />

          <div className="flex-1 max-w-2xl space-y-6">
            <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-foreground">
                      {user.email.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      Olá, {user.email}!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      O que está refletindo hoje?
                    </p>
                  </div>
                </div>

                <PostForm />
              </CardContent>
            </Card>

            {isLimitReached && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      Limite diário atingido
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Que tal uma pausa para reflexão offline?
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold">Feed consciente</h2>
                <Badge variant="secondary" className="text-xs">
                  Limitado a 5 posts
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Ordenado cronologicamente</span>
              </div>
            </div>

            <div className="space-y-4">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>

            <Card className="border-dashed bg-muted/30">
              <CardContent className="p-6 text-center space-y-3">
                <Brain className="h-8 w-8 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Fim do feed consciente</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Você viu todas as reflexões de hoje. Que tal processar o que
                  leu, ou explorar uma comunidade específica?
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/communities">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Explorar comunidades
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/profile">
                      <Users className="h-4 w-4 mr-2" />
                      Ver perfil
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-64 hidden xl:block">
            <div className="sticky top-20">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Estatísticas pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Reflexões postadas
                    </span>
                    <Badge variant="outline">
                      {statsLoading ? "..." : stats?.totalPosts ?? "-"}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Comunidades
                    </span>
                    <Badge variant="outline">
                      {statsLoading ? "..." : stats?.totalCommunities ?? "-"}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Dias consecutivos
                    </span>
                    <Badge variant="outline">
                      {statsLoading
                        ? "..."
                        : stats?.consecutiveDaysStreak ?? "-"}
                    </Badge>
                  </div>

                  {statsError && (
                    <div className="text-xs text-destructive">
                      {statsError}
                    </div>
                  )}

                  <Separator />

                  <p className="text-xs text-center text-muted-foreground">
                    Uso consciente está ajudando sua saúde mental
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
