import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
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
  return (
    <Card className={`transition-all duration-300 hover:shadow-medium ${featured ? 'ring-1 ring-primary/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">{name}</CardTitle>
          {featured && (
            <Badge variant="secondary" className="text-xs">Destaque</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
            </div>
            <div className="text-sm font-medium">{memberCount}</div>
            <div className="text-xs text-muted-foreground">membros</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center text-muted-foreground">
              <MessageSquare className="h-3 w-3 mr-1" />
            </div>
            <div className="text-sm font-medium">{activeDiscussions}</div>
            <div className="text-xs text-muted-foreground">respostas</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
            </div>
            <div className="text-sm font-medium">{topicsThisWeek}</div>
            <div className="text-xs text-muted-foreground">reflexões</div>
          </div>
        </div>

        {to ? (
          <Button variant="outline" className="w-full" size="sm" asChild>
            <Link to={to}>Explorar comunidade</Link>
          </Button>
        ) : (
          <Button variant="outline" className="w-full" size="sm">
            Explorar comunidade
          </Button>
        )}
      </CardContent>
    </Card>
  );
}