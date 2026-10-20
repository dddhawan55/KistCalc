export type Language = 'hi' | 'en';

export const translations = {
  hi: {
    appTitle: 'स्मार्ट लोन व ब्याज कैलकुलेटर',
    appSubtitle: 'ऑटो कैलकुलेशन · घटता ब्याज दर · फ्लैट दर · फिक्स्ड मूलधन व घटता ब्याज',
    
    // Tabs
    tabReducing: '1. घटता ब्याज दर (Reducing Rate)',
    tabFlat: '2. फ्लैट ब्याज दर (Flat Rate)',
    tabFixedPrincipal: '3. फिक्स्ड मूलधन + घटता ब्याज (Fixed Principal)',
    tabCompare: 'तीनों तरीकों की तुलना (Compare)',

    // Target selector
    autoCalculateLabel: 'आप क्या निकालना चाहते हैं? (Select to Auto-Calculate)',
    calcEmi: 'ईएमआई निकालें (Calculate EMI)',
    calcPrincipal: 'लोन राशि निकालें (Calculate Principal)',
    calcTenure: 'अवधि/किस्तें निकालें (Calculate Tenure)',
    calcRate: 'ब्याज दर निकालें (Calculate Rate)',

    // Fields
    fieldPrincipal: 'मूलधन / लोन राशि (Principal / Loan Amount)',
    fieldRate: 'ब्याज दर (Interest Rate)',
    fieldRateYearly: 'वार्षिक % (Per Annum)',
    fieldRateMonthly: 'मासिक % / सैकड़ा (Per Month)',
    fieldTenure: 'अवधि (Tenure / Duration)',
    fieldTenureYears: 'वर्ष (Years)',
    fieldTenureMonths: 'महीने (Months)',
    fieldEmi: 'मासिक ईएमआई (Monthly EMI Amount)',
    fieldFixedPrincipal: 'प्रति माह फिक्स्ड मूलधन (Fixed Principal / Month)',

    // Buttons & actions
    solveThis: '⚡ इसे निकालें',
    reset: 'रीसेट (Reset)',
    printSchedule: 'प्रिंट / रसीद (Print)',
    exportCsv: 'एक्सेल/CSV डाउनलोड',
    howItWorks: 'यह कैसे काम करता है?',

    // Summary
    summaryEmi: 'मासिक ईएमआई (EMI)',
    summaryFirstEmi: 'पहले महीने की ईएमआई (First Month)',
    summaryLastEmi: 'आखिरी महीने की ईएमआई (Last Month)',
    summaryAvgEmi: 'औसत ईएमआई (Average EMI)',
    summaryTotalInterest: 'कुल ब्याज (Total Interest)',
    summaryTotalPayable: 'कुल भुगतान (Total Amount)',
    summaryPrincipalShare: 'मूलधन का हिस्सा (Principal)',
    summaryInterestShare: 'ब्याज का हिस्सा (Interest)',
    summaryEffectiveApr: 'वास्तविक घटती दर (Effective APR)',
    savingsNotice: 'फ्लैट दर के मुकाबले ब्याज में बचत: ',

    // In-EMI Breakdown
    breakdownTitle: 'प्रति ईएमआई में मूलधन व ब्याज का बंटवारा (In EMI Principal & Interest)',
    month1Breakdown: 'पहला महीना',
    monthMidBreakdown: 'मध्यम अवधि',
    monthEndBreakdown: 'अंतिम महीना',
    sliderMonthSelect: 'महीने की किस्त का विवरण देखें: महीना #',

    // Schedule Table
    scheduleTitle: 'महीनेवार किस्तों की सूची (Amortization Schedule)',
    toggleYearly: 'वार्षिक सारांश (Yearly)',
    toggleMonthly: 'महीनेवार (Monthly)',
    colMonth: 'महीना #',
    colYear: 'वर्ष #',
    colOpening: 'शुरुआती बाकी (Opening Balance)',
    colEmi: 'किस्त (EMI)',
    colPrincipal: 'मूलधन हिस्सा (Principal)',
    colInterest: 'ब्याज हिस्सा (Interest)',
    colClosing: 'अंतिम बाकी (Closing Balance)',

    // Method Explanations
    methodExpReducingTitle: 'घटता ब्याज दर (Reducing Balance EMI)',
    methodExpReducingDesc: 'बैंकों और होम लोन में यही तरीका चलता है। जैसे-जैसे आप किस्त देते हैं, बाकी मूलधन कम होता है और ब्याज केवल बचे हुए मूलधन पर लगता है।',
    
    methodExpFlatTitle: 'फ्लैट ब्याज दर (Flat Rate EMI)',
    methodExpFlatDesc: 'गाड़ी और कुछ पर्सनल लोन में फ्लैट ब्याज लगता है। इसमें पूरे लोन अवधि तक पूरे मूलधन पर ब्याज जोड़ा जाता है, इसलिए यह दिखने में कम पर असल में बहुत महंगा होता है।',
    
    methodExpFixedPrincipalTitle: 'प्रति माह फिक्स्ड मूलधन + घटता ब्याज (Fixed Principal + Reducing Interest)',
    methodExpFixedPrincipalDesc: 'इसमें आप हर महीने मूलधन की एक तय रकम चुकाते हैं (जैसे ₹20,000) और ब्याज बचे हुए बैलेंस पर लगता है। इसमें पहली ईएमआई सबसे ज्यादा होती है और हर महीने ईएमआई घटती जाती है। कुल ब्याज सबसे कम इसी तरीके में लगता है!',

    // Warnings
    emiTooLowWarning: 'ईएमआई की राशि मासिक ब्याज से कम है! इस दर पर लोन कभी खत्म नहीं होगा। कम से कम ईएमआई होनी चाहिए: ',
  },
  en: {
    appTitle: 'Smart Loan & Interest Calculator',
    appSubtitle: 'Auto-Calculation · Reducing Rate · Flat Rate · Fixed Principal Diminishing Interest',
    
    // Tabs
    tabReducing: '1. Reducing Rate (Standard EMI)',
    tabFlat: '2. Flat Rate (Fixed % p.a.)',
    tabFixedPrincipal: '3. Fixed Principal + Reducing Interest',
    tabCompare: 'Compare All 3 Methods',

    // Target selector
    autoCalculateLabel: 'What do you want to calculate? (Select to Auto-Calculate)',
    calcEmi: 'Calculate Monthly EMI',
    calcPrincipal: 'Calculate Loan Principal',
    calcTenure: 'Calculate Tenure (Months/Years)',
    calcRate: 'Calculate Interest Rate %',

    // Fields
    fieldPrincipal: 'Principal / Loan Amount',
    fieldRate: 'Interest Rate',
    fieldRateYearly: 'Yearly % (p.a.)',
    fieldRateMonthly: 'Monthly %',
    fieldTenure: 'Tenure / Duration',
    fieldTenureYears: 'Years',
    fieldTenureMonths: 'Months',
    fieldEmi: 'Monthly EMI Amount',
    fieldFixedPrincipal: 'Fixed Monthly Principal Repayment',

    // Buttons & actions
    solveThis: '⚡ Solve this',
    reset: 'Reset',
    printSchedule: 'Print / Statement',
    exportCsv: 'Export CSV',
    howItWorks: 'How it works?',

    // Summary
    summaryEmi: 'Monthly EMI',
    summaryFirstEmi: '1st Month EMI',
    summaryLastEmi: 'Last Month EMI',
    summaryAvgEmi: 'Average Monthly EMI',
    summaryTotalInterest: 'Total Interest Payable',
    summaryTotalPayable: 'Total Amount Payable',
    summaryPrincipalShare: 'Principal Share',
    summaryInterestShare: 'Interest Share',
    summaryEffectiveApr: 'Effective Reducing APR',
    savingsNotice: 'Interest Saved vs Flat Rate: ',

    // In-EMI Breakdown
    breakdownTitle: 'Per-EMI Principal & Interest Share',
    month1Breakdown: '1st Month',
    monthMidBreakdown: 'Mid Tenure',
    monthEndBreakdown: 'Last Month',
    sliderMonthSelect: 'Inspect specific installment breakdown: Month #',

    // Schedule Table
    scheduleTitle: 'Amortization & Repayment Schedule',
    toggleYearly: 'Yearly Summary',
    toggleMonthly: 'Month by Month',
    colMonth: 'Month #',
    colYear: 'Year #',
    colOpening: 'Opening Balance',
    colEmi: 'Installment (EMI)',
    colPrincipal: 'Principal Paid',
    colInterest: 'Interest Paid',
    colClosing: 'Closing Balance',

    // Method Explanations
    methodExpReducingTitle: 'Reducing Balance Rate (Standard Banking EMI)',
    methodExpReducingDesc: 'Used by major banks for home & car loans. Interest is only charged on the remaining unpaid principal each month.',
    
    methodExpFlatTitle: 'Flat Interest Rate',
    methodExpFlatDesc: 'Used in informal lending or dealer vehicle financing. Interest is charged on the initial principal for the entire loan duration, making it nearly 1.8x more expensive in real APR.',
    
    methodExpFixedPrincipalTitle: 'Fixed Principal + Diminishing Interest',
    methodExpFixedPrincipalDesc: 'You pay a fixed portion of principal every month plus interest on outstanding balance. The monthly payment starts high and drops every single month, resulting in the lowest total interest!',

    // Warnings
    emiTooLowWarning: 'EMI is lower than monthly accrued interest! Loan will never be repaid. Minimum required EMI is: ',
  }
};
