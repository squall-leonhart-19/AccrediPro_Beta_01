// Unified registry of all niche landing page configs
import { NicheLandingConfig } from "./landing-page-types";
import { NICHE_LANDING_CONFIGS } from "./landing-page-configs";
import { NICHE_LANDING_CONFIGS_2 } from "./landing-page-configs-2";
import { NICHE_LANDING_CONFIGS_3 } from "./landing-page-configs-3";

export const ALL_NICHE_CONFIGS: Record<string, NicheLandingConfig> = {
    ...NICHE_LANDING_CONFIGS,
    ...NICHE_LANDING_CONFIGS_2,
    ...NICHE_LANDING_CONFIGS_3,
};

export function getNicheConfig(nicheId: string): NicheLandingConfig {
    const config = ALL_NICHE_CONFIGS[nicheId];
    if (!config) {
        throw new Error(`No landing page config found for niche: ${nicheId}`);
    }
    return config;
}
