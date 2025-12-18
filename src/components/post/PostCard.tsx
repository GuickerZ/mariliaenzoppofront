import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackButtons } from "@/components/ui/feedback-buttons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Edit, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
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
  community: string;
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

  // Use estados locais apenas para sincronizar com a API
  const [likes, setLikes] = useState(qualidade);
  const [dislikes, setDislikes] = useState(naoGostou);
  const [liked, setLiked] = useState(hasLiked);
  const [disliked, setDisliked] = useState(hasDisliked);

  // Sincroniza quando as props mudam
  useEffect(() => {
    setLikes(qualidade);
    setDislikes(naoGostou);
    setLiked(hasLiked);
    setDisliked(hasDisliked);
  }, [qualidade, naoGostou, hasLiked, hasDisliked]);

  // Determina o valor para o FeedbackButtons
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

  useEffect(() => {
    if (!showReplies) return;
    if (replies.length > 0) return;
    const load = async () => {
      try {
        setLoadingReplies(true);
        setRepliesError(null);
        const data = await listDiscussions(id);
        setReplies(data);
        setRepliesCount(data.length);
      } catch (e) {
        setRepliesError("Não foi possível carregar respostas.");
      } finally {
        setLoadingReplies(false);
      }
    };
    load();
  }, [showReplies, id, replies.length]);

  const handleReply = async () => {
    if (!newReply.trim()) return;
    try {
      setSubmittingReply(true);
      const created = await createDiscussion(id, { content: newReply.trim() });
      setReplies([created, ...replies]);
      setNewReply("");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-soft ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{author}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span>
                {formatDistanceToNow(createdAt, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readTime}min de leitura</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="outline">
                  {repliesCount === null ? "?" : repliesCount} respostas
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {edited && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Edit className="h-3 w-3" />
                <span>{editHistory} edições</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <FeedbackButtons
            postId={id}
            qualityValue={getQualityValue()} // ← Isso garante que o botão venha selecionado
            onFeedback={async (type, positive) => {
              if (type !== "quality") return;

              const prev = { likes, dislikes, liked, disliked };

              try {
                if (positive) {
                  if (liked) {
                    // Remove like
                    setLiked(false);
                    setLikes((v) => Math.max(0, v - 1));
                    const updated = await unlikePost(id);
                    setLikes(updated.qualidade ?? Math.max(0, prev.likes - 1));
                    setLiked(Boolean(updated.hasLiked));
                  } else {
                    // Adiciona like, remove dislike se existir
                    if (disliked) {
                      setDisliked(false);
                      setDislikes((v) => Math.max(0, v - 1));
                    }
                    setLiked(true);
                    setLikes((v) => v + 1);
                    const updated = await likePost(id);
                    setLikes(updated.qualidade ?? prev.likes + 1);
                    setLiked(Boolean(updated.hasLiked ?? true));
                  }
                } else {
                  if (disliked) {
                    // Remove dislike
                    setDisliked(false);
                    setDislikes((v) => Math.max(0, v - 1));
                    const updated = await undislikePost(id);
                    setDislikes(
                      updated.naoGostou ?? Math.max(0, prev.dislikes - 1)
                    );
                    setDisliked(Boolean(updated.hasDisliked));
                  } else {
                    // Adiciona dislike, remove like se existir
                    if (liked) {
                      setLiked(false);
                      setLikes((v) => Math.max(0, v - 1));
                    }
                    setDisliked(true);
                    setDislikes((v) => v + 1);
                    const updated = await dislikePost(id);
                    setDislikes(updated.naoGostou ?? prev.dislikes + 1);
                    setDisliked(Boolean(updated.hasDisliked ?? true));
                  }
                }
              } catch (e) {
                // Rollback em caso de erro
                setLikes(prev.likes);
                setDislikes(prev.dislikes);
                setLiked(prev.liked);
                setDisliked(prev.disliked);
              }
            }}
          />

          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="inline-flex items-center space-x-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{likes}</span>
            </div>
            <div className="inline-flex items-center space-x-1">
              <ThumbsDown className="h-3 w-3" />
              <span>{dislikes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>Visualização consciente</span>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Ocultar respostas" : "Discutir"}
            {repliesCount !== null && !showReplies && (
              <span className="ml-2 inline-flex">
                <Badge variant="secondary">{repliesCount}</Badge>
              </span>
            )}
          </Button>
          {showReplies && (
            <div className="mt-3 space-y-3">
              {loadingReplies ? (
                <div className="text-sm text-muted-foreground">
                  Carregando respostas...
                </div>
              ) : repliesError ? (
                <div className="text-sm text-destructive">{repliesError}</div>
              ) : (
                <div className="space-y-2">
                  {replies.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      Seja o primeiro a responder
                    </div>
                  ) : (
                    replies.map((r) => (
                      <div key={r.id} className="p-3 border rounded-md">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{r.author}</span>
                          <span>
                            {formatDistanceToNow(r.createdAt, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {r.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Escreva uma resposta consciente..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={submittingReply || !newReply.trim()}
                  >
                    {submittingReply ? "Publicando..." : "Responder"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
