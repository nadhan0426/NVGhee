export interface ProcessStage {
  step: number;
  stageNumber: string;
  title: string;
  subtitle: string;
  description: string;
  artisanQuote: string;
  metric: string;
  metricLabel: string;
  image: string;
  liquidFillPercent: number; // For stage 7-8 bottle filling
}

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: 1,
    stageNumber: '01 / 08',
    title: 'The Sacred Beginning',
    subtitle: 'Vedic Selection & Earthen Preparation',
    description: 'Before dawn, the artisan prepares earthen vessels, sacred brass pots, and selects organic pasture grasses. Pure dairy craftsmanship begins with quiet reverence and clean natural elements.',
    artisanQuote: '“Good ghee asks for nothing more than patient hands and purest intentions.”',
    metric: '4:30 AM',
    metricLabel: 'Brahma Muhurta Start',
    image: '/images/story/stage-1.jpg',
    liquidFillPercent: 0,
  },
  {
    step: 2,
    stageNumber: '02 / 08',
    title: 'Fresh Whole Milk',
    subtitle: 'Grass-Fed Pasture Harvest',
    description: 'Raw, whole milk from free-grazing indigenous cows is gently strained into thick earthenware vessels. Rich in natural beta-carotene from lush green meadows, giving the milk its subtle sweet aroma.',
    artisanQuote: '“The grasses of the meadow speak directly through the sweetness of the warm milk.”',
    metric: '100% Pasture',
    metricLabel: 'Wild-Grazed Cows',
    image: '/images/story/stage-2.jpg',
    liquidFillPercent: 0,
  },
  {
    step: 3,
    stageNumber: '03 / 08',
    title: 'Cream Culturing',
    subtitle: 'Slow Fermentation into Curd',
    description: 'Rather than skimming raw cream, the whole milk is gently warmed and cultured overnight with a traditional Vedic starter culture. Beneficial probiotics transform the proteins into silky, aromatic whole dahi (curd).',
    artisanQuote: '“True bilona is born from cultured curd, never raw industrial cream.”',
    metric: '14 Hours',
    metricLabel: 'Cultured Overnight',
    image: '/images/story/stage-3.jpg',
    liquidFillPercent: 0,
  },
  {
    step: 4,
    stageNumber: '04 / 08',
    title: 'Hand Churning Butter',
    subtitle: 'The Bi-Directional Wooden Bilona',
    description: 'Using a handcrafted two-way wooden bilona staff with hand-twisted ropes, the cultured curd is slowly churned back and forth. Gentle centrifugal rhythm separates the pure golden butter (makkhan) from wholesome buttermilk.',
    artisanQuote: '“Listen to the rhythm of the wooden staff; it tells you when the butter floats free.”',
    metric: 'Two-Way',
    metricLabel: 'Clockwise & Counter',
    image: '/images/story/stage-4.jpg',
    liquidFillPercent: 5,
  },
  {
    step: 5,
    stageNumber: '05 / 08',
    title: 'Traditional Simmer',
    subtitle: 'Slow Fire Clarification',
    description: 'Fresh makkhan is transferred into heavy-bottomed brass cauldrons over mild, steady cow-dung and wood embers. Water evaporates as milk solids gently caramelize, clarifying into amber liquid gold with fragrant hazelnut aromas.',
    artisanQuote: '“Never rush the simmer. The flame must dance low until the golden liquid turns crystal clear.”',
    metric: '110°C Gentle',
    metricLabel: 'Open Brass Cauldron',
    image: '/images/story/stage-5.jpg',
    liquidFillPercent: 15,
  },
  {
    step: 6,
    stageNumber: '06 / 08',
    title: 'Golden Ghee Filtration',
    subtitle: 'Straining the Pure Amber Essence',
    description: 'At the exact moment of perfect clarification, the artisan lifts the pot and filters the molten golden ghee through multiple layers of hand-spun organic muslin cloth, capturing every caramelized sediment.',
    artisanQuote: '“The clarity of the stream reveals the master craftsman’s patience.”',
    metric: '100% Pure',
    metricLabel: 'Naturally Clarified',
    image: '/images/story/stage-6.jpg',
    liquidFillPercent: 35,
  },
  {
    step: 7,
    stageNumber: '07 / 08',
    title: 'Airtight Bottle Filling',
    subtitle: 'Filling the Glass Sanctuary',
    description: 'While still warmly liquid and glowing, the pure ghee is steadily decanted into pre-sterilized glass jars. As you scroll, watch the golden elixir rise to fill the jar, capturing aroma and freshness under sterile seal.',
    artisanQuote: '“We pour warm liquid sunshine into pure glass to preserve its life for seasons to come.”',
    metric: 'Rising Fill',
    metricLabel: 'Progressive Filling',
    image: '/images/story/stage-7.jpg',
    liquidFillPercent: 85,
  },
  {
    step: 8,
    stageNumber: '08 / 08',
    title: 'The Finished Crown',
    subtitle: 'Granular Cooling & Golden Glow',
    description: 'Allowed to cool naturally at room temperature, the clarified butter crystallizes into its revered Danedar (granular) texture. Sealed with an embossed gold metal lid, radiating warm golden morning brilliance.',
    artisanQuote: '“From the earth and pasture to your family’s kitchen table—nourishment in its purest form.”',
    metric: 'Danedar',
    metricLabel: 'Granular Texture',
    image: '/images/story/stage-8.jpg',
    liquidFillPercent: 100,
  },
];
