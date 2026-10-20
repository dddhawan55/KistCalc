import React from 'react';
import { Calculator, Globe, Printer, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { CalculationMethod } from '../types/calculator';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeMethod: CalculationMethod | 'compare';
  onMethodChange: (method: CalculationMethod | 'compare') => void;
  onPrint: () => void;
  onOpenMobileGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeMethod,
  onMethodChange,
  onPrint,
  onOpenMobileGuide,
}) => {
  const t = translations[language];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                KistCalc
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none">
                {language === 'hi' ? 'स्मार्ट ब्याज व ईएमआई कैलकुलेटर' : 'Smart Loan & EMI Engine'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onMethodChange('reducing')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeMethod === 'reducing'
                  ? 'border-emerald-600 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'घटता ब्याज' : 'Reducing Rate'}
            </button>
            <button
              onClick={() => onMethodChange('flat')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeMethod === 'flat'
                  ? 'border-emerald-600 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'फ्लैट ब्याज' : 'Flat Rate'}
            </button>
            <button
              onClick={() => onMethodChange('fixed_principal')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeMethod === 'fixed_principal'
                  ? 'border-emerald-600 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'फिक्स्ड मूलधन' : 'Fixed Principal'}
            </button>
            <button
              onClick={() => onMethodChange('compare')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeMethod === 'compare'
                  ? 'border-emerald-600 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'तीनों की तुलना' : 'Compare All 3'}
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile App Button */}
            <button
              onClick={onOpenMobileGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-md transition-colors"
              title="Use on mobile phone / मोबाइल में चलाएं"
            >
              <span>📱</span>
              <span className="hidden sm:inline">
                {language === 'hi' ? 'मोबाइल में चलाएं' : 'Mobile App'}
              </span>
              <span className="sm:hidden">{language === 'hi' ? 'मोबाइल' : 'Mobile'}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.printSchedule}</span>
              <span className="md:hidden">Print</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
