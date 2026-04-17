import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

async function main() {
  await prisma.like.deleteMany();
  await prisma.citizenNews.deleteMany();
  await prisma.video.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@gmail.com",
        phoneNumber: "9000000000",
        passwordHash: hashPassword("Admin@123"),
        city: "Kolkata",
        state: "West Bengal",
        location: "Kolkata, West Bengal",
        preferredCategory: "Tech",
        role: "admin",
        isGuest: false
      },
      {
        name: "Demo User",
        email: "demo@taza.app",
        phoneNumber: "9999999999",
        passwordHash: hashPassword("password123"),
        city: "Bengaluru",
        state: "Karnataka",
        location: "Bengaluru, Karnataka",
        preferredCategory: "Tech",
        role: "user",
        isGuest: false
      },
      {
        name: "Guest Reader",
        city: "Mumbai",
        state: "Maharashtra",
        location: "Mumbai, Maharashtra",
        isGuest: true
      }
    ]
  });

  await prisma.news.createMany({
    data: [
      {
        title: "AI copilots become standard tools across product teams",
        description: "Teams are baking AI into design, support, and engineering workflows.",
        content:
          "Product organizations are using AI assistants to accelerate QA, summarize releases, and reduce repetitive coordination work. The gains are strongest where teams still keep humans in the review loop and treat AI as an operator rather than an autopilot.",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        category: "Tech",
        state: "Karnataka"
      },
      {
        title: "City mobility push adds new electric corridors to cut commute times",
        description: "Urban planners say cleaner transit and smarter signaling can ease congestion.",
        content:
          "A new transport rollout focuses on dedicated electric bus corridors, synchronized signals, and integrated ticketing. Officials expect better reliability in peak hours and early pilot feedback has been encouraging in commuter-heavy districts.",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        category: "World",
        state: "Maharashtra"
      },
      {
        title: "Markets rebound as investors return to growth sectors",
        description: "Technology counters and renewable plays led the day’s recovery.",
        content:
          "Broader market sentiment improved as investors moved back into companies showing resilient margins and stronger guidance. Analysts pointed to a calmer macro outlook, though they warned that the rally still depends on execution in upcoming quarters.",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        state: "Delhi"
      },
      {
        title: "Late drama seals a memorable win in front of a packed stadium",
        description: "A composed finish and sharp bowling execution closed out a tense match.",
        content:
          "The game swung repeatedly in the final overs before disciplined execution turned the momentum for the home side. Younger players drew praise for staying calm under pressure in a noisy, high-stakes finish.",
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
        category: "Sports",
        state: "Tamil Nadu"
      },
      {
        title: "Startup founders double down on product focus amid funding reset",
        description: "Lean teams and clear roadmaps are driving faster releases.",
        content:
          "Founders are prioritizing predictable shipping cycles, stronger onboarding, and measurable retention improvements. Investors say disciplined execution is now valued as much as top-line growth.",
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        state: "Karnataka"
      },
      {
        title: "Monsoon preparedness: city teams clear drains ahead of heavy rains",
        description: "Municipal crews report early progress and faster response times.",
        content:
          "Teams are clearing choke points, upgrading pumps, and expanding helplines. Officials said routine cleaning schedules are being tracked ward-by-ward to avoid repeat flooding zones.",
        imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        category: "World",
        state: "West Bengal"
      },
      {
        title: "Schools pilot AI-powered learning assistants for revision support",
        description: "Teachers say the tools help personalize practice questions.",
        content:
          "The pilot focuses on guided revision, instant feedback, and bilingual explanations. Educators emphasized that the assistant is used as a supplement rather than replacing classroom instruction.",
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
        category: "Tech",
        state: "Delhi"
      },
      {
        title: "Local artisans see new demand as handloom fairs return to cities",
        description: "Organizers say footfall is up and sales are steady.",
        content:
          "Handloom clusters are showcasing contemporary designs alongside traditional weaves. Buyers are responding to quality and traceability, with many stalls offering direct-from-weaver collections.",
        imageUrl: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&w=1200&q=80",
        category: "World",
        state: "Tamil Nadu"
      },
      {
        title: "Cricket academy opens new training center with modern analytics",
        description: "Coaches will track workload, speed, and recovery metrics.",
        content:
          "The facility includes indoor practice, video review rooms, and strength conditioning units. Young players will receive tailored programs based on biomechanics assessments.",
        imageUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
        category: "Sports",
        state: "Maharashtra"
      },
      {
        title: "Tech hiring steadies as companies shift to long-term roadmaps",
        description: "Demand rises for engineers skilled in mobile, cloud, and AI.",
        content:
          "Recruiters report fewer panic freezes and more structured hiring plans. Teams are especially seeking developers with cross-platform experience and strong fundamentals.",
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
        category: "Tech",
        state: "Karnataka"
      },
      {
        title: "New metro extension begins trial runs ahead of public launch",
        description: "Officials say safety checks are on schedule.",
        content:
          "Trial operations will test station readiness, signaling reliability, and emergency procedures. The extension is expected to reduce commute time for several high-density neighborhoods.",
        imageUrl: "https://images.unsplash.com/photo-1520967824495-b529aeba26df?auto=format&fit=crop&w=1200&q=80",
        category: "World",
        state: "Delhi"
      },
      {
        title: "Local markets add fresh produce hubs to cut waste and improve access",
        description: "Vendors say better cold storage is reducing spoilage.",
        content:
          "The new hubs focus on quick sorting, improved transport, and transparent pricing boards. Consumers benefit from more consistent quality and predictable supply.",
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        state: "West Bengal"
      },
      {
        title: "Football league final draws record crowd and tense finish",
        description: "A late equalizer forced extra time before a penalty shootout.",
        content:
          "Both teams traded chances in a fast-paced match. Fans praised the league’s improved broadcast quality and grassroots scouting networks bringing new talent to the field.",
        imageUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
        category: "Sports",
        state: "Kerala"
      },
      {
        title: "Cybersecurity basics: simple steps to protect your accounts",
        description: "Experts recommend stronger passwords and safer device habits.",
        content:
          "Use unique passwords, enable two-factor authentication, and keep systems updated. Avoid sharing OTPs and review app permissions regularly to reduce risk.",
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
        category: "Tech",
        state: "Maharashtra"
      },
      {
        title: "Small businesses adopt UPI-first billing to speed up payments",
        description: "Merchants say faster settlements improve cash flow.",
        content:
          "With QR-based billing and automated receipts, shops are reducing long queues and manual reconciliation. Some are also introducing loyalty points linked to payment confirmations.",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        state: "Tamil Nadu"
      },
      {
        title: "State tourism board launches weekend trails for local travelers",
        description: "New itineraries highlight food, heritage, and nature.",
        content:
          "The trails connect nearby destinations with curated stops for local cuisine and cultural performances. Travel operators said demand is rising for short, well-planned getaways.",
        imageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
        category: "World",
        state: "Kerala"
      },
      {
        title: "Badminton stars shine in city open as juniors impress",
        description: "Young players delivered upsets against seasoned opponents.",
        content:
          "The tournament showcased strong defense and sharp net play. Coaches noted improved training infrastructure and more year-round competitions boosting performance.",
        imageUrl: "https://images.unsplash.com/photo-1613918431747-3cbd2d9d8f7b?auto=format&fit=crop&w=1200&q=80",
        category: "Sports",
        state: "Delhi"
      },
      {
        title: "EV charging points expand along highways to support long trips",
        description: "Operators plan reliable fast-charging stops every 80–120 km.",
        content:
          "The new stations include 24/7 support and transparent pricing. EV owners say consistent uptime is the key factor for planning intercity travel confidently.",
        imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1d?auto=format&fit=crop&w=1200&q=80",
        category: "Tech",
        state: "Tamil Nadu"
      },
      {
        title: "Retailers report steady festival demand for electronics and apparel",
        description: "Discounts and easy returns are driving stronger footfall.",
        content:
          "Stores are improving delivery windows and bundling offers. Analysts expect mid-range devices and value apparel to remain the biggest winners this season.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        state: "Delhi"
      },
      {
        title: "Local marathon sees thousands participate with new safety measures",
        description: "Organizers deployed more hydration stations and medical tents.",
        content:
          "First-time runners praised clear route signage and volunteer support. Coaches recommend gradual training and adequate recovery for sustainable performance.",
        imageUrl: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
        category: "Sports",
        state: "Karnataka"
      },
      {
        title: "City opens public co-working hubs for students and early founders",
        description: "The hubs offer Wi‑Fi, quiet zones, and mentoring events.",
        content:
          "Officials say the initiative supports affordable productivity spaces. Weekly meetups will connect students with local entrepreneurs and hiring managers.",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        category: "Tech",
        state: "West Bengal"
      },
      {
        title: "Farmers adopt smart irrigation to reduce water use in summer months",
        description: "Sensors help schedule watering based on soil moisture.",
        content:
          "Pilot farms reported stable yields with lower water usage. Experts say training and maintenance support are essential for sustained adoption.",
        imageUrl: "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&w=1200&q=80",
        category: "World",
        state: "Maharashtra"
      },
      {
        title: "Local startups build vernacular news experiences for broader reach",
        description: "More users prefer short updates in their native language.",
        content:
          "Teams are experimenting with audio summaries, bigger typography, and offline modes. The goal is to make news accessible across bandwidth conditions and age groups.",
        imageUrl: "https://images.unsplash.com/photo-1520975869010-0c75b8f76a0a?auto=format&fit=crop&w=1200&q=80",
        category: "Tech",
        state: "Kerala"
      },
      {
        title: "Stock watch: investors look for stable earnings amid global cues",
        description: "Analysts advise balanced portfolios and disciplined risk.",
        content:
          "Market volatility continues as global cues change quickly. Experts recommend focusing on fundamentals and avoiding emotional reactions to short-term swings.",
        imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        state: "Karnataka"
      },
      {
        title: "City derby ends level after intense second half",
        description: "Both teams shared points after a last-minute save.",
        content:
          "Supporters filled the stands for the local rivalry. Coaches highlighted improved fitness standards and smarter set-piece routines as key to performance.",
        imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
        category: "Sports",
        state: "West Bengal"
      },
      {
        title: "Public health clinics add teleconsult slots to reduce wait times",
        description: "Doctors will be available for remote follow-ups on weekdays.",
        content:
          "The initiative aims to improve continuity of care for chronic conditions. Patients can schedule follow-ups and receive prescriptions through verified digital channels.",
        imageUrl: "https://images.unsplash.com/photo-1580281658628-9a7d5b2e63f6?auto=format&fit=crop&w=1200&q=80",
        category: "World",
        state: "Tamil Nadu"
      }
    ]
  });

  await prisma.video.createMany({
    data: [
      {
        title: "Morning Brief Live",
        videoUrl: "https://example.com/live/morning-brief.m3u8",
        thumbnail: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
        isLive: true
      },
      {
        title: "Tech Recap",
        videoUrl: "https://example.com/videos/tech-recap.mp4",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        isLive: false
      }
    ]
  });

  await prisma.citizenNews.create({
    data: {
      title: "Waterlogging reported after heavy evening rains",
      content: "Local residents shared footage of waterlogging near a busy junction and called for faster drainage clearance.",
      state: "Kerala",
      language: "English",
      imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
    }
  });

  const [user, article] = await Promise.all([
    prisma.user.findFirst({ select: { id: true } }),
    prisma.news.findFirst({ select: { id: true } })
  ]);

  if (user && article) {
    await prisma.like.create({
      data: {
        userId: user.id,
        newsId: article.id
      }
    });
  }
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
