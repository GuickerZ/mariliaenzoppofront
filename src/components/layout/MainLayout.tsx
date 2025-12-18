import { ReactNode } from "react";
import { Header } from "./Header";
import { TimeTracker } from "@/components/ui/time-tracker";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  showTimeTracker?: boolean;
}

export function MainLayout({ children, showTimeTracker = true }: MainLayoutProps) {
  const { isLimitReached, pauseSession } = useTimeTracking();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Limit Reached Overlay */}
      {isLimitReached && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto glass-card border-destructive/20 animate-scale-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Limite diário atingido</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Você usou todo o tempo diário definido. Que tal fazer uma pausa para reflexão?
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <Button 
                  onClick={() => window.location.href = '/settings'}
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary"
                >
                  Ajustar limite
                </Button>
                <Button 
                  variant="outline" 
                  onClick={pauseSession}
                  className="w-full h-12 border-border/50 hover:bg-muted/50"
                >
                  Continuar mesmo assim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
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