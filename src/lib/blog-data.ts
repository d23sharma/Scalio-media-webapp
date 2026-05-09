export type BlogCategory =
  | "Instagram Growth"
  | "Small Business"
  | "Online Business"
  | "Content Strategy"
  | "Reels & Shorts"
  | "Analytics"
  | "Email Marketing";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  readTime: string;
};

export const BLOG_CATEGORIES: ("All" | BlogCategory)[] = [
  "All",
  "Instagram Growth",
  "Small Business",
  "Content Strategy",
  "Online Business",
  "Reels & Shorts",
  "Analytics",
  "Email Marketing", // intentionally empty seed category — exercises empty-state UX
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const raw: Omit<BlogPost, "slug">[] = [
  // INSTAGRAM GROWTH
  {
    title: "How to Get Your First 1,000 Instagram Followers (Without Paid Ads)",
    excerpt:
      "A repeatable, organic playbook that takes new accounts from zero to first 1K in 60 days.",
    category: "Instagram Growth",
    readTime: "7 min read",
  },
  {
    title: "Why Your Instagram Reach Dropped — And How to Fix It in 7 Days",
    excerpt:
      "Diagnose the 5 most common reach killers and the recovery sequence that actually works.",
    category: "Instagram Growth",
    readTime: "6 min read",
  },
  {
    title: "The Best Time to Post on Instagram in 2025 (By Industry)",
    excerpt: "Posting windows by niche, backed by 1,200+ accounts we manage across India.",
    category: "Instagram Growth",
    readTime: "5 min read",
  },
  {
    title: "How the Instagram Algorithm Actually Works in 2025",
    excerpt: "What signals matter now, what's been deprioritised, and how to align your content.",
    category: "Instagram Growth",
    readTime: "9 min read",
  },
  {
    title: "Instagram Reels vs. Stories: Which Drives More Growth Right Now?",
    excerpt: "A side-by-side comparison of reach, conversion, and retention by content format.",
    category: "Reels & Shorts",
    readTime: "6 min read",
  },
  {
    title: "How to Write Instagram Captions That Stop the Scroll",
    excerpt: "Hooks, structures, and CTAs we use across every viral post we ship.",
    category: "Content Strategy",
    readTime: "5 min read",
  },

  // SMALL BUSINESS
  {
    title: "How Small Businesses Are Getting Clients Directly From Instagram DMs",
    excerpt: "The exact DM funnel turning casual followers into paying customers in under 7 days.",
    category: "Small Business",
    readTime: "6 min read",
  },
  {
    title: "Instagram for Local Businesses: A Step-by-Step Starter Guide",
    excerpt: "Set up, content cadence, and local SEO tactics for brick-and-mortar brands.",
    category: "Small Business",
    readTime: "8 min read",
  },
  {
    title: "How to Sell Products on Instagram Without a Website",
    excerpt: "Turn your bio + DMs into a fully functional storefront — no Shopify needed.",
    category: "Small Business",
    readTime: "5 min read",
  },
  {
    title: "Instagram Bio Hacks That Convert Profile Visitors Into Customers",
    excerpt: "The 4-line bio formula that consistently lifts profile→action rate by 30%+.",
    category: "Small Business",
    readTime: "4 min read",
  },
  {
    title: "How to Use Instagram Highlights to Build Trust With New Followers",
    excerpt: "The 6 highlight covers every service business should ship in week one.",
    category: "Small Business",
    readTime: "5 min read",
  },
  {
    title: "The Instagram Content Plan for Service-Based Businesses",
    excerpt: "A 30-day calendar tuned for consultants, coaches, agencies, and clinics.",
    category: "Small Business",
    readTime: "7 min read",
  },

  // ONLINE BUSINESS
  {
    title: "How to Build an Email List Using Only Instagram",
    excerpt: "Lead magnets, landing pages, and DM automations that compound into 1K+ subs/month.",
    category: "Online Business",
    readTime: "6 min read",
  },
  {
    title: "From 0 to $5K/Month: Using Instagram to Launch a Digital Product",
    excerpt: "The 90-day launch system we've used for 40+ creator-led product launches.",
    category: "Online Business",
    readTime: "9 min read",
  },
  {
    title: "The Social Media Funnel That Converts Followers Into Paying Clients",
    excerpt: "A 4-stage funnel mapped to Reels, Carousels, Stories, and DMs.",
    category: "Online Business",
    readTime: "8 min read",
  },
  {
    title: "How to Automate Your Instagram DMs Without Losing the Personal Touch",
    excerpt: "Tools, triggers, and templates that scale without sounding like a bot.",
    category: "Online Business",
    readTime: "6 min read",
  },
  {
    title: "What 100 Viral Posts Have in Common (Data-Backed Breakdown)",
    excerpt: "We dissected 100 of our own viral posts — here's the structural pattern.",
    category: "Analytics",
    readTime: "10 min read",
  },
  {
    title: "How to Repurpose One Piece of Content Into 10 Posts",
    excerpt: "The atomic content workflow we use to keep 20+ accounts perpetually fed.",
    category: "Content Strategy",
    readTime: "5 min read",
  },

  // CONTENT STRATEGY
  {
    title: "The 3-Post Formula That Gets Saved, Shared, and Followed",
    excerpt: "The Save-Share-Follow trio every account should ship every single week.",
    category: "Content Strategy",
    readTime: "5 min read",
  },
  {
    title: "How to Plan 30 Days of Content in 2 Hours",
    excerpt: "The batching system our content team uses to plan + produce a full month.",
    category: "Content Strategy",
    readTime: "6 min read",
  },
  {
    title: "What Content Types Get the Most Reach on Instagram in 2025",
    excerpt: "Format-by-format reach data from 1.2M+ posts we've shipped or analysed.",
    category: "Analytics",
    readTime: "7 min read",
  },
  {
    title: "How to Use Trending Audio on Reels Before It Peaks",
    excerpt: "Spot rising audio 48 hours before saturation — the trend-radar workflow.",
    category: "Reels & Shorts",
    readTime: "5 min read",
  },
  {
    title: "Hashtag Strategy 2025: What Still Works and What to Drop",
    excerpt: "The current hashtag stack — and the legacy tactics quietly killing reach.",
    category: "Instagram Growth",
    readTime: "4 min read",
  },
  {
    title: "How to Use ChatGPT to Write Instagram Captions That Sound Human",
    excerpt: "Prompt patterns that produce captions indistinguishable from a senior copywriter.",
    category: "Content Strategy",
    readTime: "6 min read",
  },
];

export const BLOG_POSTS: BlogPost[] = raw.map((p) => ({ ...p, slug: slugify(p.title) }));

export const FEATURED_POSTS: BlogPost[] = [BLOG_POSTS[0], BLOG_POSTS[6], BLOG_POSTS[13]];
