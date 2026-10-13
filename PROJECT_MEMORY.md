# PROJECT MEMORY & GUIDELINES — autolina E-Mail Newsletter & Template Builder

Diese Datei dient als vollständiges Gedächtnis (**Project Memory**) und als **Entwickler-Leitfaden (Guidelines)** für das autolina.ch E-Mail Marketing & Newsletter Template System. Sie kann 1:1 in andere Accounts, Umgebungen oder Repositories kopiert werden, um den vollen Kontext, architektonische Entscheidungen und Standards zu übertragen.

---

## 1. Projektübersicht & Zweck

* **Projektname:** autolina Newsletter & Transactional E-Mail Builder
* **Zweck:** Visueller, modularer No-Code / Low-Code E-Mail-Builder zur Erstellung, Pflege und zum Export von 100% E-Mail-Client-kompatiblen HTML-E-Mails (Willkommensmails, Passwort-Resets, Inseratsbestätigungen, Probefahrt-/Terminbestätigungen, monatliche Newsletter).
* **Zielgruppe:** Marketing-Teams, Partner-Händler, Kundenbetreuung und CRM-Systeme von autolina.ch.
* **Kern-USP:** 
  1. Visuelle Gestaltung per Drag & Drop mit genormten CI-Bausteinen („Bricks“).
  2. Dynamische Personalisierungs- und Fahrzeug-Tags (`%Anrede%`, `%Firma%`, `%TerminDate%`, etc.).
  3. Reiner, robuster HTML-Export, der in **Microsoft Outlook (2013–365 Desktop)**, **Gmail** und **Apple Mail** identisch wie in der Vorschau aussieht.

---

## 2. Kritische E-Mail-Client-Rendering-Regeln (Outlook & Gmail)

### Das Grundproblem
Die In-App-Vorschau im Browser nutzt moderne Browser-Engines (Blink/WebKit). Echte E-Mail-Clients (vor allem Microsoft Outlook mit Word-Rendering-Engine und Google Gmail mit restriktivem CSS-Parser) verhalten sich völlig anders. 

### Verbindliche Vorgaben für `src/utils/htmlGenerator.ts`:
1. **Reines Tabellen-Layout (`<table>`):**
   * Kein `display: flex;` oder `display: grid;` im E-Mail-HTML!
   * Alle Layouts, Abstände und Spalten müssen über verschachtelte Tabellen realisiert werden:
     ```html
     <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
     ```
2. **100% Inline-CSS:**
   * Jeder Style muss direkt im `style="..."`-Attribut der Tags deklariert sein. Webmailer wie Gmail schneiden `<style>`-Blöcke im `<head>` bei Weiterleitungen oder bestimmten Parsing-Schritten ab.
3. **Web-Safe Schriften & Outlook Times New Roman Bug:**
   * Niemals reine Webfonts (wie Google Fonts Inter/Poppins) ohne harten Fallback einbetten. Outlook ersetzt unbekannte Webfonts automatisch durch **Times New Roman**.
   * Standardisierter Inline-Font-Stack:
     ```css
     font-family: Arial, Helvetica, sans-serif;
     ```
   * Zusätzlicher MSO-Fallback im `<head>`:
     ```html
     <!--[if mso]>
     <style type="text/css">
       body, table, td, p, a, h1, h2, h3, span { font-family: Arial, Helvetica, sans-serif !important; }
     </style>
     <![endif]-->
     ```
4. **Keine Inline-SVGs:**
   * Fast alle E-Mail-Clients (Gmail, Outlook Desktop) blockieren oder entfernen Inline-`<svg>`-Code restlos.
   * Spezifikationen, Trenner und Symbole dürfen nur als Unicode/HTML-Text oder über absolute HTTPS-Bild-URLs eingebunden werden.
5. **Feste Pixelmaße für Grafiken und Badges:**
   * Bilder und Store-Badges benötigen zwingend feste Attribute: `width="120" height="40" style="display: block; width: 120px; max-width: 120px; height: auto;"`. Ohne explizite Breiten zieht Outlook Grafiken auf 100% Originalgrösse auf („Badge Blowout“).
6. **Explizite Hintergrundfarben (`bgcolor`):**
   * Outlook ignoriert `background-color` in CSS teilweise bei Tabellen. Daher immer zusätzlich das HTML-Attribut angeben:
     ```html
     <td bgcolor="#FFFFFF" style="background-color: #FFFFFF;">
     ```
7. **MSO Ghost Tables:**
   * Für den 600px Container und zweispaltige Layouts müssen MSO-Conditionals verwendet werden:
     ```html
     <!--[if (gte mso 9)|(IE)]>
     <table role="presentation" width="600" align="center" border="0" cellpadding="0" cellspacing="0">
       <tr><td>
     <![endif]-->
     ```

---

## 3. Vollständige System- & Personalisierungs-Tags

Im System existieren genormte Platzhalter (`%TagName%`), die im Editor farblich hervorgehoben und beim Export für CRM-/E-Mail-Marketing-Tools erhalten bleiben bzw. in der Vorschau durch realistische Beispieldaten ersetzt werden.

| Tag | Kategorie | Bezeichnung | Beschreibung | Musterwert (Vorschau) |
| :--- | :--- | :--- | :--- | :--- |
| **`%Anrede%`** | Person | Anrede | Salutation (Herr / Frau) | `Herr` |
| **`%Nachname%`** | Person | Nachname | Nachname des Empfängers | `Muster` |
| **`%Vorname%`** | Person | Vorname | Vorname des Empfängers | `Max` |
| **`%Mail%`** | Person | E-Mail | E-Mail-Adresse des Kunden | `max.muster@autolina.ch` |
| **`%Reset%`** | URL | URL-Tag Reset | Individueller 24h Passwort-Reset-Link | `https://www.autolina.ch/...` |
| **`%Firma%`** | Partner | Firma | Name des Autohauses / Händlers / Partners | `Garage Muster AG` |
| **`%FirmaOrt%`** | Partner | Firma Ort | Ortschaft / Standort des Autohauses | `Zürich` |
| **`%TerminDate%`** | Termin | Termin-Datum | Vereinbartes Datum für Probefahrt/Service | `15.10.2026` |
| **`%TerminTime%`** | Termin | Termin-Uhrzeit | Uhrzeit oder Zeitfenster des Termins | `14:30 Uhr` |
| **`%Fahrzeugname%`** | Fahrzeug | Fahrzeugname | Vollständige Modellbezeichnung | `Mercedes-Benz AMG GT 63 S` |
| **`%Fahrzeugbild%`** | Bild | Fahrzeugbild | Dynamische Bild-URL des Inserats | 4:3 Platzhalter-Grafik |
| **`%Bild%`** | Bild | Bild-URL | Allgemeine Bild- oder Banner-URL | Kampagnen-Banner |
| **`%Marke%`** | Fahrzeug | Marke | Fahrzeughersteller | `Mercedes-Benz` |
| **`%Modell%`** | Fahrzeug | Modell | Modellreihe / Spezifikation | `AMG GT 63 S E Performance` |
| **`%Preis%`** | Fahrzeug | Preis | Schweizer Format mit Hochkomma | `CHF 72'500` |
| **`%Datum%`** | Fahrzeug | 1. Inverkehrssetzung | Erstzulassung Monat/Jahr | `06.2024` |
| **`%KM%`** | Fahrzeug | Kilometerstand | Laufleistung mit Einheit | `256'984 km` |
| **`%PS%`** | Fahrzeug | Leistung PS | Motorleistung | `1296 PS` |
| **`%Schaltung%`** | Fahrzeug | Schaltung | Getriebeart | `Handschaltung` / `Automat` |
| **`%Energie%`** | Fahrzeug | Treibstoff | Antriebsenergie | `Plug-in-Hybrid` / `Benzin` |
| **`%Antrieb%`** | Fahrzeug | Antriebsart | Antriebsstrang | `Allrad` / `Vorderradantrieb` |

*Hinweis zu Regex-Ersetzungen:* `%FirmaOrt%` muss in regulären Ausdrücken und Suchen stets **vor** `%Firma%` aufgeführt werden, damit das längere Token nicht versehentlich als `%Firma%` + `Ort%` geparst wird.

---

## 4. Design-Spezifikationen & Markenrichtlinien (autolina.ch)

* **Primäre Markenfarben:**
  * `#2E3E6C`: autolina Button- & Link-Blau (Navy)
  * `#1B3C71`: autolina Primärblau (Dunkelblau)
  * `#2AAAB6` / `#08B9C2`: autolina Akzenttürkis (Teal)
  * `#000000`: Typografie Überschriften und Haupttext
  * `#6E6E73` / `#71717A`: Sekundärtext und Labels
  * `#F6F6F8`: Genormter Seitenhintergrund (Page Background)
  * `#FFFFFF`: Kartenhintergrund (Card Background)
  * `#E5E5E8`: Rahmen und Divider
* **Layout-Dimensionen:**
  * Maximale E-Mail-Breite: **600 px** Inhaltsbreite (bzw. max. 640 px Gesamtcontainer inkl. Außenabstand)
  * Card Border Radius: **20 px** (`border-radius: 20px;`)
  * Padding Hauptkarte: **32 px** Desktop, **20 px** Mobile
  * Zeilenabstand (Line-Height): `1.5` bis `1.6` für optimale Lesbarkeit
* **Offizielle Assets (ActiveCampaign CDN / 100% E-Mail-kompatibel):**
  * Logo: `https://autolina.activehosted.com/content/AGajEL/2026/10/06/89356b48-23e9-413e-a9e5-cfa5f590f9f2.png` (689x162 px, 4.25:1 Verhältnis, Header: 200x47 px, Footer: 153x36 px)
  * Apple App Store: `https://autolina.activehosted.com/content/AGajEL/2026/10/06/89c5cddd-4606-4b9d-90a8-e3026df0ee1a.png` (527x162 px, 3.25:1 Verhältnis, Skalierung: 135x42 px)
  * Google Play Store: `https://autolina.activehosted.com/content/AGajEL/2026/10/06/d2f2578b-48f2-411f-bfba-a84c780747e1.png` (527x162 px, 3.25:1 Verhältnis, Skalierung: 135x42 px)
  * Soziale Medien: Instagram, LinkedIn, Facebook, YouTube

---

## 5. Codebase-Architektur

```text
src/
├── components/
│   ├── CombinedOverviewEditor.tsx   # Gesamter Haupt-Editor: Node-Builder, Drag & Drop, System-Tags-Drawer, Quick-Chips
│   ├── NewsletterLivePreview.tsx    # Live-Vorschau: Umschaltung zwischen "Designer" und "E-Mail-Client" (Iframe), Zoom, Tag-Modus
│   ├── SendPreviewModal.tsx         # Versandprüfung: Client-Kompatibilitäts-Diagnose (Outlook/Gmail Checkliste), Testversand
│   ├── ExportModal.tsx              # Export-Dialog: HTML-Code kopieren, .html Download, Zeichen/Größenanzeige
│   ├── AutolinaBrandAssets.tsx      # SVG-Komponenten für Editor-Vorschau (Logo, Badges, Spec-Icons)
│   ├── BricksPalette.tsx            # Palette der verfügbaren Inhaltsblöcke
│   ├── Header.tsx                   # Obere Menüleiste (Vorlagen-Auswahl, Export, Testversand, Reset)
│   └── RightPane.tsx                # Seitenleiste für Metadaten & Vorlagen-Verwaltung
├── data/
│   └── defaultNewsletter.ts         # Standard-Inhalte & 5 fertige Vorlagen (Welcome, Pwd-Reset, Ad-Online, Ad-Expiring, Test-Drive)
├── utils/
│   ├── htmlGenerator.ts             # 100% E-Mail-kompatibler Tabellen-HTML-Generator
│   └── autolinaAssets.ts            # System-Tags, Asset-URLs, Base64-Strings, Sample-Fahrzeugdaten
├── types.ts                         # TypeScript Schnittstellen (NodeType, NewsletterNode, CompanySettings, NewsletterMeta)
└── App.tsx                          # App-Wurzel mit State-Management und Split-Screen-Layout
```

---

## 6. Vorhandene Standard-Templates (`sampleTemplates`)

1. **`welcome` (Willkommen bei autolina):**
   * Onboarding-Mail für neue Nutzer mit Nutzenargumenten, Aufzählungsliste, Tipp zum Start und Call-to-Action.
2. **`reset-password` (Passwort zurücksetzen):**
   * Transaktionale Sicherheits-Mail mit `%Reset%`-Button, URL-Klartextanzeige und 24h-Sicherheitshinweis.
3. **`ad-online` (Ihr Inserat ist online):**
   * Bestätigungs-Mail mit vollständiger Fahrzeugkarte (`%Marke%`, `%Modell%`, `%Preis%`, Spezifikations-Tabelle) und Tipps für maximale Sichtbarkeit.
4. **`ad-expiring` (Ihr Inserat läuft in 7 Tagen ab):**
   * Reaktivierungs-Mail mit Bullet-Optionen (kostenlos verlängern, Preis anpassen, als verkauft markieren).
5. **`test-drive` (Ihre Probefahrt ist bestätigt):**
   * Vorlage für Vor-Ort-Termine mit den Tags `%TerminDate%`, `%TerminTime%`, `%Firma%`, `%FirmaOrt%`, Fahrzeugkarte und Vorbereitungshinweisen.

---

## 7. Richtlinien für zukünftige Erweiterungen

* **Neue Knoten / Bausteine:**
  1. In `src/types.ts` den Typ in `NodeType` und ein passendes Interface definieren.
  2. In `src/utils/htmlGenerator.ts` die entsprechende Tabellen-HTML-Generierung implementieren (strikte E-Mail-Kompatibilität beachten!).
  3. In `src/components/NewsletterLivePreview.tsx` das visuelle Rendering im Designer-Modus einbauen.
  4. In `src/components/CombinedOverviewEditor.tsx` das Bearbeitungsformular hinzufügen.
* **Neue System-Tags:**
  1. In `src/utils/autolinaAssets.ts` zu `SYSTEM_TAGS`, `SYSTEM_TAGS_LIST`, `SampleVehicleValues`, `DEFAULT_SAMPLE_VEHICLE` und `replaceSystemTags` hinzufügen.
  2. In `src/components/NewsletterLivePreview.tsx` die Ersetzung in `tagPreviewMode === 'sample'` sowie die farbige Badge-Darstellung in `renderWithTags` ergänzen.
  3. In `src/components/CombinedOverviewEditor.tsx` entsprechende Quick-Chips (`+ %NeuerTag%`) in Heading-, Paragraph- und Drawer-Bereichen bereitstellen.
