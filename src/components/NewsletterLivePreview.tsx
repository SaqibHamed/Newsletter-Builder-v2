import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  RotateCcw,
  Copy,
  Check,
  Bell,
  BellOff,
  Car,
  Tag,
  UserCheck,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Link as LinkIcon,
  Layout,
  Mail,
  Image as ImageIcon,
} from 'lucide-react';
import { CompanySettings, NewsletterMeta, NewsletterNode, NodeType, PreviewDevice } from '../types';
import { sampleTemplates } from '../data/defaultNewsletter';
import { generateEmailHtml } from '../utils/htmlGenerator';
import { BrandAssetsModal } from './BrandAssetsModal';
import {
  AUTOLINA_ASSET_URLS,
  AUTOLINA_LIVE_LOGO_PNG,
  APPLE_APP_STORE_BADGE_PNG,
  GOOGLE_PLAY_STORE_BADGE_PNG,
  AUTOLINA_APP_STORE_URL,
  AUTOLINA_PLAY_STORE_URL,
  getSocialMediaLinksHtml,
  formatPlaceholderTag,
  isPlaceholderGraphic,
  replaceSystemTags,
  SYSTEM_TAGS_LIST,
} from '../utils/autolinaAssets';
import {
  AutolinaLogo,
  AppStoreBadge,
  GooglePlayBadge,
  VehicleDateIcon,
  VehicleMileageIcon,
  VehiclePowerIcon,
  VehicleTransmissionIcon,
  VehicleFuelIcon,
  VehicleDriveIcon,
} from './AutolinaBrandAssets';

interface NewsletterLivePreviewProps {
  nodes: NewsletterNode[];
  meta: NewsletterMeta;
  company: CompanySettings;
  selectedNodeId?: string | null;
  onSelectNode?: (id: string) => void;
  onSelectTemplate?: (templateId: string) => void;
  onReset?: () => void;
  onCopyHtml?: () => void;
  copied?: boolean;
  warningNotifications?: boolean;
  onToggleWarningNotifications?: () => void;
  onToggleSecurityNotice?: () => void;
  onToggleValediction?: () => void;
  isDraggingExternal?: boolean;
  draggedBrickType?: NodeType | null;
  onInsertBrickAtIndex?: (type: NodeType, index: number) => void;
}

export const NewsletterLivePreview: React.FC<NewsletterLivePreviewProps> = ({
  nodes,
  meta,
  company,
  selectedNodeId,
  onSelectNode,
  onSelectTemplate,
  onReset,
  onCopyHtml,
  copied = false,
  warningNotifications = true,
  onToggleWarningNotifications,
  onToggleSecurityNotice,
  onToggleValediction,
  isDraggingExternal = false,
  draggedBrickType = null,
  onInsertBrickAtIndex,
}) => {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [renderMode, setRenderMode] = useState<'visual' | 'html-client'>('visual');
  // Tag-Modus: 'tags' (zeigt CRM System-Tags wie %SALUTATION% und %LASTNAME% mit visueller Hervorhebung) oder 'sample' (zeigt z.B. Herr Rossi)
  const [tagPreviewMode, setTagPreviewMode] = useState<'tags' | 'sample'>('tags');
  const [showBrandAssetsModal, setShowBrandAssetsModal] = useState<boolean>(false);
  const [sampleRecipient, setSampleRecipient] = useState({
    anrede: 'Herr',
    nachname: 'Muster',
  });

  const containerWidthStyle =
    device === 'mobile' ? '375px' : device === 'tablet' ? '480px' : '600px';

  // Helper zum Rendern von Texten mit Personalisierungs- und Fahrzeug-System-Tags
  const renderWithTags = (text?: string): React.ReactNode => {
    if (!text) return '';
    if (tagPreviewMode === 'sample') {
      return replaceSystemTags(text, {
        SALUTATION: sampleRecipient.anrede,
        LASTNAME: sampleRecipient.nachname,
      });
    }

    // 'tags' Modus: Alle CRM-Tags und Aliase werden visuell hervorgehoben dargestellt
    const parts = text.split(/(%[A-Z0-9_ÄÖÜa-zäöü\-]+%)/g);
    if (parts.length === 1) return text;

    return parts.map((part, i) => {
      if (!part.startsWith('%') || !part.endsWith('%')) {
        return part;
      }

      const upper = part.toUpperCase();
      const matchedTag = SYSTEM_TAGS_LIST.find((t) => t.tag.toUpperCase() === upper);

      let badgeStyle = "bg-amber-100 text-amber-950 border-amber-300";
      let catTitle = matchedTag ? `${matchedTag.category}: ${matchedTag.label}` : `System-Tag: ${part}`;

      if (matchedTag) {
        switch (matchedTag.category) {
          case 'Allgemeine Details':
            badgeStyle = "bg-sky-100 text-sky-950 border-sky-300 font-bold";
            break;
          case 'Address':
            badgeStyle = "bg-amber-100 text-amber-950 border-amber-300 font-semibold";
            break;
          case 'Engagement':
            badgeStyle = "bg-purple-100 text-purple-950 border-purple-300 font-semibold";
            break;
          case 'Vehicle information':
            badgeStyle = "bg-teal-100 text-teal-950 border-teal-300 font-bold";
            break;
          case 'Subscription':
            badgeStyle = "bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold";
            break;
          case 'Dealership information':
            badgeStyle = "bg-orange-100 text-orange-950 border-orange-300 font-bold";
            break;
          case 'Transactional information':
            badgeStyle = "bg-cyan-100 text-cyan-950 border-cyan-300 font-semibold";
            break;
        }
      } else {
        // Fallback für Legacy-Tags
        const lower = part.toLowerCase();
        if (lower.includes('mail')) badgeStyle = "bg-purple-100 text-purple-950 border-purple-300 font-bold";
        else if (lower.includes('fahrzeug') || lower.includes('marke') || lower.includes('modell') || lower.includes('preis')) badgeStyle = "bg-teal-100 text-teal-950 border-teal-300 font-bold";
        else if (lower.includes('firma')) badgeStyle = "bg-orange-100 text-orange-950 border-orange-300 font-bold";
        else if (lower.includes('termin')) badgeStyle = "bg-cyan-100 text-cyan-950 border-cyan-300 font-bold";
        else if (lower.includes('bild')) badgeStyle = "bg-indigo-100 text-indigo-950 border-indigo-300 font-semibold";
      }

      return (
        <span
          key={i}
          className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[0.88em] border mx-0.5 shadow-2xs select-all ${badgeStyle}`}
          title={`${catTitle} (Beispiel: ${matchedTag?.example || ''})`}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div
      id="newsletter-live-preview-wrapper"
      className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full"
    >
      {/* Top Toolbar: Unified Workspace Controls */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        {/* Left: Template Selector, Reset & Device Switcher */}
        <div className="flex items-center gap-2">
          {onSelectTemplate && (
            <div className="relative flex items-center">
              <FolderOpen className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
              <select
                id="template-selector-dropdown"
                onChange={(e) => onSelectTemplate(e.target.value)}
                defaultValue="welcome"
                aria-label="autolina E-Mail-Vorlage auswählen"
                className="text-xs font-medium pl-8 pr-7 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer transition-colors shadow-2xs max-w-[210px] sm:max-w-none truncate"
              >
                {sampleTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    Vorlage: {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {onReset && (
            <button
              id="reset-template-btn"
              onClick={onReset}
              title="Auf Vorlage zurücksetzen"
              className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          {/* Device Switcher */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                device === 'desktop'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Desktop Ansicht (600px Inhaltsbreite)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                device === 'tablet'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Tablet Ansicht (480px Inhaltsbreite)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                device === 'mobile'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Smartphone Ansicht (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Render-Modus: Designer (Interaktiv) vs E-Mail-Client (HTML) */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setRenderMode('visual')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                renderMode === 'visual'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Interaktiver Designer mit Klick-Auswahl und Drag & Drop"
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Designer</span>
            </button>
            <button
              type="button"
              onClick={() => setRenderMode('html-client')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                renderMode === 'html-client'
                  ? 'bg-[#2E3E6C] text-white font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Echtes HTML-Rendering wie in Outlook, Gmail und Apple Mail nach dem Versand"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden md:inline">E-Mail Client (HTML)</span>
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-200 hidden md:block" />

          {/* System-Tags / Personalisierung Switcher */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              id="preview-mode-tags-btn"
              type="button"
              onClick={() => setTagPreviewMode('tags')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                tagPreviewMode === 'tags'
                  ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Original System-Tags %SALUTATION% und %LASTNAME% anzeigen"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] font-semibold">%SALUTATION% / %LASTNAME%</span>
            </button>
            <button
              id="preview-mode-sample-btn"
              type="button"
              onClick={() => setTagPreviewMode('sample')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                tagPreviewMode === 'sample'
                  ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Vorschau mit simulierten Empfängerdaten"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Vorschau:</span>
              <span className="text-[11px] font-medium">{sampleRecipient.anrede} {sampleRecipient.nachname}</span>
            </button>
          </div>
        </div>

        {/* Right: Toggle Warnings, Security Notice, Zoom & HTML Copy Button */}
        <div className="flex items-center gap-2">
          {/* Grussformel Toggle (Freundliche Grüsse / Liebe Grüsse) */}
          {onToggleValediction !== undefined && (
            <div
              id="valediction-toggle-container"
              className="flex items-center gap-1.5 px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs shadow-2xs select-none"
              title={
                company.valedictionStyle === 'informal'
                  ? 'Aktuelle Grussformel: Liebe Grüsse / Dein autolina Team (Klicken zum Umschalten auf Freundliche Grüsse)'
                  : 'Aktuelle Grussformel: Freundliche Grüsse / Ihr autolina Team (Klicken zum Umschalten auf Liebe Grüsse)'
              }
            >
              <span className="text-[11px] font-medium text-zinc-700 hidden md:inline">
                Grussformel:
              </span>
              <button
                id="toggle-valediction-btn"
                type="button"
                onClick={onToggleValediction}
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 flex items-center gap-1"
                title="Zwischen 'Freundliche Grüsse / Ihr autolina Team' und 'Liebe Grüsse / Dein autolina Team' umschalten"
              >
                <span className={company.valedictionStyle !== 'informal' ? 'text-blue-900 font-bold' : 'text-zinc-500 font-normal'}>
                  Sie
                </span>
                <span className="text-zinc-300">/</span>
                <span className={company.valedictionStyle === 'informal' ? 'text-blue-900 font-bold' : 'text-zinc-500 font-normal'}>
                  Du
                </span>
                <span className="ml-1 text-[10px] font-mono text-zinc-500 hidden xl:inline">
                  ({company.valedictionStyle === 'informal' ? 'Liebe Grüsse' : 'Freundliche Grüsse'})
                </span>
              </button>
            </div>
          )}

          {/* Security Notice Toggle ("Vorsicht vor Betrügern...") */}
          {onToggleSecurityNotice !== undefined && (
            <div
              id="security-notice-toggle-container"
              className="flex items-center gap-1.5 px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs shadow-2xs select-none"
              title="Vorsicht vor Betrügern: autolina würde Sie nie nach Ihrem Passwort oder persönlichen Daten fragen... (Klicken zum Ein-/Ausblenden)"
            >
              {company.showSecurityNotice !== false ? (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span className="text-[11px] font-medium text-zinc-700 hidden sm:inline">
                Sicherheitshinweis
              </span>
              <button
                id="toggle-security-notice-btn"
                type="button"
                role="switch"
                aria-checked={company.showSecurityNotice !== false}
                aria-label="Sicherheitshinweis 'Vorsicht vor Betrügern' aktivieren oder ausblenden"
                onClick={onToggleSecurityNotice}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  company.showSecurityNotice !== false ? 'bg-[#1B4B97]' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    company.showSecurityNotice !== false ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Warning Notifications Toggle */}
          {onToggleWarningNotifications !== undefined && (
            <div
              id="warning-notifications-toggle-container"
              className="flex items-center gap-1.5 px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs shadow-2xs select-none"
              title={
                warningNotifications
                  ? 'Warnhinweise & Benachrichtigungen aktiviert (Klicken zum Deaktivieren)'
                  : 'Warnhinweise & Benachrichtigungen deaktiviert (Klicken zum Aktivieren)'
              }
            >
              {warningNotifications ? (
                <Bell className="w-3.5 h-3.5 text-zinc-700" />
              ) : (
                <BellOff className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span className="text-[11px] font-medium text-zinc-700 hidden md:inline">
                Warnungen
              </span>
              <button
                id="toggle-warning-notifications-btn"
                type="button"
                role="switch"
                aria-checked={warningNotifications}
                aria-label="Warnhinweise aktivieren oder deaktivieren"
                onClick={onToggleWarningNotifications}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  warningNotifications ? 'bg-zinc-900' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    warningNotifications ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Zoom */}
          <div className="flex items-center gap-1 text-xs text-zinc-500 bg-white border border-zinc-200 rounded-lg px-1.5 py-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setZoom(Math.max(60, zoom - 15))}
              className="p-1 text-zinc-500 hover:text-zinc-800 rounded hover:bg-zinc-100"
              title="Verkleinern"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-8 text-center">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom(Math.min(120, zoom + 15))}
              className="p-1 text-zinc-500 hover:text-zinc-800 rounded hover:bg-zinc-100"
              title="Vergrössern"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Brand Assets & CodePNG Button */}
          <button
            id="preview-brand-assets-btn"
            type="button"
            onClick={() => setShowBrandAssetsModal(true)}
            className="px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Brand-Assets, ActiveCampaign CDN & CodePNG Base64 einsehen"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#2AAAB6]" />
            <span className="hidden sm:inline">Assets & CodePNG</span>
          </button>

          {/* HTML kopieren Button */}
          {onCopyHtml && (
            <button
              id="copy-html-btn"
              type="button"
              onClick={onCopyHtml}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-all ${
                copied
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-zinc-900 text-white hover:bg-black'
              }`}
              title="E-Mail HTML direkt in die Zwischenablage kopieren (inkl. System-Tags %SALUTATION%, %LASTNAME%)"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>HTML kopieren</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Live Preview Canvas Container with background #F6F6F8 */}
      <div
        id="preview-canvas-container"
        className="flex-1 overflow-auto p-4 sm:p-8 transition-all flex justify-center items-start"
        style={{ backgroundColor: company.backgroundColor || '#F6F6F8' }}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out, width 0.2s ease',
            width: containerWidthStyle,
            maxWidth: '100%',
            margin: '0 auto',
          }}
          className={`nl-container ${
            device === 'mobile'
              ? 'nl-device-mobile is-mobile'
              : device === 'tablet'
              ? 'nl-device-tablet'
              : 'nl-device-desktop'
          }`}
        >
          {renderMode === 'html-client' ? (
            <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="font-semibold text-slate-800">
                    Echter E-Mail-Client Renderer (Sandboxed Iframe)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Tabellen &amp; Inline-CSS • {containerWidthStyle}
                </span>
              </div>
              <iframe
                title="E-Mail Client HTML Vorschau"
                srcDoc={generateEmailHtml(nodes, meta, company)}
                className="w-full border-0"
                style={{ minHeight: '820px', height: '100%', width: '100%', display: 'block' }}
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <>
          {/* BLOCK 1: HEADER (Weisser Hintergrund, 24px Padding, 20px Radius) */}
          <div className="nl-card nl-header-card flex items-center justify-center">
            <a
              href="https://www.autolina.ch"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-opacity hover:opacity-85"
              title="autolina.ch - Der Schweizer Fahrzeugmarkt"
            >
              <img
                src={company.logoUrl || AUTOLINA_LIVE_LOGO_PNG}
                alt="autolina.ch"
                width={180}
                height={42}
                className="h-[42px] w-[180px] max-w-full object-contain select-none"
                style={{ aspectRatio: '689 / 162' }}
              />
            </a>
          </div>

          {/* BLOCK 2: INHALT (Weisser Hintergrund, 32px Padding, 20px Radius, 24px innerer Abstand) */}
          <div
            id="preview-newsletter-card"
            className={`nl-card nl-content-card transition-all ${
              isDraggingExternal ? 'ring-2 ring-dashed ring-teal-500/80' : ''
            }`}
            onDragOver={(e) => {
              if (onInsertBrickAtIndex) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (onInsertBrickAtIndex) {
                e.preventDefault();
                e.stopPropagation();
                const validTypes: NodeType[] = [
                  'title',
                  'heading',
                  'sub_heading',
                  'paragraph',
                  'gap_absorber',
                  'graphic',
                  'bullet_list',
                  'numbered_list',
                  'two_col_left_graphic',
                  'two_col_right_graphic',
                  'button_cta',
                  'vehicle_card',
                  'url',
                ];
                let bType = e.dataTransfer.getData('brick-type') as NodeType;
                if (!bType || !validTypes.includes(bType)) {
                  bType = e.dataTransfer.getData('text/plain') as NodeType;
                }
                if (!bType || !validTypes.includes(bType)) {
                  if (draggedBrickType && validTypes.includes(draggedBrickType)) {
                    bType = draggedBrickType;
                  }
                }
                if (bType && validTypes.includes(bType)) {
                  onInsertBrickAtIndex(bType, nodes.length);
                }
              }
            }}
          >
            <div className="nl-stack">
              {nodes.map((node, index) => {
                const isSelected = selectedNodeId === node.id;
                const interactiveClasses = onSelectNode
                  ? `cursor-pointer transition-all duration-150 p-1 -m-1 rounded-lg ${
                      isSelected
                        ? 'ring-2 ring-[#2E3E6C] ring-offset-2 bg-slate-50/50'
                        : 'hover:ring-1 hover:ring-zinc-300'
                    }`
                  : '';

                const handleNodeDrop = (e: React.DragEvent) => {
                  if (!onInsertBrickAtIndex) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const validTypes: NodeType[] = [
                    'title',
                    'heading',
                    'sub_heading',
                    'paragraph',
                    'gap_absorber',
                    'graphic',
                    'bullet_list',
                    'numbered_list',
                    'two_col_left_graphic',
                    'two_col_right_graphic',
                    'button_cta',
                    'vehicle_card',
                    'url',
                  ];
                  let bType = e.dataTransfer.getData('brick-type') as NodeType;
                  if (!bType || !validTypes.includes(bType)) {
                    bType = e.dataTransfer.getData('text/plain') as NodeType;
                  }
                  if (!bType || !validTypes.includes(bType)) {
                    if (draggedBrickType && validTypes.includes(draggedBrickType)) {
                      bType = draggedBrickType;
                    }
                  }
                  if (bType && validTypes.includes(bType)) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    const targetIdx = e.clientY < midY ? index : index + 1;
                    onInsertBrickAtIndex(bType, targetIdx);
                  }
                };

                const renderNodeItem = () => {
                  switch (node.type) {
                  case 'title': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <h1 className={`nl-title ${alignClass}`}>
                          {renderWithTags(node.text)}
                        </h1>
                      </div>
                    );
                  }

                  case 'heading': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <h2 className={`nl-heading ${alignClass}`}>
                          {renderWithTags(node.text)}
                        </h2>
                      </div>
                    );
                  }

                  case 'sub_heading': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <h3 className={`nl-subheading ${alignClass}`}>
                          {renderWithTags(node.text)}
                        </h3>
                      </div>
                    );
                  }

                  case 'paragraph': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <p className={`nl-paragraph ${alignClass}`}>
                          {renderWithTags(node.text)}
                        </p>
                      </div>
                    );
                  }

                  case 'gap_absorber': {
                    const gapH = typeof node.height === 'number' ? node.height : 8;
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`${interactiveClasses} group relative py-0.5 select-none`}
                        title={`Gap-Absorber (${gapH}px): Reduziert den Zeilenabstand zwischen den Nachbar-Elementen auf ${gapH}px`}
                      >
                        <div
                          className="w-full flex items-center justify-center border-t border-b border-dashed border-sky-300/60 bg-sky-50/40 rounded transition-all hover:bg-sky-100/60 hover:border-sky-400"
                          style={{ minHeight: `${Math.max(gapH, 6)}px`, height: `${gapH}px` }}
                        >
                          <span className="text-[9px] font-mono font-medium text-sky-600/80 px-2 py-0 bg-white/90 rounded border border-sky-200/60 shadow-2xs group-hover:text-sky-800 transition-colors">
                            Gap-Absorber ({gapH}px)
                          </span>
                        </div>
                      </div>
                    );
                  }

                  case 'graphic': {
                    const isPlaceholder =
                      isPlaceholderGraphic(node.imageUrl) ||
                      (tagPreviewMode === 'tags' &&
                        (node.imageUrl === '%IMAGE%' ||
                          node.imageUrl === '%IMAGE_OF_LISTING%' ||
                          node.imageUrl === '%Bild%' ||
                          node.imageUrl === '%Fahrzeugbild%'));
                    const placeholderTag = formatPlaceholderTag(node.imageUrl, 'IMAGE');

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-graphic ${interactiveClasses} relative`}
                      >
                        {isPlaceholder ? (
                          <div
                            className="w-full aspect-[4/3] rounded-[12px] bg-[#F4F4F6] border border-dashed border-zinc-300 flex items-center justify-center p-6 text-center select-none"
                            style={{ aspectRatio: '4/3' }}
                          >
                            <span className="font-mono text-sm sm:text-base font-semibold text-zinc-600 tracking-wider">
                              {placeholderTag}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={node.imageUrl}
                            alt={node.altText || 'Grafik'}
                            className="nl-img"
                            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/600x450/f4f4f6/94a3b8?text=autolina+Grafik';
                            }}
                          />
                        )}
                        {node.caption && (
                          <p className="nl-caption">{renderWithTags(node.caption)}</p>
                        )}
                      </div>
                    );
                  }

                  case 'bullet_list':
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <ul className="nl-list">
                          {node.items
                            .filter((it) => it.trim().length > 0)
                            .map((item, idx) => {
                              const cleanedItem = item.replace(/^[\s•\-\*\u2022\u25CF\u25CB\u25AA\u25AB]+\s*/, '');
                              return (
                                <li key={idx} className="nl-list-item">
                                  <span className="nl-bullet">•</span>
                                  <span>{renderWithTags(cleanedItem)}</span>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    );

                  case 'numbered_list':
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <ol className="nl-list">
                          {node.items
                            .filter((it) => it.trim().length > 0)
                            .map((item, idx) => (
                              <li key={idx} className="nl-list-item">
                                <span className="nl-badge-num">{idx + 1}.</span>
                                <span>{renderWithTags(item)}</span>
                              </li>
                            ))}
                        </ol>
                      </div>
                    );

                  case 'two_col_left_graphic': {
                    const isMobile = device === 'mobile';
                    const isPlaceholder =
                      isPlaceholderGraphic(node.imageUrl) ||
                      (tagPreviewMode === 'tags' &&
                        (node.imageUrl === '%IMAGE%' ||
                          node.imageUrl === '%IMAGE_OF_LISTING%' ||
                          node.imageUrl === '%Bild%' ||
                          node.imageUrl === '%Fahrzeugbild%'));
                    const placeholderTag = formatPlaceholderTag(node.imageUrl, 'IMAGE');

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-twocol ${isMobile ? 'nl-twocol-mobile' : ''} ${interactiveClasses}`}
                      >
                        {/* 1. Grafik (4:3 Proportion) */}
                        <div className="nl-twocol-media relative overflow-hidden">
                          {isPlaceholder ? (
                            <div
                              className="w-full aspect-[4/3] rounded-[12px] bg-[#F4F4F6] border border-dashed border-zinc-300 flex items-center justify-center p-4 text-center select-none"
                              style={{ aspectRatio: '4/3' }}
                            >
                              <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-600 tracking-wider">
                                {placeholderTag}
                              </span>
                            </div>
                          ) : (
                            <img
                              src={node.imageUrl}
                              alt={node.altText || ''}
                              className="w-full aspect-[4/3] object-cover rounded-[12px]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://placehold.co/400x300/f4f4f6/94a3b8?text=Grafik';
                              }}
                            />
                          )}
                        </div>
                        {/* 2. Titel, 3. Text, 4. Button */}
                        <div className="nl-twocol-body">
                          <h3>{renderWithTags(node.heading)}</h3>
                          <p>{renderWithTags(node.paragraph)}</p>
                          {node.buttonText && (
                            <div className="mt-2">
                              <a
                                href={node.buttonUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="nl-btn"
                              >
                                {renderWithTags(node.buttonText)}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  case 'two_col_right_graphic': {
                    const isMobile = device === 'mobile';
                    const isPlaceholder =
                      isPlaceholderGraphic(node.imageUrl) ||
                      (tagPreviewMode === 'tags' &&
                        (node.imageUrl === '%IMAGE%' ||
                          node.imageUrl === '%IMAGE_OF_LISTING%' ||
                          node.imageUrl === '%Bild%' ||
                          node.imageUrl === '%Fahrzeugbild%'));
                    const placeholderTag = formatPlaceholderTag(node.imageUrl, 'IMAGE');

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-twocol ${
                          isMobile ? 'nl-twocol-mobile' : 'nl-twocol-reverse'
                        } ${interactiveClasses}`}
                      >
                        {/* 1. Grafik (Auf Mobile immer oben, 4:3 Proportion) */}
                        <div className="nl-twocol-media relative overflow-hidden">
                          {isPlaceholder ? (
                            <div
                              className="w-full aspect-[4/3] rounded-[12px] bg-[#F4F4F6] border border-dashed border-zinc-300 flex items-center justify-center p-4 text-center select-none"
                              style={{ aspectRatio: '4/3' }}
                            >
                              <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-600 tracking-wider">
                                {placeholderTag}
                              </span>
                            </div>
                          ) : (
                            <img
                              src={node.imageUrl}
                              alt={node.altText || ''}
                              className="w-full aspect-[4/3] object-cover rounded-[12px]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://placehold.co/400x300/f4f4f6/94a3b8?text=Grafik';
                              }}
                            />
                          )}
                        </div>
                        {/* 2. Titel, 3. Text, 4. Button */}
                        <div className="nl-twocol-body">
                          <h3>{renderWithTags(node.heading)}</h3>
                          <p>{renderWithTags(node.paragraph)}</p>
                          {node.buttonText && (
                            <div className="mt-2">
                              <a
                                href={node.buttonUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="nl-btn"
                              >
                                {renderWithTags(node.buttonText)}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  case 'button_cta': {
                    const alignClass =
                      node.align === 'center'
                        ? 'nl-btn-center'
                        : node.align === 'right'
                        ? 'nl-btn-right'
                        : '';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-btn-wrap ${alignClass} ${interactiveClasses}`}
                      >
                        <a
                          href={node.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="nl-btn nl-btn-cta"
                        >
                          {renderWithTags(node.label)}
                        </a>
                      </div>
                    );
                  }

                  case 'vehicle_card': {
                    const isPlaceholder =
                      isPlaceholderGraphic(node.imageUrl) ||
                      (tagPreviewMode === 'tags' &&
                        (node.imageUrl === '%IMAGE_OF_LISTING%' ||
                          node.imageUrl === '%IMAGE%' ||
                          node.imageUrl === '%Fahrzeugbild%' ||
                          node.imageUrl === '%Bild%'));
                    const placeholderTag = formatPlaceholderTag(node.imageUrl, 'IMAGE_OF_LISTING');
                    const sampleVehicleImg =
                      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80';
                    const brand = node.brand || (node.brandModel?.includes(' ') ? node.brandModel.split(' ')[0] : 'Mercedes-Benz');
                    const model = node.brandModel || '%MODEL%';
                    const price = node.price || "CHF 72'500";
                    const dateVal = node.date || '06.2024';
                    const mileageVal = node.mileage || "256'984 km";
                    const powerVal = node.power || '1296 PS';
                    const transVal = node.transmission || 'Handschaltung';
                    const fuelVal = node.fuelType || 'Plug-in-Hybrid';
                    const driveVal = node.driveTrain || 'Vorderradantrieb';

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-vehicle-card-v2 p-3.5 sm:p-4 bg-[#F4F4F6] rounded-2xl border border-slate-200/80 transition-all ${interactiveClasses}`}
                      >
                        {/* 1. Fahrzeug-Bild (4:3 Proportion) */}
                        <div
                          className="w-full overflow-hidden rounded-xl bg-slate-200 aspect-[4/3] max-h-[340px] relative"
                          style={{ aspectRatio: '4/3' }}
                        >
                          {isPlaceholder && tagPreviewMode === 'tags' ? (
                            <div
                              className="w-full h-full aspect-[4/3] rounded-xl bg-[#F4F4F6] border border-dashed border-zinc-300 flex items-center justify-center p-4 text-center select-none"
                              style={{ aspectRatio: '4/3' }}
                            >
                              <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-600 tracking-wider">
                                {placeholderTag}
                              </span>
                            </div>
                          ) : (
                            <img
                              src={isPlaceholder ? sampleVehicleImg : node.imageUrl}
                              alt={node.altText || model}
                              className="w-full h-full object-cover rounded-xl"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = sampleVehicleImg;
                              }}
                            />
                          )}
                        </div>

                        {/* 2. Marke, Modell & Preis */}
                        <div className="mt-3">
                          <div className="text-xs sm:text-[13px] font-medium text-zinc-500">
                            {renderWithTags(brand)}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-zinc-950 leading-snug mt-0.5">
                            {renderWithTags(model)}
                          </h3>
                          <div className="text-xl sm:text-2xl font-bold text-zinc-950 mt-1 mb-3">
                            {renderWithTags(price)}
                          </div>
                        </div>

                        {/* 3. 6 Spezifikationen (Responsive: PC = 3 Spalten x 2 Reihen, Mobile/Tablet = 2 Spalten x 3 Reihen) */}
                        <div
                          className={
                            device === 'desktop'
                              ? 'grid grid-cols-3 gap-2'
                              : 'grid grid-cols-2 gap-2'
                          }
                        >
                          {/* 1. Datum */}
                          <div className="bg-white rounded-xl px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 border border-slate-100 shadow-2xs min-w-0">
                            <VehicleDateIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-xs font-medium text-zinc-900 truncate">
                              {renderWithTags(dateVal)}
                            </span>
                          </div>

                          {/* 2. KM */}
                          <div className="bg-white rounded-xl px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 border border-slate-100 shadow-2xs min-w-0">
                            <VehicleMileageIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-xs font-medium text-zinc-900 truncate">
                              {renderWithTags(mileageVal)}
                            </span>
                          </div>

                          {/* 3. PS */}
                          <div className="bg-white rounded-xl px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 border border-slate-100 shadow-2xs min-w-0">
                            <VehiclePowerIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-xs font-medium text-zinc-900 truncate">
                              {renderWithTags(powerVal)}
                            </span>
                          </div>

                          {/* 4. Schaltung */}
                          <div className="bg-white rounded-xl px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 border border-slate-100 shadow-2xs min-w-0">
                            <VehicleTransmissionIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-xs font-medium text-zinc-900 truncate">
                              {renderWithTags(transVal)}
                            </span>
                          </div>

                          {/* 5. Energie */}
                          <div className="bg-white rounded-xl px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 border border-slate-100 shadow-2xs min-w-0">
                            <VehicleFuelIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-xs font-medium text-zinc-900 truncate">
                              {renderWithTags(fuelVal)}
                            </span>
                          </div>

                          {/* 6. Antrieb */}
                          <div className="bg-white rounded-xl px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 border border-slate-100 shadow-2xs min-w-0">
                            <VehicleDriveIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-xs font-medium text-zinc-900 truncate">
                              {renderWithTags(driveVal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  case 'url': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    const displayLabel = node.label || node.url || '%LINK_TO_WEBSITE%';
                    const targetHref =
                      tagPreviewMode === 'sample' && (node.url === '%LINK_TO_WEBSITE%' || !node.url)
                        ? 'https://www.autolina.ch'
                        : node.url || '%LINK_TO_WEBSITE%';

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`${interactiveClasses} ${alignClass} py-1.5`}
                      >
                        <a
                          href={targetHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.preventDefault()}
                          className="font-bold text-[#2E3E6C] underline text-[16px] leading-[150%] hover:text-[#1B3C71] break-all inline-block transition-colors"
                          title={`URL-Baustein: ${node.url || '%LINK_TO_WEBSITE%'}`}
                        >
                          {renderWithTags(displayLabel)}
                        </a>
                      </div>
                    );
                  }

                  default:
                    return null;
                }
              };

              // Ermitteln, ob dieser Knoten oder der Nachbar ein Gap-Absorber ist,
              // um den standardmässigen 24px flex-gap in der Vorschau visuell auf die Absorber-Höhe (8px) zu reduzieren
              const isGapAbsorber = node.type === 'gap_absorber';
              const gapH = isGapAbsorber && typeof (node as any).height === 'number' ? (node as any).height : 8;
              // Flex-Gap ist 24px (12px oben, 12px unten). Ein negativer Margin von -(24 - gapH)/2 reduziert den effektiven Abstand perfekt.
              const pullMargin = isGapAbsorber ? Math.max(0, Math.round((24 - gapH) / 2)) : 0;

              return (
                <div
                  key={node.id}
                  onDragOver={(e) => {
                    if (onInsertBrickAtIndex) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = 'copy';
                    }
                  }}
                  onDrop={handleNodeDrop}
                  className={`transition-all ${isGapAbsorber ? 'relative z-10' : ''}`}
                  style={isGapAbsorber ? { marginTop: `-${pullMargin}px`, marginBottom: `-${pullMargin}px` } : undefined}
                >
                  {renderNodeItem()}
                </div>
              );
            })}
            </div>

            {/* Feste Grussformel gemäss Style Guide */}
            <div className="nl-closing">
              <p>
                {company.valedictionStyle === 'informal' ? (
                  <>
                    Liebe Grüsse<br />
                    Dein autolina Team
                  </>
                ) : (
                  <>
                    Freundliche Grüsse<br />
                    Ihr autolina Team
                  </>
                )}
              </p>
            </div>
          </div>

          {/* BLOCK 3: FOOTER (Weisser Hintergrund, 32px Padding, 20px Radius, 24px innerer Abstand) */}
          <div id="preview-footer-card" className="nl-card nl-footer-card">
            <div className="nl-footer-stack">
              {/* 1. autolina-Logo (zentriert) */}
              <div className="flex justify-center">
                <a
                  href="https://www.autolina.ch"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block transition-opacity hover:opacity-85"
                  title="autolina.ch - Der Schweizer Fahrzeugmarkt"
                >
                  <img
                    src={company.logoUrl || AUTOLINA_LIVE_LOGO_PNG}
                    alt="autolina.ch"
                    width={140}
                    height={33}
                    className="h-[33px] w-[140px] max-w-full object-contain select-none"
                    style={{ aspectRatio: '689 / 162' }}
                  />
                </a>
              </div>

              {/* 2. Adressblock (zentriert) */}
              <div className="nl-address-block">
                <p className="font-semibold text-zinc-900">autolina.ch ag</p>
                <p>Bahnhofstrasse 24c</p>
                <p>8570 Weinfelden, Schweiz</p>
                <p className="mt-1">
                  <a
                    href="mailto:service@autolina.ch"
                    className="text-[#2E3E6C] underline hover:opacity-85"
                  >
                    service@autolina.ch
                  </a>
                </p>
                <p>
                  <a
                    href="https://www.autolina.ch"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2E3E6C] underline hover:opacity-85"
                  >
                    www.autolina.ch
                  </a>
                </p>
              </div>

              {/* 3. Trennlinie (#E5E5E8, 1px) */}
              <div className="nl-divider" />

              {/* 4. App-Store-Badges (nebeneinander, zentriert, stacken responsive) */}
              <div className="nl-badges-wrap flex items-center justify-center gap-3 flex-wrap">
                <a
                  href={AUTOLINA_APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-opacity hover:opacity-85"
                  title="Laden im App Store"
                >
                  <img
                    src={APPLE_APP_STORE_BADGE_PNG}
                    alt="Download on the App Store"
                    width={130}
                    height={40}
                    className="h-[40px] w-[130px] object-contain rounded-md shadow-2xs select-none"
                    style={{ aspectRatio: '527 / 162' }}
                  />
                </a>
                <a
                  href={AUTOLINA_PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-opacity hover:opacity-85"
                  title="JETZT BEI Google Play"
                >
                  <img
                    src={GOOGLE_PLAY_STORE_BADGE_PNG}
                    alt="JETZT BEI Google Play"
                    width={130}
                    height={40}
                    className="h-[40px] w-[130px] object-contain rounded-md shadow-2xs select-none"
                    style={{ aspectRatio: '527 / 162' }}
                  />
                </a>
              </div>

              {/* 5. Trennlinie (#E5E5E8, 1px) */}
              <div className="nl-divider" />

              {/* 6. Social-Media-Links (nebeneinander, zentriert, Icons + Text in #000000) */}
              <div
                className="nl-social-wrap"
                dangerouslySetInnerHTML={{ __html: getSocialMediaLinksHtml() }}
              />
            </div>
          </div>

          {/* BLOCK 4: SICHERHEITSHINWEIS (Dunkelblau #1B4B97, 24px Padding, 20px Radius) */}
          {company.showSecurityNotice !== false && (
            <div id="preview-security-blue-box" className="nl-security-card animate-fadeIn">
              <p>
                <strong>Vorsicht vor Betrügern:</strong>{' '}
                autolina würde Sie nie nach Ihrem Passwort oder persönlichen Daten fragen oder Sie auffordern, diese zu ändern. Sollten Sie eine E-Mail mit einer entsprechenden Aufforderung erhalten, bitten wir Sie, die betreffende E-Mail zu ignorieren und umgehend unseren Support unter{' '}
                <a href="mailto:service@autolina.ch">
                  service@autolina.ch
                </a>{' '}
                zu kontaktieren.
              </p>
            </div>
          )}
          </>
          )}
        </div>
      </div>

      {/* Brand Assets, CodePNG & Outlook Specs Modal */}
      <BrandAssetsModal
        isOpen={showBrandAssetsModal}
        onClose={() => setShowBrandAssetsModal(false)}
      />
    </div>
  );
};
