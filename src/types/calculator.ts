export type CalculationMethod = 'reducing' | 'flat' | 'fixed_principal';

export type TargetField = 'emi' | 'principal' | 'tenure' | 'rate';

export type RateType = 'yearly' | 'monthly';
export type TenureType = 'years' | 'months';

export interface OneTimePrepayment {
  id: string;
  month: number;
  amount: number;
}

export interface RecurringPrepayment {
  type: 'monthly' | 'yearly';
  amount: number;
  startMonth?: number;
}

export interface PrepaymentConfig {
  enabled: boolean;
  oneTime: OneTimePrepayment[];
  recurring?: RecurringPrepayment;
}

export interface PrepaymentImpact {
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  originalMonths: number;
  newMonths: number;
  monthsSaved: number;
  totalPrepaid: number;
  payoffMonth: number;
}

export interface LoanInputState {
  principal: number;
  annualRate: number; // yearly percentage e.g. 10.5
  monthlyRate: number; // monthly percentage e.g. 0.875
  rateType: RateType; // which one user is editing
  tenureMonths: number; // always canonical in months
  tenureYears: number;
  tenureType: TenureType;
  emi: number;
  fixedMonthlyPrincipal?: number; // for method 3
  targetToCalculate: TargetField;
  prepayment: PrepaymentConfig;
}

export interface MonthScheduleItem {
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  prepaymentPaid?: number; // extra principal paid this month
  closingBalance: number;
  totalInterestPaidToDate: number;
  totalPrincipalPaidToDate: number;
}

export interface YearScheduleItem {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  closingBalance: number;
  months: MonthScheduleItem[];
}

export interface CalculationResult {
  method: CalculationMethod;
  principal: number;
  monthlyEMI: number; // for fixed principal, this is month 1 or average
  firstMonthEMI: number;
  lastMonthEMI: number;
  averageEMI: number;
  totalInterest: number;
  totalPayable: number;
  interestPercentage: number;
  principalPercentage: number;
  monthlyRatePercent: number;
  annualRatePercent: number;
  totalMonths: number;
  schedule: MonthScheduleItem[];
  yearlySchedule: YearScheduleItem[];
  effectiveAPR?: number; // for flat rate comparison
  savingsVsFlat?: number;
  prepaymentImpact?: PrepaymentImpact;
}
