import React from 'react';
import { CalculationMethod } from '../types/calculator';
import { Language, translations } from '../utils/translations';
import { TrendingDown, ArrowDownRight, Layers, BarChart3 } from 'lucide-react';

interface MethodSelectorProps {
  language: Language;
  activeMethod: CalculationMethod | 'compare';
  onSelect: (method: CalculationMethod | 'compare') => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  language,
  activeMethod,
  onSelect,
}) => {
  const t = translations[language];

  const tabs: {
    id: CalculationMethod | 'compare';
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    tag?: string;
  }[] = [
    {
      id: 'reducing',
      title: language === 'hi' ? '1. घटता ब्याज दर' : '1. Reducing Balance',
      subtitle: language === 'hi' ? 'बैंक व स्टैंडर्ड ईएमआई' : 'Standard Banking EMI',
      icon: <TrendingDown className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'flat',
      title: language === 'hi' ? '2. फ्लैट ब्याज दर' : '2. Flat Interest Rate',
      subtitle: language === 'hi' ? 'वाहन व लोकल लोन' : 'Vehicle & NBFC loans',
      icon: <Layers className="w-4 h-4 text-amber-600" />,
    },
    {
      id: 'fixed_principal',
      title: language === 'hi' ? '3. फिक्स्ड मूलधन + घटता ब्याज' : '3. Fixed Principal + Diminishing Interest',
      subtitle: language === 'hi' ? 'हर माह मूलधन बराबर, ब्याज घटता जाएगा' : 'Fixed principal drop, decreasing EMI',
      icon: <ArrowDownRight className="w-4 h-4 text-sky-600" />,
      tag: language === 'hi' ? 'कम से कम ब्याज' : 'Lowest Interest',
    },
    {
      id: 'compare',
      title: language === 'hi' ? 'तीनों की तुलना' : 'Compare All 3',
      subtitle: language === 'hi' ? 'बचत और अंतर देखें' : 'Side-by-side analysis',
      icon: <BarChart3 className="w-4 h-4 text-indigo-600" />,
    },
  ];

  return (
    <div className="w-full bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeMethod === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`flex items-start text-left gap-3 p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-white shadow-xs border border-slate-200/80 text-slate-900 ring-1 ring-emerald-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div
                className={`p-2 rounded-md shrink-0 mt-0.5 ${
                  isActive ? 'bg-slate-50' : 'bg-transparent'
                }`}
              >
                {tab.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="font-semibold text-xs sm:text-sm tracking-tight text-slate-900 truncate">
                    {tab.title}
                  </div>
                  {tab.tag && (
                    <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200/60 font-medium px-1.5 py-0.2 rounded shrink-0">
                      {tab.tag}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 truncate leading-snug mt-0.5">
                  {tab.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
