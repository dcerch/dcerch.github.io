// =====================================================================
//  data.js — every piece of *content* in the house lives here.
//  Want to add a certification, a new app, or a junk-drawer trinket?
//  Edit this file; the 3D world reads from it.
// =====================================================================

export const PROFILE = {
  name: "Dominic Cerchio",
  handle: "dominiccerchio",
  title: "Program Manager · Data & AI",
  linkedin: "https://www.linkedin.com/in/dcerch/",
  github: "https://github.com/dcerch",
  about: [
    "My love for technology started at home. My dad handed me the keys to an old Dell Dimension — CRT monitor, dial-up, and endless curiosity — and my oldest brother taught me to build my own PC and showed me what software could really do. That early support from family and friends shaped everything that came after.",
    "Studying IT sharpened the discipline and creativity I bring to technology, science, and art. Along the way I found what I care about most: using technology to help people — whether that's automating the tedious parts of how a company runs or building accessible tools that connect and teach.",
    "Today I'm a Program Manager working in the Data & AI space."
  ],
  career: [
    { org: "Microsoft", role: "Program Manager — Data & AI", when: "Today" },
    { org: "Microsoft", role: "Technical Account Manager / Customer Success Account Manager", when: "2019 →" },
    { org: "UBS Wealth Management Americas", role: "Scrum Master · Service Product Manager · Systems Engineer", when: "2014 – 2019" },
    { org: "Marist College", role: "Telecommunications Technician", when: "2010 – 2014" }
  ]
};

// ---- Den: the trophy room -------------------------------------------
export const CERTIFICATIONS = [
  { name: "Azure Fundamentals", code: "AZ-900", issuer: "Microsoft", color: "#0078d4" },
  { name: "Microsoft 365 Fundamentals", code: "MS-900", issuer: "Microsoft", color: "#d83b01" },
  { name: "ITIL v3 Foundation", code: "ITIL", issuer: "AXELOS", color: "#6b2c91" },
  { name: "Accessibility in Action", code: "A11Y", issuer: "Microsoft", color: "#107c10" },
  { name: "B.S. Information Technology & Systems", code: "Magna Cum Laude", issuer: "Marist College · 2014", color: "#b5121b" },
  { name: "PMP Exam Prep (PMBOK v6)", code: "PMP-trained", issuer: "Project Management", color: "#c8a400" }
];

export const VOLUNTEERING = [
  { id: "habitat", name: "Habitat for Humanity", detail: "Organized and swung hammers on local builds with coworkers.", prop: "hardhat" },
  { id: "soup", name: "Community soup kitchens", detail: "Organized teams to serve meals at local soup kitchens.", prop: "ladle" },
  { id: "hackathon", name: "Global Hackathon organizer", detail: "Ran a company-wide hackathon three years in a row with 100+ participants across the globe.", prop: "trophy" },
  { id: "mentor", name: "Mentoring & coaching", detail: "Interviewed, onboarded, and coached new hires; coached technicians on clear, simple customer communication.", prop: "mug" }
];

// ---- Full apps (each is a physical object somewhere in the house) ---
export const APPS = {
  rankedchoicevoting: { title: "Ranked Choice Voting", url: "apps/rankedchoicevoting.html",
    desc: "An official-style instant-runoff election simulator: create polls, rank choices, and watch the round-by-round tally." },
  secretsanta: { title: "Secret Santa", url: "apps/secretsanta.html",
    desc: "A pass-the-phone gift-exchange organizer: draw matches so nobody gets themselves, then reveal privately." },
  kojima: { title: "Kojima Name Generator", url: "apps/kojima.html",
    desc: "A Metal Gear Solid–style codec that forges your true Kojima codename from a few questions." },
  lostatsea: { title: "Lost at Sea", url: "apps/lostatsea.html",
    desc: "Stranded! Rank 15 salvaged items before the clock runs out and see if the Coast Guard would have kept you alive." },
  everybodyisjohn: { title: "Everybody is John", url: "apps/everybodyisjohn.html",
    desc: "A companion app for the simplest tabletop roleplaying game, where every player is a voice in John's head." },
  archived: { title: "The Archive", url: "apps/archived.html",
    desc: "A museum of retired apps: the Overwatch Workshop Repository, the Raspberry Pi Designer, and Garage to Table." }
};

// ---- Kitchen junk drawer: one trinket per toolbox snippet -----------
//  id must match the snippet id in toolbox.html (opens toolbox.html?embed=1#id)
export const TRINKETS = [
  { id: "bankrewards", name: "Rewards credit card", desc: "Compare the redemption value of your bank reward points across cards.", shape: "card" },
  { id: "crypto", name: "Gold crypto coin", desc: "Track crypto gains/losses from your buys and a current price.", shape: "coin" },
  { id: "incomesavings", name: "Piggy bank", desc: "Project compound interest on a savings balance.", shape: "piggy" },
  { id: "pmpcalc", name: "Calculator", desc: "Estimate project hours and split them across the PMP phases.", shape: "calculator" },
  { id: "picturespacer", name: "Tape measure", desc: "Evenly space artwork on a wall — the exact gap between each piece.", shape: "tape" },
  { id: "mailto", name: "Envelope", desc: "Compose a draft email and generate a ready-to-use mailto link.", shape: "envelope" },
  { id: "phonename", name: "Flip phone", desc: "Find real names and words a phone number can spell.", shape: "flipphone" },
  { id: "package", name: "Tiny parcel", desc: "Jump straight to a carrier's tracking page.", shape: "parcel" },
  { id: "cookie", name: "A cookie (browser flavored)", desc: "A tiny demo of creating, reading, and deleting a browser cookie.", shape: "cookie" },
  { id: "deviceenvironment", name: "USB stick", desc: "Detect your device, browser, OS, and connection.", shape: "usb" },
  { id: "randomizer", name: "Pair of dice", desc: "Pit a homemade RNG against Math.random and conjure random symbols.", shape: "dice" },
  { id: "ticketgenerator", name: "Raffle ticket", desc: "Generate event tickets with unique IDs and a barcode.", shape: "ticket" },
  { id: "timewrap", name: "Stopwatch", desc: "Run multiple labeled timers and track total time.", shape: "stopwatch" },
  { id: "weatheradvisor", name: "Thermometer", desc: "Suggests what to wear based on how you like your room temperature.", shape: "thermometer" },
  { id: "pointkeeper", name: "Score pad & pencil", desc: "A multi-player score keeper that remembers between visits.", shape: "scorepad" },
  { id: "oneshot", name: "Twenty-sided die", desc: "A hub for short, self-contained tabletop adventures.", shape: "d20" },
  { id: "elderscrolls", name: "Old scroll", desc: "Best weapon + element pairings in Elder Scrolls: Blades.", shape: "scroll" },
  { id: "hades", name: "Pomegranate", desc: "Which gods' boons pair best with each weapon ability in Hades.", shape: "pomegranate" },
  { id: "pmpref", name: "Index cards", desc: "A condensed PMP study sheet: process groups, knowledge areas, formulas.", shape: "cards" },
  { id: "strobe", name: "Flashlight", desc: "A configurable color strobe. Photosensitivity warning inside.", shape: "flashlight" },
  { id: "explorerails", name: "Toy train car", desc: "Opportunities and points of interest near NJ Transit stops.", shape: "train" }
];

// ---- Family portrait -------------------------------------------------
//  Illustrated, not photographic. Swap names/colors as you like.
//  Listed left-to-right as they stand in the picture.
export const FAMILY = [
  { who: "Big sister", shirt: "#3d8b5a", hair: "#3b2414", skin: "#f0c4a0", h: 0.9, hairStyle: "long" },
  { who: "Big brother #1", shirt: "#c4622d", hair: "#2a1a10", skin: "#e8b98f", h: 0.97, hairStyle: "short" },
  { who: "Dad", shirt: "#2f5d8a", hair: "#8a8a8a", skin: "#e8b98f", h: 1.0, hairStyle: "short" },
  { who: "Mom", shirt: "#9b2d5e", hair: "#6b3e1f", skin: "#f0c4a0", h: 0.94, hairStyle: "long" },
  { who: "Big brother #2", shirt: "#5a3f8c", hair: "#2a1a10", skin: "#e8b98f", h: 0.95, hairStyle: "spiky" },
  { who: "Dominic", shirt: "#127a74", hair: "#2a1a10", skin: "#e8b98f", h: 0.9, hairStyle: "spiky" }
];
export const CATS = [
  { name: "Cat #1", color: "#e08a3c", stripe: "#a85a1c" },
  { name: "Cat #2", color: "#2b2b2e", stripe: "#1a1a1c" },
  { name: "Cat #3", color: "#9a9aa2", stripe: "#6d6d75" }
];

export const REMEMBRANCE = [
  { name: "Grandpa", url: "https://www.pinkelfuneralhome.com/obituaries/Dominick-Cerchio/" },
  { name: "Grandma", url: "https://www.pinkelfuneralhome.com/obituaries/Marie-Cerchio/" },
  { name: "Uncle Jim", url: "https://www.echovita.com/us/obituaries/nj/ridgewood/james-allocco-12278123" }
];

export const SLOGANS = [
  "Action Gets Results","Against All Odds","All Is Well","All Y'all","Always Add Value",
  "Appreciate The Moment","Aspire To Inspire","Be A Boss","Be A Giver","Be Here Now",
  "Be Obsessively Grateful","Be The Change","Because I Can","Believe In Yourself","Bravery In Fear",
  "Can't Stop Now","Change Is Good","Choose To Shine","Collect Beautiful Moments","Connect With Nature",
  "Conquer From Within","Count Your Blessings","Decisiveness In Doubt","Design Your Life","Develop Your Strength",
  "Do Amazing Things","Do It Now","Do Your Best","Don't Set Limitations","Don't Be Afraid",
  "Dream, Believe, Achieve","Dreams Come True","Embrace The Journey","Enjoy Every Moment","Every Moment Matters",
  "Feed Your Soul","Focus And Win","Genius Is Patience","Get Enough Sleep","Get Fresh Air",
  "Give Real Value","Go All Out","Go For It","Good Vibes Only","Happiness Is Success",
  "Health Is Wealth","Hit The Goals","Inches Make Champions","Innovation With Imagination","It Is Possible",
  "Just Do It","Keep It Cool","Keep Moving Forward","Keep On Shining","Know Thy Self",
  "Knowledge Is Power","Learn From Yesterday","Learn Something New","Let It Go","Life Won't Wait",
  "Listen. Practice. Improve.","Live And Learn","Live For Others","Live In Possibility","Live Your Potential",
  "Loyalty Is Royalty","Maintain Your Integrity","Make It Happen","Never Give Up","Never Look Back",
  "Never Too Late","Nobody Is Perfect","Now Or Never","Organize Your Life","Persistence In Everything",
  "Prove Them Wrong","Pursue Your Passion","Recovery Is Possible","Remember To Live","Roll With It",
  "See The Good","Seize The Day","Shine Your Light","Simplify Your Life","Speak The Truth",
  "Stay The Course","Stop Underestimating Yourself","Success Breeds Success","Success Is Yours","Take Action Now",
  "Take The Risk","Try Something New","Use Your Wings","Volunteer Your Time","Winners Never Quit",
  "You Are Capable","You Are Enough","You Got This"
];

// ---- Rooms (camera "home" viewpoints; yaw 0 = looking north / -z) ---
export const ROOMS = {
  living: { name: "Living Room", blurb: "The Living Room, where the family keeps its favorite things.", view: { pos: [0, 1.7, 4.3], yaw: 0, pitch: -0.14 } },
  kitchen: { name: "Kitchen", blurb: "The Kitchen. Every house has a junk drawer…", view: { pos: [7.4, 1.65, 0], yaw: -Math.PI / 2, pitch: -0.14 }, door: [6, 1.65, 0] },
  den: { name: "Den", blurb: "The Den: certificates on the wall, good deeds on the shelf.", view: { pos: [-7.2, 1.7, 0], yaw: Math.PI / 2, pitch: -0.1 }, door: [-6, 1.65, 0] },
  rec: { name: "Rec Room", blurb: "The Rec Room — games, gadgets, and a suspicious cardboard box.", view: { pos: [0, 1.65, -6.9], yaw: 0, pitch: -0.12 }, door: [4.5, 1.65, -6] },
  kidspace: { name: "Ark KidSpace", blurb: "KidSpace — the fun place to work and play! Click the surprise box for help.", view: { pos: [0, 1.6, -56.6], yaw: 0, pitch: -0.13 } }
};
