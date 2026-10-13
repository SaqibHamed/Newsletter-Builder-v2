import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  HelpCircle,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  AUTOLINA_ASSET_URLS,
  ASSET_SPECIFICATIONS,
  AUTOLINA_LOGO_CODE_PNG,
  APP_STORE_BADGE_CODE_PNG,
  GOOGLE_PLAY_BADGE_CODE_PNG,
  getAutolinaLogoHtml,
  getAppleBadgeHtml,
  getGooglePlayBadgeHtml,
} from '../utils/autolinaAssets';

interface BrandAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandAssetsModal: React.FC<BrandAssetsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div
      id="brand-assets-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        id="brand-assets-modal-dialog"
        className="bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1B3C71] text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-4 h-4 text-[#2AAAB6]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 leading-tight">
                Brand-Assets, CodePNG & Outlook-Spezifikationen
              </h2>
              <p className="text-[11px] text-zinc-500">
                Offizielle autolina CDN-Grafiken, CodePNG Base64 & massgeschneiderte Skalierung
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Schliessen"
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-zinc-700">
          {/* 1. Outlook & Skalierungs-Erklärung (Beantwortung der Fragen) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Warum ist der Inhalt in Outlook visuell kantig und das Logo gestreckt?</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-amber-900/90 leading-relaxed">
              <div className="bg-white/80 p-3 rounded-lg border border-amber-200/60 space-y-1">
                <p className="font-bold text-zinc-900">1. Kantig in Outlook</p>
                <p>
                  Outlook Desktop (Windows) nutzt Microsoft Word als HTML-Engine. Word unterstützt <strong>kein CSS border-radius</strong> und keine Box-Shadows. Daher wirken Standard-Karten mit 90°-Ecken &bdquo;kantig&ldquo;.
                </p>
                <p className="text-[10px] text-zinc-500 pt-1">
                  &bull; <strong>Lösung:</strong> Buttons werden via Microsoft VML (<code className="font-mono text-[9px]">&lt;v:roundrect&gt;</code>) gerendert, Karten mit sauber definierten Innenabständen ohne verzogene Rahmen.
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-amber-200/60 space-y-1">
                <p className="font-bold text-zinc-900">2. Logo gestreckt & ausgeblendet</p>
                <p>
                  Outlook ignoriert <code className="font-mono text-[10px]">height: auto</code>. Wenn Pixel-Breite und Höhe nicht exakt dem mathematischen Seitenverhältnis entsprechen, verzerrt Word das Bild.
                </p>
                <p className="text-[10px] text-zinc-500 pt-1">
                  &bull; <strong>Vorab ausgeblendet:</strong> Outlook blockiert externe Bilder standardmässig aus Datenschutzgründen, bis der Empfänger auf &bdquo;Bilder laden&ldquo; klickt.
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-amber-200/60 space-y-1">
                <p className="font-bold text-zinc-900">3. Richtige CodePNG-Resolution</p>
                <p>
                  Für gestochen scharfe <strong>2x / 3x Retina-Darstellung</strong> ohne MSO-Stretching:
                </p>
                <ul className="text-[10px] space-y-0.5 list-disc list-inside text-zinc-600">
                  <li><strong>Header-Logo:</strong> 180×42 px &rarr; <strong>360×84 px</strong> (oder Upload 689×162 px, 4.25:1)</li>
                  <li><strong>Badges:</strong> 130×40 px &rarr; <strong>260×80 px</strong> (oder Upload 527×162 px, 3.25:1)</li>
                  <li><strong>Grafiken:</strong> 536 px &rarr; <strong>1072×804 px</strong> (4:3)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Die 3 hinterlegten Original-Grafiken mit Dimensionen & Code-Optionen */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2AAAB6]" />
              <span>Hinterlegte Marken-Assets & Dimensionen</span>
            </h3>

            {/* Asset 1: autolina Logo */}
            <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-44 bg-white border border-zinc-200 rounded-lg p-2 flex items-center justify-center shadow-2xs">
                    <img
                      src={AUTOLINA_ASSET_URLS.logo}
                      alt="autolina Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-xs">autolina Logo (Offiziell)</h4>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Original: 689 × 162 px &bull; Verhältnis: 4.253 : 1 &bull; PNG Alpha
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => copyText(AUTOLINA_ASSET_URLS.logo, 'logo-url')}
                    className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'logo-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>CDN-URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(getAutolinaLogoHtml(180, 42), 'logo-html')}
                    className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'logo-html' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>E-Mail HTML (180×42)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(AUTOLINA_LOGO_CODE_PNG, 'logo-codepng')}
                    className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'logo-codepng' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>CodePNG (Base64)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-zinc-200 text-[11px] font-mono space-y-1 overflow-x-auto text-zinc-600">
                <div className="text-[10px] text-zinc-400 font-sans font-semibold">ActiveCampaign CDN-URL:</div>
                <div className="select-all text-[#1B3C71] break-all">{AUTOLINA_ASSET_URLS.logo}</div>
                <div className="pt-1 flex items-center gap-4 text-[10px] text-zinc-500 font-sans">
                  <span><strong>Header-Vorschau:</strong> 180 × 42 px</span>
                  <span><strong>Footer-Vorschau:</strong> 140 × 33 px</span>
                  <span><strong>CodePNG-Grösse:</strong> 24.3 KB</span>
                </div>
              </div>
            </div>

            {/* Asset 2: Apple App Store Badge */}
            <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-44 bg-white border border-zinc-200 rounded-lg p-2 flex items-center justify-center shadow-2xs">
                    <img
                      src={AUTOLINA_ASSET_URLS.appleBadge}
                      alt="App Store Badge"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-xs">Apple App Store Badge</h4>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Original: 527 × 162 px &bull; Verhältnis: 3.253 : 1 &bull; PNG
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => copyText(AUTOLINA_ASSET_URLS.appleBadge, 'app-url')}
                    className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'app-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>CDN-URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(getAppleBadgeHtml(130, 40), 'app-html')}
                    className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'app-html' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>E-Mail HTML (130×40)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(APP_STORE_BADGE_CODE_PNG, 'app-codepng')}
                    className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'app-codepng' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>CodePNG (Base64)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-zinc-200 text-[11px] font-mono space-y-1 overflow-x-auto text-zinc-600">
                <div className="text-[10px] text-zinc-400 font-sans font-semibold">ActiveCampaign CDN-URL:</div>
                <div className="select-all text-[#1B3C71] break-all">{AUTOLINA_ASSET_URLS.appleBadge}</div>
                <div className="pt-1 flex items-center gap-4 text-[10px] text-zinc-500 font-sans">
                  <span><strong>E-Mail Anzeige:</strong> 130 × 40 px</span>
                  <span><strong>2x Retina Source:</strong> 260 × 80 px</span>
                  <span><strong>CodePNG-Grösse:</strong> 21.6 KB</span>
                </div>
              </div>
            </div>

            {/* Asset 3: Google Play Store Badge */}
            <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-44 bg-white border border-zinc-200 rounded-lg p-2 flex items-center justify-center shadow-2xs">
                    <img
                      src={AUTOLINA_ASSET_URLS.googlePlayBadge}
                      alt="Google Play Badge"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-xs">Google Play Store Badge</h4>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Original: 527 × 162 px &bull; Verhältnis: 3.253 : 1 &bull; PNG
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => copyText(AUTOLINA_ASSET_URLS.googlePlayBadge, 'play-url')}
                    className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'play-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>CDN-URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(getGooglePlayBadgeHtml(130, 40), 'play-html')}
                    className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'play-html' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>E-Mail HTML (130×40)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(GOOGLE_PLAY_BADGE_CODE_PNG, 'play-codepng')}
                    className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    {copiedKey === 'play-codepng' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                    <span>CodePNG (Base64)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-zinc-200 text-[11px] font-mono space-y-1 overflow-x-auto text-zinc-600">
                <div className="text-[10px] text-zinc-400 font-sans font-semibold">ActiveCampaign CDN-URL:</div>
                <div className="select-all text-[#1B3C71] break-all">{AUTOLINA_ASSET_URLS.googlePlayBadge}</div>
                <div className="pt-1 flex items-center gap-4 text-[10px] text-zinc-500 font-sans">
                  <span><strong>E-Mail Anzeige:</strong> 130 × 40 px</span>
                  <span><strong>2x Retina Source:</strong> 260 × 80 px</span>
                  <span><strong>CodePNG-Grösse:</strong> 21.7 KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500">
            Alle Grafiken sind fest im System verankert und im Newsletter-HTML vorkonfiguriert.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white font-semibold text-xs hover:bg-black transition-colors"
          >
            Schliessen
          </button>
        </div>
      </div>
    </div>
  );
};
