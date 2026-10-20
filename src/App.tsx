import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { MethodSelector } from './components/MethodSelector';
import { InputPanel } from './components/InputPanel';
import { SummaryCards } from './components/SummaryCards';
import { EmiBreakdownBar } from './components/EmiBreakdownBar';
import { AmortizationSchedule } from './components/AmortizationSchedule';
import { ComparisonView } from './components/ComparisonView';
import { PrintSlipModal } from './components/PrintSlipModal';
import { MobileGuideModal } from './components/MobileGuideModal';
import { PrepaymentSimulator } from './components/PrepaymentSimulator';
import {
  CalculationMethod,
  CalculationResult,
  LoanInputState,
  TargetField,
} from './types/calculator';
import { Language, translations } from './utils/translations';
import {
  calculateFlat,
  calculateFixedPrincipal,
  calculateReducing,
  solvePrincipalFromEMI,
  solveRateFromEMI,
  solveTenureFromEMI,
  formatINR,
} from './utils/loanCalculations';
import { HelpCircle, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('hi');
  const [activeMethod, setActiveMethod] = useState<CalculationMethod | 'compare'>('reducing');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showMobileGuide, setShowMobileGuide] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Core Reactive Input State
  const [inputState, setInputState] = useState<LoanInputState>({
    principal: 500000, // ₹5,00,000
    annualRate: 10.5, // 10.5% p.a.
    monthlyRate: 0.875, // 0.875% per mo
    rateType: 'yearly',
    tenureMonths: 36, // 36 months = 3 years
    tenureYears: 3,
    tenureType: 'years',
    emi: 16254, // initial calculated
    fixedMonthlyPrincipal: undefined,
    targetToCalculate: 'emi',
    prepayment: {
      enabled: false,
      oneTime: [],
      recurring: { type: 'monthly', amount: 0, startMonth: 1 },
    },
  });

  const t = translations[language];
  const calculationMethod: CalculationMethod =
    activeMethod === 'compare' ? 'reducing' : activeMethod;

  // Reactively calculate or solve based on targetToCalculate
  const result: CalculationResult = useMemo(() => {
    setWarningMessage(null);
    const { principal, annualRate, tenureMonths, emi, fixedMonthlyPrincipal, targetToCalculate } =
      inputState;

    let effectivePrincipal = principal;
    let effectiveRate = annualRate;
    let effectiveTenure = tenureMonths;

    if (targetToCalculate === 'principal') {
      effectivePrincipal = solvePrincipalFromEMI(
        emi,
        annualRate,
        tenureMonths,
        calculationMethod
      );
    } else if (targetToCalculate === 'tenure') {
      const solved = solveTenureFromEMI(
        principal,
        annualRate,
        emi,
        calculationMethod
      );
      if (!solved.isValid && solved.minRequiredEmi) {
        setWarningMessage(
          `${t.emiTooLowWarning} ${formatINR(solved.minRequiredEmi)} / ${
            language === 'hi' ? 'माह' : 'month'
          }`
        );
      } else {
        effectiveTenure = solved.months;
      }
    } else if (targetToCalculate === 'rate') {
      effectiveRate = solveRateFromEMI(
        principal,
        emi,
        tenureMonths,
        calculationMethod
      );
    }

    if (calculationMethod === 'flat') {
      return calculateFlat(effectivePrincipal, effectiveRate, effectiveTenure);
    }
    if (calculationMethod === 'fixed_principal') {
      return calculateFixedPrincipal(
        effectivePrincipal,
        effectiveRate,
        effectiveTenure,
        fixedMonthlyPrincipal
      );
    }
    return calculateReducing(
      effectivePrincipal,
      effectiveRate,
      effectiveTenure,
      inputState.prepayment
    );
  }, [inputState, calculationMethod, language, t.emiTooLowWarning]);

  // Sync the solved value back into inputState so fields reflect the solved values
  useEffect(() => {
    if (inputState.targetToCalculate === 'emi') {
      const calculatedEmi =
        calculationMethod === 'fixed_principal'
          ? result.firstMonthEMI
          : result.monthlyEMI;
      if (Math.abs(inputState.emi - calculatedEmi) > 1) {
        setInputState((prev) => ({ ...prev, emi: calculatedEmi }));
      }
    } else if (inputState.targetToCalculate === 'principal') {
      if (Math.abs(inputState.principal - result.principal) > 1) {
        setInputState((prev) => ({ ...prev, principal: result.principal }));
      }
    } else if (inputState.targetToCalculate === 'tenure') {
      if (inputState.tenureMonths !== result.totalMonths) {
        setInputState((prev) => ({
          ...prev,
          tenureMonths: result.totalMonths,
          tenureYears: Math.round((result.totalMonths / 12) * 10) / 10,
        }));
      }
    } else if (inputState.targetToCalculate === 'rate') {
      if (Math.abs(inputState.annualRate - result.annualRatePercent) > 0.05) {
        setInputState((prev) => ({
          ...prev,
          annualRate: result.annualRatePercent,
          monthlyRate: Math.round((result.annualRatePercent / 12) * 1000) / 1000,
        }));
      }
    }
  }, [result, inputState.targetToCalculate, calculationMethod]);

  const handleInputChange = (changes: Partial<LoanInputState>) => {
    setInputState((prev) => ({ ...prev, ...changes }));
  };

  const handleReset = () => {
    setInputState({
      principal: 500000,
      annualRate: 10.5,
      monthlyRate: 0.875,
      rateType: 'yearly',
      tenureMonths: 36,
      tenureYears: 3,
      tenureType: 'years',
      emi: 16254,
      fixedMonthlyPrincipal: undefined,
      targetToCalculate: 'emi',
      prepayment: {
        enabled: false,
        oneTime: [],
        recurring: { type: 'monthly', amount: 0, startMonth: 1 },
      },
    });
    setWarningMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Navigation */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        activeMethod={activeMethod}
        onMethodChange={setActiveMethod}
        onPrint={() => setShowPrintModal(true)}
        onOpenMobileGuide={() => setShowMobileGuide(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title & Context Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {t.appTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.appSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs">
            <div className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'कोई भी 3 फील्ड्स भरें ➔ चौथा अपने आप कैलकुलेट होगा'
                  : 'Fill any 3 fields ➔ The 4th auto-calculates in real-time'}
              </span>
            </div>
            <a
              href="/kistcalc-mobile.html"
              download="KistCalc_Loan_Calculator.html"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
              title="Download standalone file for mobile"
            >
              <span>📥</span>
              <span>{language === 'hi' ? 'मोबाइल फ़ाइल डाउनलोड (100% पक्का)' : 'Download Mobile File'}</span>
            </a>
            <button
              onClick={() => setShowMobileGuide(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <span>📱</span>
              <span>{language === 'hi' ? 'QR कोड / गाइड' : 'QR Guide'}</span>
            </button>
          </div>
        </div>

        {/* 1. Method Selection Tabs */}
        <MethodSelector
          language={language}
          activeMethod={activeMethod}
          onSelect={setActiveMethod}
        />

        {activeMethod === 'compare' ? (
          /* COMPARISON VIEW */
          <>
            <ComparisonView
              language={language}
              principal={inputState.principal}
              annualRate={inputState.annualRate}
              tenureMonths={inputState.tenureMonths}
            />
            {/* Quick parameter adjustments inside comparison */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                {language === 'hi' ? 'तुलना के लिए इनपुट बदलें' : 'Adjust Inputs For Comparison'}
              </h3>
              <InputPanel
                language={language}
                method="reducing"
                inputState={inputState}
                onChange={handleInputChange}
                onReset={handleReset}
                warningMessage={warningMessage}
              />
            </div>
          </>
        ) : (
          /* SINGLE METHOD INTERACTIVE WORKFLOW */
          <>
            {/* 2. Interactive Input Panel (with auto-calculate target selector) */}
            <InputPanel
              language={language}
              method={calculationMethod}
              inputState={inputState}
              onChange={handleInputChange}
              onReset={handleReset}
              warningMessage={warningMessage}
            />

            {/* 3. Summary Metric Cards */}
            <SummaryCards language={language} result={result} />

            {/* 4. In-EMI Principal & Interest Breakdown (addresses requirement #5) */}
            <EmiBreakdownBar language={language} result={result} />

            {/* 5. Prepayment & Early Payoff Simulator */}
            {calculationMethod === 'reducing' && (
              <PrepaymentSimulator
                language={language}
                prepayment={inputState.prepayment}
                impact={result.prepaymentImpact}
                maxMonths={inputState.tenureMonths}
                onChange={(prepayment) => handleInputChange({ prepayment })}
              />
            )}

            {/* 6. Complete Amortization Schedule with CSV Download */}
            <AmortizationSchedule language={language} result={result} />
          </>
        )}

        {/* Educational Info Box: Difference between Reducing, Flat, and Fixed Principal */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 mt-4 text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-2 mb-3 font-bold text-slate-900 text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'hi'
                ? 'लोन व ब्याज के तीनों तरीकों को समझें (Financial Guide)'
                : 'Understanding Loan Calculation Methods'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
              <h4 className="font-bold text-slate-900 mb-1">
                {t.methodExpReducingTitle}
              </h4>
              <p className="leading-relaxed">{t.methodExpReducingDesc}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
              <h4 className="font-bold text-slate-900 mb-1">
                {t.methodExpFlatTitle}
              </h4>
              <p className="leading-relaxed">{t.methodExpFlatDesc}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
              <h4 className="font-bold text-slate-900 mb-1">
                {t.methodExpFixedPrincipalTitle}
              </h4>
              <p className="leading-relaxed">{t.methodExpFixedPrincipalDesc}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            KistCalc · {language === 'hi' ? 'स्मार्ट ब्याज, ईएमआई व मूलधन कैलकुलेटर' : 'Smart Loan, EMI & Principal Engine'}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveMethod('reducing')}
              className="hover:text-slate-900 transition-colors"
            >
              Reducing EMI
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveMethod('flat')}
              className="hover:text-slate-900 transition-colors"
            >
              Flat Rate
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveMethod('fixed_principal')}
              className="hover:text-slate-900 transition-colors"
            >
              Fixed Principal
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveMethod('compare')}
              className="hover:text-slate-900 transition-colors"
            >
              Compare
            </button>
          </div>
        </div>
      </footer>

      {/* Print Slip / Statement Modal */}
      {showPrintModal && (
        <PrintSlipModal
          language={language}
          result={result}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Mobile QR & Installation Guide Modal */}
      {showMobileGuide && (
        <MobileGuideModal
          language={language}
          onClose={() => setShowMobileGuide(false)}
        />
      )}
    </div>
  );
}
