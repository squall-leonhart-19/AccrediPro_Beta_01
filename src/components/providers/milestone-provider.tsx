"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { MilestoneToast } from "@/components/ui/milestone-toast";
import type { Milestone } from "@/lib/milestones";

interface MilestoneContextType {
  showMilestone: (milestone: Milestone) => void;
}

const MilestoneContext = createContext<MilestoneContextType | null>(null);

export function useMilestone() {
  const context = useContext(MilestoneContext);
  if (!context) {
    throw new Error("useMilestone must be used within a MilestoneProvider");
  }
  return context;
}

interface MilestoneProviderProps {
  children: ReactNode;
}

export function MilestoneProvider({ children }: MilestoneProviderProps) {
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  const showMilestone = useCallback((milestone: Milestone) => {
    setActiveMilestone(milestone);
  }, []);

  const hideMilestone = useCallback(() => {
    setActiveMilestone(null);
  }, []);

  return (
    <MilestoneContext.Provider value={{ showMilestone }}>
      {children}
      {activeMilestone && (
        <MilestoneToast
          message={activeMilestone.message}
          emoji={activeMilestone.emoji}
          badge={activeMilestone.badge}
          onClose={hideMilestone}
        />
      )}
    </MilestoneContext.Provider>
  );
}
