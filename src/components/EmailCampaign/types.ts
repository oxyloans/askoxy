export interface UploadResponse {
  success: boolean;
  message: string;
  fileId: string;
  fileName: string;
  chunksStored: number;
  totalChunks: number;
  status: string;
}

export interface PdfRecord {
  success?: boolean;
  message?: string;
  fileId: string;
  fileName: string;
  chunksStored: number | null;
  totalChunks: number | null;
  status: string;
  totalCharacters: number | null;
}

export interface CampaignResponse {
  success: boolean;
  message: string;
  generatedEmail: { subject: string; body: string };
}

export interface BulkCampaignResponse {
  success: boolean;
  message: string;
  totalProcessed?: number;
  successful?: number;
  failed?: number;
}
