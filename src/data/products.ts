export interface ProductSizeOption {
  size: string;
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  fullStory: string;
  image: string;
  sizes: ProductSizeOption[];
  rating: number;
  reviewsCount: number;
  characteristics: {
    texture: string;
    aroma: string;
    method: string;
    smokePoint: string;
  };
  features: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'organic-cow-ghee',
    name: 'Organic Cow Ghee',
    tagline: 'Pure, Golden & Naturally Granular',
    badge: '100% Grass-Fed',
    description: 'Slow-simmered golden elixir made from single-origin organic pasture-raised cow milk. Boasts a delicate nutty aroma and natural golden hue.',
    fullStory: 'Our flagship Organic Cow Ghee begins at sunrise in natural pastures where cows graze freely on medicinal wild grasses. Slowly simmered over low fire, it develops a signature granular texture that melts smoothly on warm rotis or fresh steamed rice.',
    image: '/images/products/cow-ghee.jpg',
    sizes: [
      { size: '250ml', price: 14.50, originalPrice: 16.50 },
      { size: '500ml', price: 26.00, originalPrice: 29.50, isPopular: true },
      { size: '1000ml', price: 48.00, originalPrice: 55.00 },
    ],
    rating: 4.9,
    reviewsCount: 384,
    characteristics: {
      texture: 'Silky Granular (Danedar)',
      aroma: 'Subtle Toasted Almonds',
      method: 'Slow Brass Pan Simmer',
      smokePoint: '250°C (482°F)',
    },
    features: [
      'Rich in fat-soluble vitamins A, D, E & K',
      'Naturally lactose & casein free',
      'Zero artificial preservatives or trans fats',
      'Packed in UV-protected glass jar'
    ]
  },
  {
    id: 'traditional-bilona-ghee',
    name: 'Traditional Bilona Ghee',
    tagline: 'Hand-Churned Vedic Heritage',
    badge: 'Vedic Churned',
    description: 'Crafted according to classical Vedic protocols using a two-way wooden bilona churner from curd (makkhan), never raw commercial cream.',
    fullStory: 'Honoring thousand-year-old traditions, pure cultured whole milk is fermented into whole curd overnight, then hand-churned before dawn with wooden bilona ropes. The fresh butter is clarified over earthen chulhas to achieve an incomparable aromatic depth.',
    image: '/images/products/bilona-ghee.jpg',
    sizes: [
      { size: '500ml', price: 34.00, originalPrice: 38.00, isPopular: true },
      { size: '1000ml', price: 62.00, originalPrice: 70.00 },
    ],
    rating: 5.0,
    reviewsCount: 512,
    characteristics: {
      texture: 'Rich Sand-like Granules',
      aroma: 'Complex Cultured Caramel',
      method: 'Bi-Directional Wood Churning',
      smokePoint: '252°C (485°F)',
    },
    features: [
      '100% Cultured Curd origin',
      'Small batch artisanal craft',
      'Rich in butyric acid for gut wellbeing',
      'Airtight gold metallic embossed lid'
    ]
  },
  {
    id: 'premium-desi-ghee',
    name: 'Premium Desi Ghee',
    tagline: 'Indigenous Gir Cow Lineage',
    badge: 'A2 Vedic Milk',
    description: 'Sourced exclusively from indigenous Bos Indicus humped Gir cows known for naturally producing A2 beta-casein rich wholesome milk.',
    fullStory: 'Extracted from the milk of free-roaming indigenous Gir cows that feed on natural herbs, neem, and fresh pasture. The high beta-carotene in green foliage yields an opulent golden tone and a velvety finish prized by top culinary artisans.',
    image: '/images/products/desi-ghee.jpg',
    sizes: [
      { size: '250ml', price: 18.00 },
      { size: '500ml', price: 32.00, isPopular: true },
      { size: '1000ml', price: 58.00, originalPrice: 65.00 },
    ],
    rating: 4.95,
    reviewsCount: 290,
    characteristics: {
      texture: 'Velvety & Amber Granular',
      aroma: 'Warm Sweet Earth & Cardamom undertones',
      method: 'Traditional Clay Vessel Clarification',
      smokePoint: '250°C (482°F)',
    },
    features: [
      'Certified 100% A2 Gir Cow Source',
      'Unrefined natural clarifying process',
      'Excellent for daily cooking & Ayurveda',
      'Glass packaging preserved from light'
    ]
  },
  {
    id: 'family-pack-ghee',
    name: 'Family Harvest Pack',
    tagline: 'Artisanal Reserve For The Home',
    badge: 'Best Value Bundle',
    description: 'A generous duo featuring one full 1000ml pantry jar and an everyday 500ml tabletop jar, bundled for families who cherish authentic goodness.',
    fullStory: 'Specially assembled for households that cook, bake, and season every family meal with authentic ghee. Includes two hermetically sealed jars with wooden dispensing spoons and culinary pairing guide.',
    image: '/images/products/family-pack-ghee.jpg',
    sizes: [
      { size: '1500ml Set (1000ml + 500ml)', price: 74.00, originalPrice: 88.00, isPopular: true },
    ],
    rating: 4.98,
    reviewsCount: 420,
    characteristics: {
      texture: 'Golden Granular Perfection',
      aroma: 'Warm Nutty Kitchen Comfort',
      method: 'Handcrafted Heritage Blend',
      smokePoint: '250°C (482°F)',
    },
    features: [
      'Includes handcrafted rosewood spoon',
      'Pantry preservation guarantee',
      'Complimentary recipe pairing monograph',
      'Eco-friendly protective jute packaging'
    ]
  }
];
