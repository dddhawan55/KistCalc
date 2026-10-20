import React, { useState } from 'react';
import { CalculationResult, MonthScheduleItem } from '../types/calculator';
import { Language, translations } from '../utils/translations';
import { formatINR } from '../utils/loanCalculations';
import { Download, ChevronDown, ChevronRight, Calendar, Search } from 'lucide-react';

interface AmortizationScheduleProps {
  language: Language;
  result: CalculationResult;
}

export const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({
  language,
  result,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({ 1: true });
  const [searchTerm, setSearchTerm] = useState('');

  const toggleYear = (yr: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yr]: !prev[yr],
    }));
  };

  const handleExportCSV = () => {
    const headers = [
      'Month',
      'Opening Balance (INR)',
      'Regular EMI (INR)',
      'Prepayment Extra (INR)',
      'Total Principal Paid (INR)',
      'Interest Paid (INR)',
      'Closing Balance (INR)',
      'Cumulative Interest (INR)',
      'Cumulative Principal (INR)',
    ];

    const rows = result.schedule.map((m) => [
      m.month,
      Math.round(m.openingBalance),
      Math.round(m.emi - (m.prepaymentPaid || 0)),
      Math.round(m.prepaymentPaid || 0),
      Math.round(m.principalPaid),
      Math.round(m.interestPaid),
      Math.round(m.closingBalance),
      Math.round(m.totalInterestPaidToDate),
      Math.round(m.totalPrincipalPaidToDate),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Loan_Schedule_${result.method}_${result.totalMonths}Mo.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered months if user searches for a specific month
  const filteredSchedule = searchTerm
    ? result.schedule.filter((m) => m.month.toString().includes(searchTerm))
    : result.schedule;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      {/* Header with View Toggle and CSV download */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{t.scheduleTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi'
              ? `कुल ${result.totalMonths} महीनों का विस्तृत बहीखाता (अंतिम किस्त तक)`
              : `Complete statement of all ${result.totalMonths} monthly repayments`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Yearly vs Monthly Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'yearly'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.toggleYearly}
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.toggleMonthly}
            </button>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors ml-auto sm:ml-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Month Search Bar for Monthly View */}
      {viewMode === 'monthly' && (
        <div className="mb-4 relative max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="number"
            placeholder={language === 'hi' ? 'महीना खोजें (e.g. 12)...' : 'Search month (e.g. 12)...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        {viewMode === 'yearly' ? (
          /* YEARLY SUMMARY VIEW WITH ACCORDION */
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">{t.colYear}</th>
                <th className="py-2.5 px-3 text-right">{t.colPrincipal}</th>
                <th className="py-2.5 px-3 text-right">{t.colInterest}</th>
                <th className="py-2.5 px-3 text-right">{t.colEmi}</th>
                <th className="py-2.5 px-3 text-right">{t.colClosing}</th>
                <th className="py-2.5 px-3 text-center">{language === 'hi' ? 'विवरण' : 'Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.yearlySchedule.map((yr) => {
                const isExpanded = !!expandedYears[yr.year];
                return (
                  <React.Fragment key={yr.year}>
                    <tr
                      onClick={() => toggleYear(yr.year)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors font-medium bg-white"
                    >
                      <td className="py-3 px-3 flex items-center gap-1.5 font-bold text-slate-900">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <span>
                          {language === 'hi' ? `वर्ष ${yr.year}` : `Year ${yr.year}`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-emerald-900 font-semibold">
                        {formatINR(yr.principalPaid)}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-amber-900 font-semibold">
                        {formatINR(yr.interestPaid)}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-900 font-bold">
                        {formatINR(yr.totalPayment)}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                        {formatINR(yr.closingBalance)}
                      </td>
                      <td className="py-3 px-3 text-center text-[11px] text-emerald-700">
                        {isExpanded
                          ? language === 'hi'
                            ? 'छुपायें'
                            : 'Hide'
                          : language === 'hi'
                          ? '12 माह देखें'
                          : 'View 12 Mo'}
                      </td>
                    </tr>

                    {/* Sub-months nested rows */}
                    {isExpanded &&
                      yr.months.map((m) => (
                        <tr
                          key={`month-${m.month}`}
                          className="bg-slate-50/50 hover:bg-slate-100/60 text-[11px] text-slate-600 transition-colors"
                        >
                          <td className="py-2 pl-9 pr-3 font-medium text-slate-700">
                            <span>{language === 'hi' ? `महीना ${m.month}` : `Month ${m.month}`}</span>
                            {m.prepaymentPaid && m.prepaymentPaid > 0 && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                +{formatINR(m.prepaymentPaid)} Extra
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-emerald-800">
                            {formatINR(m.principalPaid)}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-amber-800">
                            {formatINR(m.interestPaid)}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-slate-800 font-medium">
                            {formatINR(m.emi)}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-slate-500">
                            {formatINR(m.closingBalance)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 text-[10px]">
                            {((m.principalPaid / m.emi) * 100).toFixed(0)}% P
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* ALL MONTHS FLAT VIEW */
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">{t.colMonth}</th>
                <th className="py-2.5 px-3 text-right">{t.colOpening}</th>
                <th className="py-2.5 px-3 text-right">{t.colEmi}</th>
                <th className="py-2.5 px-3 text-right">{t.colPrincipal}</th>
                <th className="py-2.5 px-3 text-right">{t.colInterest}</th>
                <th className="py-2.5 px-3 text-right">{t.colClosing}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedule.map((m) => (
                <tr
                  key={m.month}
                  className="hover:bg-slate-50/80 transition-colors bg-white font-normal"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 tabular-nums">
                    <span>#{m.month}</span>
                    {m.prepaymentPaid && m.prepaymentPaid > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        +{formatINR(m.prepaymentPaid)} Extra
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">
                    {formatINR(m.openingBalance)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-900">
                    {formatINR(m.emi)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-emerald-800 font-medium">
                    {formatINR(m.principalPaid)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-amber-800 font-medium">
                    {formatINR(m.interestPaid)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 font-medium">
                    {formatINR(m.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Early Payoff Celebratory Banner if prepayments saved months */}
      {result.prepaymentImpact && result.prepaymentImpact.monthsSaved > 0 && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎉</span>
            <div>
              <strong className="font-bold text-emerald-900">
                {language === 'hi'
                  ? `लोन समय से पहले खत्म! (महीना #${result.prepaymentImpact.payoffMonth} में पूरा चुकता)`
                  : `Loan Fully Paid Off in Month #${result.prepaymentImpact.payoffMonth}!`}
              </strong>
              <div className="text-[11px] text-emerald-800">
                {language === 'hi'
                  ? `आपने कुल ${result.prepaymentImpact.monthsSaved} महीने बचाए और ₹${formatINR(result.prepaymentImpact.interestSaved)} ब्याज की बचत की!`
                  : `You saved ${result.prepaymentImpact.monthsSaved} months and ₹${formatINR(result.prepaymentImpact.interestSaved)} in interest!`}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 px-2 py-1 rounded shrink-0">
            {language === 'hi' ? 'ऋण मुक्त' : 'Debt Free'}
          </span>
        </div>
      )}
    </div>
  );
};
