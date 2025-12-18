import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Lightbulb,
  Shield,
  Clock
} from "lucide-react";
import { TimeTracker } from "@/components/ui/time-tracker";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { listCommunities, type Community } from "@/api/community";

const topicColors = [
  "bg-primary/10 text-primary",
  "bg-destructive/10 text-destructive",
  "bg-accent/10 text-accent",
  "bg-green-500/10 text-green-600",
  "bg-blue-500/10 text-blue-600",
  "bg-orange-500/10 text-orange-600"
];

const quickActions = [
  { name: "Nova reflexão", icon: Lightbulb, action: "/feed" },
  { name: "Explorar comunidades", icon: Users, action: "/communities" },
  { name: "Configurar limites", icon: Shield, action: "/settings" },
  { name: "Histórico de tempo", icon: Clock, action: "/profile" }
];

export function HomeSidebar() {
  const { user, logout } = useUser();
  const { toast } = useToast();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitBannerVisible, setLimitBannerVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await listCommunities();
        setCommunities(Array.isArray(data) ? data : []);
      } catch {
        setError("Não foi possível carregar as comunidades.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="hidden lg:block w-80 space-y-6 sticky top-20 h-fit">
      {/* Uso consciente */}
      {user && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Uso consciente</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <TimeTracker
              onLimitReached={() => {
                const alertEnabled =
                  localStorage.getItem("timeAlertEnabled") === "true";
                const autoLogoutEnabled =
                  localStorage.getItem("autoLogoutEnabled") === "true";

                if (alertEnabled) {
                  toast({
                    title: "Limite diário atingido",
                    description:
                      "Faça uma pausa e volte mais tarde. Sua mente agradece.",
                    variant: "destructive"
                  });
                  setLimitBannerVisible(true);
                }

                if (autoLogoutEnabled) {
                  const today = new Date()
                    .toISOString()
                    .slice(0, 10);

                  if (localStorage.getItem("autoLoggedOutAt") !== today) {
                    localStorage.setItem("autoLoggedOutAt", today);
                    logout();
                    setTimeout(() => {
                      window.location.href = "/login";
                    }, 300);
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Ações rápidas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.action}>
              <Button
                variant="ghost"
                className="w-full justify-start p-3 h-auto"
              >
                <action.icon className="h-4 w-4 mr-3 text-muted-foreground" />
                {action.name}
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Tópicos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tópicos em alta</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comunidades ativas hoje
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          )}

          {!loading && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {!loading &&
            !error &&
            communities.slice(0, 6).map((community, index) => (
              <div
                key={index}
                className="flex space-x-3 p-3 rounded-lg hover:bg-muted/50"
              >
                <div
                  className={`p-2 rounded-lg ${
                    topicColors[index % topicColors.length]
                  }`}
                >
                  <Users className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">
                      {community.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {community.membersCount ?? 0}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {community.tags?.slice(0, 2).join(" • ") ||
                      community.description}
                  </p>
                </div>
              </div>
            ))}

          <Separator />

          <Link to="/communities">
            <Button variant="outline" className="w-full">
              Ver todas as comunidades
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Banner limite */}
      {limitBannerVisible && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 space-y-2">
            <p className="font-medium text-destructive">
              Seu limite diário foi atingido
            </p>
            <p className="text-sm text-muted-foreground">
              Faça uma pausa ou ajuste o limite nas configurações.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLimitBannerVisible(false);
                  localStorage.setItem(
                    "timeAlertDismissedAt",
                    new Date().toISOString().slice(0, 10)
                  );
                }}
              >
                Ok
              </Button>

              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  Configurações
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
