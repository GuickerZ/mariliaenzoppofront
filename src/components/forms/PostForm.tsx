import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PenTool, Send, Clock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import { listCommunities, type Community as ApiCommunity, createCommunityPost } from "@/api/community";

interface PostFormProps {
  onSubmit?: (post: {
    content: string;
    community: string;
    readTime: number;
  }) => void;
  communities?: Array<{ id?: string; name: string }>;
  hideCommunitySelect?: boolean;
}

export function PostForm({ onSubmit, communities = [], hideCommunitySelect = false }: PostFormProps) {
  const [content, setContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { isLimitReached } = useTimeTracking();
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fetchedCommunities, setFetchedCommunities] = useState<Array<{ id?: string; name: string }>>([]);

  useEffect(() => {
    if (communities.length > 0) return;
    const fetch = async () => {
      try {
        setLoadingCommunities(true);
        const data = await listCommunities();
        const mapped = (Array.isArray(data) ? data as ApiCommunity[] : []).map(c => ({ id: c.id, name: c.name }));
        setFetchedCommunities(mapped);
      } catch (e) {
        setLoadError("Não foi possível carregar as comunidades.");
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetch();
  }, [communities.length]);

  // Auto-selecionar quando há apenas 1 comunidade disponível (ex.: página da própria comunidade)
  useEffect(() => {
    const source = (communities.length > 0 ? communities : fetchedCommunities);
    if (!selectedCommunity && source.length === 1) {
      const only = source[0];
      setSelectedCommunity((only.id ?? only.name).toString());
    }
  }, [communities, fetchedCommunities, selectedCommunity]);

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedCommunity || isLimitReached) return;

    setIsSubmitting(true);
    
    const post = {
      content: content.trim(),
      community: selectedCommunity,
      readTime: calculateReadTime(content)
    };

    try {
      if (onSubmit) {
        onSubmit(post);
      } else {
        await createCommunityPost(post.community, { content: post.content });
      }
    } finally {
      setIsSubmitting(false);
    }

    setContent("");
    setSelectedCommunity("");
  };

  const readTime = calculateReadTime(content);
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PenTool className="h-5 w-5" />
          <span>Compartilhar reflexão</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(() => {
            const source = (communities.length > 0 ? communities : fetchedCommunities);
            const shouldHide = hideCommunitySelect || source.length === 1;
            if (shouldHide) {
              const label = source[0]?.name ?? "Comunidade";
              return (
                <div>
                  <label className="text-sm font-medium mb-2 block">{label}</label>
                </div>
              );
            }
            return (
              <div>
                <label className="text-sm font-medium mb-2 block">Comunidade</label>
                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCommunities && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Carregando comunidades...</div>
                    )}
                    {!loadingCommunities && loadError && (
                      <div className="px-3 py-2 text-sm text-destructive">{loadError}</div>
                    )}
                    {!loadingCommunities && !loadError && (
                      source.length > 0 ? (
                        source.map((c) => (
                          <SelectItem key={c.id ?? c.name} value={(c.id ?? c.name).toString()}>
                            {c.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Nenhuma comunidade encontrada</div>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            );
          })()}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Sua reflexão
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe suas reflexões de forma consciente e respeitosa..."
              className="min-h-[120px] resize-none"
              maxLength={2000}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>{wordCount} palavras</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readTime}min de leitura</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {2000 - content.length} caracteres restantes
              </Badge>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setContent("");
                setSelectedCommunity("");
              }}
              disabled={isSubmitting}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || !selectedCommunity || isSubmitting || isLimitReached}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Publicando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Publicar</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}