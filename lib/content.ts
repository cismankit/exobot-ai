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

export type BodyTypeSlug = "walker" | "desk-assistant" | "rover" | "utility-helper";

export const bodyTypes: {
  slug: BodyTypeSlug;
  name: string;
  purpose: string;
  bestFor: string;
  actions: string[];
}[] = [
  {
    slug: "walker",
    name: "Walker",
    purpose: "Movement, gestures, interaction, and personality.",
    bestFor: "Labs, demos, and embodied presence where bipedal motion fits your prototype goals.",
    actions: ["Step routines", "Gesture packs", "Follow modes", "Expressive poses"],
  },
  {
    slug: "desk-assistant",
    name: "Desk Assistant",
    purpose: "Workspace help, reminders, display, and friendly presence.",
    bestFor: "Desks, studios, and classrooms that need a mounted handset with deliberate motion beside monitors.",
    actions: ["Present", "Notify", "Monitor", "Assist"],
  },
  {
    slug: "rover",
    name: "Rover",
    purpose: "Wheeled movement, patrol, carrying small payloads, and longer range.",
    bestFor: "Patrol experiments, mobile demos, and payload tests on smooth surfaces.",
    actions: ["Patrol paths", "Carry trays", "Follow tags", "Record while moving"],
  },
  {
    slug: "utility-helper",
    name: "Utility Helper",
    purpose: "Task modules, trays, tools, camera rigs, and experimental builds.",
    bestFor: "Makers pushing custom mounts, rigs, sensors, and rapid hardware iteration.",
    actions: ["Tool trays", "Camera rigs", "Sensor mounts", "Custom end-effectors"],
  },
];

export const skills = [
  { name: "Walk", blurb: "Prototype gait and stepping routines for supported builds." },
  { name: "Dance", blurb: "Choreographed motion presets for personality demos." },
  { name: "Follow", blurb: "Tag-based following for early companion experiments." },
  { name: "Patrol", blurb: "Repeatable paths for rover-style configurations." },
  { name: "Record", blurb: "Use onboard cameras for capture while the body repositions." },
  { name: "Gesture", blurb: "Wave, nod, and pose packs for communication." },
  { name: "Carry", blurb: "Light payloads on approved accessory configurations." },
  { name: "Assist", blurb: "Desk-side reminders, timers, and contextual prompts." },
  { name: "Teach", blurb: "STEM-friendly motion lessons and repeatable routines." },
  { name: "Present", blurb: "Turn the phone screen into a presenter with motion cues." },
  { name: "Monitor", blurb: "Environmental checks with sensor add-ons where configured." },
  { name: "React", blurb: "Audio-reactive motion tied to assistant voice output." },
] as const;

export const homeUseCases = [
  {
    title: "Makers & Creators",
    description:
      "Swap modules, iterate mounts, and show hardware progress without hiding the phone brain.",
  },
  {
    title: "STEM / Robotics Education",
    description:
      "Teach motion planning, sensors, and embodied AI with a platform students already understand.",
  },
  {
    title: "Desk embodiment",
    description:
      "Mount the handset beside monitors; add motion cues, reminders, and presenter motion without hiding the phone brain.",
  },
  {
    title: "Prototyping & Research",
    description:
      "Prototype consultation-friendly builds for labs exploring human-robot interaction.",
  },
  {
    title: "Accessibility Experiments",
    description:
      "Early research configurations for teams exploring assistive presence - not a medical device.",
  },
  {
    title: "Brand Mascot / Demo Bot",
    description:
      "Purpose-built demo bots for events with controlled motion and scripted skills.",
  },
  {
    title: "Content Creation",
    description:
      "Camera rigs, motion cues, and repeatable takes for creators building new formats.",
  },
  {
    title: "AI Companion Exploration",
    description:
      "Swap the body. Keep the brain while testing personality, voice, and motion together.",
  },
] as const;

export const pageUseCases = [
  {
    title: "Education",
    problem: "Robotics kits often hide the AI stack students already carry daily.",
    role: "Exobod makes the phone the visible brain while the body teaches motion and mechatronics.",
    example: "Class modules pairing gait experiments with assistant voice prompts.",
    cta: { href: "/preorder", label: "Request an education build" },
  },
  {
    title: "Creators",
    problem: "Static mounts limit storytelling and motion personality on camera.",
    role: "Add articulated motion, trays, and rigs while keeping the phone as the capture brain.",
    example: "Motion-synced presenting with light modules and gesture packs.",
    cta: { href: "/customize", label: "Design My Exobod" },
  },
  {
    title: "Makers",
    problem: "Custom hardware needs repeatable mounting without rebuilding the core stack.",
    role: "Modular ports and utility arms accelerate iteration on experimental end-effectors.",
    example: "Sensor mount + gripper swaps during weekend build sprints.",
    cta: { href: "/build-system", label: "Review the build system" },
  },
  {
    title: "Desk Assistant",
    problem: "Voice assistants lack physical presence for reminders and focus cues.",
    role: "Desk Assistant bodies add motion cues, display positioning, and assistive gestures.",
    example: "Timers, stand reminders, and subtle motion prompts beside your monitor.",
    cta: { href: "/customize?type=desk-assistant", label: "Configure Desk Assistant" },
  },
  {
    title: "Product Demos",
    problem: "Event demos need safe, scripted motion without overpromising autonomy.",
    role: "Demo-oriented skill packs with controlled speeds for showroom floors.",
    example: "Patrol paths for rovers and scripted presenter motion for launch moments.",
    cta: { href: "/preorder", label: "Book a demo-oriented inquiry" },
  },
  {
    title: "Accessibility Research",
    problem: "Teams need responsible testbeds - not medical claims - for presence experiments.",
    role: "Utility and desk configurations for IRB-adjacent lab work with clear guardrails.",
    example: "Co-presence alerts with gentle motion cues - research-grade, not clinical.",
    cta: { href: "/preorder", label: "Talk with our team" },
  },
  {
    title: "Robotics Learning",
    problem: "Students need tangible feedback between code changes and physical outcomes.",
    role: "Bridge coding lessons with articulated output tied to the phone interface.",
    example: "Sequence skills in the app, watch the body perform the routine.",
    cta: { href: "/preorder", label: "See education workflows" },
  },
  {
    title: "AI Companion R&D",
    problem: "Pure software companions miss embodiment context and motion expression.",
    role: "Experiment with personality, voice, and motion while iterating body types.",
    example: "Swap walker vs desk shells while keeping the same assistant stack.",
    cta: { href: "/customize", label: "Design My Exobod" },
  },
] as const;

/** Electrical + software path (command direction ↓) */
export const buildControlPath = [
  {
    title: "Smartphone compute",
    description:
      "Your iPhone or Android runs the assistant, camera, mic, speakers, and UI. Skill intents originate here.",
  },
  {
    title: "Exobod control app",
    description:
      "Maps skills to joint targets, exposes presets, logs telemetry, and enforces prototype safety limits we ship per build.",
  },
  {
    title: "Radio or tether",
    description:
      "BLE or USB-C to the on-body MCU. Bench demos can stay offline; cloud features stay optional, never required for motion.",
  },
  {
    title: "Controller + motor drivers",
    description:
      "MCU receives targets at fixed rate, clamps accelerations, fans out PWM/PPM to each servo channel, and honors manual estop.",
  },
  {
    title: "Servo harness",
    description:
      "Dedicated power and signal bus per limb group so a fault in one joint does not brown out the entire frame.",
  },
] as const;

/** Mechanical + power stack (load path, bottom-up) */
export const buildMechanicalStack = [
  {
    title: "Removable core mount",
    description:
      "Mechanical datum between handset and exoskeleton. Swaps in minutes for handset upgrades without redesigning limbs.",
  },
  {
    title: "Hybrid frame",
    description:
      "Printed shells for fast iteration; metal linkages and shoulder/hip blocks where torque concentrates.",
  },
  {
    title: "Actuated joints",
    description:
      "Servo packages sized per body plan - walker vs rover vs desk bases differ in torque envelopes and cooling paths.",
  },
  {
    title: "Accessory ports",
    description:
      "Defined bolt circles and bus taps for trays, camera rigs, lights, grippers, and sensor masts - documented per SKU.",
  },
  {
    title: "Battery + regulation",
    description:
      "Fused pack sized for burst motion during prototype demos - not marketed runtime guarantees. Engineering sign-off per order.",
  },
] as const;

export const processSteps = [
  { step: 1, title: "Insert phone", detail: "Seat the handset in the removable core mount and torque fasteners to spec." },
  { step: 2, title: "Open control app", detail: "Load the Exobod control layer, pair over BLE/USB, and pull the prototype safety profile for your SKU." },
  { step: 3, title: "Pair manual controller", detail: "Bind a handheld or desktop override so humans can cut motion instantly." },
  { step: 4, title: "Pick a body plan", detail: "Walker, desk, rover, or utility - each changes linkage lengths, torque budgets, and accessory ports." },
  { step: 5, title: "Load skill pack", detail: "Bundle motion presets that match your preorder milestone - not consumer plug-and-play promises." },
  { step: 6, title: "Run motion", detail: "Validated targets stream to the MCU and articulate the frame within clamped speeds." },
] as const;

export const customizationOptions = {
  phoneTypes: ["iPhone", "Android", "Universal mount"] as const,
  bodyTypes: ["Walker", "Desk Assistant", "Rover", "Utility Helper"] as const,
  styles: ["Graphite Orange", "Stealth Black", "Silver Lab", "White Studio", "Custom"] as const,
  skillPacks: ["Companion", "Creator", "Education", "Patrol", "Utility", "Demo Bot"] as const,
  accessories: [
    "Tray hand",
    "Camera rig",
    "Light module",
    "Gripper hand",
    "Sensor mount",
    "Presentation stand",
  ] as const,
  buildTiers: [
    "Concept render",
    "Prototype shell",
    "Moving prototype",
    "Custom engineering consultation",
  ] as const,
};

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

/** Homepage preorder journey (distinct from lab “how it works” steps). */
export const customOrderSteps = [
  {
    step: 1,
    title: "Pick your phone",
    detail: "Tell us iPhone, Android, or universal mount so we match the removable core and cable exit.",
  },
  {
    step: 2,
    title: "Choose body type",
    detail: "Walker, Desk Assistant, Rover, or Utility Helper - each changes linkage, torque budget, and ports.",
  },
  {
    step: 3,
    title: "Select skills",
    detail: "Walk, dance, follow, patrol, and more are requested in the control app; we map them to prototype-safe motion tables.",
  },
  {
    step: 4,
    title: "Request prototype build",
    detail: "Submit preorder interest with budget band; we reply with feasibility, milestones, and what we will not attempt yet.",
  },
  {
    step: 5,
    title: "Receive consultation",
    detail: "Live review of scope, safety limits, and handoff artifacts - still not a retail ship date until agreements are signed.",
  },
] as const;

export const skillsEngineNames = [
  "Walk",
  "Dance",
  "Follow",
  "Patrol",
  "Record",
  "Carry",
  "Gesture",
  "Assist",
] as const;

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

export const whyExobod = {
  headline: "Humanoid robots start from zero. Exobod starts with the phone you already own.",
  copy: "Your smartphone already has AI, camera, microphone, speaker, display, connectivity, and apps. Exobod adds the missing layer: a customizable physical body.",
  missionLine: "Give every smartphone a useful body.",
  separation: "We do not replace your phone. We embody it.",
} as const;

export const configurationProducts = [
  {
    name: "Exobod Walker",
    href: "/customize?type=walker",
    bestFor: "Labs and demos that need biped presence beside a desk or stage.",
    motionType: "Target: servo-driven articulated legs + shoulder stack (joint count varies by prototype tier).",
    skillExamples: ["Walk", "Gesture", "Follow", "Dance"],
    prototypeTier: "Concept render → moving prototype → consult",
  },
  {
    name: "Exobod Desk",
    href: "/customize?type=desk-assistant",
    bestFor: "Classrooms, studios, and hybrid desks that want mounted handset motion.",
    motionType: "Target: compact base + reduced-DOF upper focus (not a full biped).",
    skillExamples: ["Assist", "Present", "Gesture", "Monitor"],
    prototypeTier: "Prototype shell → moving prototype",
  },
  {
    name: "Exobod Rover",
    href: "/customize?type=rover",
    bestFor: "Smooth-floor patrol, mobile demos, and light payload experiments.",
    motionType: "Target: wheeled base + steerable drivetrain (config-dependent).",
    skillExamples: ["Patrol", "Carry", "Record", "Follow"],
    prototypeTier: "Prototype shell → moving prototype",
  },
  {
    name: "Exobod Utility",
    href: "/customize?type=utility-helper",
    bestFor: "Makers iterating trays, rigs, grippers, and sensor masts.",
    motionType: "Target: utility frame + accessory-first kinematics.",
    skillExamples: ["Carry", "Record", "Gesture", "Assist"],
    prototypeTier: "Prototype shell → custom engineering consult",
  },
  {
    name: "Exobod EDU Kit",
    href: "/customize",
    bestFor: "STEM cohorts teaching embodied AI without hiding the handset brain.",
    motionType: "Target: desk or rover-class base with curriculum-safe speed caps.",
    skillExamples: ["Teach", "Patrol", "Gesture", "Assist"],
    prototypeTier: "Prototype shell bundles + educator onboarding",
  },
  {
    name: "Exobod Prototyping Kit",
    href: "/customize",
    bestFor: "Research labs benchmarking motion, payloads, and human interaction.",
    motionType: "Target: modular linkages + logging harness for bench characterization.",
    skillExamples: ["Record", "Walk", "Carry", "Monitor"],
    prototypeTier: "Moving prototype + engineering consult",
  },
] as const;

export const workRoles = [
  { name: "Desk Role", detail: "Presenter motion, reminders, and mounted presence." },
  { name: "Rover Role", detail: "Patrol paths, carry trays, mobile capture." },
  { name: "Classroom Role", detail: "STEM-friendly routines with visible handset UI." },
  { name: "Creator Role", detail: "Camera rigs, repeatable motion for shots." },
  { name: "Demo Role", detail: "Scripted, speed-capped showroom motion." },
  { name: "Utility Role", detail: "Tooling, sensors, and experimental end-effectors." },
] as const;

export const targetSpecs = [
  { label: "Phone support", value: "Target: iPhone + Android via removable universal mount core." },
  { label: "Body styles", value: "Target: biped walker, desk base, wheeled rover, utility frame + EDU/Proto bundles." },
  { label: "Control stack", value: "Target: phone AI + Exobod app + onboard MCU with manual estop." },
  { label: "Motion", value: "Target: servo-driven limbs or wheeled bases depending on configuration (not interchangeable claims)." },
  { label: "Materials", value: "Target: hybrid 3D-printed shells + metal linkages at torque nodes." },
  { label: "Skills", value: "Target: follow, record, gesture, carry, patrol, dance, assist, teach, present, monitor (per program)." },
  { label: "Height / footprint", value: "Target ranges issued per configuration after CAD lock - not single numbers pre-billing." },
  { label: "Servo count", value: "Target band 8–24+ channels depending on body tier (engineering sign-off)." },
  { label: "Runtime", value: "Target burst minutes for lab demos; no consumer all-day promise." },
  { label: "Payload", value: "Target grams-to-low-kg depending on accessory + body plan." },
  { label: "Status", value: "Concept / prototype / custom build interest only." },
] as const;

export const phoneAsBrainArchitecture = [
  { title: "AI reasoning", detail: "Assistants and automation on the handset propose skill routines and parameters." },
  { title: "Camera vision", detail: "Scene understanding and framing stay on-device unless you opt into cloud tools." },
  { title: "Voice input", detail: "Microphones capture commands routed through the app safety layer." },
  { title: "Screen face", detail: "The display stays the personality surface users already trust." },
  { title: "Speaker output", detail: "Voice feedback pairs with motion cues for embodied interaction." },
  { title: "App connection", detail: "Exobod control app packages targets, logs telemetry, and enforces prototype clamps." },
  { title: "Controller commands", detail: "BLE/USB streams approved targets to the MCU at a fixed control rate." },
  { title: "Body movement", detail: "Servos execute calibrated profiles - never raw, unbounded LLM torque." },
] as const;

export const skillSafetyLayer = {
  headline: "Skill Safety Layer",
  trainableLine:
    "Exobod bodies perform approved skill routines through phone AI + onboard controller + calibrated motion profiles.",
  copy: "The phone AI can generate commands and routines, while the onboard controller translates approved commands into safe motor actions. Prototype behavior depends on body type, controller setup, calibration, and testing.",
} as const;

export const exobodSkillsLayer = {
  title: "Exobod Skills Layer",
  lines: ["Phone AI decides.", "Controller executes.", "Body acts."] as const,
  supporting:
    "Desk tasks, classroom demos, creator shots, robotics learning, small-object carrying, AI presence, and custom skill routines - requested through the app/portal, then bounded by firmware.",
} as const;

export const forBuilders = {
  headline: "For Builders",
  subhead: "Build With Us",
  copy: "3D print designers, robotics engineers, schools, makerspaces, educators, and early investors: co-develop shells, supply batch prints, host pilots, or back milestone builds. We coordinate through the preorder desk until a dedicated partner program exists.",
} as const;
