import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface CommunityCardProps {
  name: string;
  description: string;
  memberCount: number;
  activeDiscussions: number;
  topicsThisWeek: number;
  tags: string[];
  featured?: boolean;
  to?: string;
}

export function CommunityCard({
  name,
  description,
  memberCount,
  activeDiscussions,
  topicsThisWeek,
  tags,
  featured = false,
  to
}: CommunityCardProps) {
  const content = (
    <Card className={`group glass-card-hover border-border/30 h-full flex flex-col ${featured ? 'ring-1 ring-primary/30 bg-gradient-to-br from-primary/5 to-transparent' : ''}`}>
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            {featured && (
              <Badge className="bg-primary/10 text-primary border-0 text-2xs px-1.5 py-0 flex items-center gap-1 flex-shrink-0">
                <Sparkles className="h-3 w-3" />
                Destaque
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description || "Comunidade para discussões e reflexões conscientes."}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-2xs px-2 py-0.5 bg-muted/50 hover:bg-muted transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-2xs px-2 py-0.5">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 rounded-lg bg-muted/30 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm font-semibold tabular-nums">{memberCount}</div>
            <div className="text-2xs text-muted-foreground">membros</div>
          </div>
          
          <div className="text-center border-x border-border/30">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="h-4 w-4 text-secondary" />
            </div>
            <div className="text-sm font-semibold tabular-nums">{activeDiscussions}</div>
            <div className="text-2xs text-muted-foreground">respostas</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <div className="text-sm font-semibold tabular-nums">{topicsThisWeek}</div>
            <div className="text-2xs text-muted-foreground">reflexões</div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto">
          <Button 
            variant="ghost" 
            className="w-full h-9 justify-between text-muted-foreground hover:text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all"
            size="sm"
          >
            <span>Explorar</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (to) {
    return <Link to={to} className="block h-full">{content}</Link>;
  }

  return content;
}