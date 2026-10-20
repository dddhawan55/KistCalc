import React, { useState } from 'react';
import {
  OneTimePrepayment,
  PrepaymentConfig,
  PrepaymentImpact,
  RecurringPrepayment,
} from '../types/calculator';
import { Language, translations } from '../utils/translations';
import { formatINR, numberToIndianWords } from '../utils/loanCalculations';
import {
  Sparkles,
  Plus,
  Trash2,
  Clock,
  TrendingDown,
  Coins,
  Calendar,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface PrepaymentSimulatorProps {
  language: Language;
  prepayment: PrepaymentConfig;
  impact?: PrepaymentImpact;
  maxMonths: number;
  onChange: (config: PrepaymentConfig) => void;
}

export const PrepaymentSimulator: React.FC<PrepaymentSimulatorProps> = ({
  language,
  prepayment,
  impact,
  maxMonths,
  onChange,
}) => {
  const isHi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'recurring' | 'onetime'>('recurring');

  // Local form inputs for adding one-time payment
  const [newMonth, setNewMonth] = useState<number>(6);
  const [newAmount, setNewAmount] = useState<number>(50000);

  const toggleEnabled = () => {
    onChange({
      ...prepayment,
      enabled: !prepayment.enabled,
    });
  };

  const handleRecurringChange = (recurringUpdates: Partial<RecurringPrepayment>) => {
    const current = prepayment.recurring || { type: 'monthly', amount: 0, startMonth: 1 };
    onChange({
      ...prepayment,
      enabled: true,
      recurring: {
        ...current,
        ...recurringUpdates,
      },
    });
  };

  const addOneTime = () => {
    if (newAmount <= 0 || newMonth < 1) return;
    const item: OneTimePrepayment = {
      id: `ot-${Date.now()}`,
      month: Math.min(newMonth, maxMonths),
      amount: newAmount,
    };
    onChange({
      ...prepayment,
      enabled: true,
      oneTime: [...prepayment.oneTime, item],
    });
    // set next suggested month
    setNewMonth(Math.min(newMonth + 6, maxMonths));
  };

  const removeOneTime = (id: string) => {
    onChange({
      ...prepayment,
      oneTime: prepayment.oneTime.filter((o) => o.id !== id),
    });
  };

  const applyRecurringPreset = (amt: number, type: 'monthly' | 'yearly') => {
    onChange({
      ...prepayment,
      enabled: true,
      recurring: {
        type,
        amount: amt,
        startMonth: 1,
      },
    });
    setActiveTab('recurring');
  };

  const applyOneTimePreset = (m: number, amt: number) => {
    const item: OneTimePrepayment = {
      id: `ot-${Date.now()}`,
      month: Math.min(m, maxMonths),
      amount: amt,
    };
    onChange({
      ...prepayment,
      enabled: true,
      oneTime: [...prepayment.oneTime, item],
    });
    setActiveTab('onetime');
  };

  const recurring = prepayment.recurring || { type: 'monthly', amount: 0, startMonth: 1 };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      {/* Top Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isHi ? 'लोन प्री-पेमेंट व पार्ट-पेमेंट सिम्युलेटर' : 'Prepayment & Early Payoff Simulator'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'अतिरिक्त पैसे चुकाने पर कितना ब्याज और कितने महीने बचेंगे, यहाँ देखें'
                  : 'See how extra prepayments slash your loan tenure and total interest'}
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-700">
            {prepayment.enabled
              ? isHi
                ? 'सिम्युलेटर सक्रिय है'
                : 'Simulator Active'
              : isHi
              ? 'सिम्युलेटर बंद है'
              : 'Simulator Off'}
          </span>
          <button
            type="button"
            onClick={toggleEnabled}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              prepayment.enabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                prepayment.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {prepayment.enabled ? (
        <>
          {/* IMPACT KPI BANNER */}
          {impact && (impact.interestSaved > 0 || impact.monthsSaved > 0) ? (
            <div className="mb-5 p-4 bg-emerald-50/90 border border-emerald-300 rounded-xl text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-3">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>
                  {isHi
                    ? '🎉 प्री-पेमेंट का शानदार असर (Prepayment Impact):'
                    : '🎉 Prepayment Impact Summary:'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">
                    {isHi ? 'ब्याज में सीधी बचत' : 'Total Interest Saved'}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-emerald-800 tabular-nums block">
                    {formatINR(impact.interestSaved)}
                  </strong>
                  <span className="text-[10px] text-emerald-700">
                    ({numberToIndianWords(impact.interestSaved)})
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">
                    {isHi ? 'लोन जल्दी खत्म होगा' : 'Tenure Reduced By'}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-sky-800 tabular-nums block">
                    {impact.monthsSaved} {isHi ? 'महीने पहले' : 'months earlier'}
                  </strong>
                  <span className="text-[10px] text-slate-500">
                    ({(impact.monthsSaved / 12).toFixed(1)} {isHi ? 'वर्ष की बचत' : 'years saved'})
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">
                    {isHi ? 'नया लोन समय' : 'New Loan Payoff'}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-slate-900 tabular-nums block">
                    {impact.newMonths} {isHi ? 'माह में मुक्त' : 'months'}
                  </strong>
                  <span className="text-[10px] text-slate-500">
                    {isHi ? `मूल ${impact.originalMonths} माह की जगह` : `instead of ${impact.originalMonths} mo`}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">
                    {isHi ? 'कुल अतिरिक्त दिया' : 'Total Extra Paid'}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-amber-800 tabular-nums block">
                    {formatINR(impact.totalPrepaid)}
                  </strong>
                  <span className="text-[10px] text-slate-500">
                    {isHi ? 'सीधे मूलधन से कटा' : 'directly to principal'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              {isHi
                ? 'नीचे से हर महीने अतिरिक्त राशि या किसी महीने एकमुश्त पार्ट-पेमेंट जोड़ें ताकि आप बचत देख सकें।'
                : 'Add recurring extra monthly payment or one-time prepayments below to see savings.'}
            </div>
          )}

          {/* Quick Prepayment Shortcut Chips */}
          <div className="mb-5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {isHi ? '⚡ त्वरित पार्ट-पेमेंट विकल्प (Quick Presets):' : '⚡ Quick Scenarios:'}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyRecurringPreset(1000, 'monthly')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors"
              >
                +₹1,000/{isHi ? 'माह' : 'mo'}
              </button>
              <button
                type="button"
                onClick={() => applyRecurringPreset(2500, 'monthly')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors font-medium"
              >
                +₹2,500/{isHi ? 'माह' : 'mo'}
              </button>
              <button
                type="button"
                onClick={() => applyRecurringPreset(5000, 'monthly')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors font-medium"
              >
                +₹5,000/{isHi ? 'माह' : 'mo'}
              </button>
              <button
                type="button"
                onClick={() => applyRecurringPreset(50000, 'yearly')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors"
              >
                +₹50,000/{isHi ? 'वर्ष (बोनस)' : 'yr'}
              </button>
              <button
                type="button"
                onClick={() => applyOneTimePreset(6, 50000)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors"
              >
                {isHi ? 'महीना 6 में ₹50,000' : '₹50k in Mo 6'}
              </button>
              <button
                type="button"
                onClick={() => applyOneTimePreset(12, 100000)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors font-semibold"
              >
                {isHi ? 'महीना 12 में ₹1 Lakh' : '₹1L in Mo 12'}
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Recurring vs One-time */}
          <div className="flex border-b border-slate-200 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('recurring')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'recurring'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isHi
                ? '1. नियमित अतिरिक्त भुगतान (Recurring Extra)'
                : '1. Recurring Extra Payment'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('onetime')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'onetime'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isHi
                ? `2. एकमुश्त पार्ट-पेमेंट (${prepayment.oneTime.length})`
                : `2. One-Time Lumpsum (${prepayment.oneTime.length})`}
            </button>
          </div>

          {/* TAB 1: RECURRING PREPAYMENT */}
          {activeTab === 'recurring' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Type: Monthly vs Yearly */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    {isHi ? 'भुगतान का प्रकार (Frequency)' : 'Frequency'}
                  </label>
                  <div className="flex bg-white border border-slate-300 rounded-lg p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleRecurringChange({ type: 'monthly' })}
                      className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${
                        recurring.type === 'monthly'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isHi ? 'हर महीने (Monthly)' : 'Every Month'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRecurringChange({ type: 'yearly' })}
                      className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${
                        recurring.type === 'yearly'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isHi ? 'हर साल (Yearly)' : 'Every Year'}
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    {isHi ? 'अतिरिक्त राशि (Extra Amount)' : 'Extra Amount'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={recurring.amount || ''}
                      placeholder="e.g. 2000"
                      onChange={(e) =>
                        handleRecurringChange({ amount: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {formatINR(recurring.amount)} ({numberToIndianWords(recurring.amount)})
                  </span>
                </div>

                {/* Starting Month */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    {isHi ? 'किस महीने से शुरू करें?' : 'Start From Month'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={maxMonths}
                    value={recurring.startMonth || 1}
                    onChange={(e) =>
                      handleRecurringChange({
                        startMonth: Math.max(1, Number(e.target.value)),
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {isHi ? `महीना #${recurring.startMonth || 1} से शुरू` : `Starts at month #${recurring.startMonth || 1}`}
                  </span>
                </div>
              </div>

              {recurring.amount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-900 font-medium pt-2 border-t border-slate-200">
                  <span>
                    ✓ {isHi ? 'नियमित रूप से हर' : 'Active: Every'}{' '}
                    <strong>{recurring.type === 'monthly' ? (isHi ? 'महीने' : 'month') : (isHi ? 'साल' : 'year')}</strong> ₹{formatINR(recurring.amount)} {isHi ? 'अतिरिक्त जमा होगा।' : 'extra will be prepaid.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRecurringChange({ amount: 0 })}
                    className="text-slate-400 hover:text-rose-600 text-[11px]"
                  >
                    {isHi ? 'हटाएं' : 'Remove'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ONE-TIME PREPAYMENT */}
          {activeTab === 'onetime' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              {/* Form to add one-time payment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {isHi ? 'किस महीने में भुगतान करेंगे?' : 'In which Month #?'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={maxMonths}
                    value={newMonth}
                    onChange={(e) => setNewMonth(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {isHi ? 'एकमुश्त पार्ट-पेमेंट राशि' : 'Lumpsum Amount'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1000"
                      step="5000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={addOneTime}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isHi ? 'पार्ट-पेमेंट जोड़ें' : 'Add Prepayment'}</span>
                  </button>
                </div>
              </div>

              {/* List of Added One-Time Prepayments */}
              {prepayment.oneTime.length > 0 ? (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-600 block mb-2">
                    {isHi ? 'जोड़े गए एकमुश्त पार्ट-पेमेंट्स:' : 'Scheduled One-Time Prepayments:'}
                  </span>
                  <div className="space-y-1.5">
                    {prepayment.oneTime.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {isHi ? `महीना #${item.month}` : `Month #${item.month}`}
                          </span>
                          <span className="font-bold text-emerald-800 tabular-nums">
                            {formatINR(item.amount)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({numberToIndianWords(item.amount)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOneTime(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 text-center py-2">
                  {isHi
                    ? 'अभी तक कोई एकमुश्त पार्ट-पेमेंट नहीं जोड़ा गया है।'
                    : 'No one-time prepayments added yet.'}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-xs text-slate-500 py-1 flex items-center justify-between">
          <span>
            {isHi
              ? 'यदि आप लोन को समय से पहले चुकाना चाहते हैं या हर महीने थोड़ा ज्यादा पैसा देना चाहते हैं, तो ऊपर से सिम्युलेटर ऑन करें।'
              : 'Enable this simulator to see how prepayments save thousands in interest and finish your loan years earlier.'}
          </span>
          <button
            type="button"
            onClick={toggleEnabled}
            className="text-emerald-700 hover:underline font-semibold"
          >
            {isHi ? 'ऑन करें ➔' : 'Enable ➔'}
          </button>
        </div>
      )}
    </div>
  );
};
