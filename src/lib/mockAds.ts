export interface AdData {
  brand: string;
  platform: string;
  ad_text: string;
  cta: string;
  img_url: string;
}

export const mockAds: AdData[] = [
  {
    brand: "Notion",
    platform: "Meta",
    ad_text: "Organize your life with Notion. Work smarter, not harder.",
    cta: "Try Free",
    img_url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"
  },
  {
    brand: "Slack",
    platform: "LinkedIn",
    ad_text: "Where work happens. Connect your team with Slack.",
    cta: "Get Started",
    img_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
  },
  {
    brand: "Figma",
    platform: "Meta",
    ad_text: "Design together in real-time. The collaborative design tool.",
    cta: "Start Designing",
    img_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
  },
  {
    brand: "Shopify",
    platform: "Google",
    ad_text: "Start selling online today. Build your empire with Shopify.",
    cta: "Start Free Trial",
    img_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop"
  },
  {
    brand: "Canva",
    platform: "Meta",
    ad_text: "Create stunning designs in minutes. No design skills needed.",
    cta: "Try Canva Pro",
    img_url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop"
  }
];

export const searchAds = (brandName: string): AdData[] => {
  const lowerBrand = brandName.toLowerCase();
  return mockAds.filter(ad => 
    ad.brand.toLowerCase().includes(lowerBrand)
  );
};
