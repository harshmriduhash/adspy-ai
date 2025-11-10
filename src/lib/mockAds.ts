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
    img_url:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop",
  },
  {
    brand: "Slack",
    platform: "LinkedIn",
    ad_text: "Where work happens. Connect your team with Slack.",
    cta: "Get Started",
    img_url:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
  },
  {
    brand: "Figma",
    platform: "Meta",
    ad_text: "Design together in real-time. The collaborative design tool.",
    cta: "Start Designing",
    img_url:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
  },
  {
    brand: "Shopify",
    platform: "Google",
    ad_text: "Start selling online today. Build your empire with Shopify.",
    cta: "Start Free Trial",
    img_url:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop",
  },
  {
    brand: "Canva",
    platform: "Meta",
    ad_text: "Create stunning designs in minutes. No design skills needed.",
    cta: "Try Canva Pro",
    img_url:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
  },
  {
    brand: "HubSpot",
    platform: "LinkedIn",
    ad_text: "Grow better with HubSpot. CRM that actually works for you.",
    cta: "Get Started Free",
    img_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
  },
  {
    brand: "Asana",
    platform: "Meta",
    ad_text: "Manage your team's work, projects, and tasks online.",
    cta: "Try for Free",
    img_url:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
  },
  {
    brand: "Zoom",
    platform: "Google",
    ad_text: "Video conferencing that just works. Join 300K+ companies.",
    cta: "Sign Up Free",
    img_url:
      "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=400&h=300&fit=crop",
  },
  {
    brand: "Dropbox",
    platform: "Meta",
    ad_text: "Keep your files safe, synced, and easy to share.",
    cta: "Try Business",
    img_url:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
  },
  {
    brand: "Airtable",
    platform: "LinkedIn",
    ad_text: "Build powerful apps and workflows without code.",
    cta: "Start Building",
    img_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  },
  {
    brand: "Monday",
    platform: "Meta",
    ad_text: "A platform built for a new way of working. Manage everything.",
    cta: "Get Started",
    img_url:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
  },
  {
    brand: "Mailchimp",
    platform: "Google",
    ad_text: "Turn emails into revenue. Marketing that grows with you.",
    cta: "Sign Up Free",
    img_url:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
  },
  {
    brand: "Trello",
    platform: "Meta",
    ad_text: "Collaborate, manage projects, and reach new productivity peaks.",
    cta: "Sign Up - It's Free",
    img_url:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
  },
  {
    brand: "Stripe",
    platform: "LinkedIn",
    ad_text:
      "Payments infrastructure for the internet. Start accepting payments.",
    cta: "Start Now",
    img_url:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
  },
  {
    brand: "Intercom",
    platform: "Meta",
    ad_text: "The complete customer service solution. Talk to customers.",
    cta: "Try Intercom",
    img_url:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
  },
  {
    brand: "Zendesk",
    platform: "Google",
    ad_text: "Better customer experiences start here. Support made simple.",
    cta: "Try Free",
    img_url:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
  },
  {
    brand: "ClickUp",
    platform: "LinkedIn",
    ad_text: "One app to replace them all. Save time with the everything app.",
    cta: "Get Started",
    img_url:
      "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&h=300&fit=crop",
  },
  {
    brand: "Calendly",
    platform: "Meta",
    ad_text: "Scheduling automation for everyone. Say goodbye to phone tag.",
    cta: "Sign Up Free",
    img_url:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop",
  },
  {
    brand: "Loom",
    platform: "LinkedIn",
    ad_text:
      "Record quick videos to update your team. Async communication wins.",
    cta: "Get Loom Free",
    img_url:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
  },
  {
    brand: "Miro",
    platform: "Meta",
    ad_text:
      "Visual collaboration for teams. The online whiteboard revolution.",
    cta: "Start for Free",
    img_url:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop",
  },
];

export const searchAds = (brandName: string): AdData[] => {
  const lowerBrand = brandName.toLowerCase();
  return mockAds.filter((ad) => ad.brand.toLowerCase().includes(lowerBrand));
};
