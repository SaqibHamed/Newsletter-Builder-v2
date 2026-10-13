import { NewsletterNode, NodeType } from '../types';

export function createNewNode(type: NodeType): NewsletterNode {
  const id = `node-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  switch (type) {
    case 'title':
      return {
        id,
        type: 'title',
        text: 'Neuer Titel',
        align: 'left',
      };

    case 'heading':
      return {
        id,
        type: 'heading',
        text: 'Neue Zwischenüberschrift',
        align: 'left',
      };

    case 'sub_heading':
      return {
        id,
        type: 'sub_heading',
        text: 'Neue Zwischenüberschrift (H3)',
        align: 'left',
      };

    case 'gap_absorber':
      return {
        id,
        type: 'gap_absorber',
        height: 8,
        label: 'Kompakter Folgeabstand (8px)',
      };

    case 'paragraph':
      return {
        id,
        type: 'paragraph',
        text: 'Fügen Sie hier Ihren Textabschnitt ein. Der Text wird gemäss Inter 16px Regular und 1.5 Zeilenabstand formatiert.',
        align: 'left',
      };

    case 'graphic':
      return {
        id,
        type: 'graphic',
        imageUrl: '%IMAGE%',
        altText: 'Grafik',
        caption: '',
        fullWidth: true,
      };

    case 'bullet_list':
      return {
        id,
        type: 'bullet_list',
        items: [
          'Erster wichtiger Listenpunkt',
          'Zweiter wesentlicher Vorteil oder Hinweis',
          'Dritter Schritt oder Ergänzung',
        ],
      };

    case 'numbered_list':
      return {
        id,
        type: 'numbered_list',
        items: [
          'Erster geordneter Handlungsschritt',
          'Zweiter Prozessschritt in der Abfolge',
          'Abschliessende Bestätigung oder Prüfung',
        ],
      };

    case 'two_col_left_graphic':
      return {
        id,
        type: 'two_col_left_graphic',
        imageUrl: '%IMAGE%',
        altText: 'Grafik',
        heading: 'Themenblock mit Bild links',
        paragraph: 'Erklärender Textabschnitt passend zur linken Grafik. Ideal für Feature-Vorstellungen oder Team-Notizen.',
        buttonText: 'Mehr erfahren',
        buttonUrl: '#',
      };

    case 'two_col_right_graphic':
      return {
        id,
        type: 'two_col_right_graphic',
        imageUrl: '%IMAGE%',
        altText: 'Grafik',
        heading: 'Themenblock mit Bild rechts',
        paragraph: 'Zweispaltiges Layout mit einleitender Überschrift und Erläuterung auf der linken Seite sowie Grafik rechts.',
        buttonText: 'Details ansehen',
        buttonUrl: '#',
      };

    case 'button_cta':
      return {
        id,
        type: 'button_cta',
        label: 'Aktion ausführen',
        url: 'https://www.autolina.ch',
        align: 'left',
        styleVariant: 'primary',
      };

    case 'vehicle_card':
      return {
        id,
        type: 'vehicle_card',
        imageUrl: '%IMAGE_OF_LISTING%',
        altText: 'Fahrzeugbild',
        brand: '%MAKE%',
        brandModel: '%MODEL%',
        price: '%PRICE%',
        date: '%FIRST_REGISTRATION%',
        mileage: '%MILEAGE%',
        power: '%POWER_HP%',
        transmission: '%TRANSMISSION%',
        fuelType: '%FUEL_TYPE%',
        driveTrain: '%DRIVETRAIN%',
      };

    case 'url':
      return {
        id,
        type: 'url',
        label: '%LINK_TO_WEBSITE%',
        url: '%LINK_TO_WEBSITE%',
        align: 'left',
      };

    default:
      return {
        id,
        type: 'paragraph',
        text: 'Neuer Textabschnitt',
        align: 'left',
      };
  }
}
