import React from 'react';
import { Language, translations } from '../utils/translations';
import {
  calculateFlat,
  calculateReducing,
  calculateFixedPrincipal,
  formatINR,
} from '../utils/loanCalculations';
import { CheckCircle2, AlertTriangle, TrendingDown, Layers, ArrowDownRight, Award } from 'lucide-react';

interface ComparisonViewProps {
  language: Language;
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  language,
  principal,
  annualRate,
  tenureMonths,
}) => {
  const t = translations[language];

  // Compute results for all 3 methods with same inputs
  const reducing = calculateReducing(principal, annualRate, tenureMonths);
  const flat = calculateFlat(principal, annualRate, tenureMonths);
  const fixed = calculateFixedPrincipal(principal, annualRate, tenureMonths);

  // Maximum interest among them for relative bar sizing
  const maxInterest = Math.max(flat.totalInterest, reducing.totalInterest, fixed.totalInterest, 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      <div className="border-b border-slate-200 pb-4 mb-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>{language === 'hi' ? 'तीनों तरीकों की आमने-सामने तुलना' : 'Side-by-Side Method Comparison'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'hi'
            ? `मूलधन: ${formatINR(principal)} | ब्याज दर: ${annualRate}% वार्षिक | अवधि: ${tenureMonths} माह`
            : `Principal: ${formatINR(principal)} | Rate: ${annualRate}% p.a. | Tenure: ${tenureMonths} months`}
        </p>
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* METHOD 1: REDUCING RATE */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'hi' ? '1. घटता ब्याज दर' : '1. Reducing Rate'}</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                {language === 'hi' ? 'बैंक मानक' : 'Bank Standard'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              {language === 'hi'
                ? 'किस्त हर महीने समान रहती है, ब्याज केवल बाकी मूलधन पर लगता है।'
                : 'Equal monthly EMI throughout, interest charged only on remaining principal.'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'मासिक ईएमआई:' : 'Monthly EMI:'}</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(reducing.monthlyEMI)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'कुल ब्याज:' : 'Total Interest:'}</span>
                <span className="text-base font-bold text-amber-900 tabular-nums">{formatINR(reducing.totalInterest)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'कुल भुगतान:' : 'Total Payable:'}</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">{formatINR(reducing.totalPayable)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'वास्तविक दर (APR):' : 'Effective APR:'}</span>
                <span className="font-semibold text-slate-800 tabular-nums">{annualRate}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {language === 'hi'
                ? `फ्लैट से ₹${formatINR(flat.totalInterest - reducing.totalInterest)} कम ब्याज`
                : `Saves ${formatINR(flat.totalInterest - reducing.totalInterest)} vs Flat`}
            </span>
          </div>
        </div>

        {/* METHOD 2: FLAT RATE */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'hi' ? '2. फ्लैट ब्याज दर' : '2. Flat Rate'}</span>
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-100 font-semibold px-2 py-0.5 rounded">
                {language === 'hi' ? 'महंगा विकल्प' : 'High APR'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              {language === 'hi'
                ? 'पूरे लोन तक पूरे मूलधन पर ब्याज लगता है, इसलिए असल में बहुत महंगा है।'
                : 'Interest charged on starting principal for full term; high real APR.'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'मासिक ईएमआई:' : 'Monthly EMI:'}</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(flat.monthlyEMI)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'कुल ब्याज:' : 'Total Interest:'}</span>
                <span className="text-base font-bold text-rose-700 tabular-nums">{formatINR(flat.totalInterest)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'कुल भुगतान:' : 'Total Payable:'}</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">{formatINR(flat.totalPayable)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'वास्तविक दर (APR):' : 'Effective APR:'}</span>
                <span className="font-bold text-rose-700 tabular-nums">{flat.effectiveAPR}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-rose-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>
              {language === 'hi'
                ? `फ्लैट दिखने में ${annualRate}% पर असल में ${flat.effectiveAPR}% है!`
                : `Flat ${annualRate}% costs equivalent to ${flat.effectiveAPR}% APR!`}
            </span>
          </div>
        </div>

        {/* METHOD 3: FIXED PRINCIPAL + REDUCING INTEREST */}
        <div className="rounded-xl border border-sky-300 bg-sky-50/30 p-4 flex flex-col justify-between relative ring-1 ring-sky-400/40">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wide flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'hi' ? '3. फिक्स्ड मूलधन' : '3. Fixed Principal'}</span>
              </span>
              <span className="text-[10px] text-sky-800 bg-sky-100 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3 h-3 text-sky-600" />
                <span>{language === 'hi' ? 'सबसे कम ब्याज' : 'Best Savings'}</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              {language === 'hi'
                ? 'हर महीने मूलधन बराबर कटता है और ब्याज घटता जाता है। ईएमआई हर महीने घटती है।'
                : 'Equal principal repaid monthly; interest diminishes every month.'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">
                  {language === 'hi' ? 'किस्त (1st माह ➔ अंतिम माह):' : 'Payment (1st Mo ➔ Last Mo):'}
                </span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {formatINR(fixed.firstMonthEMI)}{' '}
                  <span className="text-xs font-normal text-slate-500">➔</span>{' '}
                  {formatINR(fixed.lastMonthEMI)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'कुल ब्याज:' : 'Total Interest:'}</span>
                <span className="text-base font-bold text-emerald-800 tabular-nums">{formatINR(fixed.totalInterest)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'कुल भुगतान:' : 'Total Payable:'}</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">{formatINR(fixed.totalPayable)}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">{language === 'hi' ? 'ब्याज में बचत (vs Flat):' : 'Savings vs Flat:'}</span>
                <span className="font-bold text-emerald-800 tabular-nums">{formatINR(flat.totalInterest - fixed.totalInterest)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-sky-200 text-[11px] text-sky-900 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-700 shrink-0" />
            <span>
              {language === 'hi'
                ? `घटते ब्याज वाले लोन से भी ₹${formatINR(reducing.totalInterest - fixed.totalInterest)} कम ब्याज!`
                : `Saves ${formatINR(reducing.totalInterest - fixed.totalInterest)} even compared to bank reducing EMI!`}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Comparative Interest Bars */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          {language === 'hi' ? 'कुल ब्याज की तुलना (Visual Comparison)' : 'Total Interest Comparison'}
        </h3>

        <div className="space-y-3 text-xs">
          {/* Flat Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-700 font-medium">
                {language === 'hi' ? 'फ्लैट दर (Flat Rate)' : 'Flat Rate'}
              </span>
              <span className="font-bold text-rose-700 tabular-nums">{formatINR(flat.totalInterest)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${(flat.totalInterest / maxInterest) * 100}%` }}
              />
            </div>
          </div>

          {/* Reducing Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-700 font-medium">
                {language === 'hi' ? 'घटता ब्याज दर (Reducing Rate)' : 'Reducing Rate'}
              </span>
              <span className="font-bold text-amber-800 tabular-nums">{formatINR(reducing.totalInterest)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${(reducing.totalInterest / maxInterest) * 100}%` }}
              />
            </div>
          </div>

          {/* Fixed Principal Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-700 font-medium">
                {language === 'hi' ? 'फिक्स्ड मूलधन (Fixed Principal + Reducing Interest)' : 'Fixed Principal'}
              </span>
              <span className="font-bold text-emerald-800 tabular-nums">{formatINR(fixed.totalInterest)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${(fixed.totalInterest / maxInterest) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
