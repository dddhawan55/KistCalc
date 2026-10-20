import {
  CalculationMethod,
  CalculationResult,
  MonthScheduleItem,
  YearScheduleItem,
  PrepaymentConfig,
  PrepaymentImpact,
} from '../types/calculator';

/**
 * Format number into Indian Rupee format (e.g. ₹ 5,00,000)
 */
export function formatINR(val: number, includeDecimals = false): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  const rounded = Math.round(val * 100) / 100;
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);

  const parts = absVal.toFixed(includeDecimals ? 2 : 0).split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const res = parts.length > 1 && includeDecimals ? `${formattedInt}.${parts[1]}` : formattedInt;
  return `${isNegative ? '-' : ''}₹${res}`;
}

/**
 * Format in Indian Words (Lakhs, Crores, Thousands)
 */
export function numberToIndianWords(amount: number): string {
  if (amount <= 0 || isNaN(amount)) return '';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${cr.toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `${lk.toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `${k.toFixed(1)} Thousand`;
  }
  return `${Math.round(amount)}`;
}

/**
 * Reducing Balance Calculation (Standard Banking Amortization)
 * Supports one-time and recurring prepayments
 */
export function calculateReducing(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  prepaymentConfig?: PrepaymentConfig
): CalculationResult {
  const p = Math.max(0, principal);
  const r = annualRate > 0 ? annualRate / (12 * 100) : 0;
  const n = Math.max(1, Math.round(tenureMonths));

  let emi = 0;
  if (r === 0) {
    emi = p / n;
  } else {
    const factor = Math.pow(1 + r, n);
    emi = (p * r * factor) / (factor - 1);
  }

  // Baseline without prepayments for comparative impact
  let baseBal = p;
  let originalTotalInterest = 0;
  for (let m = 1; m <= n; m++) {
    const it = baseBal * r;
    let pr = emi - it;
    if (m === n || pr > baseBal) pr = baseBal;
    baseBal = Math.max(0, baseBal - pr);
    originalTotalInterest += it;
    if (baseBal <= 0) break;
  }

  const schedule: MonthScheduleItem[] = [];
  let currentBalance = p;
  let cumInterest = 0;
  let cumPrincipal = 0;
  let totalPrepaid = 0;

  const hasPrepayments =
    prepaymentConfig &&
    prepaymentConfig.enabled &&
    (prepaymentConfig.oneTime.length > 0 ||
      (prepaymentConfig.recurring && prepaymentConfig.recurring.amount > 0));

  for (let m = 1; m <= n && currentBalance > 0.01; m++) {
    const openingBalance = currentBalance;
    const interest = openingBalance * r;
    let standardPrincipal = emi - interest;

    // Check for prepayment in month m
    let extraPrepayment = 0;
    if (hasPrepayments) {
      // 1. One-time prepayments
      const oneTimeMatches = prepaymentConfig.oneTime.filter((o) => o.month === m);
      for (const ot of oneTimeMatches) {
        extraPrepayment += ot.amount;
      }
      // 2. Recurring prepayments
      if (prepaymentConfig.recurring && prepaymentConfig.recurring.amount > 0) {
        const start = prepaymentConfig.recurring.startMonth || 1;
        if (m >= start) {
          if (prepaymentConfig.recurring.type === 'monthly') {
            extraPrepayment += prepaymentConfig.recurring.amount;
          } else if (prepaymentConfig.recurring.type === 'yearly' && m % 12 === 0) {
            extraPrepayment += prepaymentConfig.recurring.amount;
          }
        }
      }
    }

    let principalPaid = standardPrincipal + extraPrepayment;
    let actualPrepaymentPaid = extraPrepayment;

    // Final month or overpayment cap
    if (principalPaid >= openingBalance) {
      principalPaid = openingBalance;
      if (standardPrincipal >= openingBalance) {
        actualPrepaymentPaid = 0;
      } else {
        actualPrepaymentPaid = openingBalance - standardPrincipal;
      }
      currentBalance = 0;
    } else {
      currentBalance -= principalPaid;
    }

    totalPrepaid += actualPrepaymentPaid;
    cumInterest += interest;
    cumPrincipal += principalPaid;

    const actualEmi = principalPaid + interest;

    schedule.push({
      month: m,
      openingBalance,
      emi: actualEmi,
      principalPaid,
      interestPaid: interest,
      prepaymentPaid: actualPrepaymentPaid > 0 ? Math.round(actualPrepaymentPaid) : undefined,
      closingBalance: Math.max(0, currentBalance),
      totalInterestPaidToDate: cumInterest,
      totalPrincipalPaidToDate: cumPrincipal,
    });
  }

  const totalInterest = schedule.reduce((sum, item) => sum + item.interestPaid, 0);
  const totalPayable = p + totalInterest;

  let prepaymentImpact: PrepaymentImpact | undefined = undefined;
  if (hasPrepayments) {
    const newMonths = schedule.length;
    const monthsSaved = Math.max(0, n - newMonths);
    const interestSaved = Math.max(0, originalTotalInterest - totalInterest);
    prepaymentImpact = {
      originalTotalInterest: Math.round(originalTotalInterest),
      newTotalInterest: Math.round(totalInterest),
      interestSaved: Math.round(interestSaved),
      originalMonths: n,
      newMonths,
      monthsSaved,
      totalPrepaid: Math.round(totalPrepaid),
      payoffMonth: newMonths,
    };
  }

  return {
    method: 'reducing',
    principal: p,
    monthlyEMI: Math.round(emi),
    firstMonthEMI: Math.round(schedule[0]?.emi || emi),
    lastMonthEMI: Math.round(schedule[schedule.length - 1]?.emi || emi),
    averageEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
    interestPercentage: totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0,
    principalPercentage: totalPayable > 0 ? (p / totalPayable) * 100 : 0,
    monthlyRatePercent: annualRate / 12,
    annualRatePercent: annualRate,
    totalMonths: schedule.length,
    schedule,
    yearlySchedule: groupScheduleByYear(schedule),
    prepaymentImpact,
  };
}

/**
 * Flat Interest Rate Calculation
 */
export function calculateFlat(
  principal: number,
  annualRate: number,
  tenureMonths: number
): CalculationResult {
  const p = Math.max(0, principal);
  const n = Math.max(1, Math.round(tenureMonths));
  const years = n / 12;

  // Flat Interest = P * (R / 100) * (T in years)
  const totalInterest = p * (annualRate / 100) * years;
  const totalPayable = p + totalInterest;
  const emi = totalPayable / n;

  const monthlyPrincipal = p / n;
  const monthlyInterest = totalInterest / n;

  const schedule: MonthScheduleItem[] = [];
  let currentBalance = p;
  let cumInterest = 0;
  let cumPrincipal = 0;

  for (let m = 1; m <= n; m++) {
    const opening = currentBalance;
    currentBalance = Math.max(0, currentBalance - monthlyPrincipal);
    cumInterest += monthlyInterest;
    cumPrincipal += monthlyPrincipal;

    schedule.push({
      month: m,
      openingBalance: opening,
      emi,
      principalPaid: monthlyPrincipal,
      interestPaid: monthlyInterest,
      closingBalance: currentBalance,
      totalInterestPaidToDate: cumInterest,
      totalPrincipalPaidToDate: cumPrincipal,
    });
  }

  // Calculate approximate effective reducing APR equivalent
  // Rule of thumb / accurate solver: Flat rate is nearly 1.8x reducing rate
  let effectiveAPR = annualRate;
  if (p > 0 && n > 1) {
    const solvedRate = solveRateFromEMI(p, emi, n, 'reducing');
    effectiveAPR = Math.round(solvedRate * 100) / 100;
  }

  return {
    method: 'flat',
    principal: p,
    monthlyEMI: Math.round(emi),
    firstMonthEMI: Math.round(emi),
    lastMonthEMI: Math.round(emi),
    averageEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
    interestPercentage: totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0,
    principalPercentage: totalPayable > 0 ? (p / totalPayable) * 100 : 0,
    monthlyRatePercent: annualRate / 12,
    annualRatePercent: annualRate,
    totalMonths: n,
    schedule,
    yearlySchedule: groupScheduleByYear(schedule),
    effectiveAPR,
  };
}

/**
 * Fixed Principal per Month + Reducing Interest Calculation
 * (महीने का फिक्स्ड मूलधन + घटता हुआ ब्याज)
 */
export function calculateFixedPrincipal(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  customFixedMonthlyPrincipal?: number
): CalculationResult {
  const p = Math.max(0, principal);
  const r = annualRate > 0 ? annualRate / (12 * 100) : 0;
  const n = Math.max(1, Math.round(tenureMonths));

  const monthlyPrincipal =
    customFixedMonthlyPrincipal && customFixedMonthlyPrincipal > 0
      ? customFixedMonthlyPrincipal
      : p / n;

  const schedule: MonthScheduleItem[] = [];
  let currentBalance = p;
  let cumInterest = 0;
  let cumPrincipal = 0;

  let actualMonths = 0;
  while (currentBalance > 0.01 && actualMonths < 1200) {
    actualMonths++;
    const opening = currentBalance;
    const interest = opening * r;

    let principalPaid = monthlyPrincipal;
    if (principalPaid > opening) {
      principalPaid = opening;
    }

    currentBalance = Math.max(0, currentBalance - principalPaid);
    cumInterest += interest;
    cumPrincipal += principalPaid;

    schedule.push({
      month: actualMonths,
      openingBalance: opening,
      emi: principalPaid + interest,
      principalPaid,
      interestPaid: interest,
      closingBalance: currentBalance,
      totalInterestPaidToDate: cumInterest,
      totalPrincipalPaidToDate: cumPrincipal,
    });
  }

  const totalInterest = cumInterest;
  const totalPayable = p + totalInterest;
  const firstEMI = schedule[0]?.emi || 0;
  const lastEMI = schedule[schedule.length - 1]?.emi || 0;
  const averageEMI = schedule.length > 0 ? totalPayable / schedule.length : 0;

  // Compare with Flat to show savings
  const flatComp = calculateFlat(p, annualRate, schedule.length || n);
  const savingsVsFlat = Math.max(0, flatComp.totalInterest - totalInterest);

  return {
    method: 'fixed_principal',
    principal: p,
    monthlyEMI: Math.round(averageEMI),
    firstMonthEMI: Math.round(firstEMI),
    lastMonthEMI: Math.round(lastEMI),
    averageEMI: Math.round(averageEMI),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
    interestPercentage: totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0,
    principalPercentage: totalPayable > 0 ? (p / totalPayable) * 100 : 0,
    monthlyRatePercent: annualRate / 12,
    annualRatePercent: annualRate,
    totalMonths: schedule.length,
    schedule,
    yearlySchedule: groupScheduleByYear(schedule),
    savingsVsFlat: Math.round(savingsVsFlat),
  };
}

/**
 * Group monthly schedule into calendar years
 */
function groupScheduleByYear(schedule: MonthScheduleItem[]): YearScheduleItem[] {
  const years: YearScheduleItem[] = [];
  let currentYearMonths: MonthScheduleItem[] = [];
  let currentYearNumber = 1;

  for (let i = 0; i < schedule.length; i++) {
    currentYearMonths.push(schedule[i]);
    const isYearEnd = currentYearMonths.length === 12 || i === schedule.length - 1;

    if (isYearEnd) {
      const principalPaid = currentYearMonths.reduce((s, m) => s + m.principalPaid, 0);
      const interestPaid = currentYearMonths.reduce((s, m) => s + m.interestPaid, 0);
      const totalPayment = currentYearMonths.reduce((s, m) => s + m.emi, 0);
      const closingBalance = currentYearMonths[currentYearMonths.length - 1].closingBalance;

      years.push({
        year: currentYearNumber,
        principalPaid: Math.round(principalPaid),
        interestPaid: Math.round(interestPaid),
        totalPayment: Math.round(totalPayment),
        closingBalance: Math.round(closingBalance),
        months: [...currentYearMonths],
      });

      currentYearNumber++;
      currentYearMonths = [];
    }
  }

  return years;
}

// -------------------------------------------------------------
// REVERSE SOLVERS
// -------------------------------------------------------------

/**
 * Solve Principal from EMI, Rate, Tenure
 */
export function solvePrincipalFromEMI(
  emi: number,
  annualRate: number,
  tenureMonths: number,
  method: CalculationMethod = 'reducing'
): number {
  if (emi <= 0 || tenureMonths <= 0) return 0;
  const n = tenureMonths;

  if (method === 'flat') {
    // E = P * (1 + (R/100)*(n/12)) / n
    // P = E * n / (1 + (R/100)*(n/12))
    const factor = 1 + (annualRate / 100) * (n / 12);
    return Math.round((emi * n) / factor);
  }

  if (method === 'fixed_principal') {
    // Average EMI is E. In fixed principal: Total Interest = P * r * (n+1) / 2
    // Total Payable = P + P*r*(n+1)/2 = P * [1 + r*(n+1)/2]
    // Average EMI = Total Payable / n = P/n * [1 + r*(n+1)/2]
    // P = (E * n) / [1 + r*(n+1)/2]
    const r = annualRate / (12 * 100);
    const denominator = 1 + (r * (n + 1)) / 2;
    return Math.round((emi * n) / denominator);
  }

  // Reducing Balance:
  // E = P * r * (1+r)^n / ((1+r)^n - 1)
  // P = E * ((1+r)^n - 1) / (r * (1+r)^n)
  const r = annualRate > 0 ? annualRate / (12 * 100) : 0;
  if (r === 0) return Math.round(emi * n);

  const factor = Math.pow(1 + r, n);
  const p = (emi * (factor - 1)) / (r * factor);
  return Math.round(p);
}

/**
 * Solve Tenure in months from Principal, Rate, EMI
 */
export function solveTenureFromEMI(
  principal: number,
  annualRate: number,
  emi: number,
  method: CalculationMethod = 'reducing'
): { months: number; isValid: boolean; minRequiredEmi?: number } {
  if (principal <= 0 || emi <= 0) return { months: 12, isValid: false };

  const r = annualRate > 0 ? annualRate / (12 * 100) : 0;
  const minRequiredMonthlyInterest = principal * r;

  if (method === 'flat') {
    // E * n = P + P * (R/100)*(n/12)
    // n * [E - P * R / 1200] = P
    const interestPerMonth = (principal * annualRate) / 1200;
    if (emi <= interestPerMonth) {
      return {
        months: 0,
        isValid: false,
        minRequiredEmi: Math.ceil(interestPerMonth + 1),
      };
    }
    const n = principal / (emi - interestPerMonth);
    return { months: Math.max(1, Math.round(n)), isValid: true };
  }

  // Reducing Balance:
  // If EMI <= monthly interest, loan will never finish!
  if (r > 0 && emi <= minRequiredMonthlyInterest) {
    return {
      months: 0,
      isValid: false,
      minRequiredEmi: Math.ceil(minRequiredMonthlyInterest + 1),
    };
  }

  if (r === 0) {
    return { months: Math.max(1, Math.round(principal / emi)), isValid: true };
  }

  // Formula: n = [ln(E) - ln(E - P*r)] / ln(1+r)
  const n = (Math.log(emi) - Math.log(emi - principal * r)) / Math.log(1 + r);
  return { months: Math.max(1, Math.round(n)), isValid: true };
}

/**
 * Solve Interest Rate from Principal, EMI, Tenure
 */
export function solveRateFromEMI(
  principal: number,
  emi: number,
  tenureMonths: number,
  method: CalculationMethod = 'reducing'
): number {
  if (principal <= 0 || emi <= 0 || tenureMonths <= 0) return 10;
  const totalPaid = emi * tenureMonths;
  if (totalPaid <= principal) return 0; // 0% interest

  if (method === 'flat') {
    // Total Interest = totalPaid - P
    // Flat Rate = (Total Interest * 1200) / (P * n)
    const totalInterest = totalPaid - principal;
    const rate = (totalInterest * 1200) / (principal * tenureMonths);
    return Math.round(rate * 100) / 100;
  }

  // Newton-Raphson / Bisection solver for reducing balance interest rate
  let low = 0.0001; // 0.01%
  let high = 1.0; // 100% per month = 1200% per year
  const n = tenureMonths;

  for (let iter = 0; iter < 40; iter++) {
    const mid = (low + high) / 2;
    const factor = Math.pow(1 + mid, n);
    const calculatedEmi = (principal * mid * factor) / (factor - 1);

    if (Math.abs(calculatedEmi - emi) < 0.01) {
      return Math.round(mid * 12 * 100 * 100) / 100;
    }

    if (calculatedEmi > emi) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(((low + high) / 2) * 12 * 100 * 100) / 100;
}
