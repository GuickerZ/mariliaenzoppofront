import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface TimeTrackingContextType {
  timeSpent: number;
  dailyLimit: number;
  isLimitReached: boolean;
  timeUntilReset: number;
  startSession: () => void;
  pauseSession: () => void;
  resetDaily: () => void;
  updateDailyLimit: (limit: number) => void;
}

interface StoredData {
  timeSpent: number;
  dailyLimit: number;
  lastActiveDate: string;
}

const TimeTrackingContext =
  createContext<TimeTrackingContextType | undefined>(undefined);

const STORAGE_KEY = "timeTrackingData";
const MIN_LIMIT = 1;
const MAX_LIMIT = 480;

// Função helper para ler do localStorage de forma segura
function getStoredData(): StoredData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredData;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// Função helper para calcular tempo até meia-noite
function calculateTimeUntilMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
}

// Função helper para validar limite
function validateLimit(limit: number): number {
  return Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, Math.floor(limit)));
}

export function TimeTrackingProvider({ children }: { children: ReactNode }) {
  // Estado inicializado de forma lazy com localStorage
  const [state, setState] = useState(() => {
    const today = new Date().toDateString();
    const stored = getStoredData();
    
    if (stored && stored.lastActiveDate === today) {
      const dailyLimit = validateLimit(stored.dailyLimit ?? 30);
      const maxTimeInSeconds = dailyLimit * 60;
      // Garante que timeSpent não excede o limite (caso usuário tenha reduzido)
      const timeSpent = Math.min(stored.timeSpent ?? 0, maxTimeInSeconds);
      return {
        timeSpent,
        dailyLimit,
        lastActiveDate: today,
      };
    }
    
    return {
      timeSpent: 0,
      dailyLimit: stored?.dailyLimit ? validateLimit(stored.dailyLimit) : 30,
      lastActiveDate: today,
    };
  });

  const [isActive, setIsActive] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState(calculateTimeUntilMidnight);
  
  // Refs para evitar race conditions
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Valores derivados
  const limitInSeconds = state.dailyLimit * 60;
  const isLimitReached = state.timeSpent >= limitInSeconds;

  // Salvar no localStorage com debounce
  const saveToStorage = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timeSpent: state.timeSpent,
        dailyLimit: state.dailyLimit,
        lastActiveDate: state.lastActiveDate,
      }));
    }, 500);
  }, [state]);

  // Salvar quando estado muda
  useEffect(() => {
    saveToStorage();
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [saveToStorage]);

  // Contador principal - usa ref para evitar problemas de cleanup
  useEffect(() => {
    // Limpa intervalo anterior se existir
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Não inicia se inativo ou limite atingido
    if (!isActive || isLimitReached) return;

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const maxTime = prev.dailyLimit * 60;
        
        // Já atingiu o limite, não incrementa mais
        if (prev.timeSpent >= maxTime) {
          return prev;
        }
        
        const newTimeSpent = prev.timeSpent + 1;
        
        // Atingiu o limite agora
        if (newTimeSpent >= maxTime) {
          return { ...prev, timeSpent: maxTime };
        }
        
        return { ...prev, timeSpent: newTimeSpent };
      });
    }, 1000);

    // Cleanup: limpa apenas o intervalo criado neste effect
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isLimitReached]);

  // Ref para acessar isLimitReached dentro de callbacks sem causar re-render
  const isLimitReachedRef = useRef(isLimitReached);
  useEffect(() => {
    isLimitReachedRef.current = isLimitReached;
  }, [isLimitReached]);

  // Verificar mudança de dia e visibilidade
  useEffect(() => {
    const checkDate = () => {
      const today = new Date().toDateString();
      setState(prev => {
        if (prev.lastActiveDate !== today) {
          return { ...prev, timeSpent: 0, lastActiveDate: today };
        }
        return prev;
      });
      setTimeUntilReset(calculateTimeUntilMidnight());
    };

    // Verificar ao voltar para a aba
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkDate();
        // Usa ref para evitar re-criação do listener
        if (!isLimitReachedRef.current) setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    // Sincronização entre abas
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const data = JSON.parse(e.newValue) as StoredData;
          const today = new Date().toDateString();
          if (data.lastActiveDate === today) {
            setState(prev => {
              const newLimit = validateLimit(data.dailyLimit);
              const maxTime = newLimit * 60;
              // Usa o maior tempo, mas não excede o novo limite
              const newTimeSpent = Math.min(Math.max(prev.timeSpent, data.timeSpent), maxTime);
              return {
                ...prev,
                timeSpent: newTimeSpent,
                dailyLimit: newLimit,
              };
            });
          }
        } catch { /* ignore */ }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("storage", handleStorage);

    // Verificar a cada 10 segundos
    const dateCheckInterval = setInterval(checkDate, 10000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
      clearInterval(dateCheckInterval);
    };
  }, []); // Agora sem dependências - listeners criados apenas uma vez

  // Atualizar contador regressivo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilReset(calculateTimeUntilMidnight());
    }, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  // Callbacks memoizados - usam refs para evitar recriação
  const startSession = useCallback(() => {
    if (!isLimitReachedRef.current) setIsActive(true);
  }, []);

  const pauseSession = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetDaily = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeSpent: 0,
      lastActiveDate: new Date().toDateString(),
    }));
    setIsActive(true);
  }, []);

  const updateDailyLimit = useCallback((limit: number) => {
    const validLimit = validateLimit(limit);
    setState(prev => ({ ...prev, dailyLimit: validLimit }));
  }, []);

  return (
    <TimeTrackingContext.Provider
      value={{
        timeSpent: state.timeSpent,
        dailyLimit: state.dailyLimit,
        isLimitReached,
        timeUntilReset,
        startSession,
        pauseSession,
        resetDaily,
        updateDailyLimit,
      }}
    >
      {children}
    </TimeTrackingContext.Provider>
  );
}

export function useTimeTracking() {
  const ctx = useContext(TimeTrackingContext);
  if (!ctx) {
    throw new Error("useTimeTracking deve ser usado dentro do TimeTrackingProvider");
  }
  return ctx;
}
