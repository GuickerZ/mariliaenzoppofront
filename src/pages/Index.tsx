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
  Shield,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
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

  const [feedPosts, setFeedPosts] = useState<{
    id: string;
    author: string;
    content: string;
    createdAt: Date;
    readTime: number;
    qualidade: number;
    naoGostou: number;
    hasLiked: boolean;
    hasDisliked: boolean;
  }[]>([]);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // LANDING PAGE (usuário não logado)
  if (!user) {
    const features = [
      {
        icon: Shield,
        title: "Sem algoritmos viciantes",
        description: "Conteúdo cronológico, você controla o que vê",
      },
      {
        icon: Clock,
        title: "Limites conscientes",
        description: "Defina seu tempo diário e receba lembretes",
      },
      {
        icon: Heart,
        title: "Feedback de qualidade",
        description: "Avalie conteúdo por qualidade, não por popularidade",
      },
      {
        icon: Users,
        title: "Comunidades reais",
        description: "Conecte-se com pessoas que compartilham seus valores",
      },
    ];

    const landingStats = [
      { value: "0", label: "Algoritmos manipulativos" },
      { value: "100%", label: "Controle do usuário" },
      { value: "∞", label: "Reflexões significativas" },
    ];

    return (
      <div className="min-h-screen bg-background overflow-hidden">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center py-6 sm:py-0">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-float-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] animate-pulse-soft" />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">


              {/* Logo & Title */}
              <div>
                <div className="flex justify-center mb-4 sm:mb-6">
                  <img
                    src="/off2.png"
                    alt="OFF Logo"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                  />
                </div>

                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance px-2">
                  A primeira rede social projetada para o seu{" "}
                  <span className="text-foreground font-medium">bem-estar mental</span>.
                  Sem feeds infinitos. Sem métricas viciantes.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-4">
                <Button
                  size="lg"
                  className="px-8 h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 group"
                  asChild
                >
                  <Link to="/login" className="flex items-center gap-2">
                    Começar agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-12 sm:h-14 text-base sm:text-lg border-border/50 hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
                  asChild
                >
                  <Link to="/about">Saiba mais</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 sm:pt-12 max-w-lg mx-auto">
                {landingStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator - Hidden on mobile */}
          <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 sm:py-16 md:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Uma nova forma de se <span className="gradient-text">conectar</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Projetado com princípios de design ético para promover uso consciente da tecnologia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group glass-card-hover border-border/30 bg-card/50"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 sm:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Card className="max-w-3xl mx-auto overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5">
              <CardContent className="p-6 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Pronto para uma experiência diferente?
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Junte-se a uma comunidade que valoriza qualidade sobre quantidade,
                  profundidade sobre superficialidade.
                </p>
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  asChild
                >
                  <Link to="/login">Criar conta gratuita</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>OFF © {new Date().getFullYear()} — Feito com consciência digital</p>
          </div>
        </footer>
      </div>
    );
  }

  // USUÁRIO LOGADO
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <div className="flex gap-4 sm:gap-6">
          <HomeSidebar />

          <div className="flex-1 max-w-2xl space-y-4 sm:space-y-6">
            <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg font-bold text-primary-foreground">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold truncate">
                      Olá, {user.email.split('@')[0]}!
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl font-semibold">Feed consciente</h2>
                <Badge variant="secondary" className="text-xs">
                  {visiblePosts.length} posts
                </Badge>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Cronológico</span>
              </div>
            </div>

            <div className="space-y-4">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>

            <Card className="border-dashed bg-muted/30">
              <CardContent className="p-4 sm:p-6 text-center space-y-3">
                <Brain className="h-8 w-8 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Fim do feed consciente</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Você viu todas as reflexões de hoje. Que tal processar o que
                  leu, ou explorar uma comunidade específica?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/communities">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comunidades
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/profile">
                      <Users className="h-4 w-4 mr-2" />
                      Perfil
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
