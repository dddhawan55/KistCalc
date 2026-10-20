import React from 'react';
import {
  CalculationMethod,
  LoanInputState,
  RateType,
  TargetField,
  TenureType,
} from '../types/calculator';
import { Language, translations } from '../utils/translations';
import { formatINR, numberToIndianWords } from '../utils/loanCalculations';
import {
  Zap,
  HelpCircle,
  RotateCcw,
  IndianRupee,
  Percent,
  Calendar,
  CreditCard,
  Info,
} from 'lucide-react';

interface InputPanelProps {
  language: Language;
  method: CalculationMethod;
  inputState: LoanInputState;
  onChange: (newState: Partial<LoanInputState>) => void;
  onReset: () => void;
  warningMessage?: string | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  language,
  method,
  inputState,
  onChange,
  onReset,
  warningMessage,
}) => {
  const t = translations[language];
  const {
    principal,
    annualRate,
    monthlyRate,
    rateType,
    tenureMonths,
    tenureYears,
    tenureType,
    emi,
    fixedMonthlyPrincipal,
    targetToCalculate,
  } = inputState;

  // Principal Presets
  const principalPresets = [
    { label: '₹1L', value: 100000 },
    { label: '₹3L', value: 300000 },
    { label: '₹5L', value: 500000 },
    { label: '₹10L', value: 1000000 },
    { label: '₹25L', value: 2500000 },
    { label: '₹50L', value: 5000000 },
  ];

  // Rate Presets (Yearly)
  const ratePresetsYearly = [
    { label: '8.5%', value: 8.5 },
    { label: '10.5%', value: 10.5 },
    { label: '12%', value: 12.0 },
    { label: '14%', value: 14.0 },
    { label: '18%', value: 18.0 },
    { label: '24%', value: 24.0 },
  ];

  // Rate Presets (Monthly / Saikda)
  const ratePresetsMonthly = [
    { label: '0.8%', value: 0.8 },
    { label: '1% (₹1)', value: 1.0 },
    { label: '1.5% (₹1.5)', value: 1.5 },
    { label: '2% (₹2)', value: 2.0 },
    { label: '3% (₹3)', value: 3.0 },
  ];

  // Tenure Presets
  const tenurePresets = [
    { label: '6 M', months: 6, years: 0.5 },
    { label: '1 Yr', months: 12, years: 1 },
    { label: '2 Yr', months: 24, years: 2 },
    { label: '3 Yr', months: 36, years: 3 },
    { label: '5 Yr', months: 60, years: 5 },
    { label: '10 Yr', months: 120, years: 10 },
    { label: '20 Yr', months: 240, years: 20 },
  ];

  const handlePrincipalChange = (value: number) => {
    onChange({ principal: Math.max(0, value) });
  };

  const handleRateChange = (value: number, type: RateType) => {
    const val = Math.max(0, value);
    if (type === 'yearly') {
      onChange({
        annualRate: val,
        monthlyRate: Math.round((val / 12) * 1000) / 1000,
        rateType: 'yearly',
      });
    } else {
      onChange({
        monthlyRate: val,
        annualRate: Math.round(val * 12 * 100) / 100,
        rateType: 'monthly',
      });
    }
  };

  const handleTenureChange = (value: number, type: TenureType) => {
    const val = Math.max(1, value);
    if (type === 'years') {
      onChange({
        tenureYears: val,
        tenureMonths: Math.round(val * 12),
        tenureType: 'years',
      });
    } else {
      onChange({
        tenureMonths: Math.round(val),
        tenureYears: Math.round((val / 12) * 10) / 10,
        tenureType: 'months',
      });
    }
  };

  const handleEmiChange = (value: number) => {
    onChange({ emi: Math.max(0, value) });
  };

  const handleFixedPrincipalChange = (value: number) => {
    onChange({ fixedMonthlyPrincipal: Math.max(0, value) });
  };

  const setTarget = (field: TargetField) => {
    onChange({ targetToCalculate: field });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      {/* Top Controller: Auto-calculate selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.autoCalculateLabel}</span>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'जिसे चुनेंगे, वह बाकी तीन वैल्यूज के हिसाब से अपने आप कैलकुलेट होगा'
              : 'The selected variable auto-calculates in real-time from the other three inputs'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setTarget('emi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              targetToCalculate === 'emi'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'ईएमआई (EMI)' : 'EMI'}
          </button>
          <button
            onClick={() => setTarget('principal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              targetToCalculate === 'principal'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'लोन राशि (Principal)' : 'Principal'}
          </button>
          <button
            onClick={() => setTarget('tenure')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              targetToCalculate === 'tenure'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'अवधि (Tenure)' : 'Tenure'}
          </button>
          <button
            onClick={() => setTarget('rate')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              targetToCalculate === 'rate'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'ब्याज दर (Rate)' : 'Rate %'}
          </button>
        </div>
      </div>

      {/* Warning message if impossible calculation */}
      {warningMessage && (
        <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-900 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Method 3 Special Information Banner */}
      {method === 'fixed_principal' && (
        <div className="mb-5 p-3.5 bg-sky-50 border border-sky-200 rounded-lg text-sky-950 text-xs">
          <div className="font-semibold mb-0.5 flex items-center gap-1.5 text-sky-900">
            <Info className="w-3.5 h-3.5 text-sky-700" />
            <span>{t.methodExpFixedPrincipalTitle}</span>
          </div>
          <p className="text-sky-800 leading-relaxed">
            {language === 'hi'
              ? 'यहाँ आप हर महीने मूलधन की एक तय किश्त (Fixed Principal) चुकाते हैं, और ब्याज बचे हुए बैलेंस पर लगता है। पहली ईएमआई सबसे ज्यादा होगी और हर महीने ईएमआई घटती जाएगी। कुल ब्याज सबसे कम इसी में लगता है।'
              : 'You pay a fixed portion of the loan principal every month, while interest is computed only on the outstanding balance. Monthly payment reduces every month, minimizing overall interest cost.'}
          </p>
        </div>
      )}

      {/* Grid of the 4 Primary Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIELD 1: PRINCIPAL / LOAN AMOUNT */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            targetToCalculate === 'principal'
              ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.fieldPrincipal}</span>
            </label>
            {targetToCalculate === 'principal' ? (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                ⚡ {language === 'hi' ? 'ऑटो कैलकुलेटेड' : 'Auto-calculated'}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setTarget('principal')}
                className="text-[11px] text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium"
              >
                <span>{t.solveThis}</span>
              </button>
            )}
          </div>

          <div className="relative mb-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="5000"
              value={principal || ''}
              disabled={targetToCalculate === 'principal'}
              onChange={(e) => handlePrincipalChange(Number(e.target.value))}
              className={`w-full pl-8 pr-3 py-2 text-base font-semibold rounded-lg border tabular-nums transition-colors ${
                targetToCalculate === 'principal'
                  ? 'bg-slate-100/70 border-emerald-300 text-emerald-950 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600'
              }`}
              placeholder="e.g. 500000"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-medium text-slate-700 tabular-nums">
              {formatINR(principal)}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">
              {numberToIndianWords(principal)}
            </span>
          </div>

          {targetToCalculate !== 'principal' && (
            <>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={principal}
                onChange={(e) => handlePrincipalChange(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mb-3"
              />
              <div className="flex flex-wrap gap-1">
                {principalPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handlePrincipalChange(preset.value)}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      principal === preset.value
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FIELD 2: RATE OF INTEREST */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            targetToCalculate === 'rate'
              ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.fieldRate}</span>
            </label>
            <div className="flex items-center gap-2">
              {targetToCalculate === 'rate' ? (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                  ⚡ {language === 'hi' ? 'ऑटो कैलकुलेटेड' : 'Auto-calculated'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTarget('rate')}
                  className="text-[11px] text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium"
                >
                  <span>{t.solveThis}</span>
                </button>
              )}

              {/* Yearly vs Monthly Toggle */}
              <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-[10px] font-medium">
                <button
                  type="button"
                  onClick={() => onChange({ rateType: 'yearly' })}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    rateType === 'yearly'
                      ? 'bg-white shadow-xs text-slate-900 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {language === 'hi' ? 'वार्षिक (p.a.)' : 'Yearly'}
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ rateType: 'monthly' })}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    rateType === 'monthly'
                      ? 'bg-white shadow-xs text-slate-900 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {language === 'hi' ? 'मासिक (सैकड़ा)' : 'Monthly'}
                </button>
              </div>
            </div>
          </div>

          <div className="relative mb-2">
            <input
              type="number"
              min="0"
              max="100"
              step={rateType === 'yearly' ? '0.25' : '0.1'}
              value={rateType === 'yearly' ? annualRate || '' : monthlyRate || ''}
              disabled={targetToCalculate === 'rate'}
              onChange={(e) => handleRateChange(Number(e.target.value), rateType)}
              className={`w-full pl-3 pr-8 py-2 text-base font-semibold rounded-lg border tabular-nums transition-colors ${
                targetToCalculate === 'rate'
                  ? 'bg-slate-100/70 border-emerald-300 text-emerald-950 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600'
              }`}
              placeholder="e.g. 10.5"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
              %
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span>
              {rateType === 'yearly' ? (
                <span>
                  {language === 'hi' ? 'मासिक दर:' : 'Monthly rate:'}{' '}
                  <strong className="text-slate-700 tabular-nums">{monthlyRate}%</strong>{' '}
                  <span className="text-[11px] text-slate-400">
                    ({language === 'hi' ? `₹${monthlyRate} सैकड़ा` : `${monthlyRate}% / month`})
                  </span>
                </span>
              ) : (
                <span>
                  {language === 'hi' ? 'वार्षिक दर:' : 'Annual rate:'}{' '}
                  <strong className="text-slate-700 tabular-nums">{annualRate}% p.a.</strong>
                </span>
              )}
            </span>
          </div>

          {targetToCalculate !== 'rate' && (
            <>
              <input
                type="range"
                min={rateType === 'yearly' ? '1' : '0.2'}
                max={rateType === 'yearly' ? '36' : '3'}
                step={rateType === 'yearly' ? '0.25' : '0.1'}
                value={rateType === 'yearly' ? annualRate : monthlyRate}
                onChange={(e) => handleRateChange(Number(e.target.value), rateType)}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mb-3"
              />
              <div className="flex flex-wrap gap-1">
                {(rateType === 'yearly' ? ratePresetsYearly : ratePresetsMonthly).map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleRateChange(preset.value, rateType)}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      (rateType === 'yearly' ? annualRate : monthlyRate) === preset.value
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FIELD 3: TENURE / TIME PERIOD */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            targetToCalculate === 'tenure'
              ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.fieldTenure}</span>
            </label>
            <div className="flex items-center gap-2">
              {targetToCalculate === 'tenure' ? (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                  ⚡ {language === 'hi' ? 'ऑटो कैलकुलेटेड' : 'Auto-calculated'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTarget('tenure')}
                  className="text-[11px] text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium"
                >
                  <span>{t.solveThis}</span>
                </button>
              )}

              {/* Years vs Months Toggle */}
              <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-[10px] font-medium">
                <button
                  type="button"
                  onClick={() => onChange({ tenureType: 'years' })}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    tenureType === 'years'
                      ? 'bg-white shadow-xs text-slate-900 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {language === 'hi' ? 'वर्ष (Yr)' : 'Years'}
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ tenureType: 'months' })}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    tenureType === 'months'
                      ? 'bg-white shadow-xs text-slate-900 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {language === 'hi' ? 'महीने (Mo)' : 'Months'}
                </button>
              </div>
            </div>
          </div>

          <div className="relative mb-2">
            <input
              type="number"
              min="1"
              max="480"
              step={tenureType === 'years' ? '0.5' : '1'}
              value={tenureType === 'years' ? tenureYears || '' : tenureMonths || ''}
              disabled={targetToCalculate === 'tenure'}
              onChange={(e) => handleTenureChange(Number(e.target.value), tenureType)}
              className={`w-full pl-3 pr-14 py-2 text-base font-semibold rounded-lg border tabular-nums transition-colors ${
                targetToCalculate === 'tenure'
                  ? 'bg-slate-100/70 border-emerald-300 text-emerald-950 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600'
              }`}
              placeholder="e.g. 3"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-medium text-xs">
              {tenureType === 'years'
                ? language === 'hi'
                  ? 'वर्ष'
                  : 'Years'
                : language === 'hi'
                ? 'महीने'
                : 'Months'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span>
              {language === 'hi' ? 'कुल किश्तें / महीने:' : 'Total installments:'}{' '}
              <strong className="text-slate-800 tabular-nums">{tenureMonths} EMIs</strong>
            </span>
            <span className="text-[11px] text-slate-500 tabular-nums">
              {(tenureMonths / 12).toFixed(1)} {language === 'hi' ? 'वर्ष' : 'years'}
            </span>
          </div>

          {targetToCalculate !== 'tenure' && (
            <>
              <input
                type="range"
                min="1"
                max={tenureType === 'years' ? '30' : '360'}
                step={tenureType === 'years' ? '1' : '6'}
                value={tenureType === 'years' ? tenureYears : tenureMonths}
                onChange={(e) => handleTenureChange(Number(e.target.value), tenureType)}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mb-3"
              />
              <div className="flex flex-wrap gap-1">
                {tenurePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleTenureChange(preset.months, 'months')}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      tenureMonths === preset.months
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FIELD 4: MONTHLY EMI */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            targetToCalculate === 'emi'
              ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {method === 'fixed_principal'
                  ? language === 'hi'
                    ? 'औसत ईएमआई (Average EMI)'
                    : 'Average Monthly EMI'
                  : t.fieldEmi}
              </span>
            </label>
            {targetToCalculate === 'emi' ? (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                ⚡ {language === 'hi' ? 'ऑटो कैलकुलेटेड' : 'Auto-calculated'}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setTarget('emi')}
                className="text-[11px] text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium"
              >
                <span>{t.solveThis}</span>
              </button>
            )}
          </div>

          <div className="relative mb-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="500"
              value={emi || ''}
              disabled={targetToCalculate === 'emi'}
              onChange={(e) => handleEmiChange(Number(e.target.value))}
              className={`w-full pl-8 pr-3 py-2 text-base font-semibold rounded-lg border tabular-nums transition-colors ${
                targetToCalculate === 'emi'
                  ? 'bg-slate-100/70 border-emerald-300 text-emerald-950 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600'
              }`}
              placeholder="e.g. 15000"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-800 tabular-nums">
              {formatINR(emi)} / {language === 'hi' ? 'माह' : 'month'}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">
              {numberToIndianWords(emi)}
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            {targetToCalculate === 'emi' ? (
              <span>
                {language === 'hi'
                  ? 'यह राशि मूलधन, ब्याज दर और अवधि के आधार पर बनी है।'
                  : 'Computed from Principal, Interest Rate, and Tenure.'}
              </span>
            ) : (
              <span className="text-emerald-800 font-medium">
                {language === 'hi'
                  ? 'ईएमआई बदलने पर बाकी मान तुरंत अपडेट होंगे।'
                  : 'Editing this will auto-calculate your target field.'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* METHOD 3 EXTRA FIELD: Fixed Monthly Principal Input */}
      {method === 'fixed_principal' && (
        <div className="mt-5 p-4 rounded-xl border border-sky-200 bg-sky-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-sky-950 flex items-center gap-1.5">
              <span>{t.fieldFixedPrincipal}</span>
            </label>
            <span className="text-[11px] text-sky-800">
              {language === 'hi'
                ? `डिफ़ॉल्ट: ₹${formatINR(principal / tenureMonths)} (कुल मूलधन ÷ ${tenureMonths} माह)`
                : `Default: ${formatINR(principal / tenureMonths)} (Principal ÷ ${tenureMonths} mo)`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="500"
                step="1000"
                value={fixedMonthlyPrincipal || Math.round(principal / tenureMonths)}
                onChange={(e) => handleFixedPrincipalChange(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-base font-semibold rounded-lg border border-sky-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 tabular-nums"
              />
            </div>

            <div className="text-xs text-sky-900 leading-snug">
              {language === 'hi'
                ? 'आप चाहें तो अपनी मर्ज़ी का फिक्स्ड मूलधन भर सकते हैं (जैसे ₹20,000)। बचे हुए बैलेंस पर उस महीने का ब्याज जुड़ेगा।'
                : 'Custom fixed principal reduces your principal every month; monthly interest is calculated only on remaining balance.'}
            </div>
          </div>
        </div>
      )}

      {/* Footer reset button */}
      <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100 text-xs">
        <span className="text-slate-500">
          {language === 'hi'
            ? 'किसी भी वैल्यू को बदलें, परिणाम तुरंत स्क्रीन पर दिखाई देंगे'
            : 'All calculations are reactive and instant'}
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.reset}</span>
        </button>
      </div>
    </div>
  );
};
