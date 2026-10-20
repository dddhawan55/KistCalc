import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Smartphone,
  Copy,
  Check,
  QrCode,
  AlertCircle,
  HelpCircle,
  Download,
  Key,
} from 'lucide-react';
import { Language } from '../utils/translations';

interface MobileGuideModalProps {
  language: Language;
  onClose: () => void;
}

export const MobileGuideModal: React.FC<MobileGuideModalProps> = ({ language, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Use the verified Shared App URL
  const sharedUrl = 'https://ais-pre-qhdontwst7wbu5nn6xftai-713272011262.asia-east1.run.app';

  useEffect(() => {
    QRCode.toDataURL(sharedUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [sharedUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isHindi = language === 'hi';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isHindi ? 'मोबाइल में कैसे चलाएं?' : 'How to use on your Mobile Phone'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? '403 Error का समाधान और मोबाइल सेटअप' : 'Solving 403 Error and mobile access'}
            </p>
          </div>
        </div>

        {/* 100% WORKING SOLUTION: DOWNLOAD MOBILE HTML FILE */}
        <div className="mb-5 p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-950 shadow-xs">
          <div className="flex items-start gap-2.5">
            <Download className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-2 flex-1">
              <strong className="text-sm font-bold text-emerald-900 block">
                {isHindi ? '100% पक्का समाधान: मोबाइल ऐप फ़ाइल डाउनलोड करें' : '100% Working Fix: Download Mobile App File'}
              </strong>
              <p className="text-emerald-800 leading-relaxed">
                {isHindi
                  ? 'Google Cloud Run की 403 पाबंदी से बचने के लिए, हमने इस ऐप की एक सिंगल "KistCalc.html" फ़ाइल तैयार की है। इसे डाउनलोड करके WhatsApp पर अपने फ़ोन में भेज लें — यह बिना किसी लॉगिन या इंटरनेट के आपके फ़ोन में 100% चलेगी!'
                  : 'Download the standalone KistCalc.html file and send it to your phone via WhatsApp. It opens directly in any mobile browser without 403 errors or internet!'}
              </p>

              <a
                href="/kistcalc-mobile.html"
                download="KistCalc_Loan_Calculator.html"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isHindi ? '📥 KistCalc.html फ़ाइल डाउनलोड करें (Free)' : '📥 Download KistCalc.html'}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* WHY 403 HAPPENS */}
        <div className="mb-5 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-xs font-bold text-amber-900 block">
                {isHindi ? 'लिंक से 403 एरर क्यों आ रहा है?' : 'Why the link gives 403 error'}
              </strong>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                {isHindi
                  ? 'Google AI Studio का यह लिंक अभी प्राइवेट डेवलपमेंट मोड में है। जब तक आप AI Studio स्क्रीन के ऊपर दाएँ कोने में "Deploy" बटन नहीं दबाते, तब तक यह लिंक केवल आपके कंप्यूटर के Google खाते से ही खुल सकता है।'
                  : 'AI Studio preview links are private until deployed. External devices cannot bypass Google IAM proxy without deployment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Direct Link Copy */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
            {isHindi ? 'शेयर्ड मोबाइल लिंक (Shared App URL):' : 'Shared Mobile Link:'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={sharedUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono truncate select-all"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'कॉपी हो गया!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'लिंक कॉपी करें' : 'Copy Link'}</span>
                </>
              )}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isHindi
              ? 'इसे WhatsApp पर खुद को भेजें और Google Chrome में खोलें।'
              : 'Send this to WhatsApp and open inside Google Chrome.'}
          </span>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-5">
          <div className="text-xs space-y-1 flex-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'सीधे कैमरे से स्कैन करें' : 'Scan with Camera'}</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {isHindi
                ? 'यदि कैमरे से 403 आए, तो ब्राउज़र में ऊपर 3 डॉट्स दबाकर "Open in Chrome" (Chrome में खोलें) चुनें।'
                : 'If scanning shows 403, tap the 3 dots in the camera popup and select "Open in Chrome".'}
            </p>
          </div>

          <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan to open on mobile"
                className="w-28 h-28 object-contain"
              />
            ) : (
              <div className="w-28 h-28 bg-slate-200 animate-pulse rounded-lg" />
            )}
          </div>
        </div>

        {/* Add to Home Screen Instructions */}
        <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-2">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>
              {isHindi
                ? 'मोबाइल में हमेशा के लिए ऐप कैसे बनाएं? (Add to Home screen)'
                : 'Install on Home Screen'}
            </span>
          </div>

          <p className="text-slate-700 text-[11px] leading-relaxed">
            {isHindi
              ? 'Chrome में लिंक खुल जाने के बाद, ऊपर 3 डॉट्स (⋮) पर क्लिक करें और "Add to Home screen" (होम स्क्रीन पर जोड़ें) चुनें। इससे यह ऐप आपके फोन के मेन्यू में WhatsApp की तरह सेव हो जाएगी और बार-बार लिंक डालने या लॉगिन करने की जरूरत नहीं पड़ेगी!'
              : 'Once opened in Chrome, tap 3 dots (⋮) and select "Add to Home screen". It installs directly on your home screen for 1-tap instant access without re-authenticating!'}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isHindi ? 'समझ गया, धन्यवाद' : 'Understood, Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
