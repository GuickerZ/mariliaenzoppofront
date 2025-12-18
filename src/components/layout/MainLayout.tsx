import { ReactNode } from "react";
import { Header } from "./Header";
import { TimeTracker } from "@/components/ui/time-tracker";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold">Limite diário atingido</h2>
              <p className="text-muted-foreground">
                Você usou todo o tempo diário definido. Que tal fazer uma pausa para reflexão?
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = '/settings'}
                  className="w-full"
                >
                  Ajustar limite
                </Button>
                <Button 
                  variant="outline" 
                  onClick={pauseSession}
                  className="w-full"
                >
                  Continuar mesmo assim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
          
          {/* Sidebar */}
          {showTimeTracker && user && (
            <div className="lg:col-span-1 space-y-6">
              <TimeTracker 
                dailyLimit={user.dailyTimeLimit}
                onLimitReached={() => {
                  console.log("Limite atingido - usuário será notificado");
                }}
              />
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Suas comunidades</h3>
                  <div className="space-y-2">
                    {user.communities.map((community) => (
                      <div 
                        key={community}
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      >
                        {community}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}