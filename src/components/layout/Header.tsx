import { Button } from "@/components/ui/button";
import { Clock, Settings, User, LogOut, Home, Users, Compass, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const location = useLocation();
  const { user, logout } = useUser();
  const { timeSpent } = useTimeTracking();
  const minutes = Math.floor(timeSpent / 60);
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: "/", label: "Início", icon: Home },
    { path: "/feed", label: "Feed", icon: Compass },
    { path: "/communities", label: "Comunidades", icon: Users },
    { path: "/about", label: "Sobre", icon: Info },
  ];

  const getTimeStatus = () => {
    if (minutes < 15) return { label: "Saudável", variant: "default" as const, color: "text-emerald-400" };
    if (minutes < 30) return { label: "Moderado", variant: "secondary" as const, color: "text-amber-400" };
    return { label: "Atenção", variant: "destructive" as const, color: "text-rose-400" };
  };

  const timeStatus = getTimeStatus();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 flex-shrink-0 group"
        >
          <img 
            src="/off2.png" 
            alt="OFF" 
            className="h-9 w-9 object-contain rounded-lg shadow-md group-hover:shadow-glow-sm transition-shadow duration-300" 
          />
          <span className="hidden sm:block text-lg font-bold gradient-text">
            OFF
          </span>
        </Link>

        {/* Navigation - Desktop */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border/50">
              <Clock className={`w-4 h-4 ${timeStatus.color}`} />
              <span className="text-sm font-medium tabular-nums">{minutes}min</span>
              <Badge 
                variant={timeStatus.variant} 
                className="text-2xs px-1.5 py-0"
              >
                {timeStatus.label}
              </Badge>
            </div>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-muted/50 rounded-full pl-1 pr-3"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-[2px]">
                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">
                    {user.email.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <div className="px-2 py-3 mb-2 rounded-lg bg-muted/50">
                  <p className="font-medium text-sm truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Membro OFF</p>
                </div>
                
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link to="/profile" className="flex items-center gap-3 py-2">
                    <User className="h-4 w-4" />
                    <span>Meu perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link to="/settings" className="flex items-center gap-3 py-2">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/about">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sobre
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-sm hover:shadow-glow-sm transition-all duration-300"
                >
                  Entrar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
