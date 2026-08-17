/**
 * Leadership and company values for the About section.
 *
 * Leadership biographies are factual, simple-English summaries based only on
 * facts already present in the company's source material. Each biography is
 * approximately 100–140 words, free of generic praise and corporate
 * superlatives.
 *
 * Public references to Tata Precision Industries (India) Ltd. have been
 * removed from the biographies because the current status of that relationship
 * has not been reconfirmed. They are not replaced with another partnership
 * claim.
 */

export interface Leader {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  shortBio: string;
  /** Multi-paragraph biography, split at logical sentence boundaries. */
  fullProfile: string[];
  /** Per-portrait CSS object-position value (e.g. "center 25%"). */
  imagePosition?: string;
}

export const leaders: Leader[] = [
  {
    name: 'Vishnu Gupta',
    role: 'Co-Founder & Director',
    image: '/media/leadership/vishnu-gupta-treated.webp',
    imageAlt: 'Vishnu Gupta, Co-Founder and Director of Bharat Electrosafe',
    shortBio:
      'Chartered Accountant, entrepreneur and business leader with over 18 years of experience across sales, marketing, business development, finance, manufacturing and industrial operations.',
    fullProfile: [
      'Vishnu Gupta is a Chartered Accountant, entrepreneur and business leader with over 18 years of diverse experience across sales, marketing, business development, finance, manufacturing and industrial operations.',
      'As the Co-Founder & Director of Bharat Electrosafe, he is primarily responsible for driving the company\'s Sales, Marketing, Business Development and Strategic Growth initiatives. He plays a key role in expanding Bharat Electrosafe\'s market presence, developing new business opportunities, strengthening customer and channel partnerships, and building the company\'s presence across diverse industrial and infrastructure sectors.',
      'Bharat Electrosafe offers a growing range of electrical safety, industrial protection and infrastructure solutions, including High Voltage Electrical Insulating Mats, Geo Membrane Lining, Water Stop Seal, PVC Flooring and other industrial products. Vishnu\'s focus is on developing new markets and applications for these products while strengthening long-term relationships with customers, distributors, industry partners and institutions across India.',
      'With a strong belief in quality, innovation and standardisation, he is committed to positioning Bharat Electrosafe as a trusted Indian manufacturer and solution provider, delivering reliable products for the electrical, industrial, infrastructure and construction sectors. His vision is aligned with the Make in India initiative and the growth of Indian manufacturing through innovative, quality-driven and standards-compliant solutions.',
      'Before his entrepreneurial journey, Vishnu gained valuable corporate experience with leading organisations including Honda Motor India, Universal Cables Ltd. (MP Birla Group), GHCL Ltd. and Cavendish Industries Ltd. (JK Tyre Group). His diverse professional background has provided him with a strong understanding of business operations, manufacturing, finance, market development and organisational growth.',
      'He is also the Co-Founder of Samridhi Test House Pvt. Ltd., an ISO/IEC 17025-accredited and BIS-recognized electrical and mechanical testing laboratory.',
      'His professional and entrepreneurial journey has received recognition through platforms including the Times Power Icons and the Make in India Conclave organised by ABP News.',
      'At Bharat Electrosafe, Vishnu remains focused on expanding markets, strengthening the sales and distribution network, developing new applications and opportunities for the company\'s diverse product range, and building long-term value for customers and stakeholders.',
    ],
    imagePosition: 'center 25%',
  },
  {
    name: 'Krishan Kumar',
    role: 'Co-Founder & Director',
    image: '/media/leadership/krishan-kumar-treated.webp',
    imageAlt: 'Krishan Kumar, Co-Founder and Director of Bharat Electrosafe',
    shortBio:
      'Business professional with more than 25 years of experience across manufacturing, trading, real estate and infrastructure.',
    fullProfile: [
      'Krishan Kumar Khandelwal has more than 25 years of business experience across manufacturing, trading, real estate and infrastructure. As Co-Founder and Director of Bharat Electrosafe, he works across operations, quality assurance, production, vendor development, partner coordination and after-sales support.',
      'His experience includes supply-chain management, customer relationships and commercial project work, including real estate development and management of commercial and residential projects. At Bharat Electrosafe, he focuses on coordinating production, suppliers and customer requirements through delivery and after-sales activity.',
      'His background in manufacturing operations, vendor management and customer coordination supports the company\'s day-to-day production and supply work across project and repeat-order requirements.',
    ],
    imagePosition: 'center 20%',
  },
  {
    name: 'Priyanka Garg',
    role: 'Co-Founder & Director',
    image: '/media/leadership/priyanka-garg-treated.webp',
    imageAlt: 'Priyanka Garg, Co-Founder and Director of Bharat Electrosafe',
    shortBio:
      'Business professional with more than 20 years of experience in rubber and polymer products, manufacturing and commercial operations.',
    fullProfile: [
      'Priyanka Garg has more than 20 years of experience in the rubber and polymer industry. As Co-Founder and Director of Bharat Electrosafe, her work covers electrical insulating mats, silicone rubber sheets, EPDM membranes, PVC and rubber compounds and other rubber products.',
      'She holds an M.Com from Agra University and a business certification from UP Technical University, as stated in the company\'s existing profile. Her experience also includes consulting, quality testing and international trade facilitation.',
      'At Bharat Electrosafe, she contributes product knowledge, business operations, market development and customer coordination. Her background combines practical experience in rubber and polymer products with commercial and manufacturing work.',
    ],
    imagePosition: 'center 30%',
  },
];

export interface Value {
  title: string;
  description: string;
}

/** Company values — exact client-supplied wording from Core Values artwork. */
export const companyValues: Value[] = [
  {
    title: 'Respect',
    description: 'Thoughtful of showing regard for another person.',
  },
  {
    title: 'Trust',
    description: 'Confidence in each other\u2019s capabilities and intentions.',
  },
  {
    title: 'Ownership',
    description: 'Take responsibility for one\u2019s own decisions and actions.',
  },
  {
    title: 'Integrated Team Work',
    description: 'Every person to work towards the larger group objective.',
  },
];
