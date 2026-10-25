import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toDataUri = (file) =>
  `data:image/jpeg;base64,${fs.readFileSync(path.join(__dirname, "assets", file)).toString("base64")}`;

// Compressed local assets — embedded so paste-into-plugin keeps photos
const IMG_HOME = toDataUri("buildwise-home.jpg");
const IMG_VENT = toDataUri("buildwise-ventilation.jpg");
const IMG_GRID = `data:image/png;base64,${fs.readFileSync(path.join(__dirname, "assets", "plan-grid.png")).toString("base64")}`;

function photo(kind, w, h, extraClass = "") {
  const cls = kind === "home" ? "photo-home" : "photo-vent";
  // Single CSS background-image (defined once in stylesheet) — more reliable for Figma HTML plugins than repeated <img data:> tags
  return `<div class="photo ${cls} ${extraClass}" style="width:${w}px;height:${h}px" role="img" aria-label="Architecture photo"></div>`;
}

/** Square blueprint grid — real image layer (CSS gradients get dropped by Figma plugins) */
function gridLayer(extraClass = "") {
  return `<div class="grid-layer ${extraClass}" data-name="Plan grid" role="img" aria-label="Square plan grid">
    <img class="grid-img" src="${IMG_GRID}" alt="Square plan grid" width="390" height="1400" />
  </div>`;
}

const questions = [
  {
    key: "project",
    title: "What are you planning?",
    text: "We'll shape your guide around the kind of project ahead.",
    options: [
      { value: "Build a new home", description: "Starting from the ground up", selected: true },
      { value: "Renovate", description: "Improving an existing home" },
      { value: "Redesign", description: "Rethinking how spaces work together" },
    ],
  },
  {
    key: "location",
    title: "Where are you building?",
    text: "Your location helps us understand the conditions your home needs to respond to.",
    options: [
      { value: "Karachi", description: "Warm, coastal climate", selected: true },
      { value: "Lahore", description: "Seasonal temperature shifts" },
      { value: "Islamabad", description: "Cool winters, warm summers" },
      { value: "Other", description: "A city or town elsewhere in Pakistan" },
    ],
  },
  {
    key: "plot",
    title: "Tell us about your space.",
    text: "Plot size shapes how light, privacy and outdoor living can work.",
    options: [
      { value: "Under 5 marla", description: "Compact urban plot" },
      { value: "5–10 marla", description: "A common family home size", selected: true },
      { value: "10–20 marla", description: "Room to breathe and grow" },
      { value: "1 kanal or more", description: "Generous grounds and gardens" },
    ],
  },
  {
    key: "climate",
    title: "What climate challenge matters most?",
    text: "A focused environmental priority helps shape early design conversations.",
    options: [
      { value: "Intense heat", description: "Long, hot summers and solar gain", selected: true },
      { value: "Humidity", description: "Coastal moisture and still air" },
      { value: "Monsoon rains", description: "Heavy rain, drainage and damp" },
      { value: "Dust & haze", description: "Air quality and filtration needs" },
      { value: "Mild seasons", description: "Comfortable swings year-round" },
    ],
  },
  {
    key: "family",
    title: "Who will live here?",
    text: "A home works better when it responds to everyone in it.",
    options: [
      { value: "1–2 people", description: "A compact household" },
      { value: "3–5 people", description: "A growing family", selected: true },
      { value: "6+ people", description: "A multi-generational home" },
    ],
  },
  {
    key: "outdoor",
    title: "How do you use outdoor space?",
    text: "Courtyards and roof spaces can become an extension of home.",
    options: [
      { value: "Every day", description: "An essential living space", selected: true },
      { value: "On weekends", description: "A place to gather and unwind" },
      { value: "Occasionally", description: "Useful when the weather is right" },
    ],
  },
  {
    key: "future",
    title: "What should the future hold?",
    text: "Thinking ahead now can make change easier later.",
    options: [
      { value: "A growing family", description: "Rooms that can adapt", selected: true },
      { value: "Working from home", description: "Flexible, quiet spaces" },
      { value: "Parents moving in", description: "Comfort across generations" },
      { value: "No major changes", description: "A home complete as it is" },
    ],
  },
  {
    key: "style",
    title: "Your preferences",
    text: "Choose the architectural direction closest to your taste.",
    options: [
      { value: "Modern", description: "Clean lines and open spaces", selected: true },
      { value: "Traditional", description: "Familiar forms, thoughtfully updated" },
      { value: "Minimal", description: "Quiet materials and essential spaces" },
      { value: "Cultural", description: "Local craft, courtyards and character" },
    ],
  },
  {
    key: "priorities",
    title: "Your priorities, considered.",
    text: "Choose up to three areas to place at the heart of your plan.",
    multi: true,
    selectedCount: 2,
    options: [
      { value: "Natural light", description: "Bright, uplifting spaces" },
      { value: "Ventilation", description: "Fresh air and natural cooling", selected: true },
      { value: "Energy efficiency", description: "Lower demand, smarter systems", selected: true },
      { value: "Privacy", description: "Open, without feeling exposed" },
      { value: "Space", description: "Room that feels generous and clear" },
      { value: "Aesthetics", description: "A home that feels carefully composed" },
    ],
  },
];

const topics = [
  { number: "01", title: "Orientation", blurb: "How sunlight and positioning can influence comfort." },
  { number: "02", title: "Ventilation", blurb: "Plan natural airflow before you rely on mechanical cooling." },
  { number: "03", title: "Sunlight", blurb: "Plan daylight into the spaces you use most." },
  { number: "04", title: "Materials", blurb: "Suggest finishes that suit climate, maintenance and character." },
  { number: "05", title: "Spatial considerations", blurb: "Shape rooms around family life, privacy and outdoor use." },
  { number: "06", title: "Design direction", blurb: "Align architecture with the character you want at home." },
];

const discussList = [
  "Orientation",
  "Natural Ventilation",
  "Light & Sun",
  "Materials",
  "Spatial Considerations",
  "Design Direction",
];

function icon(name) {
  const icons = {
    leaf: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    leafSm: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    arrowLeft: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    arrowLeftSm: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    chevron: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    chevronSm: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    homeMuted: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    plan: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`,
    planMuted: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`,
    user: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    userMuted: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  };
  return icons[name] || "";
}

function tabBar(active) {
  const items = [
    { id: "home", label: "Home", activeIcon: "home", mutedIcon: "homeMuted" },
    { id: "plan", label: "Plan", activeIcon: "plan", mutedIcon: "planMuted" },
    { id: "profile", label: "Profile", activeIcon: "user", mutedIcon: "userMuted" },
  ];
  return `<nav class="tabbar">
    <div class="tabbar-grid">
      ${items
        .map(
          (t) => `<div class="tab ${t.id === active ? "tab-active" : ""}">
        ${icon(t.id === active ? t.activeIcon : t.mutedIcon)}
        <span>${t.label}</span>
      </div>`,
        )
        .join("")}
    </div>
  </nav>`;
}

function screenHeader(title, { inverse = false } = {}) {
  return `<header class="screen-header ${inverse ? "screen-header-inverse" : ""}">
    <div class="screen-header-left">
      <div class="back-btn">${icon("arrowLeft")}</div>
      <h1 class="screen-header-title">${title}</h1>
    </div>
  </header>`;
}

function btn(label, { variant = "default", withArrow = false, withBack = false } = {}) {
  const arrow = withArrow ? icon("arrowRight") : "";
  const back = withBack ? icon("arrowLeftSm") : "";
  return `<div class="btn btn-${variant}">${back}<span>${label}</span>${arrow}</div>`;
}

function optionCard(opt) {
  return `<div class="option ${opt.selected ? "option-active" : ""}">
    <div>
      <h2 class="option-title">${opt.value}</h2>
      <p class="option-desc">${opt.description}</p>
    </div>
    <span class="option-check ${opt.selected ? "option-check-active" : ""}">${opt.selected ? icon("check") : ""}</span>
  </div>`;
}

function plannerScreen(stepIndex) {
  const q = questions[stepIndex];
  const step = stepIndex + 1;
  const total = questions.length;
  const pct = Math.round((step / total) * 100);
  const multiNote = q.multi
    ? `<p class="multi-note">${q.selectedCount} of 3 selected</p>`
    : "";
  return phone(
    `${String(10 + stepIndex).padStart(2, "0")} Planner — Step ${String(step).padStart(2, "0")}`,
    `<div class="screen flex-col">
      ${gridLayer()}
      <div class="screen-front flex-col">
      <header class="planner-top">
        <p class="planner-brand">BuildWise</p>
        <div class="close-btn">${icon("x")}</div>
      </header>
      <div class="px-20">
        <div class="planner-meta">
          <span>Step ${String(step).padStart(2, "0")} of ${String(total).padStart(2, "0")}</span>
          <span class="muted">${pct}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <section class="planner-body">
        <h1 class="h1">${q.title}</h1>
        <p class="body muted mt-12">${q.text}</p>
        ${multiNote}
        <div class="options">${q.options.map(optionCard).join("")}</div>
      </section>
      <footer class="planner-footer">
        ${btn("Back", { variant: "ghost", withBack: true })}
        ${btn("Continue", { withArrow: true })}
      </footer>
      </div>
    </div>`,
  );
}

function screenSlug(name) {
  return name
    .replace(/—/g, "-")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function phone(name, inner) {
  const slug = screenSlug(name);
  // Class + data-name + aria-label use the screen title so Figma plugins
  // name layers "01 Splash" etc. instead of "div.phone"
  return `<div class="frame" data-name="${name}">
  <div class="frame-label">${name}</div>
  <div class="screen-frame ${slug}" id="${slug}" data-name="${name}" name="${name}" aria-label="${name}">
    ${inner}
  </div>
</div>`;
}

const screens = [];

// 00 Assets — standalone grid so it’s easy to find in Figma
screens.push(`<div class="frame" data-name="00 Assets — Plan Grid">
  <div class="frame-label">00 Assets — Square Plan Grid (52px)</div>
  <div class="screen-frame asset-phone 00-Assets-Plan-Grid" id="00-Assets-Plan-Grid" data-name="00 Assets — Plan Grid" name="00 Assets — Plan Grid" aria-label="00 Assets — Plan Grid">
    <img class="asset-grid" src="${IMG_GRID}" alt="Square plan grid" width="390" height="844" data-name="plan-grid.png" />
    <p class="asset-caption">Blueprint square grid · 52px cells · used on Splash, Planner, Processing, Guide, Final Plan</p>
  </div>
</div>`);

// 01 Splash
screens.push(
  phone(
    "01 Splash",
    `<div class="screen splash">
      ${gridLayer()}
      <div class="screen-front splash-front">
      <div class="splash-inner">
        <span class="logo-mark logo-mark-lg">${icon("leaf")}</span>
        <h1 class="splash-title">BuildWise</h1>
        <p class="eyebrow primary mt-16">Helping Pakistanis Build Smarter Homes</p>
      </div>
      </div>
    </div>`,
  ),
);

// 02 Get Started
screens.push(
  phone(
    "02 Get Started",
    `<div class="screen flex-col">
      <div class="hero-img-wrap">
        ${photo("home", 390, 224)}
        <div class="hero-fade"></div>
      </div>
      <div class="get-started-body">
        <div class="brand-row">
          <span class="logo-mark logo-mark-sm">${icon("leafSm")}</span>
          <span class="brand-name">BuildWise</span>
        </div>
        <h1 class="h1 mt-24">Build smarter.<br/>Before you build.</h1>
        <p class="body muted mt-16">Plan your home around climate, lifestyle and future needs — then share a clear guide with your architect.</p>
        <div class="cta-stack mt-auto">
          ${btn("Let’s build", { withArrow: true })}
          ${btn("I already have an account", { variant: "ghost" })}
        </div>
      </div>
    </div>`,
  ),
);

// 03 Sign Up
screens.push(
  phone(
    "03 Sign Up",
    `<div class="screen flex-col">
      ${screenHeader("Create account")}
      <div class="form-body">
        <p class="body muted">Dummy signup for this prototype — data stays on this device.</p>
        <div class="fields mt-32">
          <div class="field"><label>Name</label><div class="input">Your name</div></div>
          <div class="field"><label>Email</label><div class="input">you@email.com</div></div>
          <div class="field"><label>Password</label><div class="input">At least 4 characters</div></div>
        </div>
        <div class="cta-stack mt-auto">
          ${btn("Sign up", { withArrow: true })}
          ${btn("Already have an account? Sign in", { variant: "ghost" })}
        </div>
      </div>
    </div>`,
  ),
);

// 04 Sign In
screens.push(
  phone(
    "04 Sign In",
    `<div class="screen flex-col">
      ${screenHeader("Sign in")}
      <div class="form-body">
        <p class="body muted">Welcome back. Use the account you created on this device.</p>
        <div class="fields mt-32">
          <div class="field"><label>Email</label><div class="input">you@email.com</div></div>
          <div class="field"><label>Password</label><div class="input">Your password</div></div>
        </div>
        <div class="cta-stack mt-auto">
          ${btn("Sign in", { withArrow: true })}
          ${btn("Need an account? Sign up", { variant: "ghost" })}
        </div>
      </div>
    </div>`,
  ),
);

// 05 Home empty
screens.push(
  phone(
    "05 Home — Empty",
    `<div class="screen flex-col with-tabs">
      <div class="pad-x pad-top">
        <p class="eyebrow primary">Home</p>
        <h1 class="h1 mt-12">Good morning, Sarah.</h1>
        <p class="body muted mt-12">Your smarter home plan starts with a few focused questions about place, climate and how you live.</p>
        <div class="step-cards mt-32">
          <div class="card"><span class="num">01</span><h2 class="card-title">Tell us about home</h2><p class="card-desc">Location, plot and lifestyle.</p></div>
          <div class="card"><span class="num">02</span><h2 class="card-title">See what matters</h2><p class="card-desc">Dummy recommendations shaped for you.</p></div>
          <div class="card"><span class="num">03</span><h2 class="card-title">Share with confidence</h2><p class="card-desc">A guide for your architect.</p></div>
        </div>
        <div class="mt-auto pb-8">${btn("Start planning", { withArrow: true })}</div>
      </div>
      ${tabBar("home")}
    </div>`,
  ),
);

// 06 Home with plan
screens.push(
  phone(
    "06 Home — Plan Ready",
    `<div class="screen flex-col with-tabs">
      <div class="content-scroll">
        <div class="pad-x pad-top">
          <p class="small muted">Good morning, Sarah.</p>
          <h1 class="h1 mt-8">Your plan is taking shape.</h1>
          <p class="body strong mt-12">Karachi · Build a new home · Modern · 3–5 people</p>
          <div class="pill mt-16">Plan ready</div>
        </div>
        <div class="featured mx-20 mt-32">
          ${photo("vent", 350, 144)}
          <div class="featured-body">
            <p class="eyebrow featured-eyebrow">Top consideration</p>
            <h2 class="featured-title">Ventilation</h2>
            <p class="featured-desc">Karachi homes can hold heat long after sunset. Thoughtful openings help rooms feel comfortable.</p>
            <span class="featured-link">Explore ${icon("chevronSm")}</span>
          </div>
        </div>
        <div class="cta-stack pad-x mt-24">
          ${btn("View full plan", { withArrow: true })}
          ${btn("Update answers", { variant: "outline" })}
        </div>
      </div>
      ${tabBar("home")}
    </div>`,
  ),
);

// 07 Plan empty
screens.push(
  phone(
    "07 Plan — Empty",
    `<div class="screen flex-col with-tabs">
      <div class="pad-x pad-top flex-col grow">
        <p class="eyebrow primary">Plan</p>
        <h1 class="h1 mt-12">No plan yet.</h1>
        <p class="body muted mt-12">Answer a short set of questions to unlock recommendations on orientation, ventilation, light, materials and more.</p>
        <div class="mt-auto pb-8">${btn("Start planning", { withArrow: true })}</div>
      </div>
      ${tabBar("plan")}
    </div>`,
  ),
);

// 08 Plan hub
screens.push(
  phone(
    "08 Plan — Hub",
    `<div class="screen flex-col with-tabs">
      <div class="content-scroll">
        <div class="plan-header">
          <p class="eyebrow primary">Plan</p>
          <h1 class="h1 mt-12">Your home plan is taking shape.</h1>
          <p class="body strong mt-12">Karachi · Build a new home · Modern · 3–5 people</p>
        </div>
        <article class="plan-hero mx-20 mt-24">
          ${photo("vent", 350, 160)}
          <div class="plan-hero-body">
            <p class="eyebrow featured-eyebrow">Top consideration</p>
            <h2 class="featured-title">Ventilation</h2>
            <p class="featured-desc">Karachi homes can hold heat long after sunset. Thoughtful openings, shaded edges and a clear path for air help rooms feel comfortable with less reliance on cooling.</p>
            <div class="mt-20">${btn("Explore", { variant: "secondary", withArrow: true })}</div>
          </div>
        </article>
        <div class="pad-x mt-32 pb-24">
          <div class="section-head">
            <h2 class="h2">Considerations</h2>
            <span class="tiny muted">06 areas</span>
          </div>
          <div class="topic-list mt-16">
            ${topics
              .map(
                (t) => `<div class="topic-row">
              <div>
                <span class="num">${t.number}</span>
                <h3 class="topic-title">${t.title}</h3>
                <p class="card-desc">${t.blurb}</p>
              </div>
              ${icon("chevron")}
            </div>`,
              )
              .join("")}
          </div>
          <div class="mt-24">${btn("Shareable plan", { variant: "outline", withArrow: true })}</div>
        </div>
      </div>
      ${tabBar("plan")}
    </div>`,
  ),
);

// 09 Profile
screens.push(
  phone(
    "09 Profile",
    `<div class="screen flex-col with-tabs">
      <div class="content-scroll">
        <div class="plan-header">
          <p class="eyebrow primary">Profile</p>
          <h1 class="h1 mt-12">Sarah Ahmed</h1>
          <p class="body muted mt-8">sarah@email.com</p>
        </div>
        <section class="pad-x pt-24">
          <h2 class="section-label">Home profile</h2>
          <div class="profile-rows mt-16">
            ${[
              ["Project", "Build a new home"],
              ["Location", "Karachi"],
              ["Plot", "5–10 marla"],
              ["Climate", "Intense heat"],
              ["Household", "3–5 people"],
              ["Style", "Modern"],
            ]
              .map(
                ([k, v]) => `<div class="profile-row">
              <span class="tiny muted upper">${k}</span>
              <p class="profile-val">${v}</p>
            </div>`,
              )
              .join("")}
          </div>
        </section>
        <div class="cta-stack pad-x mt-32 pb-24">
          ${btn("Edit home answers")}
          ${btn("Disclaimer", { variant: "outline" })}
          ${btn("Sign out", { variant: "ghost" })}
        </div>
      </div>
      ${tabBar("profile")}
    </div>`,
  ),
);

// Planner steps 10-18
questions.forEach((_, i) => screens.push(plannerScreen(i)));

// 19 Processing
screens.push(
  phone(
    "19 Processing",
    `<div class="screen processing">
      ${gridLayer()}
      <div class="screen-front processing-front">
      <div class="processing-inner">
        <p class="eyebrow primary">BuildWise</p>
        <h1 class="h1 mt-24">Building your personalized recommendations…</h1>
        <p class="body muted mt-16">Shaping a dummy guide from your location, climate, lifestyle and priorities.</p>
        <div class="progress-track mt-40"><div class="progress-fill" style="width:64%"></div></div>
        <p class="tiny strong muted mt-16">64%</p>
      </div>
      </div>
    </div>`,
  ),
);

// 20 Guide
screens.push(
  phone(
    "20 Guide — Ventilation",
    `<div class="screen flex-col">
      ${screenHeader("Guide")}
      <div class="content-scroll">
        <div class="pad-x pt-24">
          <p class="eyebrow primary">Climate & comfort</p>
          <h1 class="h1 mt-12">Make natural airflow work for you.</h1>
        </div>
        ${photo("vent", 390, 192, "guide-img")}
        <div class="guide-body">
          ${gridLayer()}
          <div class="screen-front">
          <div>
            <h2 class="h2">Why this matters</h2>
            <p class="body muted mt-16 lh-28">Karachi homes can hold heat long after sunset. Thoughtful openings, shaded edges and a clear path for air help rooms feel comfortable with less reliance on cooling — especially when Intense heat is a priority.</p>
          </div>
          <div class="mt-40">
            <p class="eyebrow primary">Things worth discussing</p>
            <div class="discuss-list mt-16">
              ${["Window placement", "Cross ventilation", "Shading", "Room orientation"]
                .map(
                  (item, i) => `<div class="discuss-row">
                <span class="num">0${i + 1}</span>
                <span class="discuss-label">${item}</span>
              </div>`,
                )
                .join("")}
            </div>
          </div>
          </div>
        </div>
        <div class="tip-block">
          <p class="tiny strong primary upper tracking">BuildWise tip</p>
          <blockquote class="tip-quote">“Think about airflow during planning — not after construction.”</blockquote>
          <div class="cta-stack mt-32">
            ${btn("Next consideration", { withArrow: true })}
            ${btn("Back to plan", { variant: "ghost", withBack: true })}
          </div>
        </div>
      </div>
    </div>`,
  ),
);

// 21 Final Plan
screens.push(
  phone(
    "21 Final Plan",
    `<div class="screen flex-col inverse">
      ${screenHeader("Your plan", { inverse: true })}
      <div class="content-scroll final-body">
        ${gridLayer("grid-layer-dark")}
        <div class="screen-front">
        <p class="eyebrow inverse-muted">BuildWise</p>
        <h1 class="h1 mt-16">Your smarter home starts here.</h1>
        <p class="body inverse-soft mt-16">A personalized planning guide based on your priorities.</p>
        <div class="mt-40">
          <p class="body inverse-soft">06 things to discuss before you build</p>
          <div class="final-list mt-16">
            ${discussList
              .map(
                (label, i) => `<div class="final-row">
              <span class="final-num">${String(i + 1).padStart(2, "0")}</span>
              <h2 class="final-title">${label}</h2>
            </div>`,
              )
              .join("")}
          </div>
        </div>
        <div class="cta-stack mt-40 pb-32">
          ${btn("Share with your architect", { variant: "secondary", withArrow: true })}
          ${btn("Save my plan", { variant: "ghost-inverse" })}
          ${btn("Disclaimer", { variant: "ghost-inverse-soft" })}
        </div>
        </div>
      </div>
    </div>`,
  ),
);

// 22 Disclaimer
screens.push(
  phone(
    "22 Disclaimer",
    `<div class="screen flex-col">
      ${screenHeader("Disclaimer")}
      <div class="pad-x py-32">
        <h1 class="h1">Please note</h1>
        <div class="disclaimer-copy mt-24">
          <p>BuildWise is a <strong>prototype</strong>. Recommendations are illustrative dummy content — not verified engineering or climate data.</p>
          <p>This guide does <strong>not replace</strong> professional architectural, structural or engineering consultation.</p>
          <p>Focused on residential use in selected Pakistani cities, with limited geographic coverage.</p>
          <p>Your answers and account stay on this device for this demo. Nothing is sent to a server.</p>
        </div>
        <div class="mt-40">${btn("Got it")}</div>
      </div>
    </div>`,
  ),
);

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  background: #3A3530;
  color: #2A2620;
  font-family: "Manrope", sans-serif;
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; object-fit: cover; }
.artboard {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 48px 40px;
  padding: 64px;
  width: 5200px;
  background: #3A3530;
}
.frame { width: 390px; }
.frame-label {
  color: #C8C2B4;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.screen-frame {
  width: 390px;
  min-height: 844px;
  height: auto;
  background: #F7F5F0;
  overflow: visible;
  position: relative;
  border-radius: 0;
}
.screen {
  width: 390px;
  min-height: 844px;
  height: auto;
  background: #F7F5F0;
  color: #2A2620;
  position: relative;
  overflow: hidden;
}
.screen.inverse { background: #3A3530; color: #F7F5F0; }
.flex-col { display: flex; flex-direction: column; }
.grow { flex: 1; }
.with-tabs { }
.content-scroll {
  flex: 1;
  overflow: visible;
  display: flex;
  flex-direction: column;
}
.grid-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 390px;
  height: 100%;
  min-height: 844px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background-image: url("${IMG_GRID}");
  background-repeat: repeat;
  background-size: 390px 1400px;
  background-position: top left;
}
.grid-img {
  width: 390px;
  height: 100%;
  min-height: 844px;
  object-fit: cover;
  object-position: top left;
  display: block;
}
.asset-phone { background: #F7F5F0; display: flex; flex-direction: column; }
.asset-grid { width: 390px; height: 760px; object-fit: cover; object-position: top left; display: block; }
.asset-caption {
  padding: 16px 20px 24px;
  font-size: 12px;
  font-weight: 600;
  color: #7A7468;
  line-height: 1.4;
}
.grid-layer-dark {
  opacity: 0.22;
  filter: invert(1) brightness(1.4);
}
.screen-front {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 844px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.splash-front, .processing-front {
  align-items: center;
  justify-content: center;
}
.guide-body { position: relative; overflow: hidden; }
.primary { color: #3D6B4F; }
.muted { color: #7A7468; }
.strong { font-weight: 500; }
.tiny { font-size: 12px; }
.small { font-size: 14px; }
.upper { text-transform: uppercase; }
.tracking { letter-spacing: 0.18em; }
.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.h1 {
  font-size: 30px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
}
.h2 { font-size: 20px; font-weight: 600; line-height: 1.25; }
.body { font-size: 14px; line-height: 1.5; }
.lh-28 { line-height: 1.75; }
.pad-x { padding-left: 20px; padding-right: 20px; }
.pad-top { padding-top: 32px; padding-bottom: 24px; display: flex; flex-direction: column; flex: 1; }
.px-20 { padding-left: 20px; padding-right: 20px; }
.mx-20 { margin-left: 20px; margin-right: 20px; }
.pt-24 { padding-top: 24px; }
.py-32 { padding-top: 32px; padding-bottom: 32px; }
.pb-8 { padding-bottom: 8px; }
.pb-24 { padding-bottom: 24px; }
.pb-32 { padding-bottom: 32px; }
.mt-8 { margin-top: 8px; }
.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }
.mt-20 { margin-top: 20px; }
.mt-24 { margin-top: 24px; }
.mt-32 { margin-top: 32px; }
.mt-40 { margin-top: 40px; }
.mt-auto { margin-top: auto; }
.logo-mark {
  display: grid;
  place-items: center;
  border: 1px solid #3D6B4F;
  color: #3D6B4F;
}
.logo-mark-lg { width: 56px; height: 56px; }
.logo-mark-sm { width: 32px; height: 32px; }
.splash { display: flex; align-items: center; justify-content: center; }
.splash-inner { display: flex; flex-direction: column; align-items: center; text-align: center; }
.splash-title { margin-top: 32px; font-size: 36px; font-weight: 600; }
.hero-img-wrap { position: relative; width: 390px; height: 224px; flex-shrink: 0; overflow: hidden; }
.photo {
  display: block;
  flex-shrink: 0;
  overflow: hidden;
  background-color: #C8C2B4;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.photo-home { background-image: url("${IMG_HOME}"); }
.photo-vent { background-image: url("${IMG_VENT}"); }
.hero-fade {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(to top, #F7F5F0 0%, rgba(247,245,240,0.4) 45%, transparent 100%);
}
.guide-img { margin-top: 24px; }
.get-started-body {
  flex: 1; display: flex; flex-direction: column;
  padding: 8px 20px 32px;
}
.brand-row { display: flex; align-items: center; gap: 8px; }
.brand-name { font-size: 16px; font-weight: 700; }
.cta-stack { display: flex; flex-direction: column; gap: 12px; padding-top: 40px; }
.btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  height: 52px; padding: 0 28px;
  font-size: 14px; font-weight: 600;
  border-radius: 4px; width: 100%;
}
.btn-default { background: #3D6B4F; color: #FAF9F6; }
.btn-outline { background: #F7F5F0; color: #2A2620; border: 1px solid #D4D0C5; }
.btn-secondary { background: #EBE8E0; color: #3A3530; }
.btn-ghost { background: transparent; color: #2A2620; }
.btn-ghost-inverse { background: transparent; color: #F7F5F0; }
.btn-ghost-inverse-soft { background: transparent; color: rgba(247,245,240,0.7); }
.screen-header {
  height: 56px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; border-bottom: 1px solid #D4D0C5; background: #F7F5F0;
}
.screen-header-inverse {
  background: #3A3530; color: #F7F5F0;
  border-bottom-color: rgba(247,245,240,0.15);
}
.screen-header-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
.back-btn { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 6px; }
.screen-header-title { font-size: 16px; font-weight: 600; }
.form-body {
  flex: 1; display: flex; flex-direction: column;
  padding: 24px 20px 32px;
}
.fields { display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 8px; }
.field label { font-size: 14px; font-weight: 500; }
.input {
  height: 36px; border: 1px solid #D4D0C5; border-radius: 6px;
  padding: 0 12px; display: flex; align-items: center;
  font-size: 14px; color: #7A7468; background: transparent;
}
.card {
  border: 1px solid #D4D0C5; background: #FCFAF7; padding: 16px;
}
.step-cards { display: flex; flex-direction: column; gap: 12px; }
.num { font-size: 12px; color: #3D6B4F; }
.card-title { margin-top: 12px; font-size: 18px; font-weight: 600; }
.card-desc { margin-top: 4px; font-size: 14px; color: #7A7468; }
.pill {
  display: inline-flex; align-items: center;
  border: 1px solid rgba(61,107,79,0.3); background: #E0EBE3;
  color: #3D6B4F; font-size: 12px; font-weight: 600;
  padding: 4px 12px; border-radius: 999px; align-self: flex-start;
}
.featured { border: 1px solid #D4D0C5; overflow: hidden; width: 350px; }
.featured-body { background: #2A2620; color: #F7F5F0; padding: 20px; }
.featured-eyebrow { color: rgba(247,245,240,0.55); letter-spacing: 0.14em; }
.featured-title { margin-top: 8px; font-size: 24px; font-weight: 600; }
.featured-desc { margin-top: 8px; font-size: 14px; color: rgba(247,245,240,0.65); line-height: 1.4; }
.featured-link {
  margin-top: 16px; display: inline-flex; align-items: center; gap: 4px;
  font-size: 14px; font-weight: 600;
}
.tabbar {
  flex-shrink: 0; border-top: 1px solid #D4D0C5;
  background: rgba(247,245,240,0.95); padding: 8px 8px 12px;
}
.tabbar-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; }
.tab {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 0; border-radius: 8px;
  font-size: 11px; font-weight: 600; color: #7A7468;
}
.tab-active { background: #E0EBE3; color: #3D6B4F; }
.plan-header {
  border-bottom: 1px solid #D4D0C5;
  padding: 32px 20px 24px;
}
.plan-hero { background: #2A2620; color: #F7F5F0; overflow: hidden; width: 350px; }
.plan-hero-body { padding: 20px; }
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
.topic-list { border: 1px solid #D4D0C5; background: #D4D0C5; display: flex; flex-direction: column; gap: 1px; }
.topic-row {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  background: #F7F5F0; padding: 16px; color: #7A7468;
}
.topic-title { margin-top: 8px; font-size: 18px; font-weight: 600; color: #2A2620; }
.section-label {
  font-size: 14px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: #7A7468;
}
.profile-rows { border-top: 1px solid #D4D0C5; }
.profile-row { border-bottom: 1px solid #D4D0C5; padding: 16px 0; }
.profile-val { margin-top: 4px; font-size: 16px; font-weight: 600; }
.planner-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
}
.planner-brand { font-size: 14px; font-weight: 600; }
.close-btn {
  width: 40px; height: 40px; display: grid; place-items: center;
  border: 1px solid #D4D0C5;
}
.planner-meta {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12px; font-weight: 600;
}
.progress-track { margin-top: 12px; height: 1px; background: #D4D0C5; position: relative; }
.progress-fill { position: absolute; left: 0; top: -1px; height: 3px; background: #3D6B4F; }
.planner-body {
  flex: 1; padding: 32px 20px 24px; overflow: visible;
}
.multi-note { margin-top: 12px; font-size: 14px; font-weight: 500; color: #3D6B4F; }
.options { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
.option {
  min-height: 80px; display: flex; align-items: center; justify-content: space-between;
  gap: 12px; border: 1px solid #D4D0C5; background: #FCFAF7; padding: 16px; text-align: left;
}
.option-active { border-color: #3D6B4F; background: #E0EBE3; }
.option-title { font-size: 16px; font-weight: 600; }
.option-desc { margin-top: 4px; font-size: 14px; color: #7A7468; }
.option-check {
  width: 28px; height: 28px; flex-shrink: 0; border-radius: 999px;
  border: 1px solid #D4D0C5; display: grid; place-items: center;
}
.option-check-active { border-color: #3D6B4F; background: #3D6B4F; color: #FAF9F6; }
.planner-footer {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  border-top: 1px solid #D4D0C5; background: rgba(247,245,240,0.95);
  padding: 12px 16px; margin-top: auto;
}
.planner-footer .btn { width: auto; }
.processing { display: flex; align-items: center; justify-content: center; padding: 0 20px; }
.processing-inner { width: 100%; }
.guide-body { padding: 40px 20px; position: relative; overflow: hidden; }
.guide-body .grid-layer { min-height: 100%; height: 100%; }
.guide-body .screen-front { min-height: 0; }
.discuss-list { border-top: 1px solid #D4D0C5; }
.discuss-row {
  display: flex; align-items: center; gap: 16px;
  border-bottom: 1px solid #D4D0C5; padding: 16px 0;
}
.discuss-label { font-size: 16px; font-weight: 600; }
.tip-block { background: #E0EBE3; padding: 40px 20px; }
.tip-quote {
  margin-top: 16px; font-size: 24px; font-weight: 600;
  line-height: 1.2; text-wrap: balance;
}
.final-body { padding: 32px 20px; flex: 1; position: relative; overflow: hidden; }
.final-body .screen-front { min-height: 0; padding: 0; }
.inverse-muted { color: rgba(247,245,240,0.55); }
.inverse-soft { color: rgba(247,245,240,0.6); }
.final-list { border-top: 1px solid rgba(247,245,240,0.2); }
.final-row {
  display: flex; align-items: center; gap: 16px;
  border-bottom: 1px solid rgba(247,245,240,0.2); padding: 20px 0;
}
.final-num { width: 32px; font-size: 12px; color: rgba(247,245,240,0.45); }
.final-title { font-size: 20px; font-weight: 600; }
.disclaimer-copy {
  display: flex; flex-direction: column; gap: 20px;
  font-size: 14px; line-height: 1.75; color: #7A7468;
}
.disclaimer-copy strong { color: #2A2620; font-weight: 600; }
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BuildWise — All Screens (Figma Export)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>${css}</style>
</head>
<body>
  <!--
    BuildWise — All Screens Artboard
    Phone size: 390 × 844 (matches app PhoneShell)
    Optimized for html.to.design / iframe → Figma plugins:
    - Fixed pixel frames (no viewport units)
    - Flat layout, no sticky/fixed outside phones
    - Hex colors, Manrope, embedded images
    - Each screen frame uses data-name / class from its screen title (e.g. 01-Splash)
  -->
  <div class="artboard" data-name="BuildWise — All Screens">
    ${screens.join("\n")}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "buildwise-all-screens.html"), html);

// File-based variant for "Import from URL" / local server (better if plugin strips data: URIs)
const cssFiles = css
  .replace(`url("${IMG_HOME}")`, 'url("./assets/buildwise-home.jpg")')
  .replace(`url("${IMG_VENT}")`, 'url("./assets/buildwise-ventilation.jpg")');
const htmlFiles = html
  .replace(`<style>${css}</style>`, `<style>${cssFiles.replace(`url("${IMG_GRID}")`, 'url("./assets/plan-grid.png")')}</style>`)
  .replaceAll(`src="${IMG_GRID}"`, 'src="./assets/plan-grid.png"');
fs.writeFileSync(path.join(__dirname, "buildwise-all-screens-files.html"), htmlFiles);

console.log(`Wrote ${screens.length} screens → buildwise-all-screens.html (${Math.round(html.length / 1024)} KB)`);
console.log(`Also wrote buildwise-all-screens-files.html (relative image paths for local server)`);
