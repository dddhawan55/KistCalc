import React from 'react';
import { CalculationResult } from '../types/calculator';
import { Language, translations } from '../utils/translations';
import { formatINR, numberToIndianWords } from '../utils/loanCalculations';
import {
  CreditCard,
  TrendingDown,
  Coins,
  PieChart,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

interface SummaryCardsProps {
  language: Language;
  result: CalculationResult;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ language, result }) => {
  const t = translations[language];
  const isFixedPrincipal = result.method === 'fixed_principal';

  return (
    <div className="space-y-4 mb-6">
      {/* 4 Primary Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Monthly EMI */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isFixedPrincipal
                ? language === 'hi'
                  ? 'पहले महीने की किस्त (1st Month)'
                  : '1st Month Payment'
                : t.summaryEmi}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {formatINR(isFixedPrincipal ? result.firstMonthEMI : result.monthlyEMI)}
          </div>

          <div className="text-xs text-slate-500 mt-1">
            {isFixedPrincipal ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" />
                {language === 'hi'
                  ? `आखिरी महीने में ₹${formatINR(result.lastMonthEMI)} रह जाएगी`
                  : `Drops to ${formatINR(result.lastMonthEMI)} in last month`}
              </span>
            ) : (
              <span>
                {language === 'hi'
                  ? `कुल ${result.totalMonths} महीने तक देय`
                  : `Payable for ${result.totalMonths} months`}
              </span>
            )}
          </div>
        </div>

        {/* CARD 2: Total Interest */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.summaryTotalInterest}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-900 tabular-nums">
            {formatINR(result.totalInterest)}
          </div>

          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{numberToIndianWords(result.totalInterest)}</span>
            <span className="font-semibold text-amber-800 tabular-nums">
              {result.interestPercentage.toFixed(1)}% {language === 'hi' ? 'ब्याज' : 'interest'}
            </span>
          </div>
        </div>

        {/* CARD 3: Total Payable Amount */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.summaryTotalPayable}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {formatINR(result.totalPayable)}
          </div>

          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{numberToIndianWords(result.totalPayable)}</span>
            <span className="text-slate-600">
              {language === 'hi' ? 'मूलधन + ब्याज' : 'P + Interest'}
            </span>
          </div>
        </div>

        {/* CARD 4: Split & Effective Rate */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {result.method === 'flat' && result.effectiveAPR
                ? t.summaryEffectiveApr
                : language === 'hi'
                ? 'मूलधन व ब्याज का अनुपात'
                : 'Principal vs Interest'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>

          {result.method === 'flat' && result.effectiveAPR ? (
            <>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-700 tabular-nums">
                {result.effectiveAPR}%{' '}
                <span className="text-xs font-medium text-slate-500">APR</span>
              </div>
              <div className="text-xs text-rose-800 mt-1 leading-snug font-medium">
                {language === 'hi'
                  ? `फ्लैट दर ${result.annualRatePercent}% असल में ${result.effectiveAPR}% घटते ब्याज के बराबर है!`
                  : `Flat ${result.annualRatePercent}% equals ${result.effectiveAPR}% reducing APR!`}
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-bold text-slate-900 flex items-center justify-between tabular-nums">
                <span className="text-emerald-700">
                  {result.principalPercentage.toFixed(0)}%
                </span>
                <span className="text-xs text-slate-400 font-normal">vs</span>
                <span className="text-amber-700">
                  {result.interestPercentage.toFixed(0)}%
                </span>
              </div>

              {/* Progress split bar */}
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden flex my-2">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${result.principalPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-emerald-800 font-medium">
                  {language === 'hi' ? 'मूलधन' : 'Principal'}
                </span>
                <span className="text-amber-800 font-medium">
                  {language === 'hi' ? 'ब्याज' : 'Interest'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bonus Savings Banner for Fixed Principal */}
      {isFixedPrincipal && result.savingsVsFlat && result.savingsVsFlat > 0 && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between gap-4 text-emerald-950">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900">
                {language === 'hi' ? 'ब्याज में भारी बचत!' : 'Massive Interest Savings!'}
              </span>{' '}
              {language === 'hi'
                ? `इस तरीके में आप फ्लैट ब्याज के मुकाबले लगभग `
                : `By paying fixed principal each month, you save `}
              <strong className="text-emerald-900 font-bold tabular-nums">
                {formatINR(result.savingsVsFlat)}
              </strong>{' '}
              {language === 'hi' ? `रुपये बचा रहे हैं!` : `compared to flat rate!`}
            </div>
          </div>
          <div className="hidden sm:block text-xs font-semibold text-emerald-800 bg-white px-3 py-1 rounded-md border border-emerald-200 shrink-0">
            {language === 'hi' ? 'स्मार्ट रीपेमेंट' : 'Smart Repayment'}
          </div>
        </div>
      )}
    </div>
  );
};
