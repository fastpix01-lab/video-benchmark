"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { BenchmarkRun } from "@/lib/providers/types";
import { DEFAULT_ENABLED } from "@/lib/constants";

interface BenchmarkState {
  runs: BenchmarkRun[];
  setRuns: (runs: BenchmarkRun[] | ((prev: BenchmarkRun[]) => BenchmarkRun[])) => void;
  enabled: Set<string>;
  setEnabled: (enabled: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  advancedEnabled: boolean;
  setAdvancedEnabled: (v: boolean) => void;
  networkPreset: "3g" | "2g";
  setNetworkPreset: (v: "3g" | "2g") => void;
  resetAll: () => void;
}

const BenchmarkContext = createContext<BenchmarkState | null>(null);

export function BenchmarkProvider({ children }: { children: React.ReactNode }) {
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [enabled, setEnabled] = useState<Set<string>>(new Set(DEFAULT_ENABLED));
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const [networkPreset, setNetworkPreset] = useState<"3g" | "2g">("3g");

  const resetAll = useCallback(() => {
    setRuns([]);
    setEnabled(new Set(DEFAULT_ENABLED));
    setAdvancedEnabled(false);
    setNetworkPreset("3g");
  }, []);

  return (
    <BenchmarkContext.Provider
      value={{
        runs,
        setRuns,
        enabled,
        setEnabled,
        advancedEnabled,
        setAdvancedEnabled,
        networkPreset,
        setNetworkPreset,
        resetAll,
      }}
    >
      {children}
    </BenchmarkContext.Provider>
  );
}

export function useBenchmarkContext() {
  const ctx = useContext(BenchmarkContext);
  if (!ctx) throw new Error("useBenchmarkContext must be used within BenchmarkProvider");
  return ctx;
}
