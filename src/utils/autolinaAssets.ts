/**
 * autolina Marken-Assets, Badges, Dimensionen und E-Mail-Marketing System-Tags
 * 
 * Beinhaltet:
 * - Offizielles autolina Logo (ActiveCampaign CDN & CodePNG, Seitenverhältnis 4.253 : 1)
 * - Offizieller Apple App Store Badge (ActiveCampaign CDN & CodePNG, Seitenverhältnis 3.253 : 1)
 * - Offizieller Google Play Store Badge (ActiveCampaign CDN & CodePNG, Seitenverhältnis 3.253 : 1)
 * - Exakte Outlook-Word-kompatible Dimensionen & DPI-Skalierungsregeln
 * - Vollständige System-Tags gemäss CRM/ActiveCampaign Spezifikation (7 Kategorien, 39 System-Tags)
 */

import {
  AUTOLINA_LOGO_CODE_PNG,
  APP_STORE_BADGE_CODE_PNG,
  GOOGLE_PLAY_BADGE_CODE_PNG,
} from './autolinaBase64Assets';

export {
  AUTOLINA_LOGO_CODE_PNG,
  APP_STORE_BADGE_CODE_PNG,
  GOOGLE_PLAY_BADGE_CODE_PNG,
};

export const AUTOLINA_COLORS = {
  blue: '#1B3C71',
  teal: '#2AAAB6',
  buttonNavy: '#2E3E6C',
  urlColor: '#2E3E6C',
  navyNotice: '#1B4B97',
  black: '#000000',
  logoBlack: '#101010',
  white: '#FFFFFF',
  pageBg: '#F6F6F8',
  divider: '#E5E5E8',
  googleBlue: '#4285F4',
  googleRed: '#EA4335',
  googleYellow: '#FBBC04',
  googleGreen: '#34A853',
};

// ============================================================================
// 1. OFFIZIELLE SYSTEM-TAGS (ActiveCampaign / CRM Standard)
// ============================================================================

export interface SystemTagDefinition {
  category: string;
  field: string;
  type: 'Texteingabe' | 'Dropdown' | 'Textbereich' | 'Datum' | 'Radio Button' | 'Kombination';
  tag: string;
  label: string;
  description: string;
  example: string;
}

export const SYSTEM_TAG_CATEGORIES = [
  'Allgemeine Details',
  'Address',
  'Engagement',
  'Vehicle information',
  'Subscription',
  'Dealership information',
  'Transactional information',
] as const;

export const SYSTEM_TAGS_LIST: SystemTagDefinition[] = [
  // --- Allgemeine Details ---
  {
    category: 'Allgemeine Details',
    field: 'Vorname',
    type: 'Texteingabe',
    tag: '%FIRSTNAME%',
    label: 'Vorname',
    description: 'Vorname des Empfängers / Kunden',
    example: 'Max',
  },
  {
    category: 'Allgemeine Details',
    field: 'Nachname',
    type: 'Texteingabe',
    tag: '%LASTNAME%',
    label: 'Nachname',
    description: 'Nachname des Empfängers / Kunden',
    example: 'Muster',
  },
  {
    category: 'Allgemeine Details',
    field: 'E-Mail',
    type: 'Texteingabe',
    tag: '%EMAIL%',
    label: 'E-Mail',
    description: 'E-Mail-Adresse des Nutzers',
    example: 'max.muster@autolina.ch',
  },
  {
    category: 'Allgemeine Details',
    field: 'Telefon',
    type: 'Texteingabe',
    tag: '%PHONE%',
    label: 'Telefon',
    description: 'Telefon- oder Mobilnummer',
    example: '+41 44 123 45 67',
  },
  {
    category: 'Allgemeine Details',
    field: 'Preferred Language',
    type: 'Dropdown',
    tag: '%PREFERRED_LANGUAGE%',
    label: 'Sprache',
    description: 'Bevorzugte Korrespondenzsprache (DE, FR, IT, EN)',
    example: 'Deutsch',
  },
  {
    category: 'Allgemeine Details',
    field: 'Kanton',
    type: 'Texteingabe',
    tag: '%KANTON%',
    label: 'Kanton',
    description: 'Schweizer Wohnkanton (z. B. ZH, BE, AG)',
    example: 'ZH',
  },
  {
    category: 'Allgemeine Details',
    field: 'Address',
    type: 'Textbereich',
    tag: '%ADDRESS%',
    label: 'Adresse',
    description: 'Strasse und Hausnummer',
    example: 'Badenerstrasse 47',
  },
  {
    category: 'Allgemeine Details',
    field: 'Stadt',
    type: 'Texteingabe',
    tag: '%STADT%',
    label: 'Stadt',
    description: 'Wohnort / Ortschaft',
    example: 'Zürich',
  },
  {
    category: 'Allgemeine Details',
    field: 'Salutation',
    type: 'Texteingabe',
    tag: '%SALUTATION%',
    label: 'Anrede (Salutation)',
    description: 'Anredeformel (Herr / Frau)',
    example: 'Herr',
  },
  {
    category: 'Allgemeine Details',
    field: 'Image',
    type: 'Texteingabe',
    tag: '%IMAGE%',
    label: 'Bild / Grafik URL',
    description: 'Bild-URL für Kampagnen-, Header- oder Inhaltsgrafiken',
    example: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Allgemeine Details',
    field: 'Link to website',
    type: 'Texteingabe',
    tag: '%LINK_TO_WEBSITE%',
    label: 'Webseite-Link',
    description: 'Direktlink zur autolina Plattform oder Zielseite',
    example: 'https://www.autolina.ch',
  },

  // --- Address ---
  {
    category: 'Address',
    field: 'ZIP Code',
    type: 'Texteingabe',
    tag: '%ZIP_CODE%',
    label: 'PLZ (ZIP Code)',
    description: 'Postleitzahl der Adresse',
    example: '8004',
  },

  // --- Engagement ---
  {
    category: 'Engagement',
    field: 'last website visit',
    type: 'Datum',
    tag: '%LAST_WEBSITE_VISIT%',
    label: 'Letzter Website-Besuch',
    description: 'Datum des letzten Website-Besuchs',
    example: '05.10.2026',
  },
  {
    category: 'Engagement',
    field: 'last email activity',
    type: 'Datum',
    tag: '%LAST_EMAIL_ACTIVITY%',
    label: 'Letzte E-Mail-Aktivität',
    description: 'Datum der letzten E-Mail-Interaktion',
    example: '02.10.2026',
  },

  // --- Vehicle information ---
  {
    category: 'Vehicle information',
    field: 'Listing ID',
    type: 'Texteingabe',
    tag: '%LISTING_ID%',
    label: 'Inserate-ID (Listing ID)',
    description: 'Eindeutige autolina Inserate-Kennung',
    example: 'AL-984210',
  },
  {
    category: 'Vehicle information',
    field: 'Make',
    type: 'Texteingabe',
    tag: '%MAKE%',
    label: 'Marke (Make)',
    description: 'Fahrzeug-Hersteller/Marke',
    example: 'Mercedes-Benz',
  },
  {
    category: 'Vehicle information',
    field: 'Model',
    type: 'Texteingabe',
    tag: '%MODEL%',
    label: 'Modell (Model)',
    description: 'Fahrzeug-Modellreihe',
    example: 'AMG GT 63 S E',
  },
  {
    category: 'Vehicle information',
    field: 'Model Type',
    type: 'Texteingabe',
    tag: '%MODEL_TYPE%',
    label: 'Modell-Typ',
    description: 'Genaue Ausführung / Modellvariante',
    example: 'Performance 4MATIC+',
  },
  {
    category: 'Vehicle information',
    field: 'Price',
    type: 'Texteingabe',
    tag: '%PRICE%',
    label: 'Preis (Price)',
    description: 'Verkaufspreis in CHF',
    example: "CHF 72'500",
  },
  {
    category: 'Vehicle information',
    field: 'First registration',
    type: 'Texteingabe',
    tag: '%FIRST_REGISTRATION%',
    label: '1. Inverkehrssetzung',
    description: 'Erstzulassungsdatum / Jahrgang',
    example: '06.2024',
  },
  {
    category: 'Vehicle information',
    field: 'Mileage',
    type: 'Texteingabe',
    tag: '%MILEAGE%',
    label: 'Kilometerstand (Mileage)',
    description: 'Gefahrene Kilometer',
    example: "42'500 km",
  },
  {
    category: 'Vehicle information',
    field: 'Power (HP)',
    type: 'Texteingabe',
    tag: '%POWER_HP%',
    label: 'Leistung PS (Power HP)',
    description: 'Motorleistung in Pferdestärken',
    example: '843 PS',
  },
  {
    category: 'Vehicle information',
    field: 'Fuel type',
    type: 'Texteingabe',
    tag: '%FUEL_TYPE%',
    label: 'Treibstoff (Fuel type)',
    description: 'Kraftstoffart (Benzin, Hybrid, Elektro, Diesel)',
    example: 'Plug-in-Hybrid',
  },
  {
    category: 'Vehicle information',
    field: 'Drivetrain',
    type: 'Texteingabe',
    tag: '%DRIVETRAIN%',
    label: 'Antrieb (Drivetrain)',
    description: 'Antriebsart (Allrad, Vorderrad, Hinterrad)',
    example: 'Allradantrieb',
  },
  {
    category: 'Vehicle information',
    field: 'Transmission',
    type: 'Texteingabe',
    tag: '%TRANSMISSION%',
    label: 'Getriebe (Transmission)',
    description: 'Getriebeart (Automat, Schaltgetriebe)',
    example: 'AMG SPEEDSHIFT 9G',
  },
  {
    category: 'Vehicle information',
    field: 'Link to vehicle',
    type: 'Texteingabe',
    tag: '%LINK_TO_VEHICLE%',
    label: 'Fahrzeug-Link',
    description: 'Direktlink zum Inserat auf autolina.ch',
    example: 'https://www.autolina.ch/auto/mercedes-benz-amg-gt/984210',
  },
  {
    category: 'Vehicle information',
    field: 'Offer received',
    type: 'Texteingabe',
    tag: '%OFFER_RECEIVED%',
    label: 'Angebot erhalten',
    description: 'Status ob Angebot eingegangen ist',
    example: 'Ja',
  },
  {
    category: 'Vehicle information',
    field: 'Image of listing',
    type: 'Texteingabe',
    tag: '%IMAGE_OF_LISTING%',
    label: 'Inserate-Bild',
    description: 'Offizielles Fahrzeugbild aus dem Inserat',
    example: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  },

  // --- Subscription ---
  {
    category: 'Subscription',
    field: 'Listing package',
    type: 'Texteingabe',
    tag: '%LISTING_PACKAGE%',
    label: 'Inserate-Paket',
    description: 'Gebuchtes Inserate- oder Abo-Paket',
    example: 'Premium Top-Listing',
  },
  {
    category: 'Subscription',
    field: 'Amount paid for listing',
    type: 'Texteingabe',
    tag: '%AMOUNT_PAID_FOR_LISTING%',
    label: 'Bezahlter Betrag',
    description: 'Abgerechneter Betrag für das Inserat',
    example: 'CHF 89.00',
  },
  {
    category: 'Subscription',
    field: 'Date of listing',
    type: 'Datum',
    tag: '%DATE_OF_LISTING%',
    label: 'Aufschaltdatum Inserat',
    description: 'Datum der Veröffentlichung',
    example: '01.09.2026',
  },
  {
    category: 'Subscription',
    field: 'Expiration date of listing',
    type: 'Datum',
    tag: '%EXPIRATION_DATE_OF_LISTING%',
    label: 'Ablaufdatum Inserat',
    description: 'Ende der 60-tägigen Laufzeit',
    example: '31.10.2026',
  },

  // --- Dealership information ---
  {
    category: 'Dealership information',
    field: 'Salutation dealership representative',
    type: 'Texteingabe',
    tag: '%SALUTATION_DEALERSHIP_REPRESENTATIVE%',
    label: 'Händler Anrede',
    description: 'Anrede des Händleransprechpartners (Herr / Frau)',
    example: 'Herr',
  },
  {
    category: 'Dealership information',
    field: 'First name dealership representative',
    type: 'Texteingabe',
    tag: '%FIRST_NAME_DEALERSHIP_REPRESENTATIVE%',
    label: 'Händler Vorname',
    description: 'Vorname des Händleransprechpartners',
    example: 'Sandro',
  },
  {
    category: 'Dealership information',
    field: 'Last name dealership representative',
    type: 'Texteingabe',
    tag: '%LAST_NAME_DEALERSHIP_REPRESENTATIVE%',
    label: 'Händler Nachname',
    description: 'Nachname des Händleransprechpartners',
    example: 'Keller',
  },
  {
    category: 'Dealership information',
    field: 'Dealership name',
    type: 'Texteingabe',
    tag: '%DEALERSHIP_NAME%',
    label: 'Händlername / Garage',
    description: 'Offizieller Firmenname des Autohauses',
    example: 'Garage Muster AG',
  },
  {
    category: 'Dealership information',
    field: 'Dealership ZIP',
    type: 'Texteingabe',
    tag: '%DEALERSHIP_ZIP%',
    label: 'Händler PLZ',
    description: 'Postleitzahl des Händlers',
    example: '8004',
  },
  {
    category: 'Dealership information',
    field: 'Dealership City name',
    type: 'Texteingabe',
    tag: '%DEALERSHIP_CITY_NAME%',
    label: 'Händler Ortschaft',
    description: 'Standort / Stadt des Händlers',
    example: 'Zürich',
  },
  {
    category: 'Dealership information',
    field: 'Dealership ID',
    type: 'Texteingabe',
    tag: '%DEALERSHIP_ID%',
    label: 'Händler-ID',
    description: 'Eindeutige autolina Händler-ID',
    example: 'AUT-5829',
  },

  // --- Transactional information ---
  {
    category: 'Transactional information',
    field: 'Test drive (yes/no)',
    type: 'Radio Button',
    tag: '%TEST_DRIVE_YESNO%',
    label: 'Probefahrt (Ja/Nein)',
    description: 'Bestätigung Probefahrt-Anfrage',
    example: 'Ja',
  },
  {
    category: 'Transactional information',
    field: 'Date for test drive',
    type: 'Texteingabe',
    tag: '%DATE_FOR_TEST_DRIVE%',
    label: 'Probefahrt-Termin',
    description: 'Datum und Uhrzeit für die Probefahrt',
    example: '15.10.2026 um 14:30 Uhr',
  },
  {
    category: 'Transactional information',
    field: 'Message written by user to dealership',
    type: 'Textbereich',
    tag: '%MESSAGE_WRITTEN_BY_USER_TO_DEALERSHIP%',
    label: 'Nachricht an Händler',
    description: 'Nachrichtentext des Kunden an die Garage',
    example: 'Guten Tag, ich interessiere mich für eine Probefahrt am kommenden Samstag.',
  },
  {
    category: 'Transactional information',
    field: 'Message written by user to private seller',
    type: 'Textbereich',
    tag: '%MESSAGE_WRITTEN_BY_USER_TO_PRIVATE_SELLER%',
    label: 'Nachricht an Privatverkäufer',
    description: 'Nachrichtentext des Interessenten an den Privatverkäufer',
    example: 'Guten Tag, ist das Fahrzeug unfallfrei und Serviceheft gepflegt?',
  },
  {
    category: 'Transactional information',
    field: 'Category of support request (contact page)',
    type: 'Textbereich',
    tag: '%CATEGORY_OF_SUPPORT_REQUEST_CONTACT_PAGE%',
    label: 'Support-Kategorie',
    description: 'Themenbereich der Support-Anfrage',
    example: 'Inserateverwaltung & Freischaltung',
  },
  {
    category: 'Transactional information',
    field: 'Message to support team autolina (contact page)',
    type: 'Textbereich',
    tag: '%MESSAGE_TO_SUPPORT_TEAM_AUTOLINA_CONTACT_PAGE%',
    label: 'Nachricht an Support autolina',
    description: 'Nachrichtentext an das autolina Support-Team',
    example: 'Bitte prüfen Sie die Freischaltung meines neuen Händler-Accounts.',
  },
];

// Schneller Key-Value Zugriff auf alle System-Tags
export const SYSTEM_TAGS = {
  // Allgemeine Details
  firstname: '%FIRSTNAME%',
  lastname: '%LASTNAME%',
  email: '%EMAIL%',
  phone: '%PHONE%',
  preferredLanguage: '%PREFERRED_LANGUAGE%',
  kanton: '%KANTON%',
  address: '%ADDRESS%',
  stadt: '%STADT%',
  salutation: '%SALUTATION%',
  image: '%IMAGE%',
  linkToWebsite: '%LINK_TO_WEBSITE%',
  // Address
  zipCode: '%ZIP_CODE%',
  // Engagement
  lastWebsiteVisit: '%LAST_WEBSITE_VISIT%',
  lastEmailActivity: '%LAST_EMAIL_ACTIVITY%',
  // Vehicle information
  listingId: '%LISTING_ID%',
  make: '%MAKE%',
  model: '%MODEL%',
  modelType: '%MODEL_TYPE%',
  price: '%PRICE%',
  firstRegistration: '%FIRST_REGISTRATION%',
  mileage: '%MILEAGE%',
  powerHp: '%POWER_HP%',
  fuelType: '%FUEL_TYPE%',
  drivetrain: '%DRIVETRAIN%',
  transmission: '%TRANSMISSION%',
  linkToVehicle: '%LINK_TO_VEHICLE%',
  offerReceived: '%OFFER_RECEIVED%',
  imageOfListing: '%IMAGE_OF_LISTING%',
  // Subscription
  listingPackage: '%LISTING_PACKAGE%',
  amountPaidForListing: '%AMOUNT_PAID_FOR_LISTING%',
  dateOfListing: '%DATE_OF_LISTING%',
  expirationDateOfListing: '%EXPIRATION_DATE_OF_LISTING%',
  // Dealership information
  salutationDealershipRep: '%SALUTATION_DEALERSHIP_REPRESENTATIVE%',
  firstNameDealershipRep: '%FIRST_NAME_DEALERSHIP_REPRESENTATIVE%',
  lastNameDealershipRep: '%LAST_NAME_DEALERSHIP_REPRESENTATIVE%',
  dealershipName: '%DEALERSHIP_NAME%',
  dealershipZip: '%DEALERSHIP_ZIP%',
  dealershipCityName: '%DEALERSHIP_CITY_NAME%',
  dealershipId: '%DEALERSHIP_ID%',
  // Transactional information
  testDriveYesNo: '%TEST_DRIVE_YESNO%',
  dateForTestDrive: '%DATE_FOR_TEST_DRIVE%',
  msgToDealership: '%MESSAGE_WRITTEN_BY_USER_TO_DEALERSHIP%',
  msgToPrivateSeller: '%MESSAGE_WRITTEN_BY_USER_TO_PRIVATE_SELLER%',
  supportCategory: '%CATEGORY_OF_SUPPORT_REQUEST_CONTACT_PAGE%',
  msgToSupport: '%MESSAGE_TO_SUPPORT_TEAM_AUTOLINA_CONTACT_PAGE%',
  // Komfort-Kombinationen
  greetingCombined: '%SALUTATION% %LASTNAME%',
  greetingFull: 'Guten Tag %SALUTATION% %LASTNAME%,',
} as const;

export const DEFAULT_SAMPLE_SYSTEM_VALUES: Record<string, string> = {
  FIRSTNAME: 'Max',
  LASTNAME: 'Muster',
  EMAIL: 'max.muster@autolina.ch',
  PHONE: '+41 44 123 45 67',
  PREFERRED_LANGUAGE: 'Deutsch',
  KANTON: 'ZH',
  ADDRESS: 'Badenerstrasse 47',
  STADT: 'Zürich',
  SALUTATION: 'Herr',
  IMAGE: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  LINK_TO_WEBSITE: 'https://www.autolina.ch',
  ZIP_CODE: '8004',
  LAST_WEBSITE_VISIT: '05.10.2026',
  LAST_EMAIL_ACTIVITY: '02.10.2026',
  LISTING_ID: 'AL-984210',
  MAKE: 'Mercedes-Benz',
  MODEL: 'AMG GT 63 S E',
  MODEL_TYPE: 'Performance 4MATIC+',
  PRICE: "CHF 72'500",
  FIRST_REGISTRATION: '06.2024',
  MILEAGE: "42'500 km",
  POWER_HP: '843 PS',
  FUEL_TYPE: 'Plug-in-Hybrid',
  DRIVETRAIN: 'Allradantrieb',
  TRANSMISSION: 'AMG SPEEDSHIFT 9G',
  LINK_TO_VEHICLE: 'https://www.autolina.ch/auto/mercedes-benz-amg-gt/984210',
  OFFER_RECEIVED: 'Ja',
  IMAGE_OF_LISTING: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  LISTING_PACKAGE: 'Premium Top-Listing',
  AMOUNT_PAID_FOR_LISTING: 'CHF 89.00',
  DATE_OF_LISTING: '01.09.2026',
  EXPIRATION_DATE_OF_LISTING: '31.10.2026',
  SALUTATION_DEALERSHIP_REPRESENTATIVE: 'Herr',
  FIRST_NAME_DEALERSHIP_REPRESENTATIVE: 'Sandro',
  LAST_NAME_DEALERSHIP_REPRESENTATIVE: 'Keller',
  DEALERSHIP_NAME: 'Garage Muster AG',
  DEALERSHIP_ZIP: '8004',
  DEALERSHIP_CITY_NAME: 'Zürich',
  DEALERSHIP_ID: 'AUT-5829',
  TEST_DRIVE_YESNO: 'Ja',
  DATE_FOR_TEST_DRIVE: '15.10.2026 um 14:30 Uhr',
  MESSAGE_WRITTEN_BY_USER_TO_DEALERSHIP: 'Guten Tag, ich interessiere mich für eine Probefahrt am kommenden Samstag.',
  MESSAGE_WRITTEN_BY_USER_TO_PRIVATE_SELLER: 'Guten Tag, ist das Fahrzeug unfallfrei und Serviceheft gepflegt?',
  CATEGORY_OF_SUPPORT_REQUEST_CONTACT_PAGE: 'Inserateverwaltung & Freischaltung',
  MESSAGE_TO_SUPPORT_TEAM_AUTOLINA_CONTACT_PAGE: 'Bitte prüfen Sie die Freischaltung meines neuen Händler-Accounts.',
};

/**
 * Ersetzt System-Tags mit Beispiel-Werten für die Live-Vorschau.
 * Unterstützt sowohl die neuen offiziellen CRM-Tags (%FIRSTNAME%, %MAKE%, etc.)
 * als auch bisherige Aliase (%Vorname%, %Nachname%, %Preis%, etc.) für lückenlose Rückwärtskompatibilität.
 */
export function replaceSystemTags(
  text: string,
  customValues: Partial<Record<string, string>> = {}
): string {
  if (!text) return '';
  const values = { ...DEFAULT_SAMPLE_SYSTEM_VALUES, ...customValues };

  let result = text;

  // 1. Offizielle CRM-Tags (%TAG%)
  for (const [key, val] of Object.entries(values)) {
    if (val !== undefined) {
      const regex = new RegExp(`%${key}%`, 'g');
      result = result.replace(regex, val || '');
    }
  }

  // 2. Legacy / Deutsche Aliase für bestehende Newsletter-Texte
  result = result
    .replace(/%Anrede%/gi, values.SALUTATION || 'Herr')
    .replace(/%Nachname%/gi, values.LASTNAME || 'Muster')
    .replace(/%Vorname%/gi, values.FIRSTNAME || 'Max')
    .replace(/(%Mail%|%E-Mail%)/gi, values.EMAIL || 'max.muster@autolina.ch')
    .replace(/%Fahrzeugname%/gi, `${values.MAKE} ${values.MODEL} ${values.MODEL_TYPE}`.trim())
    .replace(/%Marke%/gi, values.MAKE || 'Mercedes-Benz')
    .replace(/%Modell%/gi, values.MODEL || 'AMG GT 63 S E')
    .replace(/%Preis%/gi, values.PRICE || "CHF 72'500")
    .replace(/%Datum%/gi, values.FIRST_REGISTRATION || '06.2024')
    .replace(/%KM%/gi, values.MILEAGE || "42'500 km")
    .replace(/%PS%/gi, values.POWER_HP || '843 PS')
    .replace(/%Schaltung%/gi, values.TRANSMISSION || 'AMG SPEEDSHIFT 9G')
    .replace(/%Energie%/gi, values.FUEL_TYPE || 'Plug-in-Hybrid')
    .replace(/%Antrieb%/gi, values.DRIVETRAIN || 'Allradantrieb')
    .replace(/%Firma%/gi, values.DEALERSHIP_NAME || 'Garage Muster AG')
    .replace(/%FirmaOrt%/gi, values.DEALERSHIP_CITY_NAME || 'Zürich')
    .replace(/%TerminDate%/gi, '15.10.2026')
    .replace(/%TerminTime%/gi, '14:30 Uhr')
    .replace(/%Reset%/gi, values.LINK_TO_WEBSITE || 'https://www.autolina.ch')
    .replace(/%Fahrzeugbild%/gi, values.IMAGE_OF_LISTING || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80')
    .replace(/%Bild%/gi, values.IMAGE || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80');

  return result;
}

// ============================================================================
// 2. OFFIZIELLE ASSETS, CDN-URLS & PROPORTIONEN (ActiveCampaign CDN)
// ============================================================================

export const AUTOLINA_ASSET_URLS = {
  logo: 'https://autolina.activehosted.com/content/AGajEL/2026/10/06/89356b48-23e9-413e-a9e5-cfa5f590f9f2.png',
  appleBadge: 'https://autolina.activehosted.com/content/AGajEL/2026/10/06/89c5cddd-4606-4b9d-90a8-e3026df0ee1a.png',
  googlePlayBadge: 'https://autolina.activehosted.com/content/AGajEL/2026/10/06/d2f2578b-48f2-411f-bfba-a84c780747e1.png',
};

export const AUTOLINA_LIVE_LOGO_PNG = AUTOLINA_ASSET_URLS.logo;
export const APPLE_APP_STORE_BADGE_PNG = AUTOLINA_ASSET_URLS.appleBadge;
export const GOOGLE_PLAY_STORE_BADGE_PNG = AUTOLINA_ASSET_URLS.googlePlayBadge;

// Offizielle Store-Links gemäss Vorgabe
export const AUTOLINA_APP_STORE_URL = 'https://apps.apple.com/ch/app/autolina/id1200318326';
export const AUTOLINA_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.autolina.ch&hl=de_CH';

/**
 * Exakte Spezifikationen & Proportionen zur Vermeidung von Outlook-Verzerrungen
 */
export const ASSET_SPECIFICATIONS = {
  logo: {
    naturalWidth: 689,
    naturalHeight: 162,
    aspectRatio: 689 / 162, // 4.253086 : 1
    aspectRatioRatioString: '4.253 : 1',
    headerDisplay: { width: 180, height: 42 }, // 180 / 4.253086 = 42.32 px
    footerDisplay: { width: 140, height: 33 }, // 140 / 4.253086 = 32.91 px
    retina2x: { width: 360, height: 84 },
    cdnUrl: AUTOLINA_LIVE_LOGO_PNG,
    codePng: AUTOLINA_LOGO_CODE_PNG,
  },
  appleBadge: {
    naturalWidth: 527,
    naturalHeight: 162,
    aspectRatio: 527 / 162, // 3.253086 : 1
    aspectRatioRatioString: '3.253 : 1',
    display: { width: 130, height: 40 }, // 130 / 3.253086 = 39.96 px ~ 40 px
    retina2x: { width: 260, height: 80 },
    cdnUrl: APPLE_APP_STORE_BADGE_PNG,
    codePng: APP_STORE_BADGE_CODE_PNG,
  },
  googlePlayBadge: {
    naturalWidth: 527,
    naturalHeight: 162,
    aspectRatio: 527 / 162, // 3.253086 : 1
    aspectRatioRatioString: '3.253 : 1',
    display: { width: 130, height: 40 }, // 130 / 3.253086 = 39.96 px ~ 40 px
    retina2x: { width: 260, height: 80 },
    cdnUrl: GOOGLE_PLAY_STORE_BADGE_PNG,
    codePng: GOOGLE_PLAY_BADGE_CODE_PNG,
  },
};

/**
 * autolina Logo HTML für E-Mails & Vorschau
 * Verwendet feste Pixel-Attribute und Inline-Styles für Outlook Word-Renderer
 */
export function getAutolinaLogoHtml(width = 180, height = 42, customUrl?: string): string {
  const src = customUrl || AUTOLINA_LIVE_LOGO_PNG;
  return `<img src="${src}" alt="autolina.ch" width="${width}" height="${height}" border="0" style="display:block;margin:0 auto;width:${width}px;max-width:${width}px;height:${height}px;max-height:${height}px;border:0;outline:none;text-decoration:none;" />`;
}

/**
 * Apple App Store Badge (100% E-Mail kompatibel, exaktes 3.253:1 Verhältnis)
 */
export function getAppleBadgeHtml(width = 130, height = 40): string {
  return `<a href="${AUTOLINA_APP_STORE_URL}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;line-height:0;">
    <img src="${APPLE_APP_STORE_BADGE_PNG}" alt="Download on the App Store" width="${width}" height="${height}" border="0" style="display:block;width:${width}px;max-width:${width}px;height:${height}px;max-height:${height}px;border:0;border-radius:6px;outline:none;text-decoration:none;" />
  </a>`;
}

/**
 * Google Play Store Badge (100% E-Mail kompatibel, exaktes 3.253:1 Verhältnis)
 */
export function getGooglePlayBadgeHtml(width = 130, height = 40): string {
  return `<a href="${AUTOLINA_PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;line-height:0;">
    <img src="${GOOGLE_PLAY_STORE_BADGE_PNG}" alt="JETZT BEI Google Play" width="${width}" height="${height}" border="0" style="display:block;width:${width}px;max-width:${width}px;height:${height}px;max-height:${height}px;border:0;border-radius:6px;outline:none;text-decoration:none;" />
  </a>`;
}

// Social Media Links (Instagram, LinkedIn, Facebook, YouTube) als 100% E-Mail-kompatible Tabelle
export function getSocialMediaLinksHtml(): string {
  const links = [
    { name: 'Instagram', url: 'https://www.instagram.com/autolina.ch/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/autolina-ch-ag/' },
    { name: 'Facebook', url: 'https://www.facebook.com/autolina.ch/' },
    { name: 'YouTube', url: 'https://www.youtube.com/@autolinach' },
  ];

  const cells = links
    .map(
      (link, idx) =>
        `<td align="center" style="padding:4px 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;line-height:120%;">
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;display:inline-block;">${link.name}</a>
        </td>${
          idx < links.length - 1
            ? `<td style="color:#CBD5E1;font-size:12px;line-height:1;padding:0 2px;vertical-align:middle;">&bull;</td>`
            : ''
        }`
    )
    .join('\n        ');

  return `<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;border-collapse:collapse;">
      <tr>
        ${cells}
      </tr>
    </table>`;
}

/**
 * Prüft ob eine Bild-URL ein Platzhalter (%Bild%, %%Bild%% etc.) ist
 */
export function isPlaceholderGraphic(url?: string): boolean {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  if (trimmed.startsWith('%') || trimmed.endsWith('%')) return true;
  if (trimmed.toLowerCase().includes('platzhalter') || trimmed.toLowerCase().includes('placeholder')) return true;
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/') && !trimmed.startsWith('data:')) {
    return true;
  }
  return false;
}

/**
 * Formatiert den Platzhaltertext für Grafiken (z. B. %%Bild%%)
 */
export function formatPlaceholderTag(rawUrl?: string, defaultTag = 'Bild'): string {
  if (!rawUrl || !rawUrl.trim()) {
    return `%%${defaultTag}%%`;
  }
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('%%') && trimmed.endsWith('%%') && trimmed.length > 4) {
    return trimmed;
  }
  if (trimmed.startsWith('%') && trimmed.endsWith('%') && trimmed.length > 2) {
    const inner = trimmed.slice(1, -1).trim();
    return `%%${inner}%%`;
  }
  if (!trimmed.includes('/') && !trimmed.includes('.') && !trimmed.includes(':')) {
    return `%%${trimmed}%%`;
  }
  return `%%${defaultTag}%%`;
}
