import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedbackButtonsProps {
  postId: string;
  onFeedback?: (type: 'quality' | 'relevance', positive: boolean) => void;
  className?: string;
  qualityValue?: boolean | null;
}

export function FeedbackButtons({ postId, onFeedback, className, qualityValue }: FeedbackButtonsProps) {
  const [qualityFeedback, setQualityFeedback] = useState<boolean | null>(null);

  // Sincroniza o estado interno com o prop qualityValue
  useEffect(() => {
    setQualityFeedback(qualityValue ?? null);
  }, [qualityValue]);

  const handleQualityFeedback = (positive: boolean) => {
    const newValue = qualityFeedback === positive ? null : positive;
    setQualityFeedback(newValue);
    onFeedback?.('quality', positive);
  };

  return (
    <div className={cn("flex items-center space-x-6", className)}>
      {/* Quality Feedback */}
      <div className="flex items-center space-x-1">
        <span className="text-xs text-muted-foreground mr-2">Qualidade:</span>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            qualityFeedback === true && "text-primary bg-primary/10"
          )}
          onClick={() => handleQualityFeedback(true)}
          aria-pressed={qualityFeedback === true}
        >
          <ThumbsUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            qualityFeedback === false && "text-destructive bg-destructive/10"
          )}
          onClick={() => handleQualityFeedback(false)}
          aria-pressed={qualityFeedback === false}
        >
          <ThumbsDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}