import type { PlayerMeta } from "@/lib/api/player";
import type { PlayerSetupWizard } from "@/hooks/use-player-setup-wizard";

/**
 * Every step reads the same two things: the wizard it drives and the
 * config-served vocabulary it renders (ADR-0007). Steps hold no state of
 * their own beyond local presentation toggles.
 */
export type StepProps = {
  wizard: PlayerSetupWizard;
  meta: PlayerMeta;
};
