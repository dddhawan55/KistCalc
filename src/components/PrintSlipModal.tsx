import React from 'react';
import { CalculationResult } from '../types/calculator';
import { Language, translations } from '../utils/translations';
import { formatINR } from '../utils/loanCalculations';
import { X, Printer, CheckCircle } from 'lucide-react';

interface PrintSlipModalProps {
  language: Language;
  result: CalculationResult;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  language,
  result,
  onClose,
}) => {
  const t = translations[language];

  const handlePrint = () => {
    window.print();
  };

  const getMethodName = () => {
    if (result.method === 'reducing') {
      return language === 'hi' ? 'घटता ब्याज दर (Reducing Balance EMI)' : 'Reducing Balance EMI';
    }
    if (result.method === 'flat') {
      return language === 'hi' ? 'फ्लैट ब्याज दर (Flat Interest Rate)' : 'Flat Interest Rate';
    }
    return language === 'hi'
      ? 'फिक्स्ड मूलधन + घटता ब्याज (Fixed Principal Diminishing Interest)'
      : 'Fixed Principal + Diminishing Interest';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Slip Content */}
        <div className="print-area">
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? 'लोन व ईएमआई विवरण पत्र' : 'Loan & EMI Statement'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  KistCalc · {getMethodName()}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>{new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
                <div className="text-[10px] text-slate-400">Ref: KC-{Date.now().toString().slice(-6)}</div>
              </div>
            </div>
          </div>

          {/* Key Loan Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">{language === 'hi' ? 'लोन मूलधन' : 'Loan Principal'}</span>
              <strong className="text-sm font-bold text-slate-900 tabular-nums">
                {formatINR(result.principal)}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">{language === 'hi' ? 'ब्याज दर' : 'Interest Rate'}</span>
              <strong className="text-sm font-bold text-slate-900 tabular-nums">
                {result.annualRatePercent}% p.a.
              </strong>
              <span className="text-[10px] text-slate-500 block">
                ({result.monthlyRatePercent.toFixed(2)}%/mo)
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">{language === 'hi' ? 'अवधि' : 'Tenure'}</span>
              <strong className="text-sm font-bold text-slate-900 tabular-nums">
                {result.totalMonths} {language === 'hi' ? 'माह' : 'Months'}
              </strong>
              <span className="text-[10px] text-slate-500 block">
                ({(result.totalMonths / 12).toFixed(1)} {language === 'hi' ? 'वर्ष' : 'Yrs'})
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">
                {result.method === 'fixed_principal'
                  ? language === 'hi'
                    ? '1st माह की किस्त'
                    : '1st Month EMI'
                  : language === 'hi'
                  ? 'मासिक किस्त'
                  : 'Monthly EMI'}
              </span>
              <strong className="text-sm font-bold text-emerald-800 tabular-nums">
                {formatINR(
                  result.method === 'fixed_principal'
                    ? result.firstMonthEMI
                    : result.monthlyEMI
                )}
              </strong>
            </div>
          </div>

          {/* Detailed Financial Summary Table */}
          <table className="w-full text-xs mb-6 border-collapse">
            <tbody className="divide-y divide-slate-200">
              <tr className="py-2">
                <td className="py-2.5 text-slate-600 font-medium">
                  {language === 'hi' ? 'मूल लोन राशि (Principal):' : 'Principal Borrowed:'}
                </td>
                <td className="py-2.5 text-right font-bold text-slate-900 tabular-nums">
                  {formatINR(result.principal)}
                </td>
              </tr>
              <tr className="py-2">
                <td className="py-2.5 text-slate-600 font-medium">
                  {language === 'hi' ? 'कुल देय ब्याज (Total Interest):' : 'Total Interest Payable:'}
                </td>
                <td className="py-2.5 text-right font-bold text-amber-900 tabular-nums">
                  {formatINR(result.totalInterest)} ({result.interestPercentage.toFixed(1)}%)
                </td>
              </tr>
              <tr className="py-2 bg-slate-50/80 font-bold">
                <td className="py-2.5 pl-2 text-slate-900">
                  {language === 'hi' ? 'कुल कुल देय राशि (Total Payable):' : 'Total Amount Payable:'}
                </td>
                <td className="py-2.5 pr-2 text-right text-base text-slate-900 tabular-nums">
                  {formatINR(result.totalPayable)}
                </td>
              </tr>
              {result.method === 'fixed_principal' && (
                <tr>
                  <td className="py-2 text-slate-600">
                    {language === 'hi' ? 'अंतिम महीने की किस्त:' : 'Last Month Payment:'}
                  </td>
                  <td className="py-2 text-right font-bold text-slate-800 tabular-nums">
                    {formatINR(result.lastMonthEMI)}
                  </td>
                </tr>
              )}
              {result.method === 'flat' && result.effectiveAPR && (
                <tr>
                  <td className="py-2 text-rose-700 font-medium">
                    {language === 'hi' ? 'वास्तविक घटती ब्याज दर (APR):' : 'Effective Reducing APR:'}
                  </td>
                  <td className="py-2 text-right font-bold text-rose-700 tabular-nums">
                    {result.effectiveAPR}% p.a.
                  </td>
                </tr>
              )}
              {result.prepaymentImpact && result.prepaymentImpact.monthsSaved > 0 && (
                <tr className="bg-emerald-50/80 text-emerald-950 font-bold">
                  <td className="py-2.5 pl-2 text-emerald-900">
                    {language === 'hi'
                      ? `पार्ट-पेमेंट से बचत (${result.prepaymentImpact.monthsSaved} महीने पहले लोन खत्म):`
                      : `Prepayment Savings (${result.prepaymentImpact.monthsSaved} months saved):`}
                  </td>
                  <td className="py-2.5 pr-2 text-right text-emerald-800 tabular-nums font-extrabold">
                    -{formatINR(result.prepaymentImpact.interestSaved)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* First 6 Months Snapshot */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">
              {language === 'hi' ? 'शुरुआती 6 महीनों की किस्तों का विवरण' : 'First 6 Installments Preview'}
            </h3>
            <table className="w-full text-[11px] text-slate-700 border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-semibold">
                <tr>
                  <th className="py-1.5 px-2 text-left">Mo#</th>
                  <th className="py-1.5 px-2 text-right">EMI</th>
                  <th className="py-1.5 px-2 text-right">Principal</th>
                  <th className="py-1.5 px-2 text-right">Interest</th>
                  <th className="py-1.5 px-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.schedule.slice(0, 6).map((m) => (
                  <tr key={m.month}>
                    <td className="py-1.5 px-2 font-medium">#{m.month}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums font-semibold">
                      {formatINR(m.emi)}
                    </td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-emerald-800">
                      {formatINR(m.principalPaid)}
                    </td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-amber-800">
                      {formatINR(m.interestPaid)}
                    </td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-slate-500">
                      {formatINR(m.closingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-3">
            * This calculation sheet is generated for estimate & comparison purposes. Actual bank terms may include processing fees, taxes, or pre-closure charges.
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रिंट करें / PDF सेव करें' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
