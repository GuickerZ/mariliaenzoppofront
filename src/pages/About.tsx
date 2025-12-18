import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Zap, 
  Target,
  CheckCircle,
  ArrowRight,
  Quote
} from "lucide-react";

const principles = [
  {
    icon: Brain,
    title: "Consciência digital",
    description: "Promovemos o uso reflexivo da tecnologia, questionando nossos hábitos automáticos e criando espaço para escolhas intencionais."
  },
  {
    icon: Heart,
    title: "Conexões autênticas",
    description: "Priorizamos relacionamentos genuínos sobre métricas superficiais, valorizando qualidade de interação sobre quantidade."
  },
  {
    icon: Shield,
    title: "Proteção mental",
    description: "Desenvolvemos mecanismos que protegem contra vícios digitais e estimulam bem-estar psicológico."
  },
  {
    icon: Clock,
    title: "Tempo intencional",
    description: "Cada momento na plataforma é uma escolha consciente, com limites claros e pausas para reflexão."
  }
];

const features = [
  "Sem curtidas públicas ou métricas viciantes",
  "Limites de tempo configuráveis pelo usuário", 
  "Feedback dual: qualidade e relevância",
  "Comunidades temáticas específicas",
  "Perfis minimalistas focados no conteúdo",
  "Histórico de edições visível",
  "Sem algoritmos manipulativos",
  "Pausas conscientes integradas"
];

const testimonials = [
  {
    text: "Finalmente uma rede social que me faz pensar ao invés de apenas consumir. A ausência de curtidas mudou completamente como me relaciono com o conteúdo.",
    author: "Maria, Designer",
    community: "Minimalismo Digital"
  },
  {
    text: "O limite de tempo me ajudou a perceber quanto da minha vida eu estava desperdiçando em rolagem infinita. Agora cada minuto online é intencional.",
    author: "João, Psicólogo", 
    community: "Saúde Mental e Redes"
  },
  {
    text: "As discussões aqui têm profundidade. Sem a pressa por engajamento, as pessoas realmente refletem antes de compartilhar.",
    author: "Ana, Educadora",
    community: "Relacionamentos Autênticos"
  }
];

export default function About() {
  return (
    <MainLayout showTimeTracker={false}>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Manifesto digital</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Por que a <span className="gradient-text">OFF</span> existe?
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
            Vivemos uma epidemia de dependência digital. As redes sociais tradicionais foram 
            projetadas para capturar e monetizar nossa atenção. Nós propomos uma alternativa consciente.
          </p>
        </div>

        {/* Problem Statement */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">O problema que enfrentamos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Vício por design</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Algoritmos que maximizam tempo de tela</li>
                  <li>• Notificações constantes interrompendo foco</li>
                  <li>• Rolagem infinita sem pontos de parada</li>
                  <li>• Recompensas intermitentes (curtidas, comentários)</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Consequências</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ansiedade e depressão aumentadas</li>
                  <li>• Comparação social constante</li>
                  <li>• Fragmentação da atenção</li>
                  <li>• Relacionamentos superficiais</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Solution */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Nossa solução</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A Reflectis foi construída com princípios antivício desde o início. 
              Cada funcionalidade foi pensada para promover uso consciente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <principle.icon className="h-6 w-6 text-primary" />
                    <span>{principle.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Funcionalidades conscientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">O que nossa comunidade diz</h2>
            <p className="text-muted-foreground">
              Experiências reais de pessoas que encontraram uma relação mais saudável com a tecnologia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-sm mb-4 leading-relaxed">"{testimonial.text}"</p>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.community}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Mission */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-none">
          <CardContent className="p-8 text-center space-y-6">
            <Target className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Nossa missão</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Democratizar o acesso a uma tecnologia que serve ao bem-estar humano, 
              não aos interesses corporativos. Cada usuário deve ter controle total 
              sobre sua experiência digital.
            </p>
          </CardContent>
        </Card>

        {/* Join Movement */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold">Junte-se ao movimento</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A mudança começa com cada indivíduo que escolhe consciência sobre automação, 
            profundidade sobre superficialidade, bem-estar sobre engajamento.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              Começar agora
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Explorar comunidades
            </Button>
          </div>
        </div>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Construindo juntos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A Reflectis é uma plataforma em constante evolução, construída com e para a comunidade. 
              Suas sugestões e feedback são fundamentais para criarmos uma alternativa verdadeiramente 
              consciente às redes sociais tradicionais.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Sugerir funcionalidade</Button>
              <Button variant="outline" size="sm">Reportar problema</Button>
              <Button variant="outline" size="sm">Contribuir com código</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}