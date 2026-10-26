// src/OxyNews/data/codingAgentsData.ts
// Benchmark evaluation data from Artificial Analysis Coding Agents Leaderboard
// Source: https://artificialanalysis.ai/agents/coding-agents?coding-agents-performance-chart=benchmark-score-by-eval

export interface BenchmarkEval {
  datasetIndexName: string;
  evaluationDatasetSlug: string;
  refDatasetName: string;
  weight: number;
  reward: number; // 0 to 1
  inputTokens?: number;
  outputTokens?: number;
}

export interface CodingAgentModel {
  id: string;
  isDefault: boolean;
  isHighlighted: boolean;
  agentName: string;
  provider: string;
  hostModelSlug?: string;
  agent: string;
  model: string;
  displayLabel: string;
  creatorName: string;
  creatorSlug: string;
  creatorColor: string;
  indexScore: number; // 0 to 1
  deepSweScore: number | null; // 0 to 1
  sweAtlasScore: number | null; // 0 to 1
  terminalBenchScore: number | null; // 0 to 1
  costUsd: number | null;
  agentWallTimeSec: number | null;
  steps: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  cacheTokens: number | null;
  cacheHitRate: number | null;
  totalTokens: number | null;
  evals: BenchmarkEval[];
}

export interface BenchmarkMeta {
  key: string;
  name: string;
  tagline: string;
  author: string;
  taskCount: number;
  color: string;
  url: string;
}

export const BENCHMARKS_METADATA: Record<string, BenchmarkMeta> = {
  "deep-swe-v1.1": {
    key: "deep-swe-v1.1",
    name: "DeepSWE v1.1",
    tagline: "Software engineering tasks",
    author: "Datacurve",
    taskCount: 113,
    color: "#8b5cf6", // Purple
    url: "https://deepswe.datacurve.ai/",
  },
  "terminal-bench-v4": {
    key: "terminal-bench-v4",
    name: "Terminal-Bench 4.0",
    tagline: "Agentic terminal use",
    author: "Laude Institute",
    taskCount: 66,
    color: "#f59e0b", // Amber
    url: "https://www.tbench.ai/",
  },
  "swe-atlas-qna": {
    key: "swe-atlas-qna",
    name: "SWE-Atlas-QnA",
    tagline: "Technical Q&A",
    author: "Scale AI",
    taskCount: 124,
    color: "#06b6d4", // Cyan
    url: "https://labs.scale.com/leaderboard/sweatlas-qna",
  },
};

export const CODING_AGENTS_DATA: CodingAgentModel[] = [
  {
    "id": "a2c87c062f3cef73d8525e7578f14742",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-beignet-eap-max",
    "agent": "Claude Code",
    "model": "Sonnet 5.5 (max)",
    "displayLabel": "Claude Code - Sonnet 5.5 (max)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.6835783373750831,
    "deepSweScore": 0.71976401179941,
    "sweAtlasScore": 0.669354838709677,
    "terminalBenchScore": 0.661616161616162,
    "costUsd": 14.19,
    "agentWallTimeSec": 5245,
    "steps": 266,
    "inputTokens": 27141369,
    "outputTokens": 600968,
    "cacheTokens": 26006028,
    "cacheHitRate": 95.1,
    "totalTokens": 27742337,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.71976401179941,
        "inputTokens": 22525712,
        "outputTokens": 614456
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.669354838709677,
        "inputTokens": 34503497,
        "outputTokens": 552624
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.661616161616162,
        "inputTokens": 21212058,
        "outputTokens": 668705
      }
    ]
  },
  {
    "id": "9bafad3e22caac44923f3df721644e06",
    "isDefault": true,
    "isHighlighted": false,
    "agentName": "Devin Fusion CLI",
    "provider": "cognition",
    "hostModelSlug": "cognition_fusion-claude-opus-5-5-max-sidekick-gpt-6-luna-high",
    "agent": "Devin Fusion CLI",
    "model": "Claude Opus 5.5 Max + GPT-6 Luna High",
    "displayLabel": "Devin Fusion CLI - Claude Opus 5.5 Max + GPT-6 Luna High",
    "creatorName": "Cognition",
    "creatorSlug": "cognition",
    "creatorColor": "#2200FF",
    "indexScore": 0.6810374657220217,
    "deepSweScore": 0.725663716814159,
    "sweAtlasScore": 0.696236559139785,
    "terminalBenchScore": 0.621212121212121,
    "costUsd": 9.01,
    "agentWallTimeSec": 3290,
    "steps": 116,
    "inputTokens": 12511135,
    "outputTokens": 295567,
    "cacheTokens": 11428758,
    "cacheHitRate": 87.1,
    "totalTokens": 12806702,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.725663716814159,
        "inputTokens": 17713236,
        "outputTokens": 320121
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.696236559139785,
        "inputTokens": 5657074,
        "outputTokens": 238145
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.621212121212121,
        "inputTokens": 16481833,
        "outputTokens": 361409
      }
    ]
  },
  {
    "id": "60d5b66f39c9e9aacacde1855d69e211",
    "isDefault": true,
    "isHighlighted": false,
    "agentName": "Muse Code",
    "provider": "meta",
    "hostModelSlug": "meta_straw-110_evals_ext_max",
    "agent": "Muse Code",
    "model": "Muse Wonder Full (max)",
    "displayLabel": "Muse Code - Muse Wonder Full (max)",
    "creatorName": "Meta",
    "creatorSlug": "meta",
    "creatorColor": "#0089f4",
    "indexScore": 0.6803093740718634,
    "deepSweScore": 0.769911504424779,
    "sweAtlasScore": 0.68010752688172,
    "terminalBenchScore": 0.590909090909091,
    "costUsd": null,
    "agentWallTimeSec": 1726,
    "steps": 195,
    "inputTokens": 14917199,
    "outputTokens": 85117,
    "cacheTokens": 14564667,
    "cacheHitRate": 96.4,
    "totalTokens": 15002316,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.769911504424779,
        "inputTokens": 20456596,
        "outputTokens": 98151
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.68010752688172,
        "inputTokens": 6628007,
        "outputTokens": 42390
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.590909090909091,
        "inputTokens": 21090643,
        "outputTokens": 143272
      }
    ]
  },
  {
    "id": "ab5074e404be48bbd4ac3c488ad9a3e2",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "anthropic_claude-opus-5-5",
    "agent": "Claude Code",
    "model": "Opus 5.5 (max)",
    "displayLabel": "Claude Code - Opus 5.5 (max)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.659885802549234,
    "deepSweScore": 0.684365781710915,
    "sweAtlasScore": 0.663978494623656,
    "terminalBenchScore": 0.631313131313131,
    "costUsd": 13.04,
    "agentWallTimeSec": 3867,
    "steps": 155,
    "inputTokens": 15218206,
    "outputTokens": 333177,
    "cacheTokens": 14568924,
    "cacheHitRate": 95,
    "totalTokens": 15551383,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.684365781710915,
        "inputTokens": 15895335,
        "outputTokens": 406479
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.663978494623656,
        "inputTokens": 14842420,
        "outputTokens": 214788
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.631313131313131,
        "inputTokens": 14764903,
        "outputTokens": 430101
      }
    ]
  },
  {
    "id": "ef63fafa9b4a635522183c879ae8435b",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Antigravity CLI",
    "provider": "google",
    "hostModelSlug": "google_barium-bb_ai-studio",
    "agent": "Antigravity CLI",
    "model": "Gemini 4 Argon",
    "displayLabel": "Antigravity CLI - Gemini 4 Argon (high)",
    "creatorName": "Google",
    "creatorSlug": "google",
    "creatorColor": "#34A853",
    "indexScore": 0.637577603035782,
    "deepSweScore": 0.787610619469027,
    "sweAtlasScore": 0.564516129032258,
    "terminalBenchScore": 0.560606060606061,
    "costUsd": 5.84,
    "agentWallTimeSec": 2070,
    "steps": 149,
    "inputTokens": 13621673,
    "outputTokens": 112121,
    "cacheTokens": 11850855,
    "cacheHitRate": 87,
    "totalTokens": 13733794,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.787610619469027,
        "inputTokens": 19901657,
        "outputTokens": 152423
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.564516129032258,
        "inputTokens": 7075681,
        "outputTokens": 48671
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.560606060606061,
        "inputTokens": 15263258,
        "outputTokens": 162940
      }
    ]
  },
  {
    "id": "61df0222d90b30e25d4ff8b08d0c0aca",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Muse Code",
    "provider": "meta",
    "hostModelSlug": "meta_restful-rf120_evals_ext_max",
    "agent": "Muse Code",
    "model": "Muse Wonder (max)",
    "displayLabel": "Muse Code - Muse Wonder (max)",
    "creatorName": "Meta",
    "creatorSlug": "meta",
    "creatorColor": "#0089f4",
    "indexScore": 0.6349675266318143,
    "deepSweScore": 0.75811209439528,
    "sweAtlasScore": 0.672043010752688,
    "terminalBenchScore": 0.474747474747475,
    "costUsd": 8.05,
    "agentWallTimeSec": 1347,
    "steps": 192,
    "inputTokens": 14926251,
    "outputTokens": 90049,
    "cacheTokens": 14066776,
    "cacheHitRate": 93.6,
    "totalTokens": 15016300,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.75811209439528,
        "inputTokens": 20458663,
        "outputTokens": 93286
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.672043010752688,
        "inputTokens": 5962255,
        "outputTokens": 36860
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.474747474747475,
        "inputTokens": 22295537,
        "outputTokens": 184438
      }
    ]
  },
  {
    "id": "ed8c1d0b0a2fe4560bbfa0a9f47e8941",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_quasar-alpha",
    "agent": "Codex",
    "model": "GPT-6.1 Sol (xhigh)",
    "displayLabel": "Codex - GPT-6.1 Sol (xhigh) ({'reasoning_effort': 'xhigh'})",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.6290776736822983,
    "deepSweScore": 0.731563421828909,
    "sweAtlasScore": 0.610215053763441,
    "terminalBenchScore": 0.545454545454545,
    "costUsd": 1.04,
    "agentWallTimeSec": 931,
    "steps": 40,
    "inputTokens": 3177125,
    "outputTokens": 35403,
    "cacheTokens": 3036066,
    "cacheHitRate": 93.3,
    "totalTokens": 3212528,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.731563421828909,
        "inputTokens": 2690172,
        "outputTokens": 37762
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.610215053763441,
        "inputTokens": 2748675,
        "outputTokens": 21382
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.545454545454545,
        "inputTokens": 4815817,
        "outputTokens": 57704
      }
    ]
  },
  {
    "id": "666605c66ad569c503ce53c01682e285",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-beignet-eap-xhigh",
    "agent": "Claude Code",
    "model": "Sonnet 5.5 (xhigh)",
    "displayLabel": "Claude Code - Sonnet 5.5 (xhigh)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.628713868151493,
    "deepSweScore": 0.684365781710914,
    "sweAtlasScore": 0.620967741935484,
    "terminalBenchScore": 0.580808080808081,
    "costUsd": 3.33,
    "agentWallTimeSec": 1619,
    "steps": 78,
    "inputTokens": 6961982,
    "outputTokens": 125696,
    "cacheTokens": 6693764,
    "cacheHitRate": 95.7,
    "totalTokens": 7087678,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.684365781710914,
        "inputTokens": 7430694,
        "outputTokens": 150014
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.620967741935484,
        "inputTokens": 5431788,
        "outputTokens": 64841
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.580808080808081,
        "inputTokens": 9034402,
        "outputTokens": 198394
      }
    ]
  },
  {
    "id": "29a1cdad0d140781d05b9b4746cfdd0d",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "anthropic_claude-fable-5-1",
    "agent": "Claude Code",
    "model": "Fable 5.1 (max) (with fallback)",
    "displayLabel": "Claude Code - Fable 5.1 (max) (with fallback)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.6222249615769457,
    "deepSweScore": 0.64306784660767,
    "sweAtlasScore": 0.647849462365591,
    "terminalBenchScore": 0.575757575757576,
    "costUsd": 12.39,
    "agentWallTimeSec": 2090,
    "steps": 37,
    "inputTokens": 5581622,
    "outputTokens": 133632,
    "cacheTokens": 5205556,
    "cacheHitRate": 91.6,
    "totalTokens": 5715254,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.64306784660767,
        "inputTokens": 6428755,
        "outputTokens": 155542
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.647849462365591,
        "inputTokens": 3623188,
        "outputTokens": 81143
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.575757575757576,
        "inputTokens": 7810712,
        "outputTokens": 194732
      }
    ]
  },
  {
    "id": "34970c963bdfd318e46205514d46ea4f",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Devin Fusion CLI",
    "provider": "cognition",
    "hostModelSlug": "cognition_fusion-claude-fable-5-1-xhigh-sidekick-penguin-medium",
    "agent": "Devin Fusion CLI",
    "model": "Claude Fable 5.1 XHigh + SWE-2 Medium",
    "displayLabel": "Devin Fusion CLI - Claude Fable 5.1 XHigh + SWE-2 Medium",
    "creatorName": "Cognition",
    "creatorSlug": "cognition",
    "creatorColor": "#2200FF",
    "indexScore": 0.6168255492406223,
    "deepSweScore": 0.631268436578171,
    "sweAtlasScore": 0.658602150537635,
    "terminalBenchScore": 0.560606060606061,
    "costUsd": 7.9,
    "agentWallTimeSec": 2147,
    "steps": 100,
    "inputTokens": 9590504,
    "outputTokens": 101044,
    "cacheTokens": 9279593,
    "cacheHitRate": 95.8,
    "totalTokens": 9691548,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.631268436578171,
        "inputTokens": 10080280,
        "outputTokens": 111600
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.658602150537635,
        "inputTokens": 5492120,
        "outputTokens": 55828
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.560606060606061,
        "inputTokens": 16451945,
        "outputTokens": 167922
      }
    ]
  },
  {
    "id": "9e810ff3c6cce5ebaaff7c744c687a47",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_vega-alpha",
    "agent": "Codex",
    "model": "GPT-6 Astra (max)",
    "displayLabel": "Codex - GPT-6 Astra (max)",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.6164504498789397,
    "deepSweScore": 0.675516224188791,
    "sweAtlasScore": 0.618279569892473,
    "terminalBenchScore": 0.555555555555555,
    "costUsd": 7.47,
    "agentWallTimeSec": 1762,
    "steps": 39,
    "inputTokens": 3299550,
    "outputTokens": 47061,
    "cacheTokens": 3141589,
    "cacheHitRate": 93.4,
    "totalTokens": 3346611,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.675516224188791,
        "inputTokens": 3338102,
        "outputTokens": 56420
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.618279569892473,
        "inputTokens": 2623791,
        "outputTokens": 28534
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.555555555555555,
        "inputTokens": 4503152,
        "outputTokens": 65845
      }
    ]
  },
  {
    "id": "93acd59f31f8e5478686d650aa650f79",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_quasar-alpha",
    "agent": "Codex",
    "model": "GPT-6.1 Sol (medium)",
    "displayLabel": "Codex - GPT-6.1 Sol (medium) ({'reasoning_effort': 'medium'})",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.6141474695571183,
    "deepSweScore": 0.71976401179941,
    "sweAtlasScore": 0.60752688172043,
    "terminalBenchScore": 0.515151515151515,
    "costUsd": 0.7,
    "agentWallTimeSec": 651,
    "steps": 38,
    "inputTokens": 2275867,
    "outputTokens": 22412,
    "cacheTokens": 2176437,
    "cacheHitRate": 92.4,
    "totalTokens": 2298279,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.71976401179941,
        "inputTokens": 1875718,
        "outputTokens": 22954
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.60752688172043,
        "inputTokens": 1970189,
        "outputTokens": 13754
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.515151515151515,
        "inputTokens": 3535272,
        "outputTokens": 37751
      }
    ]
  },
  {
    "id": "4aee8aa2d4a0bad6068644f40edae235",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_quasar-alpha",
    "agent": "Codex",
    "model": "GPT-6.1 Sol (high)",
    "displayLabel": "Codex - GPT-6.1 Sol (high) ({'reasoning_effort': 'high'})",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.6014923716179784,
    "deepSweScore": 0.705014749262537,
    "sweAtlasScore": 0.599462365591398,
    "terminalBenchScore": 0.5,
    "costUsd": 0.89,
    "agentWallTimeSec": 800,
    "steps": 39,
    "inputTokens": 2791163,
    "outputTokens": 28749,
    "cacheTokens": 2665415,
    "cacheHitRate": 92.8,
    "totalTokens": 2819912,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.705014749262537,
        "inputTokens": 2382530,
        "outputTokens": 31207
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.599462365591398,
        "inputTokens": 2421836,
        "outputTokens": 17769
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.5,
        "inputTokens": 4184680,
        "outputTokens": 45169
      }
    ]
  },
  {
    "id": "ea296ce785422d3b97cfff4427f2e0d2",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_quasar-alpha",
    "agent": "Codex",
    "model": "GPT-6.1 Sol (max)",
    "displayLabel": "Codex - GPT-6.1 Sol (max)",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.6014750704302517,
    "deepSweScore": 0.696165191740413,
    "sweAtlasScore": 0.577956989247312,
    "terminalBenchScore": 0.53030303030303,
    "costUsd": 1.55,
    "agentWallTimeSec": 1463,
    "steps": 40,
    "inputTokens": 3937843,
    "outputTokens": 61659,
    "cacheTokens": 3740552,
    "cacheHitRate": 92.8,
    "totalTokens": 3999502,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.696165191740413,
        "inputTokens": 3676097,
        "outputTokens": 70759
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.577956989247312,
        "inputTokens": 3171478,
        "outputTokens": 35669
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.53030303030303,
        "inputTokens": 5825822,
        "outputTokens": 94907
      }
    ]
  },
  {
    "id": "409518818f1e9ad21995d70631ab05b6",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "anthropic_claude-opus-5",
    "agent": "Claude Code",
    "model": "Opus 5 (max)",
    "displayLabel": "Claude Code - Opus 5 (max)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.5972636729844837,
    "deepSweScore": 0.625368731563422,
    "sweAtlasScore": 0.620967741935484,
    "terminalBenchScore": 0.545454545454545,
    "costUsd": 10.79,
    "agentWallTimeSec": 2516,
    "steps": 152,
    "inputTokens": 11238194,
    "outputTokens": 136656,
    "cacheTokens": 10929014,
    "cacheHitRate": 97,
    "totalTokens": 11374850,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.625368731563422,
        "inputTokens": 13358102,
        "outputTokens": 129794
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.620967741935484,
        "inputTokens": 7586224,
        "outputTokens": 61960
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.545454545454545,
        "inputTokens": 14469933,
        "outputTokens": 288742
      }
    ]
  },
  {
    "id": "fa2595093fa640e73d072e7d1aa7df82",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Devin Fusion CLI",
    "provider": "cognition",
    "hostModelSlug": "cognition_fusion-gpt-6-astra-xhigh-sidekick-penguin-medium",
    "agent": "Devin Fusion CLI",
    "model": "GPT-6 Astra XHigh + SWE-2 Medium",
    "displayLabel": "Devin Fusion CLI - GPT-6 Astra XHigh + SWE-2 Medium",
    "creatorName": "Cognition",
    "creatorSlug": "cognition",
    "creatorColor": "#2200FF",
    "indexScore": 0.588884131062264,
    "deepSweScore": 0.672566371681416,
    "sweAtlasScore": 0.594086021505376,
    "terminalBenchScore": 0.5,
    "costUsd": 4.54,
    "agentWallTimeSec": 1482,
    "steps": 79,
    "inputTokens": 6017555,
    "outputTokens": 56580,
    "cacheTokens": 5695797,
    "cacheHitRate": 92,
    "totalTokens": 6074134,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.672566371681416,
        "inputTokens": 10312445,
        "outputTokens": 83838
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.594086021505376,
        "inputTokens": 2112115,
        "outputTokens": 23624
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.5,
        "inputTokens": 6001674,
        "outputTokens": 71828
      }
    ]
  },
  {
    "id": "fa589dad83ffcdd6cce72a467e552063",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_quasar-alpha",
    "agent": "Codex",
    "model": "GPT-6.1 Sol (low)",
    "displayLabel": "Codex - GPT-6.1 Sol (low) ({'reasoning_effort': 'low'})",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.5721634943016617,
    "deepSweScore": 0.675516224188791,
    "sweAtlasScore": 0.551075268817204,
    "terminalBenchScore": 0.48989898989899,
    "costUsd": 0.5,
    "agentWallTimeSec": 518,
    "steps": 36,
    "inputTokens": 1699124,
    "outputTokens": 14695,
    "cacheTokens": 1627296,
    "cacheHitRate": 91.4,
    "totalTokens": 1713819,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.675516224188791,
        "inputTokens": 1135333,
        "outputTokens": 12866
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.551075268817204,
        "inputTokens": 1278601,
        "outputTokens": 9084
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.48989898989899,
        "inputTokens": 3454474,
        "outputTokens": 28369
      }
    ]
  },
  {
    "id": "7a0dfd2a7a9d93056f860d4675586d66",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_gpt-6-sol",
    "agent": "Codex",
    "model": "GPT-6 Sol (max)",
    "displayLabel": "Codex - GPT-6 Sol (max)",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.5666259127577997,
    "deepSweScore": 0.690265486725664,
    "sweAtlasScore": 0.575268817204301,
    "terminalBenchScore": 0.434343434343434,
    "costUsd": 2.99,
    "agentWallTimeSec": 1338,
    "steps": 87,
    "inputTokens": 9778602,
    "outputTokens": 62176,
    "cacheTokens": 9598929,
    "cacheHitRate": 96.4,
    "totalTokens": 9840778,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.690265486725664,
        "inputTokens": 9754197,
        "outputTokens": 70300
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.575268817204301,
        "inputTokens": 6133615,
        "outputTokens": 37934
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.434343434343434,
        "inputTokens": 16668545,
        "outputTokens": 93811
      }
    ]
  },
  {
    "id": "f927d9c41b5c3021996eb14c3dd1341e",
    "isDefault": true,
    "isHighlighted": true,
    "agentName": "Grok Build",
    "provider": "xai",
    "hostModelSlug": "xai_grok-bop-o86-xhigh",
    "agent": "Grok Build",
    "model": "Grok 4.7 (xhigh)",
    "displayLabel": "Grok Build - Grok 4.7 (xhigh)",
    "creatorName": "SpaceXAI",
    "creatorSlug": "xai",
    "creatorColor": "#736cd3",
    "indexScore": 0.5626764360706693,
    "deepSweScore": 0.725663716814159,
    "sweAtlasScore": 0.629032258064516,
    "terminalBenchScore": 0.333333333333333,
    "costUsd": 8.82,
    "agentWallTimeSec": 2354,
    "steps": 163,
    "inputTokens": 14201448,
    "outputTokens": 123276,
    "cacheTokens": 13550057,
    "cacheHitRate": 93.9,
    "totalTokens": 14324724,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.725663716814159,
        "inputTokens": 14656744,
        "outputTokens": 152948
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.629032258064516,
        "inputTokens": 7966826,
        "outputTokens": 57168
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.333333333333333,
        "inputTokens": 25135459,
        "outputTokens": 196677
      }
    ]
  },
  {
    "id": "33e80f383dc644527161435b076798ad",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-beignet-eap-high",
    "agent": "Claude Code",
    "model": "Sonnet 5.5 (high)",
    "displayLabel": "Claude Code - Sonnet 5.5 (high)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.5501249049636148,
    "deepSweScore": 0.666666666666667,
    "sweAtlasScore": 0.564516129032258,
    "terminalBenchScore": 0.419191919191919,
    "costUsd": 1.24,
    "agentWallTimeSec": 735,
    "steps": 37,
    "inputTokens": 2610884,
    "outputTokens": 41496,
    "cacheTokens": 2507283,
    "cacheHitRate": 94.8,
    "totalTokens": 2652381,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.666666666666667,
        "inputTokens": 2606938,
        "outputTokens": 46315
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.564516129032258,
        "inputTokens": 1796492,
        "outputTokens": 20475
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.419191919191919,
        "inputTokens": 4147711,
        "outputTokens": 72741
      }
    ]
  },
  {
    "id": "709f801275dedae5675b1f56e97c9df3",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_gpt-5-6-sol",
    "agent": "Codex",
    "model": "GPT-5.6 Sol (max)",
    "displayLabel": "Codex - GPT-5.6 Sol (max) ({'reasoning_effort': 'max'})",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.54559127289644,
    "deepSweScore": 0.722713864306785,
    "sweAtlasScore": 0.540322580645161,
    "terminalBenchScore": 0.373737373737374,
    "costUsd": 6.35,
    "agentWallTimeSec": 1238,
    "steps": 116,
    "inputTokens": 10120981,
    "outputTokens": 49155,
    "cacheTokens": 9784084,
    "cacheHitRate": 94.6,
    "totalTokens": 10170137,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.722713864306785,
        "inputTokens": 10907777,
        "outputTokens": 56944
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.540322580645161,
        "inputTokens": 7898019,
        "outputTokens": 31499
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.373737373737374,
        "inputTokens": 12950367,
        "outputTokens": 68993
      }
    ]
  },
  {
    "id": "f2de07373c3626f1b9269a6ecad7804c",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Muse Code",
    "provider": "meta",
    "hostModelSlug": "meta_aa_glacier135",
    "agent": "Muse Code",
    "model": "Muse Spark 1.3 (max)",
    "displayLabel": "Muse Code - Muse Spark 1.3 (max)",
    "creatorName": "Meta",
    "creatorSlug": "meta",
    "creatorColor": "#0089f4",
    "indexScore": 0.5430273329930766,
    "deepSweScore": 0.716814159292036,
    "sweAtlasScore": 0.594086021505376,
    "terminalBenchScore": 0.318181818181818,
    "costUsd": 3.98,
    "agentWallTimeSec": 1107,
    "steps": 185,
    "inputTokens": 16445971,
    "outputTokens": 263474,
    "cacheTokens": 16090656,
    "cacheHitRate": 97.1,
    "totalTokens": 16709445,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.716814159292036,
        "inputTokens": 13526616,
        "outputTokens": 122492
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.594086021505376,
        "inputTokens": 4493625,
        "outputTokens": 23616
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.318181818181818,
        "inputTokens": 43900184,
        "outputTokens": 955493
      }
    ]
  },
  {
    "id": "45493c2782f1bd94f6d30d4911f317a0",
    "isDefault": true,
    "isHighlighted": false,
    "agentName": "Opencode",
    "provider": "zai",
    "hostModelSlug": "zai_glm-5-3",
    "agent": "Opencode",
    "model": "GLM-5.3",
    "displayLabel": "Opencode - GLM-5.3 ({'reasoning_effort': 'max'})",
    "creatorName": "OpenCode",
    "creatorSlug": "opencode",
    "creatorColor": "#2D2828",
    "indexScore": 0.5355484140097326,
    "deepSweScore": 0.613569321533923,
    "sweAtlasScore": 0.594086021505376,
    "terminalBenchScore": 0.398989898989899,
    "costUsd": 4.24,
    "agentWallTimeSec": 2888,
    "steps": 107,
    "inputTokens": 14202165,
    "outputTokens": 74259,
    "cacheTokens": 14007356,
    "cacheHitRate": 97.5,
    "totalTokens": 14276424,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.613569321533923,
        "inputTokens": 16638608,
        "outputTokens": 75200
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.594086021505376,
        "inputTokens": 6141052,
        "outputTokens": 28542
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.398989898989899,
        "inputTokens": 25175801,
        "outputTokens": 158542
      }
    ]
  },
  {
    "id": "55b029d6971b4d378335bb168eb98b3b",
    "isDefault": true,
    "isHighlighted": false,
    "agentName": "Kimi Code CLI",
    "provider": "moonshotai",
    "hostModelSlug": "moonshot_kimi-k3",
    "agent": "Kimi Code CLI",
    "model": "Kimi K3",
    "displayLabel": "Kimi Code CLI - Kimi K3",
    "creatorName": "Kimi",
    "creatorSlug": "kimi",
    "creatorColor": "#047AFE",
    "indexScore": 0.519259105470924,
    "deepSweScore": 0.684365781710915,
    "sweAtlasScore": 0.661290322580645,
    "terminalBenchScore": 0.212121212121212,
    "costUsd": 5.05,
    "agentWallTimeSec": 3689,
    "steps": 173,
    "inputTokens": 8387891,
    "outputTokens": 93231,
    "cacheTokens": 7968496,
    "cacheHitRate": 95,
    "totalTokens": 8481122,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.684365781710915,
        "inputTokens": 8571957,
        "outputTokens": 75080
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.661290322580645,
        "inputTokens": 4719527,
        "outputTokens": 49977
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.212121212121212,
        "inputTokens": 14964825,
        "outputTokens": 205571
      }
    ]
  },
  {
    "id": "af5216a16f1d1e725b798b216da90479",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "stepfun",
    "hostModelSlug": "stepfun_step-5",
    "agent": "Claude Code",
    "model": "Step 5 Preview",
    "displayLabel": "Claude Code - Step 5 Preview",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.5120452310717793,
    "deepSweScore": 0.619469026548672,
    "sweAtlasScore": 0.583333333333333,
    "terminalBenchScore": 0.333333333333333,
    "costUsd": 1.66,
    "agentWallTimeSec": 3381,
    "steps": 139,
    "inputTokens": 21619803,
    "outputTokens": 126001,
    "cacheTokens": 21366096,
    "cacheHitRate": 98.7,
    "totalTokens": 21745804,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.619469026548672,
        "inputTokens": 26020832,
        "outputTokens": 118669
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.583333333333333,
        "inputTokens": 10364323,
        "outputTokens": 55886
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.333333333333333,
        "inputTokens": 35231367,
        "outputTokens": 270287
      }
    ]
  },
  {
    "id": "cd60470c35fd626a116af80fd5915dfa",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Muse Code 1.0.2 RC",
    "provider": "meta",
    "hostModelSlug": "meta_joyful-jello138",
    "agent": "Muse Code",
    "model": "Muse Spark 1.3 (xhigh)",
    "displayLabel": "Muse Code - Muse Spark 1.3 (xhigh)",
    "creatorName": "Meta",
    "creatorSlug": "meta",
    "creatorColor": "#0089f4",
    "indexScore": 0.482993172759088,
    "deepSweScore": 0.731563421828909,
    "sweAtlasScore": 0.545698924731183,
    "terminalBenchScore": 0.171717171717172,
    "costUsd": 3.47,
    "agentWallTimeSec": 1098,
    "steps": 187,
    "inputTokens": 16091465,
    "outputTokens": 145629,
    "cacheTokens": 15709289,
    "cacheHitRate": 96.6,
    "totalTokens": 16237094,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.731563421828909,
        "inputTokens": 15210161,
        "outputTokens": 78929
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.545698924731183,
        "inputTokens": 3764505,
        "outputTokens": 21519
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.171717171717172,
        "inputTokens": 40760108,
        "outputTokens": 493004
      }
    ]
  },
  {
    "id": "70a5d300021b9986f77d4198272ef1a5",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Grok Build",
    "provider": "xai",
    "hostModelSlug": "xai_grok-4-6-xhigh",
    "agent": "Grok Build",
    "model": "Grok 4.6 (xhigh)",
    "displayLabel": "Grok Build - Grok 4.6 (xhigh)",
    "creatorName": "SpaceXAI",
    "creatorSlug": "xai",
    "creatorColor": "#736cd3",
    "indexScore": 0.4696895205744764,
    "deepSweScore": 0.648967551622419,
    "sweAtlasScore": 0.583333333333333,
    "terminalBenchScore": 0.176767676767677,
    "costUsd": 3.57,
    "agentWallTimeSec": 1167,
    "steps": 112,
    "inputTokens": 5487670,
    "outputTokens": 55955,
    "cacheTokens": 5160617,
    "cacheHitRate": 90.6,
    "totalTokens": 5543625,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.648967551622419,
        "inputTokens": 6323126,
        "outputTokens": 69583
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.583333333333333,
        "inputTokens": 2992096,
        "outputTokens": 26162
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.176767676767677,
        "inputTokens": 8745920,
        "outputTokens": 88597
      }
    ]
  },
  {
    "id": "4d6aa9e9c8df931d54dba5956d94973c",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-beignet-eap-medium",
    "agent": "Claude Code",
    "model": "Sonnet 5.5 (medium)",
    "displayLabel": "Claude Code - Sonnet 5.5 (medium)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.4588397535157457,
    "deepSweScore": 0.654867256637168,
    "sweAtlasScore": 0.448924731182796,
    "terminalBenchScore": 0.272727272727273,
    "costUsd": 0.62,
    "agentWallTimeSec": 511,
    "steps": 22,
    "inputTokens": 1232831,
    "outputTokens": 20521,
    "cacheTokens": 1173805,
    "cacheHitRate": 93.4,
    "totalTokens": 1253351,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.654867256637168,
        "inputTokens": 1089241,
        "outputTokens": 21123
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.448924731182796,
        "inputTokens": 567844,
        "outputTokens": 9186
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.272727272727273,
        "inputTokens": 2728044,
        "outputTokens": 40785
      }
    ]
  },
  {
    "id": "cd4c865dc2f539b650d741fd2ebf7f2d",
    "isDefault": true,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "alibaba_cloud",
    "hostModelSlug": "alibaba_cloud_qwen3-8-max-public",
    "agent": "Claude Code",
    "model": "Qwen3.8 Max",
    "displayLabel": "Claude Code - Qwen3.8 Max",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.43265296412598736,
    "deepSweScore": 0.510324483775811,
    "sweAtlasScore": 0.620967741935484,
    "terminalBenchScore": 0.166666666666667,
    "costUsd": 3.48,
    "agentWallTimeSec": 3784,
    "steps": 110,
    "inputTokens": 8600561,
    "outputTokens": 106333,
    "cacheTokens": 8290830,
    "cacheHitRate": 95.1,
    "totalTokens": 8706894,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.510324483775811,
        "inputTokens": 10307762,
        "outputTokens": 104418
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.620967741935484,
        "inputTokens": 5159228,
        "outputTokens": 45812
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.166666666666667,
        "inputTokens": 12143162,
        "outputTokens": 223316
      }
    ]
  },
  {
    "id": "b3c56ec69185d544992fd578edb75e8c",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_gpt-5-6-luna",
    "agent": "Codex",
    "model": "GPT-5.6 Luna (max)",
    "displayLabel": "Codex - GPT-5.6 Luna (max)",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.4322468668029613,
    "deepSweScore": 0.663716814159292,
    "sweAtlasScore": 0.486559139784946,
    "terminalBenchScore": 0.146464646464646,
    "costUsd": 0.44,
    "agentWallTimeSec": 1412,
    "steps": 122,
    "inputTokens": 14783220,
    "outputTokens": 71305,
    "cacheTokens": 14535766,
    "cacheHitRate": 97.2,
    "totalTokens": 14854525,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.663716814159292,
        "inputTokens": 16195750,
        "outputTokens": 75781
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.486559139784946,
        "inputTokens": 7864729,
        "outputTokens": 31796
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.146464646464646,
        "inputTokens": 25363172,
        "outputTokens": 137870
      }
    ]
  },
  {
    "id": "542590ecc1aa12a718d158565d464daa",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "deepseek",
    "hostModelSlug": "deepseek_deepseek-v4-pro-0813",
    "agent": "Codex",
    "model": "DeepSeek V4 Pro 0813 (max)",
    "displayLabel": "Codex - DeepSeek V4 Pro 0813 (max)",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.4305203524444174,
    "deepSweScore": 0.572271386430678,
    "sweAtlasScore": 0.618279569892473,
    "terminalBenchScore": 0.101010101010101,
    "costUsd": 0.24,
    "agentWallTimeSec": 2418,
    "steps": 138,
    "inputTokens": 24063626,
    "outputTokens": 116482,
    "cacheTokens": 23948932,
    "cacheHitRate": 99,
    "totalTokens": 24180108,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.572271386430678,
        "inputTokens": 21857745,
        "outputTokens": 116677
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.618279569892473,
        "inputTokens": 9901327,
        "outputTokens": 46364
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.101010101010101,
        "inputTokens": 54448315,
        "outputTokens": 247887
      }
    ]
  },
  {
    "id": "e9f9d3ae5b03aa060114dd4b3275d67d",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-beignet-eap-low",
    "agent": "Claude Code",
    "model": "Sonnet 5.5 (low)",
    "displayLabel": "Claude Code - Sonnet 5.5 (low)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.420593075103495,
    "deepSweScore": 0.619469026548673,
    "sweAtlasScore": 0.389784946236559,
    "terminalBenchScore": 0.252525252525253,
    "costUsd": 0.48,
    "agentWallTimeSec": 381,
    "steps": 19,
    "inputTokens": 961481,
    "outputTokens": 15804,
    "cacheTokens": 917183,
    "cacheHitRate": 93.1,
    "totalTokens": 977285,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.619469026548673,
        "inputTokens": 831380,
        "outputTokens": 16104
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.389784946236559,
        "inputTokens": 393558,
        "outputTokens": 6681
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.252525252525253,
        "inputTokens": 2251237,
        "outputTokens": 32428
      }
    ]
  },
  {
    "id": "d1003684d8f29b95a3b14d2a7722221a",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Antigravity SDK v0.1.12",
    "provider": "google",
    "hostModelSlug": "google_skimaki_ai-studio",
    "agent": "Antigravity SDK",
    "model": "Gemini 3.8 Flash (high)",
    "displayLabel": "Antigravity SDK - Gemini 3.8 Flash (high)",
    "creatorName": "Google",
    "creatorSlug": "google",
    "creatorColor": "#34A853",
    "indexScore": 0.4186315529449987,
    "deepSweScore": 0.657817109144543,
    "sweAtlasScore": 0.451612903225807,
    "terminalBenchScore": 0.146464646464646,
    "costUsd": 2.47,
    "agentWallTimeSec": 703,
    "steps": 188,
    "inputTokens": 13395247,
    "outputTokens": 115826,
    "cacheTokens": 11871692,
    "cacheHitRate": 87,
    "totalTokens": 13511073,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.657817109144543,
        "inputTokens": 16400687,
        "outputTokens": 148259
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.451612903225807,
        "inputTokens": 9020407,
        "outputTokens": 58109
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.146464646464646,
        "inputTokens": 16468965,
        "outputTokens": 168737
      }
    ]
  },
  {
    "id": "e52072ed5528ec319d2f8030a2cf63a2",
    "isDefault": true,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-verrine-eap-xhigh",
    "agent": "Claude Code",
    "model": "Haiku 5.5 (xhigh)",
    "displayLabel": "Claude Code - Haiku 5.5 (xhigh)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.414392761951997,
    "deepSweScore": 0.489675516224189,
    "sweAtlasScore": 0.516129032258065,
    "terminalBenchScore": 0.237373737373737,
    "costUsd": 0.61,
    "agentWallTimeSec": 1553,
    "steps": 75,
    "inputTokens": 6891343,
    "outputTokens": 189524,
    "cacheTokens": 6587508,
    "cacheHitRate": 95,
    "totalTokens": 7080866,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.489675516224189,
        "inputTokens": 7390196,
        "outputTokens": 229329
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.516129032258065,
        "inputTokens": 6641845,
        "outputTokens": 119955
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.237373737373737,
        "inputTokens": 6506000,
        "outputTokens": 252076
      }
    ]
  },
  {
    "id": "ac8276cd5d15ac2daacb9956ad44c132",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "openai",
    "hostModelSlug": "openai_gpt-6-luna",
    "agent": "Codex",
    "model": "GPT-6 Luna (max)",
    "displayLabel": "Codex - GPT-6 Luna (max) ({'reasoning_effort': 'max'})",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.4107438934016153,
    "deepSweScore": 0.63716814159292,
    "sweAtlasScore": 0.443548387096774,
    "terminalBenchScore": 0.151515151515152,
    "costUsd": 0.18,
    "agentWallTimeSec": 1286,
    "steps": 89,
    "inputTokens": 10119728,
    "outputTokens": 98341,
    "cacheTokens": 9897313,
    "cacheHitRate": 96.1,
    "totalTokens": 10218069,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.63716814159292,
        "inputTokens": 12385746,
        "outputTokens": 108272
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.443548387096774,
        "inputTokens": 5786510,
        "outputTokens": 53342
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.151515151515152,
        "inputTokens": 14381227,
        "outputTokens": 165884
      }
    ]
  },
  {
    "id": "28ef65135f08f035dc93a97d324fea73",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Codex",
    "provider": "deepseek",
    "hostModelSlug": "deepseek_deepseek-v4-flash-0731",
    "agent": "Codex",
    "model": "DeepSeek V4 Flash 0731 (max)",
    "displayLabel": "Codex - DeepSeek V4 Flash 0731 (max)",
    "creatorName": "OpenAI",
    "creatorSlug": "openai",
    "creatorColor": "#1f1f1f",
    "indexScore": 0.3874247758775307,
    "deepSweScore": 0.542772861356932,
    "sweAtlasScore": 0.513440860215054,
    "terminalBenchScore": 0.106060606060606,
    "costUsd": 0.09,
    "agentWallTimeSec": 1097,
    "steps": 122,
    "inputTokens": 15269826,
    "outputTokens": 80399,
    "cacheTokens": 15142137,
    "cacheHitRate": 98.7,
    "totalTokens": 15350225,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.542772861356932,
        "inputTokens": 18697669,
        "outputTokens": 97092
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.513440860215054,
        "inputTokens": 8160643,
        "outputTokens": 35349
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.106060606060606,
        "inputTokens": 22757591,
        "outputTokens": 136458
      }
    ]
  },
  {
    "id": "69061178d1f87a145d332b38f566b7d0",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-verrine-eap-max",
    "agent": "Claude Code",
    "model": "Haiku 5.5 (max)",
    "displayLabel": "Claude Code - Haiku 5.5 (max)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.3647260981688613,
    "deepSweScore": 0.460176991150442,
    "sweAtlasScore": 0.336021505376344,
    "terminalBenchScore": 0.297979797979798,
    "costUsd": 2.58,
    "agentWallTimeSec": 5226,
    "steps": 121,
    "inputTokens": 12778721,
    "outputTokens": 990295,
    "cacheTokens": 11449044,
    "cacheHitRate": 89.2,
    "totalTokens": 13769015,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.460176991150442,
        "inputTokens": 10729488,
        "outputTokens": 815453
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.336021505376344,
        "inputTokens": 16322891,
        "outputTokens": 1289996
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.297979797979798,
        "inputTokens": 9597462,
        "outputTokens": 723919
      }
    ]
  },
  {
    "id": "da2f03dcda6604f53d83189400698b0a",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-verrine-eap-high",
    "agent": "Claude Code",
    "model": "Haiku 5.5 (high)",
    "displayLabel": "Claude Code - Haiku 5.5 (high)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.350585020439431,
    "deepSweScore": 0.463126843657817,
    "sweAtlasScore": 0.46236559139785,
    "terminalBenchScore": 0.126262626262626,
    "costUsd": 0.36,
    "agentWallTimeSec": 1107,
    "steps": 59,
    "inputTokens": 4970717,
    "outputTokens": 105473,
    "cacheTokens": 4783915,
    "cacheHitRate": 95.6,
    "totalTokens": 5076191,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.463126843657817,
        "inputTokens": 5690127,
        "outputTokens": 127752
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.46236559139785,
        "inputTokens": 4247624,
        "outputTokens": 59719
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.126262626262626,
        "inputTokens": 5097538,
        "outputTokens": 153293
      }
    ]
  },
  {
    "id": "430db5363624407d35b63d80ec863ab6",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-verrine-eap-medium",
    "agent": "Claude Code",
    "model": "Haiku 5.5 (medium)",
    "displayLabel": "Claude Code - Haiku 5.5 (medium)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.33591817883853303,
    "deepSweScore": 0.474926253687316,
    "sweAtlasScore": 0.416666666666667,
    "terminalBenchScore": 0.116161616161616,
    "costUsd": 0.23,
    "agentWallTimeSec": 837,
    "steps": 44,
    "inputTokens": 3413193,
    "outputTokens": 67616,
    "cacheTokens": 3284159,
    "cacheHitRate": 95.5,
    "totalTokens": 3480809,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.474926253687316,
        "inputTokens": 4540302,
        "outputTokens": 87470
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.416666666666667,
        "inputTokens": 2117001,
        "outputTokens": 30954
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.116161616161616,
        "inputTokens": 3918714,
        "outputTokens": 102505
      }
    ]
  },
  {
    "id": "b4a228ec941f485bc4e96489bb773dea",
    "isDefault": false,
    "isHighlighted": false,
    "agentName": "Claude Code",
    "provider": "anthropic",
    "hostModelSlug": "private-anthropic_claude-verrine-eap-low",
    "agent": "Claude Code",
    "model": "Haiku 5.5 (low)",
    "displayLabel": "Claude Code - Haiku 5.5 (low)",
    "creatorName": "Anthropic",
    "creatorSlug": "anthropic",
    "creatorColor": "#cc785c",
    "indexScore": 0.2818428360106922,
    "deepSweScore": 0.454277286135693,
    "sweAtlasScore": 0.330645161290323,
    "terminalBenchScore": 0.0606060606060606,
    "costUsd": 0.14,
    "agentWallTimeSec": 694,
    "steps": 34,
    "inputTokens": 2364249,
    "outputTokens": 48139,
    "cacheTokens": 2267044,
    "cacheHitRate": 94.8,
    "totalTokens": 2412388,
    "evals": [
      {
        "datasetIndexName": "deep-swe-v1.1",
        "evaluationDatasetSlug": "DeepSWE v1.1",
        "refDatasetName": "datacurve/deep-swe-1-1@1",
        "weight": 0.333333333333333,
        "reward": 0.454277286135693,
        "inputTokens": 3401283,
        "outputTokens": 65516
      },
      {
        "datasetIndexName": "swe-atlas-qna",
        "evaluationDatasetSlug": "SWE-Atlas-QnA",
        "refDatasetName": "datasets/swe-atlas-qna",
        "weight": 0.333333333333333,
        "reward": 0.330645161290323,
        "inputTokens": 1040363,
        "outputTokens": 17314
      },
      {
        "datasetIndexName": "terminal-bench-v4",
        "evaluationDatasetSlug": "Terminal-Bench v4",
        "refDatasetName": "terminal-bench/terminal-bench@sha256:39d9f44b40420cde8fdcc087579c0d72a7e14fa3656d603c3f0d22fb35e27732",
        "weight": 0.333333333333333,
        "reward": 0.0606060606060606,
        "inputTokens": 3076023,
        "outputTokens": 76302
      }
    ]
  }
];
