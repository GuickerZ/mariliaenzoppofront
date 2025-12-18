import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Settings, User, Menu, LogOut, Search, Bell, Shield } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
          <img 
            src="/off2.png" 
            alt="Off" 
            className="h-10 w-15 rounded-xl shadow-lg" 
          />
        </Link>

        {/* Search Bar */}
        {/* <div className="flex-1 max-w-lg mx-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar reflexões, comunidades..." 
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div> */}

        {/* Right Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {user && (
            <>
              {/* Time Counter with Status */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/50">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{minutes}min</span>
                <Badge variant={minutes < 20 ? "default" : minutes < 40 ? "secondary" : "destructive"} className="text-xs">
                  {minutes < 20 ? "Saudável" : minutes < 40 ? "Moderado" : "Limite"}
                </Badge>
              </div>

              {/* Well-being Indicator */}
              {/* <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Modo consciente</span>
              </Button> */}

              {/* Notifications */}
              {/* <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full"></span>
              </Button> */}
            </>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-muted/80">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="hidden lg:inline font-medium">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Meu perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
