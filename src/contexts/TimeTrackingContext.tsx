import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface TimeTrackingContextType {
  timeSpent: number;
  dailyLimit: number;
  isLimitReached: boolean;
  startSession: () => void;
  pauseSession: () => void;
  resetDaily: () => void;
  updateDailyLimit: (limit: number) => void;
}

const TimeTrackingContext =
  createContext<TimeTrackingContextType | undefined>(undefined);

const STORAGE_KEY = "timeTrackingData";

export function TimeTrackingProvider({ children }: { children: ReactNode }) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [lastActiveDate, setLastActiveDate] = useState(
    new Date().toDateString()
  );

  const limitInSeconds = dailyLimit * 60;
  const isLimitReached = timeSpent >= limitInSeconds;

  /* =====================
     RESTAURA AO CARREGAR
     ===================== */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      const today = new Date().toDateString();

      if (data.lastActiveDate === today) {
        setTimeSpent(Math.min(data.timeSpent ?? 0, limitInSeconds));
      } else {
        setTimeSpent(0);
      }

      setLastActiveDate(today);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [limitInSeconds]);

  /* =====================
     RESET AUTOMÁTICO À MEIA-NOITE
     ===================== */
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();

      if (today !== lastActiveDate) {
        setTimeSpent(0);
        setLastActiveDate(today);
        setIsActive(true);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [lastActiveDate]);

  /* =====================
     CONTADOR CONTROLADO
     ===================== */
  useEffect(() => {
    if (!isActive || isLimitReached) return;

    const interval = setInterval(() => {
      setTimeSpent((prev) => Math.min(prev + 1, limitInSeconds));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isLimitReached, limitInSeconds]);

  /* =====================
     SALVA SEMPRE
     ===================== */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timeSpent,
        dailyLimit,
        lastActiveDate,
        lastTick: Date.now(),
      })
    );
  }, [timeSpent, dailyLimit, lastActiveDate]);

  return (
    <TimeTrackingContext.Provider
      value={{
        timeSpent,
        dailyLimit,
        isLimitReached,
        startSession: () => {
          if (!isLimitReached) setIsActive(true);
        },
        pauseSession: () => setIsActive(false),
        resetDaily: () => setTimeSpent(0),
        updateDailyLimit: setDailyLimit,
      }}
    >
      {children}
    </TimeTrackingContext.Provider>
  );
}

export function useTimeTracking() {
  const ctx = useContext(TimeTrackingContext);
  if (!ctx) {
    throw new Error(
      "useTimeTracking must ser usado dentro do Provider"
    );
  }
  return ctx;
}
