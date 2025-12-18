import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Clock,
  Shield,
  User,
  Save,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, updateUser } = useUser();
  const { dailyLimit, updateDailyLimit } = useTimeTracking();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    dailyTimeLimit: dailyLimit,
    enableTimeWarnings:
      typeof window !== "undefined"
        ? localStorage.getItem("timeAlertEnabled") === "true"
        : true,
    enableReflectionPrompts: true,
    showFeedbackStats: false,
    enableNotifications: true,
    enableWeeklyDigest: true,
    autoLogout:
      typeof window !== "undefined"
        ? localStorage.getItem("autoLogoutEnabled") === "true"
        : false,
    hideProfilePictures: true,
    limitScrolling: true,
    mindfulPauses: true,
  });

  const [profile, setProfile] = useState({
    email: user?.email || "",
  });

  const handleSaveSettings = () => {
    updateDailyLimit(settings.dailyTimeLimit);
    updateUser({ dailyTimeLimit: settings.dailyTimeLimit });

    localStorage.setItem(
      "timeAlertEnabled",
      settings.enableTimeWarnings ? "true" : "false"
    );
    localStorage.setItem(
      "autoLogoutEnabled",
      settings.autoLogout ? "true" : "false"
    );

    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleSaveProfile = () => {
    updateUser({ email: profile.email });

    toast({
      title: "Perfil atualizado!",
      description: "Suas informações pessoais foram salvas.",
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Você precisa estar logado para acessar as configurações.
            </p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout showTimeTracker={false}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
            <SettingsIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">Configurações</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Personalize sua experiência
            </p>
          </div>
        </div>

        <Tabs defaultValue="time" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="time" className="text-xs sm:text-sm py-2 sm:py-2.5">Tempo</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 sm:py-2.5">Perfil</TabsTrigger>
            <TabsTrigger value="experience" className="text-xs sm:text-sm py-2 sm:py-2.5">Exp.</TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs sm:text-sm py-2 sm:py-2.5">Privac.</TabsTrigger>
          </TabsList>

          {/* Tempo */}
          <TabsContent value="time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Gestão de tempo consciente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Limite diário de uso (minutos)</Label>
                  <Slider
                    value={[settings.dailyTimeLimit]}
                    onValueChange={([value]) =>
                      setSettings((prev) => ({
                        ...prev,
                        dailyTimeLimit: value,
                      }))
                    }
                    min={5}
                    max={120}
                    step={5}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5min</span>
                    <Badge variant="outline">
                      {settings.dailyTimeLimit} minutos
                    </Badge>
                    <span>120min</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Avisos de tempo</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando estiver próximo do limite
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableTimeWarnings}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        enableTimeWarnings: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Pausas conscientes</Label>
                    <p className="text-sm text-muted-foreground">
                      Prompts periódicos para reflexão e presença
                    </p>
                  </div>
                  <Switch
                    checked={settings.mindfulPauses}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        mindfulPauses: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Perfil */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ email: e.target.value })
                  }
                />

                <Separator />

                <Label>Comunidades participantes</Label>
                <div className="flex flex-wrap gap-2">
                  {user.communities.map((community) => (
                    <Badge key={community} variant="secondary">
                      {community}
                    </Badge>
                  ))}
                </div>

                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experiência */}
          <TabsContent value="experience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Experiência de uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Prompts de reflexão</Label>
                  <Switch
                    checked={settings.enableReflectionPrompts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        enableReflectionPrompts: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Limitar rolagem</Label>
                  <Switch
                    checked={settings.limitScrolling}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        limitScrolling: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Ocultar fotos de perfil</Label>
                  <Switch
                    checked={settings.hideProfilePictures}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        hideProfilePictures: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacidade */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacidade</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Mostrar estatísticas de feedback</Label>
                  <Switch
                    checked={settings.showFeedbackStats}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        showFeedbackStats: checked,
                      }))
                    }
                  />
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center sm:justify-end">
          <Button onClick={handleSaveSettings} size="lg" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Salvar configurações
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
