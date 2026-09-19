export interface NewsFeedItem {
  paperclipId: string;
  articleName: string;
  fileName?: string | null;
  domain: string | null;
  category: string | null;
  shortSummary: string;
  imageUrl: string | null;
  overallScore: number | null;
  tags: string[];
  createdAt: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CategoryCount {
  domain: string;
  category: string;
  count: number;
}

export interface StakeholderPerspective {
  stakeholder: string;
  headline: string;
  angle: string;
  relevantOpportunities?: string[];
}

export interface Opportunity {
  stars: number;
  reason: string;
  opportunities: string[];
}

export interface OpportunityAssessment {
  revenue: Opportunity;
  partnership: Opportunity;
  sales: Opportunity;
  startup: Opportunity;
  ai: Opportunity;
  investment: Opportunity;
  compliance: Opportunity;
  career: Opportunity;
  overallScore: number;
}

export interface Classification {
  domain: string;
  subDomain: string;
  category: string;
  topic: string;
  industry: string;
  articleType: string;
  businessFunction: string;
  tags: string[];
  confidence: number;
}

export interface Summary {
  shortSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  actionItems: string[];
  shortSummaryHtml?: string | null;
  detailedSummaryHtml?: string | null;
}

export interface Person {
  name: string;
  designation?: string;
  company?: string;
  linkedin?: string;
}

export interface Company {
  name: string;
  website?: string;
  linkedin?: string;
}

export interface Report {
  title: string;
  source?: string;
  downloadUrl?: string;
}

export interface ServiceRecommendation {
  service: string;
  businessImpact: string;
  actionItems: string[];
  priority: string;
}

// Matches PaperclipAnalysisResult on the backend
export interface PaperclipAnalysisResult {
  classification: Classification;
  summary: Summary;
  articleName: string;
  people: Person[];
  companies: Company[];
  reports: Report[];
  serviceRecommendations: ServiceRecommendation[];
  opportunityAssessment: OpportunityAssessment;
  stakeholderPerspectives: StakeholderPerspective[];
  blogUrl?: string; // NEW — this stakeholder's own published blog post URL

}

// Matches PaperclipResponse on the backend — the analysis payload is
// nested under `analysis`, NOT flattened onto this object.
export interface PaperclipDetail {
  paperclipId: string;
  fileName?: string;
  feedback?: string;
  addedBy?: string;
  s3FileUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
  blogUrl?: string;
  blogImageUrl?: string;
  uploadedAt?: string;
  analysis: PaperclipAnalysisResult;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}
export interface RbiPressRelease {
  id: number;
  title: string;
  url: string;
  publishedDate: string | null;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
}

export interface RbiCampaignPressRelease {
  id: string;
  date: number[];
  name: string;
  fileUrl: string;
  enumIs: string;
  pipeline: string;
  type: string;
}

export interface RbiCampaignResponse {
  status: string;
  type: string;
  date: string;
  count: number;
  notifications: RbiCampaignPressRelease[];
}

export interface ExternalNewsArticle {
  id: number;
  url: string;
  title: string;
  sourceName: string;
  category: string | null;
  publishedDate: string | null;
  fetchedAt: string | null;
  content?: string | null;
  imageUrl: string | null;
}