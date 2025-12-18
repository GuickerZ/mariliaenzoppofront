import { Clock, AlertTriangle, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";
import { useEffect, useMemo, useState } from "react";

interface TimeTrackerProps {
  onLimitReached?: () => void;
}

export function TimeTracker({ onLimitReached }: TimeTrackerProps) {
  const { timeSpent, dailyLimit, isLimitReached } = useTimeTracking();

  /* =====================
     CALLBACK AO ATINGIR LIMITE
     ===================== */
  useEffect(() => {
    if (isLimitReached && onLimitReached) {
      onLimitReached();
    }
  }, [isLimitReached, onLimitReached]);

  /* =====================
     TEMPO FORMATADO
     ===================== */
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const limitInSeconds = dailyLimit * 60;
  const progress = (timeSpent / limitInSeconds) * 100;
  const isNearLimit = progress >= 80;

  /* =====================
     CONTADOR ATÉ RESET
     ===================== */
  const [timeToReset, setTimeToReset] = useState<number | null>(null);

  useEffect(() => {
    if (!isLimitReached) {
      setTimeToReset(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight.getTime() - now.getTime();
      setTimeToReset(diff > 0 ? diff : 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isLimitReached]);

  const resetTimeFormatted = useMemo(() => {
    if (timeToReset === null) return "";

    const totalSeconds = Math.floor(timeToReset / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${h}h ${m}m ${s}s`;
  }, [timeToReset]);

  return (
    <Card
      className={`p-4 transition-all ${
        isLimitReached ? "opacity-80 border-destructive" : ""
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isLimitReached ? (
            <Lock className="h-4 w-4 text-destructive" />
          ) : (
            <Clock
              className={`h-4 w-4 ${
                isNearLimit
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            />
          )}
          <span className="text-sm font-medium">
            Tempo de uso hoje
          </span>
        </div>

        {isNearLimit && !isLimitReached && (
          <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
        )}
      </div>

      {/* CONTEÚDO */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            {minutes}min {seconds}s
          </span>
          <span className="text-muted-foreground">
            Limite: {dailyLimit}min
          </span>
        </div>

        {/* BARRA */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${
              isLimitReached
                ? "bg-destructive"
                : isNearLimit
                ? "bg-destructive"
                : "bg-primary"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* BLOQUEIO */}
        {isLimitReached ? (
          <div className="pt-2 space-y-1">
            <p className="text-sm text-destructive font-medium">
              Limite diário atingido.
            </p>

            {timeToReset !== null && (
              <p className="text-xs text-muted-foreground">
                Liberação em {resetTimeFormatted}
              </p>
            )}
          </div>
        ) : (
          isNearLimit && (
            <p className="text-xs text-muted-foreground">
              Você está perto do limite diário.
            </p>
          )
        )}
      </div>
    </Card>
  );
}
