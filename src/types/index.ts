export interface RawPatientRecord {
  'Region Code'?: string | number;
  'Region_Name'?: string;
  'Facility Id'?: string | number;
  'Facility Name'?: string;
  'Patient ID'?: string | number;
  'Patient Name'?: string;
  'Birth Date'?: string | number | Date;
  'patient gender'?: string;
  'Billing Group Desc'?: string;
  'Check in Date'?: string | number | Date;
  'Assign Date'?: string | number | Date;
  'Consultation Date'?: string | number | Date;
  'Check Out Date'?: string | number | Date;
  'Queue Status Desc'?: string;
  'Consult Performed By'?: string;
  'Consult Performed Date'?: string | number | Date;
  [key: string]: any;
}

export interface PatientRecord {
  id: string;
  regionCode: string;
  regionName: string;
  facilityId: string;
  facilityName: string;
  patientId: string;
  patientName: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  ageGroup: 'أطفال (0-14)' | 'شباب (15-35)' | 'بالغين (36-59)' | 'كبار السن (60+)';
  gender: 'ذكر' | 'أنثى' | 'غير محدد';
  billingGroup: string;
  checkInDate: string; // YYYY-MM-DD HH:mm
  assignDate: string; // YYYY-MM-DD HH:mm
  consultationDate: string; // YYYY-MM-DD HH:mm
  checkOutDate: string; // YYYY-MM-DD HH:mm
  queueStatus: string;
  consultPerformedBy: string;
  consultPerformedDate: string;
  
  // Calculated Times (in minutes)
  waitTimeMinutes: number | null; // Assign Date - Check in Date
  consultationTimeMinutes: number | null; // Check Out Date - Consultation Date
  totalTurnaroundMinutes: number | null; // Check Out Date - Check in Date
  checkInHour: number; // 0 - 23
  checkInDay: string; // YYYY-MM-DD
  sourceFile: string;
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  facilityNames: string[];
  regionNames: string[];
  billingGroups: string[];
  queueStatuses: string[];
  genders: string[];
  searchQuery: string;
}

export interface KpiSummary {
  totalPatients: number;
  avgWaitTime: number; // minutes
  avgConsultTime: number; // minutes
  avgTurnaroundTime: number; // minutes
  completedConsultations: number;
  totalCancelled: number;
  totalWaiting: number;
  totalInProgress: number;
  completionRate: number; // %
}

export type ViewMode = 'dashboard' | 'comparison' | 'table';

export type ComparisonType = 'facility' | 'period';

export interface FacilityComparisonItem {
  facilityName: string;
  totalPatients: number;
  avgWaitTime: number;
  avgConsultTime: number;
  completedConsultations: number;
  doctorsCount: number;
}

export interface PeriodComparisonSummary {
  period1Label: string;
  period2Label: string;
  period1Kpis: KpiSummary;
  period2Kpis: KpiSummary;
  kpiVariances: {
    totalPatients: number; // percentage change
    avgWaitTime: number;
    avgConsultTime: number;
    completedConsultations: number;
  };
}

export interface DoctorPerformance {
  doctorName: string;
  facilityName: string;
  completedCount: number;
  avgConsultTime: number;
  avgWaitTime: number;
}
