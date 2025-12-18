import { ReactNode } from "react";
import { Header } from "./Header";
import { TimeTracker } from "@/components/ui/time-tracker";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  showTimeTracker?: boolean;
}

export function MainLayout({ children, showTimeTracker = true }: MainLayoutProps) {
  const { isLimitReached, timeUntilReset } = useTimeTracking();

  // Formatar tempo restante
  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Limit Reached Overlay */}
      {isLimitReached && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto glass-card border-destructive/30 animate-scale-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <Clock className="h-10 w-10 text-destructive" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-destructive">Limite diário atingido</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Você usou todo o seu tempo diário. Faça uma pausa e volte amanhã.
                </p>
              </div>
              
              {/* Countdown */}
              <div className="py-4 px-6 rounded-xl bg-muted/50 border border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Acesso liberado em</p>
                <div className="text-4xl font-mono font-bold text-foreground tracking-wider">
                  {formatTimeRemaining(timeUntilReset)}
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={() => window.location.href = '/settings'}
                  variant="outline"
                  className="w-full h-12 border-border/50"
                >
                  Ajustar limite nas configurações
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Seu bem-estar mental é prioridade. Use esse tempo para atividades offline.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        <div className={`${showTimeTracker && user ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : 'max-w-4xl mx-auto'}`}>
          {/* Main Content */}
          <div className={`${showTimeTracker && user ? 'lg:col-span-3' : ''} space-y-4 sm:space-y-6`}>
            {children}
          </div>
          
          {/* Sidebar - Hidden on mobile */}
          {showTimeTracker && user && (
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">
                <TimeTracker 
                  onLimitReached={() => {
                    console.log("Limite atingido - usuário será notificado");
                  }}
                />
                
                {user.communities.length > 0 && (
                  <Card className="glass-card border-border/30">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm">Suas comunidades</h3>
                      </div>
                      <div className="space-y-2">
                        {user.communities.slice(0, 5).map((community) => (
                          <Link 
                            key={community}
                            to="/communities"
                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-md hover:bg-muted/50 -mx-2"
                          >
                            {community}
                          </Link>
                        ))}
                        {user.communities.length > 5 && (
                          <Link 
                            to="/communities"
                            className="flex items-center gap-1 text-xs text-primary hover:underline pt-2"
                          >
                            Ver todas <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {user.communities.length === 0 && (
                  <Card className="glass-card border-border/30 border-dashed">
                    <CardContent className="p-5 text-center">
                      <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Você ainda não participa de nenhuma comunidade
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/communities">Explorar comunidades</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}