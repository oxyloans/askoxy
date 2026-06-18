export type RegulatoryFramework = 'CBUAE' | 'RBI' | 'SAMA';
export type BackendStack = 'JAVA_SPRING' | 'NODEJS' | 'PYTHON' | 'DOTNET';
export type FrontendStack = 'REACT_TS' | 'ANGULAR' | 'VUE' | 'NEXTJS';
export type DatabaseType = 'POSTGRESQL' | 'MYSQL' | 'ORACLE' | 'MSSQL' | 'MONGODB';
export type AIProvider = 'CLAUDE' | 'OPENAI' | 'AZURE_OPENAI' | 'GEMINI' | 'GROK' | 'OLLAMA' | 'DEEPSEEK';

// Backend InputType enum values (EngineTypes.java)
export type QuestionType =
  | 'TEXT'
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'BOOLEAN'
  // Backend enum values:
  | 'SELECT'        // = DROPDOWN
  | 'MULTI_SELECT'  // = MULTISELECT
  | 'CURRENCY'
  | 'FILE_UPLOAD'
  | 'DATE'
  // Legacy / frontend-only aliases:
  | 'MULTISELECT'
  | 'DROPDOWN';

export interface ConfigurationQuestion {
  questionId: string;
  questionText: string;
  /** Backend serializes this field as `inputType`. Frontend may also use `type`. */
  inputType?: QuestionType;
  type?: QuestionType;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  options?: string[];
  /** Backend sends validationRules.min — mapped to min */
  min?: number;
  /** Backend sends validationRules.max — mapped to max */
  max?: number;
  validationRules?: { min?: number; max?: number; [key: string]: unknown };
  helpText?: string;
  regulatoryBasis?: string;
  category?: string;
  affectsCompliance?: boolean;
  complianceRuleIds?: string[];
}

export interface RequiredDocument {
  documentId: string;
  name: string;
  mandatory: boolean;
  category: 'IDENTITY' | 'INCOME' | 'EMPLOYMENT' | 'FINANCIAL' | 'PROPERTY' | 'BUSINESS' | 'COMPLIANCE' | 'OTHER';
  acceptedFormats: string[];
  description: string;
  maxSizeKB?: number;
  regulatoryBasis?: string;
}

export interface RequiredDataSignal {
  signalId: string;
  name: string;
  source: string;
  type: 'API' | 'DATABASE' | 'MANUAL' | 'CALCULATED';
  mandatory: boolean;
  description: string;
}

export interface BankProfile {
  bankName: string;
  regulatoryFramework: RegulatoryFramework;
  geography: string;
  backendStack: BackendStack;
  frontendStack: FrontendStack;
  databaseType: DatabaseType;
  aiProvider: AIProvider;
  aiModelId: string;
  existingServices: string[];
  systemApiSpecFile?: string;
}

export interface UseCaseSpec {
  useCaseId: string;
  useCaseName: string;
  category: string;
  description: string;
  technicalComplexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  estimatedSetupMinutes: number;
  requiredIntegrations: string[];
}

export interface APIEndpointConfig {
  apiId: string;
  name: string;
  provider: string;
  baseUrl: string;
  authType: 'API_KEY' | 'OAUTH2' | 'BASIC' | 'JWT' | 'NONE';
  endpoints: {
    path: string;
    method: string;
    purpose: string;
  }[];
  sandboxUrl?: string;
  documentationUrl?: string;
}

export interface ComplianceRule {
  ruleId: string;
  framework: RegulatoryFramework;
  category: string;
  description: string;
  threshold?: number;
  unit?: string;
  mandatory: boolean;
  bankOverride?: number;
}

export interface GeneratedPrompt {
  systemPrompt: string;
  contextSchema: Record<string, string>;
  outputFormat: string;
  exampleInput?: string;
  exampleOutput?: string;
}

export interface IREntity {
  entityId: string;
  name: string;
  type: 'CLASS' | 'ENTITY' | 'SERVICE' | 'CONTROLLER' | 'REPOSITORY' | 'DTO' | 'ENUM';
  package?: string;
  fields?: IRField[];
  methods?: IRMethod[];
}

export interface IRField {
  name: string;
  type: string;
  nullable: boolean;
  constraints?: string[];
  jpaAnnotations?: string[];
}

export interface IRMethod {
  name: string;
  returnType: string;
  parameters: string[];
  annotations?: string[];
  description: string;
}

export interface IRScreen {
  screenId: string;
  name: string;
  route: string;
  components: string[];
  apiCalls: string[];
}

export interface IntermediateRepresentation {
  entities: IREntity[];
  services: IREntity[];
  controllers: IREntity[];
  repositories: IREntity[];
  dtos: IREntity[];
  screens: IRScreen[];
  databaseTables: IRDatabaseTable[];
}

export interface IRDatabaseTable {
  tableName: string;
  columns: IRColumn[];
  indexes?: string[];
  foreignKeys?: string[];
}

export interface IRColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  defaultValue?: string;
}

export interface GeneratedArtifact {
  artifactId: string;
  type: 'BACKEND' | 'FRONTEND' | 'DATABASE' | 'TEST' | 'CONFIG' | 'DOCUMENTATION';
  path: string;
  filename: string;
  description: string;
  sizeBytes?: number;
  linesOfCode?: number;
}

export interface PackageManifest {
  packageId: string;
  sessionId: string;
  useCaseId: string;
  bankName: string;
  framework: RegulatoryFramework;
  generatedAt: string;
  totalFiles: number;
  totalSizeBytes: number;
  estimatedSetupMinutes: number;
  artifacts: GeneratedArtifact[];
  downloadUrl: string;
}

export interface EngineContext {
  // Core identity
  sessionId: string;
  runId: string;
  createdAt: string;
  status: 'RUNNING' | 'AWAITING_INPUT' | 'COMPLETED' | 'FAILED';

  // Stage 1 inputs
  bankProfile: BankProfile;

  // Stage 1 AI outputs
  useCaseSpec?: UseCaseSpec;
  systemApiAnalysis?: {
    detectedServices: string[];
    suggestedMappings: Record<string, string>;
    apiVersion: string;
  };

  // Stage 2 dynamic inputs
  configurationQuestions?: ConfigurationQuestion[];
  requiredDocuments?: RequiredDocument[];
  requiredDataSignals?: RequiredDataSignal[];
  userAnswers?: Record<string, string | number | boolean | string[]>;

  // Agent outputs
  resolvedAPIs?: APIEndpointConfig[];
  complianceRules?: ComplianceRule[];
  generatedPrompt?: GeneratedPrompt;
  intermediateRepresentation?: IntermediateRepresentation;
  packageManifest?: PackageManifest;

  // Error tracking
  errors?: { step: number; agent: string; message: string; timestamp: string }[];
}
