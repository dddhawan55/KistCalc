import React, { useState } from 'react';
import { CalculationResult } from '../types/calculator';
import { Language, translations } from '../utils/translations';
import { formatINR } from '../utils/loanCalculations';
import { PieChart, Sliders } from 'lucide-react';

interface EmiBreakdownBarProps {
  language: Language;
  result: CalculationResult;
}

export const EmiBreakdownBar: React.FC<EmiBreakdownBarProps> = ({ language, result }) => {
  const t = translations[language];
  const totalMonths = result.schedule.length;
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  if (totalMonths === 0) return null;

  // Clamped selected item
  const validMonthIndex = Math.min(Math.max(1, selectedMonth), totalMonths) - 1;
  const currentItem = result.schedule[validMonthIndex] || result.schedule[0];

  const principalRatio =
    currentItem.emi > 0 ? (currentItem.principalPaid / currentItem.emi) * 100 : 0;
  const interestRatio =
    currentItem.emi > 0 ? (currentItem.interestPaid / currentItem.emi) * 100 : 0;

  // Key snapshot months
  const firstMonth = result.schedule[0];
  const midIndex = Math.floor(totalMonths / 2);
  const midMonth = result.schedule[midIndex];
  const lastMonth = result.schedule[totalMonths - 1];

  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>{t.breakdownTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi'
              ? 'देखें कि आपकी हर महीने की किस्त (EMI) में मूलधन कितना जमा होता है और ब्याज कितना कटता है'
              : 'Inspect exact Principal vs Interest composition inside any monthly installment'}
          </p>
        </div>

        {/* Milestone Quick Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setSelectedMonth(1)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedMonth === 1
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? '1st महीना' : '1st Month'}
          </button>
          {totalMonths > 3 && (
            <button
              onClick={() => setSelectedMonth(midIndex + 1)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedMonth === midIndex + 1
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'मध्य (Mid)' : 'Mid-term'}
            </button>
          )}
          <button
            onClick={() => setSelectedMonth(totalMonths)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedMonth === totalMonths
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'आखिरी महीना' : 'Last Month'}
          </button>
        </div>
      </div>

      {/* Interactive Month Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {t.sliderMonthSelect} <strong>{selectedMonth}</strong> / {totalMonths}
            </span>
          </label>
          <span className="text-[11px] text-slate-500 tabular-nums">
            {language === 'hi'
              ? `साल ${Math.ceil(selectedMonth / 12)} का महीना ${(selectedMonth - 1) % 12 + 1}`
              : `Year ${Math.ceil(selectedMonth / 12)}, Mo ${(selectedMonth - 1) % 12 + 1}`}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max={totalMonths}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
      </div>

      {/* Selected Month Detail Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {language === 'hi' ? `महीना #${selectedMonth} की कुल किस्त:` : `Month #${selectedMonth} EMI:`}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {formatINR(currentItem.emi)}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
              <div>
                <span className="text-slate-500 block text-[10px]">
                  {language === 'hi' ? 'मूलधन में जमा' : 'Principal Paid'}
                </span>
                <span className="font-bold text-emerald-900 tabular-nums">
                  {formatINR(currentItem.principalPaid)} ({principalRatio.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
              <div>
                <span className="text-slate-500 block text-[10px]">
                  {language === 'hi' ? 'ब्याज में गया' : 'Interest Paid'}
                </span>
                <span className="font-bold text-amber-900 tabular-nums">
                  {formatINR(currentItem.interestPaid)} ({interestRatio.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Color Progress Bar */}
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-emerald-600 h-full transition-all duration-200"
            style={{ width: `${principalRatio}%` }}
            title={`Principal: ${formatINR(currentItem.principalPaid)}`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-200"
            style={{ width: `${interestRatio}%` }}
            title={`Interest: ${formatINR(currentItem.interestPaid)}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>
            {language === 'hi' ? 'शुरुआती बाकी:' : 'Opening Balance:'}{' '}
            <strong className="text-slate-700 tabular-nums">
              {formatINR(currentItem.openingBalance)}
            </strong>
          </span>
          <span>
            {language === 'hi' ? 'बची हुई बाकी (Closing):' : 'Closing Balance:'}{' '}
            <strong className="text-slate-700 tabular-nums">
              {formatINR(currentItem.closingBalance)}
            </strong>
          </span>
        </div>
      </div>

      {/* Snapshot 3-column timeline */}
      {firstMonth && lastMonth && totalMonths > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium mb-1">
              {language === 'hi' ? 'महीना 1 (शुरुआत)' : 'Month 1 (Start)'}
            </div>
            <div className="font-bold text-slate-800 tabular-nums mb-1">
              EMI: {formatINR(firstMonth.emi)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="text-emerald-700">P: {formatINR(firstMonth.principalPaid)}</span>
              <span className="text-amber-700">Int: {formatINR(firstMonth.interestPaid)}</span>
            </div>
          </div>

          {midMonth && (
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium mb-1">
                {language === 'hi'
                  ? `महीना ${midIndex + 1} (मध्य)`
                  : `Month ${midIndex + 1} (Mid)`}
              </div>
              <div className="font-bold text-slate-800 tabular-nums mb-1">
                EMI: {formatINR(midMonth.emi)}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="text-emerald-700">P: {formatINR(midMonth.principalPaid)}</span>
                <span className="text-amber-700">Int: {formatINR(midMonth.interestPaid)}</span>
              </div>
            </div>
          )}

          <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium mb-1">
              {language === 'hi'
                ? `महीना ${totalMonths} (आखिर)`
                : `Month ${totalMonths} (End)`}
            </div>
            <div className="font-bold text-slate-800 tabular-nums mb-1">
              EMI: {formatINR(lastMonth.emi)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="text-emerald-700">P: {formatINR(lastMonth.principalPaid)}</span>
              <span className="text-amber-700">Int: {formatINR(lastMonth.interestPaid)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
