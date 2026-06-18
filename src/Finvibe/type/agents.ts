  export type AgentStatus = 'waiting' | 'running' | 'completed' | 'failed' | 'awaiting_input';

  export interface AgentInfo {
    step: number;
    name: string;
    label: string;
    description: string;
    callsAI: boolean;
    status: AgentStatus;
    startTime?: string;
    endTime?: string;
    duration?: number;
    outputSummary?: string;
    error?: string;
  }

export interface SSEEvent {
  step: number;
  agent: string;
  status: AgentStatus 
    | 'completed' 
    | 'running' 
    | 'awaiting_user_input' 
    | 'error'
    | 'created'   
    | 'paused'    
    | 'resumed'    
    | 'progress'   
    | 'started';   
  data?: Record<string, unknown>;
  timestamp: string;
  message?: string;
}

  export const AGENT_DEFINITIONS: Omit<AgentInfo, 'status'>[] = [
    { step: 0, name: 'SystemDiscoveryAgent', label: 'System Discovery', description: 'Analyzes your existing core banking system API specification', callsAI: true },
    { step: 1, name: 'BankProfileAgent', label: 'Bank Profile', description: 'Validates and enriches your configuration inputs', callsAI: false },
    { step: 2, name: 'RequirementsIntelligenceAgent', label: 'Requirements Intelligence', description: 'Determines dynamic inputs needed for your specific use case', callsAI: true },
    { step: 3, name: 'UseCaseContextAgent', label: 'Use Case Context', description: 'Builds complete technical specification for the selected use case', callsAI: true },
    { step: 4, name: 'APIResolverAgent', label: 'API Resolver', description: 'Resolves all external government and bureau API configurations', callsAI: false },
    { step: 5, name: 'ComplianceRuleLoaderAgent', label: 'Compliance Rule Loader', description: 'Loads and configures regulatory compliance rules with bank thresholds', callsAI: true },
    { step: 6, name: 'PromptArchitectAgent', label: 'Prompt Architect', description: 'Builds the production AI prompt embedded in generated banking service', callsAI: true },
    { step: 7, name: 'IntermediateRepresentationAgent', label: 'Intermediate Representation', description: 'Produces complete blueprint of every class, method, table, and screen', callsAI: true },
    { step: 8, name: 'BackendCodeGeneratorAgent', label: 'Backend Code Generator', description: 'Generates all Java Spring Boot backend code from the blueprint', callsAI: true },
    { step: 9, name: 'FrontendCodeGeneratorAgent', label: 'Frontend Code Generator', description: 'Generates React TypeScript frontend code and screens', callsAI: true },
    { step: 10, name: 'DatabaseSchemaAgent', label: 'Database Schema', description: 'Generates PostgreSQL migration scripts and JPA entity classes', callsAI: true },
    { step: 11, name: 'TestGeneratorAgent', label: 'Test Generator', description: 'Generates unit tests, integration tests, and compliance tests', callsAI: true },
    { step: 12, name: 'PackageBuilderAgent', label: 'Package Builder', description: 'Assembles all artifacts into a deployable ZIP package', callsAI: false },
  ];
