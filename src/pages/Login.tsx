import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Instagram, Twitter, Zap } from "lucide-react";
import { auth, getUser, register } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErrorMessage(null);

      if (!isLogin && formData.password !== formData.confirmPassword) {
        setErrorMessage("As senhas não conferem.");
        return;
      }

      setIsSubmitting(true);
      const res = isLogin
        ? await auth(formData.email, formData.password)
        : await register(formData.email, formData.password);
      if (res?.accessToken) {
        localStorage.setItem('accessToken', res.accessToken);
      }
      const me = await getUser();
      if (me) {
        // Persist user id for API header injection (idUsuario)
        localStorage.setItem('userId', String(me.id));
        login({
          id: String(me.id),
          email: me.email,
          joinedAt: new Date(),
          communities: [],
          dailyTimeLimit: 30,
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      setErrorMessage(
        isLogin
          ? "Credenciais inválidas. Verifique seu e-mail e senha."
          : "Não foi possível criar sua conta. Verifique os dados e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles with social media colors */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/40 rounded-full blur-md animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>

        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(255,255,255,.2) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255,255,255,.1) 2px, transparent 0)",
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
           <div className="flex justify-center mb-4">
  <img
    src="/off2.png"
    alt="Logo Off"
    className="w-28 h-28 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
  />
</div>

            <p className="text-muted-foreground text-sm">
              Rede social antidependência
            </p>
          </div>

          {/* Login/Register Card */}
          <Card className="bg-gradient-card border-border/50 shadow-medium backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center text-foreground">
                {isLogin ? "Entrar" : "Criar Conta"}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {isLogin
                  ? "Entre na sua conta para continuar"
                  : "Junte-se à revolução digital consciente"}
              </CardDescription>
              {errorMessage && (
                <div className="text-center text-destructive text-sm mt-2">
                  {errorMessage}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-foreground font-medium"
                  >
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-colors pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password Field (only for registration) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-foreground font-medium"
                    >
                      Confirmar Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-colors"
                      required
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-social hover:opacity-90 text-background font-semibold shadow-glow hover:shadow-medium transition-all duration-300"
                >
                 {isSubmitting
                    ? (isLogin ? "Entrando..." : "Cadastrando...")
                    : (isLogin ? "Entrar" : "Criar Conta")}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase"></div>
              </div>

              {/* Toggle Form Type */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:text-primary/80 font-medium transition-colors underline decoration-primary/50 hover:decoration-primary"
                  >
                    {isLogin ? "Cadastre-se" : "Entre"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
{/* Footer */}
<div className="mt-8"></div>

        </div>
      </div>
    </div>
  );
};

export default Login;
