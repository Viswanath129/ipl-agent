export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export type ApiPayload = Record<string, unknown> | unknown[] | string | number | boolean | null;

export interface RoiResult {
  brand_name: string;
  match_scope?: string;
  data_status?: string;
  exposure_score?: number;
  estimated_roi_pct?: number;
  jersey_logo_visibility?: unknown;
  sponsor_sentiment?: {
    label: string;
  };
  social_mentions?: {
    total_mentions?: number;
  };
  meme_virality?: {
    estimated_meme_impressions?: number;
  };
  brand_recommendations?: string[];
  do_not_misrepresent?: string;
}

export interface DebateResult {
  debate_id: string;
  topic: string;
  side_a: string;
  side_b: string;
  lens?: string;
  comparison?: {
    score_a?: number;
    score_b?: number;
  };
  balanced_arguments?: {
    for_a?: string[];
    for_b?: string[];
  };
  bias_detection?: {
    bias_label?: string;
  };
  final_judge?: {
    winner?: string;
    verdict?: string;
    confidence_pct?: number;
  };
  fan_voting?: {
    total_votes?: number;
    votes?: Record<string, number>;
  };
  viral_shareable?: {
    hashtags?: string[];
    short_post?: string;
  };
}

export interface ChatResult {
  route_taken: string;
  message?: string;
  module_a_output?: RoiResult;
  module_b_output?: DebateResult;
}

export interface ReportSummary {
  sponsor_metrics: Array<{
    brand_name: string;
    exposure_score: number;
    estimated_roi_pct: number;
  }>;
  recent_queries: Array<{
    route: string;
    query: string;
  }>;
}
