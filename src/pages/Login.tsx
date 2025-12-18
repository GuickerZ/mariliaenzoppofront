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
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { auth, getUser, register } from "@/api/authApi";
import { useNavigate, Link } from "react-router-dom";
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
    if (errorMessage) setErrorMessage(null);
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
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] animate-pulse-soft" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/off2.png"
              alt="OFF Logo"
              className="w-24 h-24 mx-auto object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform"
            />
          </Link>
          <p className="text-muted-foreground text-sm mt-1">
            Rede social anti-dependência
          </p>
        </div>

        {/* Login Card */}
        <Card className="glass-card border-border/30 shadow-xl">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Bem-vindo de volta" : "Criar sua conta"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Entre para continuar sua jornada consciente"
                : "Junte-se à comunidade de uso consciente"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center animate-fade-in">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
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
                    className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all pr-12"
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                    required
                    autoComplete="new-password"
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-gradient hover:shadow-glow disabled:opacity-50 transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </span>
                ) : (
                  isLogin ? "Entrar" : "Criar conta"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
            </div>

            {/* Toggle Form Type */}
            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage(null);
                }}
                className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
              >
                {isLogin ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Ao continuar, você concorda com nossos{" "}
          <Link to="/about" className="underline hover:text-foreground transition-colors">
            termos de uso consciente
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
