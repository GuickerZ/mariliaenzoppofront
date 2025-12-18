import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackButtons } from "@/components/ui/feedback-buttons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Edit, MessageCircle, ThumbsUp, ThumbsDown, User, ChevronDown, ChevronUp, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  createDiscussion,
  listDiscussions,
  type Discussion,
  likePost,
  unlikePost,
  dislikePost,
  undislikePost,
} from "@/api/posts";

interface PostCardProps {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  community?: string;
  readTime: number;
  edited?: boolean;
  editHistory?: number;
  qualidade?: number;
  naoGostou?: number;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  className?: string;
}

export function PostCard({
  id,
  author,
  content,
  createdAt,
  community,
  readTime,
  edited = false,
  editHistory = 0,
  qualidade = 0,
  naoGostou = 0,
  hasLiked = false,
  hasDisliked = false,
  className,
}: PostCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Discussion[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesError, setRepliesError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [repliesCount, setRepliesCount] = useState<number | null>(null);

  const [likes, setLikes] = useState(qualidade);
  const [dislikes, setDislikes] = useState(naoGostou);
  const [liked, setLiked] = useState(hasLiked);
  const [disliked, setDisliked] = useState(hasDisliked);
  
  // Flag para evitar cliques múltiplos (race condition)
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);

  useEffect(() => {
    setLikes(qualidade);
    setDislikes(naoGostou);
    setLiked(hasLiked);
    setDisliked(hasDisliked);
  }, [qualidade, naoGostou, hasLiked, hasDisliked]);

  const getQualityValue = (): boolean | null => {
    if (liked) return true;
    if (disliked) return false;
    return null;
  };

  // Initial load to get replies count and cache data
  useEffect(() => {
    let mounted = true;
    const loadInitial = async () => {
      try {
        const data = await listDiscussions(id);
        if (!mounted) return;
        setReplies(data);
        setRepliesCount(data.length);
      } catch {
        // silent; count stays null
      }
    };
    loadInitial();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Carrega respostas quando abre a seção (sempre recarrega para pegar novas)
  useEffect(() => {
    if (!showReplies) return;
    
    let mounted = true;
    const load = async () => {
      try {
        setLoadingReplies(true);
        setRepliesError(null);
        const data = await listDiscussions(id);
        if (!mounted) return;
        setReplies(data);
        setRepliesCount(data.length);
      } catch (e) {
        if (!mounted) return;
        setRepliesError("Não foi possível carregar respostas.");
      } finally {
        if (mounted) setLoadingReplies(false);
      }
    };
    load();
    
    return () => { mounted = false; };
  }, [showReplies, id]);

  const handleReply = async () => {
    if (!newReply.trim() || submittingReply) return;
    try {
      setSubmittingReply(true);
      const created = await createDiscussion(id, { content: newReply.trim() });
      setReplies(prev => [created, ...prev]);
      setRepliesCount(prev => (prev ?? 0) + 1);
      setNewReply("");
    } catch (e) {
      // Silencioso - o usuário verá que a resposta não apareceu
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <Card
      className={`glass-card-hover border-border/30 ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{author}</span>
                {community && (
                  <Badge variant="secondary" className="text-2xs px-1.5 py-0">
                    {community}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span>
                  {formatDistanceToNow(createdAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}min</span>
                </div>
                {edited && (
                  <div className="flex items-center gap-1">
                    <Edit className="h-3 w-3" />
                    <span>{editHistory}x editado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
          {content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <FeedbackButtons
            postId={id}
            qualityValue={getQualityValue()} // ← Isso garante que o botão venha selecionado
            onFeedback={async (type, positive) => {
              if (type !== "quality") return;
              
              // Evita cliques múltiplos (race condition)
              if (isProcessingFeedback) return;
              setIsProcessingFeedback(true);

              // Captura estado ANTES de qualquer mudança
              const prevLikes = likes;
              const prevDislikes = dislikes;
              const prevLiked = liked;
              const prevDisliked = disliked;

              try {
                if (positive) {
                  if (prevLiked) {
                    // Remove like
                    setLiked(false);
                    setLikes(Math.max(0, prevLikes - 1));
                    const updated = await unlikePost(id);
                    setLikes(updated.qualidade ?? Math.max(0, prevLikes - 1));
                    setLiked(Boolean(updated.hasLiked));
                  } else {
                    // Adiciona like, remove dislike se existir
                    if (prevDisliked) {
                      setDisliked(false);
                      setDislikes(Math.max(0, prevDislikes - 1));
                    }
                    setLiked(true);
                    setLikes(prevLikes + 1);
                    const updated = await likePost(id);
                    setLikes(updated.qualidade ?? prevLikes + 1);
                    setDislikes(updated.naoGostou ?? (prevDisliked ? Math.max(0, prevDislikes - 1) : prevDislikes));
                    setLiked(Boolean(updated.hasLiked ?? true));
                    setDisliked(Boolean(updated.hasDisliked));
                  }
                } else {
                  if (prevDisliked) {
                    // Remove dislike
                    setDisliked(false);
                    setDislikes(Math.max(0, prevDislikes - 1));
                    const updated = await undislikePost(id);
                    setDislikes(updated.naoGostou ?? Math.max(0, prevDislikes - 1));
                    setDisliked(Boolean(updated.hasDisliked));
                  } else {
                    // Adiciona dislike, remove like se existir
                    if (prevLiked) {
                      setLiked(false);
                      setLikes(Math.max(0, prevLikes - 1));
                    }
                    setDisliked(true);
                    setDislikes(prevDislikes + 1);
                    const updated = await dislikePost(id);
                    setDislikes(updated.naoGostou ?? prevDislikes + 1);
                    setLikes(updated.qualidade ?? (prevLiked ? Math.max(0, prevLikes - 1) : prevLikes));
                    setDisliked(Boolean(updated.hasDisliked ?? true));
                    setLiked(Boolean(updated.hasLiked));
                  }
                }
              } catch (e) {
                // Rollback em caso de erro
                setLikes(prevLikes);
                setDislikes(prevDislikes);
                setLiked(prevLiked);
                setDisliked(prevDisliked);
              } finally {
                setIsProcessingFeedback(false);
              }
            }}
          />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30">
              <ThumbsUp className={`h-3.5 w-3.5 ${liked ? 'text-primary' : ''}`} />
              <span className="font-medium tabular-nums">{likes}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30">
              <ThumbsDown className={`h-3.5 w-3.5 ${disliked ? 'text-destructive' : ''}`} />
              <span className="font-medium tabular-nums">{dislikes}</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplies(!showReplies)}
          className="w-full justify-between h-10 text-muted-foreground hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{repliesCount === null ? "Discussão" : `${repliesCount} respostas`}</span>
          </div>
          {showReplies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showReplies && (
          <div className="space-y-4 pt-2 border-t border-border/30">
            {loadingReplies ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Carregando respostas...
              </div>
            ) : repliesError ? (
              <div className="text-sm text-destructive text-center py-4">{repliesError}</div>
            ) : (
              <div className="space-y-3">
                {replies.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Seja o primeiro a responder
                  </div>
                ) : (
                  replies.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg bg-muted/30 border border-border/20">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="font-medium">{r.author}</span>
                        </div>
                        <span>
                          {formatDistanceToNow(r.createdAt, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap pl-8">
                        {r.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Escreva uma resposta..."
                className="min-h-[60px] resize-none flex-1 bg-muted/30 border-border/30"
              />
              <Button
                size="icon"
                onClick={handleReply}
                disabled={submittingReply || !newReply.trim()}
                className="h-[60px] w-12 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
