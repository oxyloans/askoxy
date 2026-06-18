import type { RegulatoryFramework } from './engineContext';

export interface UseCase {
  id: string;
  name: string;
  framework: RegulatoryFramework;
  geography: string;
  category: string;
  description: string;
  tags: string[];
  technicalComplexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
}
