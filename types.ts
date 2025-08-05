export interface MockAbnDataType {
  abn: string;
  entityName: string;
  status: string;
  entityType: string;
  gstRegistered: boolean;
  businessLocation: string;
  registrationDate: string;
  industry: string;
}

export type RedFlagSeverity = 'Critical' | 'Caution';

export interface RedFlag {
  severity: RedFlagSeverity;
  message: string;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High';
