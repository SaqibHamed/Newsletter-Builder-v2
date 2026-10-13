# GUIDELINES — autolina E-Mail Newsletter & Template System

> **Vollständige Dokumentation & Projektgedächtnis:** Siehe auch [`PROJECT_MEMORY.md`](./PROJECT_MEMORY.md).

Diese Richtlinien definieren die verbindlichen Entwicklungs- und Design-Standards für das E-Mail-Marketing-System von autolina.ch.

---

## 1. Oberste E-Mail-Rendering-Regeln
* **Kein Flexbox / Kein CSS Grid:** Reale E-Mail-Clients (Microsoft Outlook 2013–365 Desktop, Gmail App) unterstützen moderne CSS-Layouts nicht. Ausschließlich verschachtelte HTML-Tabellen (`<table role="presentation" border="0" cellpadding="0" cellspacing="0">`) verwenden.
* **100% Inline-CSS:** Alle Styles müssen inline am Element deklariert sein. Keine ausgelagerten Stylesheets.
* **Web-Safe Typografie:** Standard-Schriftart ist immer `Arial, Helvetica, sans-serif`. Keine ungeschützten Google Fonts (Inter/Poppins führen in Outlook zum Times New Roman Fallback).
* **Keine Inline-SVGs:** SVGs werden von E-Mail-Clients entfernt. Nur PNGs/JPEGs mit absoluten HTTPS-URLs oder reiner HTML-Text.
* **Feste Bild- und Badge-Dimensionen:** Bilder müssen explizite `width` und `height` Attribute besitzen (z.B. `120x40` für App Store Badges).
* **Feste Inhaltsbreite:** Genau 600 px Inhaltsbreite mit MSO Ghost Tables für Outlook.

---

## 2. Personalisierungs- & Termin-Tags
Verfügbare Tags im System:
* `%Anrede%` — Salutation (Herr / Frau)
* `%Nachname%` — Nachname des Empfängers
* `%Vorname%` — Vorname des Empfängers
* `%Mail%` — E-Mail-Adresse
* `%Reset%` — Individueller 24h Passwort-Reset-Link
* `%Firma%` — Autohaus / Partnerbetrieb / Händler
* `%FirmaOrt%` — Standort / Ortschaft des Partners
* `%TerminDate%` — Vereinbartes Datum für Probefahrt oder Übergabe
* `%TerminTime%` — Uhrzeit oder Zeitfenster des Termins
* `%Fahrzeugname%`, `%Fahrzeugbild%`, `%Bild%`, `%Marke%`, `%Modell%`, `%Preis%`, `%Datum%`, `%KM%`, `%PS%`, `%Schaltung%`, `%Energie%`, `%Antrieb%`

*Wichtig:* Bei Regex-Ersetzungen muss `%FirmaOrt%` immer vor `%Firma%` geprüft werden!

---

## 3. Marken-Farben (autolina Design System)
* **Button & Links (Navy):** `#2E3E6C`
* **Dunkelblau (Brand Blue):** `#1B3C71`
* **Akzent (Teal):** `#08B9C2` / `#2AAAB6`
* **Haupttext:** `#000000`
* **Hintergrund:** `#F6F6F8` (Seite) / `#FFFFFF` (Karte)
* **Karten-Ecken:** `border-radius: 20px`
