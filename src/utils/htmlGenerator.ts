import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';
import {
  AUTOLINA_LIVE_LOGO_PNG,
  APPLE_APP_STORE_BADGE_PNG,
  GOOGLE_PLAY_STORE_BADGE_PNG,
  AUTOLINA_APP_STORE_URL,
  AUTOLINA_PLAY_STORE_URL,
  getSocialMediaLinksHtml,
  formatPlaceholderTag,
  isPlaceholderGraphic,
} from './autolinaAssets';

/**
 * Generiert 100% E-Mail-Client-kompatibles HTML gemäss Industriestandards (Litmus, Campaign Monitor, Email on Acid).
 * 
 * Behebt Darstellungsfehler in:
 * - Microsoft Outlook (2013-2021, Office 365, Desktop Windows/Mac, Outlook Web App)
 * - Gmail (Webmail, iOS App, Android App, Google Workspace)
 * - Apple Mail (iOS, iPadOS, macOS)
 * - Yahoo Mail, GMX, Web.de, Thunderbird, Bluewin
 * 
 * Massnahmen zur Fehlerbehebung gemäss Support-Analyse:
 * 1. Keine Inline-SVGs: SVGs werden von Gmail und Outlook gestrippt oder blockiert. Spezifikationen und Icons werden über bulletproof HTML & Web-Safe Typografie gelöst.
 * 2. Vollständige bgcolor-Attribute: Outlook ignoriert CSS background-color auf <td>, wenn bgcolor fehlt. Alle Kartenblöcke (#FFFFFF) und Platzhalter (#F4F4F6) besitzen nun explizite bgcolor-Attribute.
 * 3. Robuster Web-Safe Font-Stack: Outlook besitzt einen bekannten Bug, bei dem 'Inter' in Times New Roman umgewandelt wird. Durch Arial/Helvetica als primären Fallback und MSO-Stylesheets wird die Schriftart in allen Clients konsistent dargestellt.
 * 4. Feste Pixel-Dimensionen für Bilder: Badges und Grafiken haben explizite Breiten und Höhen (width="120" height="40"), um eine 646px-Skalierung im Outlook Word-Renderer zu verhindern.
 * 5. Tabellen-basiertes 2-Spalten-Layout: Statt anfälliger inline-block Divs mit max-width (die Gmail Desktop oft umbricht) werden fluide Hybrid-Tabellen (align="left" / align="right") verwendet.
 * 6. 4:3-Platzhalterboxen mit fixierter Höhe und zentriertem Text für den %% bezeichnung%% Platzhalter.
 */
export function generateEmailHtml(
  nodes: NewsletterNode[],
  meta: NewsletterMeta,
  company: CompanySettings
): string {
  const replacePersonalization = (str: string) => {
    return str || '';
  };

  const renderNodeHtml = (node: NewsletterNode): string => {
    switch (node.type) {
      case 'title': {
        const align = node.align || 'left';
        return `            <!-- TITEL -->
            <tr>
              <td align="${align}" style="padding:0;text-align:${align};">
                <h1 class="nl-font nl-h1" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:bold;line-height:125%;color:#000000;text-align:${align};letter-spacing:-0.5px;">${escapeHtml(replacePersonalization(node.text))}</h1>
              </td>
            </tr>`;
      }

      case 'heading': {
        const align = node.align || 'left';
        return `            <!-- UNTERÜBERSCHRIFT (H2) -->
            <tr>
              <td align="${align}" style="padding:0;text-align:${align};">
                <h2 class="nl-font nl-h2" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;line-height:130%;color:#000000;text-align:${align};">${escapeHtml(replacePersonalization(node.text))}</h2>
              </td>
            </tr>`;
      }

      case 'sub_heading': {
        const align = node.align || 'left';
        return `            <!-- ÜBERSCHRIFT H3 -->
            <tr>
              <td align="${align}" style="padding:0;text-align:${align};">
                <h3 class="nl-font nl-h3" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;line-height:130%;color:#000000;text-align:${align};">${escapeHtml(replacePersonalization(node.text))}</h3>
              </td>
            </tr>`;
      }

      case 'paragraph': {
        const align = node.align || 'left';
        const rawText = escapeHtml(replacePersonalization(node.text));
        const formattedText = formatInlineLinks(rawText);
        return `            <!-- FLIESSTEXT -->
            <tr>
              <td align="${align}" style="padding:0;text-align:${align};">
                <p class="nl-font nl-body" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:150%;color:#000000;white-space:pre-line;text-align:${align};">${formattedText}</p>
              </td>
            </tr>`;
      }

      case 'graphic': {
        const captionHtml = node.caption
          ? `\n                <p class="nl-font" style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:150%;color:#666666;text-align:center;">${escapeHtml(node.caption)}</p>`
          : '';
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);
        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Bild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;margin:0 auto;">
                  <tr>
                    <td align="center" valign="middle" height="402" bgcolor="#F4F4F6" style="height:402px;background-color:#F4F4F6;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:24px;">
                      <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#64748B;letter-spacing:0.5px;display:inline-block;">${escapeHtml(placeholderTag)}</span>
                    </td>
                  </tr>
                </table>`;
        } else {
          const imgTag = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || 'Grafik')}" width="536" border="0" class="nl-img-responsive" style="display:block;width:100%;max-width:100%;height:auto;border-radius:12px;border:0;outline:none;text-decoration:none;margin:0 auto;" />`;
          mediaHtml = node.linkUrl
            ? `<a href="${escapeAttr(node.linkUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;border:0;">${imgTag}</a>`
            : imgTag;
        }

        return `            <!-- GRAFIK (4:3 PLATZHALTER ODER BILD) -->
            <tr>
              <td align="center" style="padding:0;text-align:center;">
                ${mediaHtml}${captionHtml}
              </td>
            </tr>`;
      }

      case 'bullet_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item) => {
              // Führende Bullet-Zeichen bereinigen, um Doppel-Bullets zu verhindern
              const cleanedItem = item.replace(/^[\s•\-\*\u2022\u25CF\u25CB\u25AA\u25AB]+\s*/, '');
              return `                  <tr>
                    <td width="20" valign="top" style="width:20px;padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:150%;color:#2E3E6C;text-align:left;">&bull;</td>
                    <td valign="top" class="nl-font" style="padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;color:#000000;text-align:left;">${formatInlineLinks(
                      escapeHtml(replacePersonalization(cleanedItem))
                    )}</td>
                  </tr>`;
            }
          )
          .join('\n');

        return `            <!-- AUFZÄHLUNG (BULLET POINTS) -->
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
${items}
                </table>
              </td>
            </tr>`;
      }

      case 'numbered_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item, idx) =>
              `                  <tr>
                    <td width="28" valign="top" class="nl-font" style="width:28px;padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:150%;color:#2E3E6C;text-align:left;">${idx + 1}.</td>
                    <td valign="top" class="nl-font" style="padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;color:#000000;text-align:left;">${formatInlineLinks(
                      escapeHtml(replacePersonalization(item))
                    )}</td>
                  </tr>`
          )
          .join('\n');

        return `            <!-- NUMMERIERTE LISTE -->
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
${items}
                </table>
              </td>
            </tr>`;
      }

      case 'two_col_left_graphic': {
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);
        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Bild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                      <tr>
                        <td align="center" valign="middle" height="180" bgcolor="#F4F4F6" style="height:180px;background-color:#F4F4F6;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:16px;">
                          <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#64748B;">${escapeHtml(placeholderTag)}</span>
                        </td>
                      </tr>
                    </table>`;
        } else {
          mediaHtml = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" width="100%" border="0" class="nl-img-responsive" style="display:block;width:100%;max-width:100%;height:auto;border-radius:12px;border:0;outline:none;" />`;
        }

        const btnHtml = node.buttonText
          ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                      <tr>
                        <td bgcolor="#2E3E6C" style="background-color:#2E3E6C;border-radius:12px;padding:10px 20px;">
                          <a href="${escapeAttr(node.buttonUrl || '#')}" target="_blank" rel="noopener noreferrer" class="nl-font" style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;line-height:120%;text-decoration:none;display:inline-block;">${escapeHtml(node.buttonText)}</a>
                        </td>
                      </tr>
                    </table>`
          : '';

        return `            <!-- 2 SPALTEN (BILD LINKS) FLUID HYBRID -->
            <tr>
              <td style="padding:0;">
                <!--[if (gte mso 9)|(IE)]>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                <td width="240" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-left" align="left" width="46%" cellpadding="0" cellspacing="0" border="0" style="width:46%;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      ${mediaHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                <td width="20" style="width:20px;font-size:1px;">&nbsp;</td>
                <td width="276" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-right" align="right" width="50%" cellpadding="0" cellspacing="0" border="0" style="width:50%;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      <h3 class="nl-font" style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;line-height:130%;color:#000000;">
                        ${escapeHtml(replacePersonalization(node.heading))}
                      </h3>
                      <p class="nl-font" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:150%;color:#000000;">
                        ${formatInlineLinks(escapeHtml(replacePersonalization(node.paragraph)))}
                      </p>
                      ${btnHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>`;
      }

      case 'two_col_right_graphic': {
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);
        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Bild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                      <tr>
                        <td align="center" valign="middle" height="180" bgcolor="#F4F4F6" style="height:180px;background-color:#F4F4F6;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:16px;">
                          <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#64748B;">${escapeHtml(placeholderTag)}</span>
                        </td>
                      </tr>
                    </table>`;
        } else {
          mediaHtml = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" width="100%" border="0" class="nl-img-responsive" style="display:block;width:100%;max-width:100%;height:auto;border-radius:12px;border:0;outline:none;" />`;
        }

        const btnHtml = node.buttonText
          ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                      <tr>
                        <td bgcolor="#2E3E6C" style="background-color:#2E3E6C;border-radius:12px;padding:10px 20px;">
                          <a href="${escapeAttr(node.buttonUrl || '#')}" target="_blank" rel="noopener noreferrer" class="nl-font" style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;line-height:120%;text-decoration:none;display:inline-block;">${escapeHtml(node.buttonText)}</a>
                        </td>
                      </tr>
                    </table>`
          : '';

        return `            <!-- 2 SPALTEN (BILD RECHTS) FLUID HYBRID -->
            <tr>
              <td style="padding:0;">
                <!--[if (gte mso 9)|(IE)]>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                <td width="276" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-right" align="left" width="50%" cellpadding="0" cellspacing="0" border="0" style="width:50%;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      <h3 class="nl-font" style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;line-height:130%;color:#000000;">
                        ${escapeHtml(replacePersonalization(node.heading))}
                      </h3>
                      <p class="nl-font" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:150%;color:#000000;">
                        ${formatInlineLinks(escapeHtml(replacePersonalization(node.paragraph)))}
                      </p>
                      ${btnHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                <td width="20" style="width:20px;font-size:1px;">&nbsp;</td>
                <td width="240" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-left" align="right" width="46%" cellpadding="0" cellspacing="0" border="0" style="width:46%;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      ${mediaHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>`;
      }

      case 'button_cta': {
        const align = node.align || 'left';
        return `            <!-- AKTIONSBUTTON (CTA) BULLETPROOF -->
            <tr>
              <td align="${align}" style="padding:6px 0;text-align:${align};">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${align}" style="border-collapse:separate;margin:${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'};">
                  <tr>
                    <td align="center" bgcolor="#2E3E6C" style="background-color:#2E3E6C;border-radius:12px;padding:14px 28px;">
                      <a href="${escapeAttr(node.url || '#')}" target="_blank" rel="noopener noreferrer" class="nl-font" style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:120%;text-decoration:none;display:inline-block;letter-spacing:0.2px;">${escapeHtml(node.label)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`;
      }

      case 'vehicle_card': {
        const brand = node.brand || (node.brandModel?.includes(' ') ? node.brandModel.split(' ')[0] : 'Mercedes-Benz');
        const model = node.brandModel || '%MODEL%';
        const price = node.price || "CHF 72'500";
        const dateVal = node.date || '06.2024';
        const mileageVal = node.mileage || "256'984 km";
        const powerVal = node.power || '1296 PS';
        const transVal = node.transmission || 'Handschaltung';
        const fuelVal = node.fuelType || 'Plug-in-Hybrid';
        const driveVal = node.driveTrain || 'Vorderradantrieb';
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);

        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Fahrzeugbild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                      <tr>
                        <td align="center" valign="middle" height="378" bgcolor="#EFEFF2" style="height:378px;background-color:#EFEFF2;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:24px;">
                          <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#64748B;letter-spacing:0.5px;display:inline-block;">${escapeHtml(placeholderTag)}</span>
                        </td>
                      </tr>
                    </table>`;
        } else {
          mediaHtml = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || model)}" width="504" border="0" class="nl-img-responsive" style="display:block;width:100%;max-width:100%;height:auto;border-radius:12px;border:0;outline:none;" />`;
        }

        return `            <!-- FAHRZEUGKARTE (100% E-MAIL CLIENT KOMPATIBEL) -->
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F4F4F6" style="background-color:#F4F4F6;border:1px solid #E5E5E8;border-radius:16px;border-collapse:separate;width:100%;">
                  <tr>
                    <td style="padding:16px;">
                      <!-- 1. Fahrzeug-Bild -->
                      ${mediaHtml}
                      
                      <!-- 2. Marke, Modell & Preis -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                        <tr>
                          <td class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:500;color:#71717A;line-height:130%;padding-bottom:2px;">
                            ${escapeHtml(replacePersonalization(brand))}
                          </td>
                        </tr>
                        <tr>
                          <td class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;line-height:130%;color:#09090B;padding-bottom:4px;">
                            ${escapeHtml(replacePersonalization(model))}
                          </td>
                        </tr>
                        <tr>
                          <td class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;line-height:120%;color:#09090B;padding-bottom:12px;">
                            ${escapeHtml(replacePersonalization(price))}
                          </td>
                        </tr>
                      </table>

                      <!-- 3. 6 Spezifikationen (Echte Tabellen-Zeilen: PC = 3x2, Mobile/Tablet = 2x3 ohne Float/Zigzag-Fehler) -->
                      ${(() => {
                        const renderSpecCard = (label: string, val: string) => {
                          const displayVal = replacePersonalization(val);
                          const fontSize = displayVal.length > 15 ? '10px' : displayVal.length > 12 ? '11px' : '12px';
                          const letterSpacing = displayVal.length > 14 ? '-0.3px' : 'normal';

                          return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;border-collapse:separate;width:100%;">
                            <tr>
                              <td valign="top" style="padding:6px 8px;text-align:left;height:42px;box-sizing:border-box;">
                                <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#71717A;line-height:12px;margin-bottom:2px;font-weight:500;">${escapeHtml(label)}</div>
                                <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:${fontSize};letter-spacing:${letterSpacing};color:#18181B;font-weight:bold;line-height:14px;word-break:break-word;overflow:hidden;">${escapeHtml(displayVal)}</div>
                              </td>
                            </tr>
                          </table>`;
                        };

                        return `
                      <!-- DESKTOP ANSICHT: 3 SPALTEN x 2 ZEILEN (1 2 3 / 4 5 6) -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="nl-specs-desktop" style="width:100%;border-collapse:separate;">
                        <!-- Reihe 1: Datum (1), Kilometer (2), Leistung (3) -->
                        <tr>
                          <td width="32%" valign="top" style="width:32%;padding:0;">
                            ${renderSpecCard('Datum', dateVal)}
                          </td>
                          <td width="2%" style="width:2%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td width="32%" valign="top" style="width:32%;padding:0;">
                            ${renderSpecCard('Kilometer', mileageVal)}
                          </td>
                          <td width="2%" style="width:2%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td width="32%" valign="top" style="width:32%;padding:0;">
                            ${renderSpecCard('Leistung', powerVal)}
                          </td>
                        </tr>
                        <tr>
                          <td height="8" colspan="5" style="height:8px;font-size:1px;line-height:8px;">&nbsp;</td>
                        </tr>
                        <!-- Reihe 2: Getriebe (4), Treibstoff (5), Antrieb (6) -->
                        <tr>
                          <td width="32%" valign="top" style="width:32%;padding:0;">
                            ${renderSpecCard('Getriebe', transVal)}
                          </td>
                          <td width="2%" style="width:2%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td width="32%" valign="top" style="width:32%;padding:0;">
                            ${renderSpecCard('Treibstoff', fuelVal)}
                          </td>
                          <td width="2%" style="width:2%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td width="32%" valign="top" style="width:32%;padding:0;">
                            ${renderSpecCard('Antrieb', driveVal)}
                          </td>
                        </tr>
                      </table>

                      <!-- MOBILE & TABLET ANSICHT: 2 SPALTEN x 3 ZEILEN (1 2 / 3 4 / 5 6) -->
                      <!--[if !mso]><!-->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="nl-specs-mobile" style="display:none;mso-hide:all;max-height:0;overflow:hidden;font-size:0;width:100%;border-collapse:separate;">
                        <!-- Reihe 1: Datum (1), Kilometer (2) -->
                        <tr>
                          <td width="48%" valign="top" style="width:48%;padding:0;">
                            ${renderSpecCard('Datum', dateVal)}
                          </td>
                          <td width="4%" style="width:4%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td width="48%" valign="top" style="width:48%;padding:0;">
                            ${renderSpecCard('Kilometer', mileageVal)}
                          </td>
                        </tr>
                        <tr>
                          <td height="8" colspan="3" style="height:8px;font-size:1px;line-height:8px;">&nbsp;</td>
                        </tr>
                        <!-- Reihe 2: Leistung (3), Getriebe (4) -->
                        <tr>
                          <td width="48%" valign="top" style="width:48%;padding:0;">
                            ${renderSpecCard('Leistung', powerVal)}
                          </td>
                          <td width="4%" style="width:4%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td width="48%" valign="top" style="width:48%;padding:0;">
                            ${renderSpecCard('Getriebe', transVal)}
                          </td>
                        </tr>
                        <tr>
                          <td height="8" colspan="3" style="height:8px;font-size:1px;line-height:8px;">&nbsp;</td>
                        </tr>
                        <!-- Reihe 3: Treibstoff (5), Antrieb (6) -->
                        <tr>
                          <td width="48%" valign="top" style="width:48%;padding:0;">
                            ${renderSpecCard('Treibstoff', fuelVal)}
                          </td>
                          <td width="4%" style="width:4%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td width="48%" valign="top" style="width:48%;padding:0;">
                            ${renderSpecCard('Antrieb', driveVal)}
                          </td>
                        </tr>
                      </table>
                      <!--<![endif]-->`;
                      })()}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`;
      }

      case 'url': {
        const align = node.align || 'left';
        const displayLabel = node.label || node.url || '%LINK_TO_WEBSITE%';
        const targetUrl = node.url || '%LINK_TO_WEBSITE%';
        return `            <!-- URL / LINK -->
            <tr>
              <td align="${align}" style="padding:4px 0;text-align:${align};">
                <a href="${escapeAttr(targetUrl)}" target="_blank" rel="noopener noreferrer" class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:150%;color:#2E3E6C;text-decoration:underline;word-break:break-all;">${escapeHtml(replacePersonalization(displayLabel))}</a>
              </td>
            </tr>`;
      }

      case 'gap_absorber': {
        const gapHeight = typeof node.height === 'number' ? node.height : 8;
        return `            <!-- GAP-ABSORBER: Kompakter Folgeabstand (${gapHeight}px) -->
            <tr>
              <td height="${gapHeight}" style="height:${gapHeight}px;line-height:${gapHeight}px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
            </tr>`;
      }

      default:
        return '';
    }
  };

  // Zusammenbau der Content-Knoten mit Standard 24px Zeilenabstand (Spacern),
  // wobei Gap-Absorber als direkter reduzierter Abstand agieren
  const nodeRowsWithSpacers = nodes
    .map((node, index) => {
      const rendered = renderNodeHtml(node);
      const isLast = index >= nodes.length - 1;
      const nextNode = !isLast ? nodes[index + 1] : null;

      // Wenn der aktuelle oder der nächste Knoten ein Gap-Absorber ist,
      // entfällt der standardmässige 24px-Zwischenabstand
      if (!isLast && node.type !== 'gap_absorber' && nextNode?.type !== 'gap_absorber') {
        return `${rendered}
            <!-- 24px ABSTAND ZWISCHEN DEN ELEMENTEN -->
            <tr>
              <td height="24" style="height:24px;line-height:24px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
            </tr>`;
      }
      return rendered;
    })
    .join('\n');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="de">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(meta.subject)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <style type="text/css">
    body, table, td, p, a, li, blockquote, h1, h2, h3, h4, h5, h6, span, strong, b {
      font-family: Arial, Helvetica, sans-serif !important;
    }
  </style>
  <![endif]-->
  <style type="text/css">
    /* Globale E-Mail-Client Resets */
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      height: 100% !important;
      background-color: #F6F6F8 !important;
      font-family: Arial, Helvetica, sans-serif;
    }
    a {
      text-decoration: underline;
      color: #2E3E6C;
    }
    /* Web Font progressive enhancement für moderne Clients */
    @media screen {
      .nl-font {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      }
    }
    center {
      width: 100% !important;
      min-width: 100% !important;
      text-align: center !important;
    }
    /* Bulletproof Zentrierung für Gmail (Web & Apps) und alle Desktop-Clients */
    .nl-outer-table {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      text-align: center !important;
    }
    .nl-outer-td {
      text-align: center !important;
      padding: 20px 8px !important;
    }
    .nl-container-wrapper {
      max-width: 600px !important;
      width: 100% !important;
      margin: 0 auto !important;
      display: inline-block !important;
      text-align: left !important;
      vertical-align: top !important;
    }
    .nl-container-table {
      max-width: 600px !important;
      width: 100% !important;
      margin: 0 auto !important;
      text-align: left !important;
    }
    /* Fix für Gmail auf iOS & Web: Verhindert horizontalen Versatz & erzwungene Überbreite */
    u + .body .nl-outer-table {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      text-align: center !important;
    }
    u + .body .nl-outer-td {
      text-align: center !important;
    }
    u + .body .nl-container-wrapper,
    u + .body .nl-container-table {
      width: 100% !important;
      max-width: 600px !important;
      margin: 0 auto !important;
    }
    html, body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      min-width: 100% !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }
    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }
    /* Spezifikationen Fahrzeugkarte: Desktop 3 Spalten (1 2 3 / 4 5 6) */
    .nl-specs-desktop {
      display: table !important;
      width: 100% !important;
    }
    .nl-specs-mobile {
      display: none !important;
      max-height: 0px !important;
      overflow: hidden !important;
      mso-hide: all !important;
      font-size: 0 !important;
      line-height: 0 !important;
    }
    .nl-spec-col {
      width: 33.333% !important;
      max-width: 33.333% !important;
      display: inline-block !important;
      vertical-align: top !important;
      box-sizing: border-box !important;
    }
    /* Desktop Erweiterung */
    @media only screen and (min-width: 621px) {
      .nl-card-block {
        padding: 32px 28px !important;
      }
    }
    /* Mobile Responsive Optimierungen (bis 620px) */
    @media only screen and (max-width: 620px) {
      .nl-outer-table {
        padding: 8px 0 !important;
      }
      .nl-outer-td {
        padding: 10px 4px !important;
      }
      .nl-container-wrapper,
      .nl-container-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .nl-card-block {
        padding: 20px 16px !important;
        border-radius: 16px !important;
      }
      .nl-card-header {
        padding: 16px !important;
        border-radius: 16px !important;
      }
      .nl-card-footer {
        padding: 24px 16px 20px 16px !important;
        border-radius: 16px !important;
      }
      .nl-col-left, .nl-col-right {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        display: block !important;
      }
      /* Spezifikationen Fahrzeugkarte: Mobile/Tablet 2 Spalten (1 2 / 3 4 / 5 6) */
      .nl-specs-desktop {
        display: none !important;
        max-height: 0 !important;
        overflow: hidden !important;
        mso-hide: all !important;
        font-size: 0 !important;
        line-height: 0 !important;
      }
      .nl-specs-mobile {
        display: table !important;
        max-height: none !important;
        overflow: visible !important;
        font-size: 13px !important;
        line-height: normal !important;
        width: 100% !important;
      }
      .nl-spec-col {
        width: 50% !important;
        max-width: 50% !important;
        display: inline-block !important;
        vertical-align: top !important;
        box-sizing: border-box !important;
      }
      .nl-spec-cell-td {
        padding: 0 3px 6px 3px !important;
      }
      .nl-h1 {
        font-size: 24px !important;
        line-height: 125% !important;
      }
      .nl-h2 {
        font-size: 18px !important;
        line-height: 130% !important;
      }
      .nl-h3 {
        font-size: 16px !important;
        line-height: 130% !important;
      }
      .nl-body {
        font-size: 15px !important;
        line-height: 150% !important;
      }
      .nl-img-responsive {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
      }
    }
    @media only screen and (max-width: 480px) {
      .nl-spec-cell-td {
        padding: 0 2px 5px 2px !important;
      }
    }
  </style>
</head>
<body class="body" bgcolor="#F6F6F8" style="margin:0;padding:0;width:100%;min-width:100%;background-color:#F6F6F8;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;">
  <!-- Preheader Text (unsichtbar im Textkörper, sichtbar in Posteingangsliste) -->
  <div style="display:none;font-size:1px;color:#F6F6F8;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(meta.preheader)}
    ${'&#847; &zwnj; &nbsp; '.repeat(20)}
  </div>

  <center style="width:100%;min-width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#F6F6F8;text-align:center;">
    <!-- AUSSEN-TABELLE: 100% Helles Grau #F6F6F8 mit align="center" für fehlerfreie Zentrierung in allen Clients -->
    <table role="presentation" align="center" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F6F6F8" class="nl-outer-table" style="width:100%;min-width:100%;max-width:100%;background-color:#F6F6F8;margin:0 auto;border:0;text-align:center;">
      <tr>
        <td align="center" valign="top" bgcolor="#F6F6F8" class="nl-outer-td" style="background-color:#F6F6F8;padding:20px 8px;text-align:center;">
          <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
          <tr>
          <td align="center" valign="top" width="600" style="width:600px;">
          <![endif]-->
          
          <!-- INNEN-CONTAINER (Responsive: Passt sich dem Viewport an, max. 600px Inhaltsbreite, strikt zentriert) -->
          <div class="nl-container-wrapper" style="max-width:600px;width:100%;margin:0 auto;display:inline-block;text-align:left;vertical-align:top;">
            <table role="presentation" class="nl-container-table" align="center" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;width:100%;margin:0 auto;text-align:left;border-collapse:separate;">

              <!-- ================= BLOCK 1: HEADER ================= -->
              <tr>
                <td class="nl-card-header" align="center" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E5E5E8;padding:24px 20px;text-align:center;width:100%;box-sizing:border-box;">
                  <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;">
                    <img src="${company.logoUrl || AUTOLINA_LIVE_LOGO_PNG}" alt="autolina.ch" width="180" height="42" border="0" style="display:block;margin:0 auto;border:0;width:180px;max-width:100%;height:auto;max-height:42px;outline:none;text-decoration:none;" />
                  </a>
                </td>
              </tr>

              <!-- 16px ABSTAND -->
              <tr>
                <td height="16" style="height:16px;line-height:16px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
              </tr>

              <!-- ================= BLOCK 2: INHALT ================= -->
              <tr>
                <td class="nl-card-block" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E5E5E8;padding:28px 24px;text-align:left;width:100%;box-sizing:border-box;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:100%;">
${nodeRowsWithSpacers}
                  </table>

                  <!-- Feste Grussformel am Ende des Inhaltsblocks -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:28px;border-top:1px solid #E5E5E8;">
                    <tr>
                      <td class="nl-font" style="padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;color:#000000;text-align:left;">
                        ${
                          company.valedictionStyle === 'informal'
                            ? 'Liebe Gr&uuml;sse<br />Dein autolina Team'
                            : 'Freundliche Gr&uuml;sse<br />Ihr autolina Team'
                        }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- 16px ABSTAND -->
              <tr>
                <td height="16" style="height:16px;line-height:16px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
              </tr>

              <!-- ================= BLOCK 3: FOOTER ================= -->
              <tr>
                <td class="nl-card-block nl-card-footer" align="center" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E5E5E8;padding:32px 24px;text-align:center;width:100%;box-sizing:border-box;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                    <!-- 1. autolina Logo -->
                    <tr>
                      <td align="center" style="padding-bottom:20px;">
                        <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;">
                          <img src="${company.logoUrl || AUTOLINA_LIVE_LOGO_PNG}" alt="autolina.ch" width="140" height="33" border="0" style="display:block;margin:0 auto;border:0;width:140px;max-width:100%;height:auto;max-height:33px;outline:none;text-decoration:none;" />
                        </a>
                      </td>
                    </tr>

                    <!-- 2. Adressblock -->
                    <tr>
                      <td align="center" class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:150%;color:#000000;padding-bottom:20px;text-align:center;">
                        autolina.ch ag<br />
                        Bahnhofstrasse 24c<br />
                        8570 Weinfelden, Schweiz<br />
                        <a href="mailto:service@autolina.ch" style="color:#2E3E6C;text-decoration:underline;">service@autolina.ch</a><br />
                        <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer" style="color:#2E3E6C;text-decoration:underline;">www.autolina.ch</a>
                      </td>
                    </tr>

                    <!-- 3. Trennlinie -->
                    <tr>
                      <td style="padding-bottom:20px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="border-top:1px solid #E5E5E8;font-size:1px;line-height:1px;">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- 4. App Store & Google Play Badges mit exakten Breiten gegen Outlook-Verzerrung -->
                    <tr>
                      <td align="center" style="padding-bottom:20px;">
                        <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                          <tr>
                            <td align="center" valign="middle" style="padding:0 6px;">
                              <a href="${AUTOLINA_APP_STORE_URL}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;line-height:0;">
                                <img src="${APPLE_APP_STORE_BADGE_PNG}" alt="Download on the App Store" width="130" height="40" border="0" style="display:block;width:130px;max-width:130px;height:40px;max-height:40px;border:0;border-radius:6px;outline:none;text-decoration:none;" />
                              </a>
                            </td>
                            <td align="center" valign="middle" style="padding:0 6px;">
                              <a href="${AUTOLINA_PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;line-height:0;">
                                <img src="${GOOGLE_PLAY_STORE_BADGE_PNG}" alt="JETZT BEI Google Play" width="130" height="40" border="0" style="display:block;width:130px;max-width:130px;height:40px;max-height:40px;border:0;border-radius:6px;outline:none;text-decoration:none;" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- 5. Trennlinie -->
                    <tr>
                      <td style="padding-bottom:16px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="border-top:1px solid #E5E5E8;font-size:1px;line-height:1px;">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- 6. Social Media Links (100% E-Mail Tabellen-Layout) -->
                    <tr>
                      <td align="center">
                        ${getSocialMediaLinksHtml()}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              ${
                company.showSecurityNotice !== false
                  ? `<!-- 16px ABSTAND -->
              <tr>
                <td height="16" style="height:16px;line-height:16px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
              </tr>

              <!-- ================= BLOCK 4: SICHERHEITSHINWEIS ================= -->
              <tr>
                <td align="left" bgcolor="#1B4B97" style="background-color:#1B4B97;border-radius:20px;border:1px solid #163E7D;padding:24px 20px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:150%;width:100%;box-sizing:border-box;">
                  <p class="nl-font" style="margin:0;padding:0;color:#FFFFFF;font-size:14px;line-height:150%;">
                    <strong style="color:#FFFFFF;font-weight:bold;">Vorsicht vor Betr&uuml;gern:</strong> autolina w&uuml;rde Sie nie nach Ihrem Passwort oder pers&ouml;nlichen Daten fragen oder Sie auffordern, diese zu &auml;ndern. Sollten Sie eine E-Mail mit einer entsprechenden Aufforderung erhalten, bitten wir Sie, die betreffende E-Mail zu ignorieren und umgehend unseren Support unter <a href="mailto:service@autolina.ch" style="color:#FFFFFF;text-decoration:underline;font-weight:bold;">service@autolina.ch</a> zu kontaktieren.
                  </p>
                </td>
              </tr>`
                  : ''
              }

            </table>
          </div>
          <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatInlineLinks(text: string): string {
  if (!text) return '';
  // E-Mail-Adressen klickbar machen
  let formatted = text.replace(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    '<a href="mailto:$1" style="color:#2E3E6C;text-decoration:underline;">$1</a>'
  );
  // Web-URLs klickbar machen
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+|www\.[^\s]+)/gi,
    (match) => {
      const href = match.startsWith('www.') ? `https://${match}` : match;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#2E3E6C;text-decoration:underline;">${match}</a>`;
    }
  );
  return formatted;
}

