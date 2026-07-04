/**
 * Editable marketing copy — swap this module for a headless CMS adapter without
 * touching page components. Non-marketing catalog/content remains in lib/content.ts.
 */

export const site = {
  name: "Exobod.ai",
  tagline: "Give your phone a real body.",
  secondary: "AI in your phone. Motion in the world.",
};

export const navLinks = [
  { href: "/#product", label: "Product" },
  { href: "/#why-exobod", label: "Why Exobod" },
  { href: "/customize", label: "Customize" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/build-system", label: "Build System" },
  { href: "/trust", label: "Trust" },
  { href: "/company", label: "Company" },
  { href: "/partners", label: "Partners" },
  { href: "/demo", label: "Book demo" },
  { href: "/preorder", label: "Order" },
] as const;

export const heroTrustChips = [
  "iPhone + Android cores",
  "Removable handset mount",
  "Four body architectures",
  "BLE / USB + onboard MCU",
  "Global custom-order support",
] as const;

export const featureCards = [
  {
    title: "Phone as Brain",
    description:
      "Your existing device powers the intelligence, face, voice, camera, and interface.",
  },
  {
    title: "Exoskeleton as Body",
    description:
      "A modular frame adds arms, legs, mounts, servo joints, and physical actions.",
  },
  {
    title: "Configurator + build requests",
    description:
      "Pick mount geometry, limbs, accessories, and motion packs - then file a prototype or custom-build request. No storefront checkout.",
  },
] as const;

export const preorderPageCopy = {
  whoFor:
    "Makers, robotics educators, product teams, and AI builders who want a configurable embodied platform they can tailor to real workflows.",
  whatRequest:
    "Body type, handset family, use case, budget band, accessories, and deployment goals. We respond with recommended configuration, timeline windows, and quote path.",
  whatNext:
    "After submission, our team confirms requirements, shares build options, and sends the next step for order confirmation. We also support team and education procurement flows.",
};

export const footerNote =
  "Built-to-order modular hardware platform for custom smartphone embodiment systems.";

export const whyExobod = {
  headline: "Humanoid robots start from zero. Exobod starts with the phone you already own.",
  copy: "Your smartphone already has AI, camera, microphone, speaker, display, connectivity, and apps. Exobod adds the missing layer: a customizable physical body.",
  missionLine: "Give every smartphone a useful body.",
  separation: "We do not replace your phone. We embody it.",
} as const;

export const forBuilders = {
  headline: "For Builders",
  subhead: "Build With Us",
  copy: "3D print designers, robotics engineers, schools, makerspaces, educators, and early investors: co-develop shells, supply batch prints, host pilots, or back milestone builds. We coordinate through the preorder desk until a dedicated partner program exists.",
} as const;

export const partnersPageCopy = {
  headline: "Partner with Exobod",
  subhead: "Print shops, schools, and institutional buyers",
  intro:
    "Batch EDU kits, white-label shells, and regional print partners — submit interest for volume quotes, curriculum bundles, or co-branded pilot programs.",
  printShopBlurb:
    "FDM / SLA shops with robotics experience: supply shells, jigs, and QC fixtures under Exobod BOM templates.",
  schoolBlurb:
    "Schools and makerspaces: EDU kit bundles with curriculum-safe speed caps and procurement-friendly documentation.",
} as const;

export const demoPageCopy = {
  headline: "Book a live Exobod demo",
  subhead: "Engineering walkthrough + your saved configuration",
  intro:
    "Pick a slot with our build desk. We attach your saved configuration ID and summary to the prep packet so the session starts with your exact options — not a generic tour.",
  noConfigHint:
    "No saved config yet? Lock options in the configurator first, or save a snapshot by email — we'll still run a product overview.",
} as const;

export const homeFaq = [
  {
    q: "Is this a phone case?",
    a: "No. Exobod is a modular exoskeleton frame with mounts, joints, and motion hardware - not a cosmetic shell. Your phone stays the compute and UI core.",
  },
  {
    q: "Does it work with iPhone and Android?",
    a: "We design around removable cores for both families plus a universal mount path. Final fit and cable kits are confirmed during prototype intake.",
  },
  {
    q: "Is it available now?",
    a: "No. Everything on this site is preorder interest, prototype milestones, or custom engineering - not retail inventory or guaranteed ship dates.",
  },
  {
    q: "Can it really walk?",
    a: "Walker-class prototypes explore gait within lab guardrails. No guarantee of outdoor autonomy, uneven-terrain success, or consumer-grade reliability - those require program-specific testing.",
  },
  {
    q: "Can ChatGPT control the body?",
    a: "The phone AI can generate commands and routines, while the onboard controller translates approved commands into safe motor actions. Prototype behavior depends on body type, controller setup, and testing.",
  },
  {
    q: "What is customizable?",
    a: "Body architecture, finish, accessory ports, skill packs, and prototype tier are configured through the desk and app; hardware changes are gated by engineering review - not checkout options.",
  },
  {
    q: "Is this for kids?",
    a: "Exobod is aimed at makers, educators, labs, and teams who understand prototype risk. It is not positioned as a toy product and not sold as child-safe consumer hardware.",
  },
  {
    q: "Can schools or makers request kits?",
    a: "Yes - submit preorder interest with your institution or shop context. We route education and makerspace requests to the same prototype review queue with documentation suited for procurement.",
  },
  {
    q: "How is Exobod different from a humanoid robot?",
    a: "Full humanoids ship an integrated brain, sensors, and body. Exobod assumes your smartphone is already the brain, display, and connectivity stack - we only engineer the embodiment layer, mounts, and motion hardware around it.",
  },
  {
    q: "What does the phone do?",
    a: "It runs assistants, vision, voice I/O, UI, and the Exobod control app. High-level skill requests originate there before crossing BLE/USB to the onboard controller.",
  },
  {
    q: "What does the body do?",
    a: "It carries structure, joints or wheels, accessory ports, and actuators that turn approved motion targets into physical motion - always within prototype safety tables.",
  },
  {
    q: "Can customers request custom bodies?",
    a: "Yes. Custom geometry, accessories, and torque targets go through the configurator + preorder desk, then engineering review. Declined scopes are communicated plainly - no silent yeses.",
  },
  {
    q: "Is it available for preorder?",
    a: "You can join the preorder interest list and request prototype milestones today. That is not the same as buying finished inventory or a guaranteed delivery window.",
  },
] as const;
