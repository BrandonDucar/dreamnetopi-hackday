const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const sponsors = require('./integrations/sponsors');

const PORT = process.env.PORT || 4242;

// Coastal Freeze Co. Real Inventory & Base Offer
const INITIAL_STATE = {
  meta: {
    businessName: "Coastal Freeze Co.",
    tagline: "Ultra-Sublimated Artisan Confections & Fruit Crisps",
    event: "Saturday Jupiter GreenMarket Pop-Up & Online Delivery",
    eventDate: "Saturday, Oct 3, 2026",
    operationalStatus: "NOMINAL",
    octopusState: "COORDINATING",
    activeView: "today"
  },
  octoArms: [
    { armId: 1, name: "Voice Ingestion", sponsor: "Plaud AI", status: "ONLINE", icon: "🎙️", desc: "Transcribing founder voice memos into structured briefs" },
    { armId: 2, name: "Local Intelligence", sponsor: "Brave Search API", status: "ONLINE", icon: "🦁", desc: "Real-time weather, crowd forecast & vendor roster" },
    { armId: 3, name: "Market Trends", sponsor: "Similarweb", status: "ONLINE", icon: "📈", desc: "Tracking trending confection keywords in Palm Beach" },
    { armId: 4, name: "Causal Graph", sponsor: "Neo4j", status: "ONLINE", icon: "🕸️", desc: "Evaluating 18-node dependency network in real-time" },
    { armId: 5, name: "Copy Engine", sponsor: "OpenRouter", status: "ONLINE", icon: "⚡", desc: "Routing tailored voice copy via Claude 3.5 Sonnet" },
    { armId: 6, name: "Agent Quorum", sponsor: "Band Protocol", status: "ONLINE", icon: "🛡️", desc: "2-of-2 Agent consensus on pricing & margin guardrails" },
    { armId: 7, name: "Storefront Sync", sponsor: "Merge.dev + Vultr", status: "ONLINE", icon: "🔗", desc: "Shopify + Square sync with global CDN edge check" },
    { armId: 8, name: "Human TasteGate", sponsor: "Nebius AI + UserTesting", status: "ONLINE", icon: "👅", desc: "Quality tone score 9.8/10 + simulated buyer validation" }
  ],
  inventory: [
    {
      id: "SKU-STRAWBERRY",
      name: "Jupiter Sweet Strawberry Slices",
      batch: "HR-BATCH-26",
      category: "Fruit Crisps",
      totalStock: 50,
      onlineReserved: 20,
      marketAllocated: 30,
      unitCost: 1.85,
      retailPrice: 7.99,
      status: "OPTIMAL"
    },
    {
      id: "SKU-MANGO",
      name: "Swicy Mango Tajín Finishing Crunch",
      batch: "HR-BATCH-28",
      category: "Confectionary Crisps",
      totalStock: 65,
      onlineReserved: 15,
      marketAllocated: 50,
      unitCost: 2.10,
      retailPrice: 8.99,
      status: "EXCESS_AVAILABLE"
    },
    {
      id: "SKU-GALAXY",
      name: "Galaxy Gelatin Crunch Cubes",
      batch: "HR-BATCH-27",
      category: "Artisan Gelatin",
      totalStock: 80,
      onlineReserved: 25,
      marketAllocated: 55,
      unitCost: 1.45,
      retailPrice: 8.49,
      status: "OPTIMAL"
    },
    {
      id: "SKU-PEACH",
      name: "Georgia Gold Peach Crisps",
      batch: "HR-BATCH-25",
      category: "Fruit Crisps",
      totalStock: 35,
      onlineReserved: 10,
      marketAllocated: 25,
      unitCost: 1.95,
      retailPrice: 7.99,
      status: "OPTIMAL"
    },
    {
      id: "SKU-SOUR-WATERMELON",
      name: "Atomic Sour Watermelon Drops",
      batch: "HR-BATCH-29",
      category: "Sour Candy",
      totalStock: 45,
      onlineReserved: 12,
      marketAllocated: 33,
      unitCost: 1.30,
      retailPrice: 6.99,
      status: "OPTIMAL"
    }
  ],
  currentOffer: {
    id: "OFFER-01",
    name: "Jupiter Sunrise Duo",
    featuredProducts: ["Jupiter Sweet Strawberry Slices", "Galaxy Gelatin Crunch Cubes"],
    bundlePrice: 15.49,
    savings: "$0.99 off retail",
    grossMargin: "73.5%",
    marketAllocationSlots: 25,
    onlinePreorderLimit: 15,
    tagline: "Crisp Florida strawberries meets shatter-in-your-mouth rainbow gelatin cubes!"
  },
  postizCampaign: {
    campaignId: "CAMP-OCT3-SATURDAY",
    status: "STAGED",
    scheduledFor: "Friday 5:00 PM EST (Pre-Market Teaser)",
    channels: [
      {
        platform: "instagram",
        handle: "@coastalfreezeco",
        type: "Carousel Post + Story",
        characterLimit: 2200,
        content: "Sunrise crunch incoming 🍓✨ This Saturday at the Jupiter GreenMarket, we're unleashing the Jupiter Sunrise Duo: ultra-crisp Florida strawberry slices paired with shatter-in-your-mouth Galaxy Gelatin Cubes. Only 25 bundle packs reserved for the booth! Link in bio to lock in your pickup bag 🌴 #CoastalFreeze #JupiterGreenMarket #FreezeDriedCandy",
        media: "coastal_sunrise_duo_carousel.webp",
        tasteGateScore: 9.8,
        status: "STAGED"
      },
      {
        platform: "tiktok",
        handle: "@coastalfreeze",
        type: "Direct Post Video",
        characterLimit: 2200,
        content: "Wait for that crunch... 🎧 Satisfying freeze-dried Florida strawberries meet galaxy gelatin! Catch us this Saturday 9am at Jupiter GreenMarket Booth 14! 🍓🌌 #asmrfood #freezedried #crunchy #satisfying",
        media: "strawberry_galaxy_asmr.mp4",
        tasteGateScore: 9.9,
        status: "STAGED"
      },
      {
        platform: "facebook",
        handle: "Coastal Freeze Co.",
        type: "Community Event Post",
        characterLimit: 5000,
        content: "Jupiter locals! Join us this Saturday at the Riverwalk GreenMarket (9 AM – 1:30 PM). We have 25 limited Jupiter Sunrise Duos prepared. Pre-order online for fast pickup at Booth 14!",
        media: "facebook_event_banner.webp",
        tasteGateScore: 9.6,
        status: "STAGED"
      },
      {
        platform: "x",
        handle: "@coastal_freeze",
        type: "Thread (1/2)",
        characterLimit: 280,
        content: "Saturday setup locked in! Jupiter GreenMarket, Booth 14. Featuring the Jupiter Sunrise Duo (Strawberries + Galaxy Gelatin Cubes). Preorders protected. See you on the Riverwalk! 🍓⚡️",
        media: "x_card_sunrise.webp",
        tasteGateScore: 9.5,
        status: "STAGED"
      },
      {
        platform: "threads",
        handle: "@coastalfreezeco",
        type: "Conversation Starter",
        characterLimit: 500,
        content: "Who's hitting Jupiter GreenMarket this weekend? We're pairing freeze-dried Florida strawberries with Galaxy Gelatin Cubes. Drop a comment if you want a reserved pickup bag! 🍬🍓",
        media: "threads_duo.webp",
        tasteGateScore: 9.7,
        status: "STAGED"
      }
    ]
  },
  commitments: [
    { id: "COM-01", owner: "Brandon (Kitchen Head)", task: "Sublimate Harvest Right Batch #26 (Strawberries & Gelatin)", due: "Friday 2:00 PM", dependsOn: "None", status: "COMPLETED", verifiedBy: "Harvest Right Log Telemetry" },
    { id: "COM-02", owner: "Alex (Packaging)", task: "Heat-seal 25 Sunrise Duo foil pouches with oxygen absorbers", due: "Friday 4:30 PM", dependsOn: "COM-01", status: "IN_PROGRESS", verifiedBy: "Alex Ack (Mobile App)" },
    { id: "COM-03", owner: "Dreamnetiopi Auto-Arm", task: "Stage 5-platform social broadcast via Postiz", due: "Friday 5:00 PM", dependsOn: "COM-02", status: "AWAITING_APPROVAL", verifiedBy: "Postiz API Draft Receipt" },
    { id: "COM-04", owner: "Marco (Logistics)", task: "Load tent, cooling bins, and POS terminals into van", due: "Saturday 7:00 AM", dependsOn: "COM-02", status: "ACKNOWLEDGED", verifiedBy: "Marco SMS Check-In" },
    { id: "COM-05", owner: "Sarah (Booth Lead)", task: "GreenMarket Booth #14 Setup & Square POS Sync", due: "Saturday 8:15 AM", dependsOn: "COM-04", status: "ACKNOWLEDGED", verifiedBy: "Geofence Check-in" }
  ],
  sponsors: Object.entries(sponsors).map(([key, s]) => ({
    id: key,
    name: s.name,
    tier: s.tier,
    role: s.role,
    status: s.status
  })),
  history: [
    { event: "Oct 1, 2026 - TasteGate Revision", description: "Nebius flagged wordy TikTok caption; auto-condensed to ASMR soundbite style. Approved by Brandon." },
    { event: "Sep 28, 2026 - Packaging Delay Rehearsal", description: "Simulated Alex 1-hr delay. Plan automatically adjusted loading window without impacting market arrival." }
  ],
  pendingDecision: null
};

let state = JSON.parse(JSON.stringify(INITIAL_STATE));

// Chaos Injection Handler: Strawberries Not Available
function injectStrawberryChaos() {
  const strawberry = state.inventory.find(i => i.id === "SKU-STRAWBERRY");

  strawberry.totalStock = 12; // dropped from 50 to 12!
  strawberry.onlineReserved = 12; // Protect existing online orders first!
  strawberry.marketAllocated = 0; // 0 bags for market!
  strawberry.status = "DEFICIT_PROTECTED";

  state.meta.operationalStatus = "REHEARSAL_ALERT";
  state.meta.octopusState = "REHEARSING_DISRUPTION";

  const newOffer = {
    id: "OFFER-01-REVISED",
    name: "Swicy Cosmic Star-Pack (Revised)",
    featuredProducts: ["Swicy Mango Tajín Finishing Crunch", "Galaxy Gelatin Crunch Cubes"],
    bundlePrice: 19.99,
    savings: "$2.49 off retail",
    grossMargin: "76.2%",
    marketAllocationSlots: 35,
    onlinePreorderLimit: 10,
    tagline: "Tangy tropical mango coated in artisanal chili-lime salt paired with shattering galaxy cubes!"
  };

  const revisedChannels = [
    {
      platform: "instagram",
      handle: "@coastalfreezeco",
      type: "Carousel Post + Story",
      characterLimit: 2200,
      content: "🔥🥭 NEW REVEAL FOR SATURDAY: Introducing the Swicy Cosmic Star-Pack at Jupiter GreenMarket! Sublimated tropical mango with zesty Tajín lime salt + our signature Galaxy Gelatin Crunch Cubes. 35 packs available at the booth! Online pre-orders live now 🌴🌶️ #SwicySnacks #FreezeDriedMango #JupiterFl",
      media: "coastal_swicy_mango_galaxy.webp",
      tasteGateScore: 9.9,
      status: "REVISED_PENDING_APPROVAL"
    },
    {
      platform: "tiktok",
      handle: "@coastalfreeze",
      type: "Direct Post Video",
      characterLimit: 2200,
      content: "Wait till you hear the crunch of this Swicy Mango Tajín slice 🤤 Sweet, tart, salty, spicy, crisp. Jupiter GreenMarket this Saturday! Who's snagging the first bag?! 🥭⚡️ #freezedried #swicy #foodtok #satisfying",
      media: "swicy_mango_asmr.mp4",
      tasteGateScore: 9.8,
      status: "REVISED_PENDING_APPROVAL"
    },
    {
      platform: "facebook",
      handle: "Coastal Freeze Co.",
      type: "Community Event Post",
      characterLimit: 5000,
      content: "🚨 Menu Update for Saturday's Jupiter GreenMarket! We've pivoted our featured bundle to the fan-favorite Swicy Mango Tajín & Galaxy Crunch Star-Pack ($19.99). All online orders are 100% protected and ready for pickup!",
      media: "swicy_bundle_facebook.webp",
      tasteGateScore: 9.7,
      status: "REVISED_PENDING_APPROVAL"
    },
    {
      platform: "x",
      handle: "@coastal_freeze",
      type: "Thread (1/2)",
      characterLimit: 280,
      content: "When supply shifts, our whole operation pivots seamlessly 🐙 Saturday's Jupiter GreenMarket hero offer is now the Swicy Mango Tajín + Galaxy Crunch Star-Pack! Online orders fully protected. 35 market packs ready. See you Saturday! 🥭🚀",
      media: "x_card_swicy.webp",
      tasteGateScore: 9.6,
      status: "REVISED_PENDING_APPROVAL"
    },
    {
      platform: "threads",
      handle: "@coastalfreezeco",
      type: "Conversation Starter",
      characterLimit: 500,
      content: "Pivoted Saturday's drop to our most viral creation: Swicy Mango Tajín crisps + Galaxy Crunch Cubes. Sweet, sour, spicy, crunch. Who needs a bag reserved? 🌶️🥭",
      media: "threads_swicy.webp",
      tasteGateScore: 9.8,
      status: "REVISED_PENDING_APPROVAL"
    }
  ];

  state.pendingDecision = {
    decisionId: `DEC-${Date.now().toString(36).toUpperCase()}`,
    title: "Disruption Recovery: Strawberry Inventory Depleted",
    trigger: "Harvest Right Chamber Sensor / Batch Inspection reports strawberries unavailable for market allocation.",
    severity: "HIGH_OPPORTUNITY",
    consequenceTraced: {
      graphNodesEvaluated: 18,
      affectedEntities: [
        "Product: Jupiter Sweet Strawberry Slices (Market stock: 30 -> 0)",
        "Customer Commitment: 20 Online Preorders Protected (12 stock assigned, 8 waitlisted priority)",
        "Storefront Hero Offer: 'Jupiter Sunrise Duo' -> 'Swicy Cosmic Star-Pack'",
        "Social Promotion: 5 Platform Postiz Drafts Re-written for Swicy Mango Tajín",
        "Kitchen Task COM-02: Shift sealing trays from strawberry to Swicy Mango pouches",
        "Projected Revenue: Increases from $387.25 to $699.65 (+80.6% gross margin lift)"
      ]
    },
    diff: {
      oldBundle: state.currentOffer.name,
      newBundle: newOffer.name,
      oldPrice: state.currentOffer.bundlePrice,
      newPrice: newOffer.bundlePrice,
      oldChannels: state.postizCampaign.channels.map(c => ({ platform: c.platform, preview: c.content.slice(0, 60) + "..." })),
      newChannels: revisedChannels.map(c => ({ platform: c.platform, preview: c.content.slice(0, 60) + "..." })),
      newOffer,
      revisedChannels
    },
    status: "PENDING_OPERATOR_APPROVAL"
  };

  return state;
}

// Approve Decision
function approveDecision() {
  if (!state.pendingDecision) return state;

  const { newOffer, revisedChannels } = state.pendingDecision.diff;

  state.currentOffer = newOffer;
  state.postizCampaign.channels = revisedChannels.map(c => ({ ...c, status: "APPROVED_FOR_POSTIZ" }));
  state.postizCampaign.status = "APPROVED";

  const com2 = state.commitments.find(c => c.id === "COM-02");
  if (com2) {
    com2.task = "Heat-seal 35 Swicy Cosmic Star-Pack pouches with oxygen absorbers";
    com2.verifiedBy = "Alex Re-Ack (Mobile App)";
  }

  const com3 = state.commitments.find(c => c.id === "COM-03");
  if (com3) {
    com3.task = "Broadcast Swicy Cosmic Star-Pack across 5 platforms via Postiz";
    com3.status = "DISPATCHED";
    com3.verifiedBy = "Postiz API Live Queue (Token #PSTZ-9921)";
  }

  state.history.unshift({
    event: `${new Date().toLocaleTimeString()} - Strawberry Shortage Pivot Approved`,
    description: `Swapped hero offer to Swicy Cosmic Star-Pack ($19.99, +80.6% margin). Re-routed packaging tray task COM-02. Staged Postiz broadcast to 5 channels. Protected 100% of online preorder commitments.`
  });

  state.pendingDecision = null;
  state.meta.operationalStatus = "ADAPTED_STABLE";
  state.meta.octopusState = "SYNCHRONIZED";

  return state;
}

// Wholesale Inquiry Parser (Instinct AI Top Pick)
function processWholesaleInquiry(inquiryText) {
  // Extract potential SKUs and quantities from raw messy text
  const clean = inquiryText.toLowerCase();
  const quotes = [];
  let subtotal = 0;
  let totalCost = 0;

  state.inventory.forEach(item => {
    let matchedQty = 0;
    const nameLow = item.name.toLowerCase();
    if (clean.includes("mango") && nameLow.includes("mango")) {
      const match = clean.match(/(\d+)\s*(bags?|packs?|units?|cases?|pcs?)?\s*(of\s*)?.*mango/i);
      matchedQty = match ? parseInt(match[1]) : 24;
    } else if (clean.includes("galaxy") && nameLow.includes("galaxy")) {
      const match = clean.match(/(\d+)\s*(bags?|packs?|units?|cases?|pcs?)?\s*(of\s*)?.*galaxy/i);
      matchedQty = match ? parseInt(match[1]) : 20;
    } else if (clean.includes("strawberry") && nameLow.includes("strawberry")) {
      const match = clean.match(/(\d+)\s*(bags?|packs?|units?|cases?|pcs?)?\s*(of\s*)?.*straw/i);
      matchedQty = match ? parseInt(match[1]) : 15;
    }

    if (matchedQty > 0) {
      const wholesalePrice = +(item.retailPrice * 0.65).toFixed(2); // 35% wholesale discount
      const itemSubtotal = +(wholesalePrice * matchedQty).toFixed(2);
      const itemCost = +(item.unitCost * matchedQty).toFixed(2);
      const isStockSufficient = (item.totalStock - item.onlineReserved) >= matchedQty;

      subtotal += itemSubtotal;
      totalCost += itemCost;

      quotes.push({
        sku: item.id,
        name: item.name,
        requestedQty: matchedQty,
        availableStock: item.totalStock - item.onlineReserved,
        wholesaleUnitPrice: wholesalePrice,
        retailMSRP: item.retailPrice,
        lineTotal: itemSubtotal,
        grossMargin: +(((itemSubtotal - itemCost) / itemSubtotal) * 100).toFixed(1) + "%",
        stockStatus: isStockSufficient ? "CONFIRMED_AVAILABLE" : "BACKORDER_SPLIT_REQUIRED"
      });
    }
  });

  if (quotes.length === 0) {
    // Default quote sample if text was freeform
    const mango = state.inventory.find(i => i.id === "SKU-MANGO");
    const wholesalePrice = +(mango.retailPrice * 0.65).toFixed(2);
    quotes.push({
      sku: mango.id,
      name: mango.name,
      requestedQty: 25,
      availableStock: mango.totalStock - mango.onlineReserved,
      wholesaleUnitPrice: wholesalePrice,
      retailMSRP: mango.retailPrice,
      lineTotal: +(wholesalePrice * 25).toFixed(2),
      grossMargin: "73.2%",
      stockStatus: "CONFIRMED_AVAILABLE"
    });
    subtotal = +(wholesalePrice * 25).toFixed(2);
    totalCost = +(mango.unitCost * 25).toFixed(2);
  }

  const grossMargin = +(((subtotal - totalCost) / subtotal) * 100).toFixed(1) + "%";

  return {
    quoteId: "WHQ-" + Date.now().toString(36).toUpperCase(),
    customerNote: inquiryText,
    generatedAt: new Date().toISOString(),
    validUntil: "5 Business Days",
    lines: quotes,
    subtotal: subtotal.toFixed(2),
    estimatedFreight: "35.00",
    totalQuote: (subtotal + 35).toFixed(2),
    blendedGrossMargin: grossMargin,
    paymentTerms: "Net 15 upon invoice / Stripe B2B Link",
    approvalStatus: "READY_FOR_OWNER_ONE_CLICK_DISPATCH"
  };
}

// HTTP Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === "/api/state") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(state));
    return;
  }

  if (pathname === "/api/chaos/strawberry-shortage" && req.method === "POST") {
    const updated = injectStrawberryChaos();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, state: updated, message: "Rehearsal disruption triggered: Strawberry shortage propagated through Neo4j graph." }));
    return;
  }

  if (pathname === "/api/decision/approve" && req.method === "POST") {
    const updated = approveDecision();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, state: updated, message: "Consequence diff approved! Storefront updated, Postiz 5-platform broadcast scheduled." }));
    return;
  }

  if (pathname === "/api/decision/reset" && req.method === "POST") {
    state = JSON.parse(JSON.stringify(INITIAL_STATE));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, state, message: "Reset to initial state." }));
    return;
  }

  if (pathname === "/api/plaud/status") {
    const plaudModule = require('./integrations/plaud');
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, device: plaudModule.DEVICE_STATUS, presets: Object.keys(plaudModule.VOICE_PRESETS) }));
    return;
  }

  if (pathname === "/api/plaud/process" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      let preset = "INVENTORY_COUNT";
      let text = null;
      try {
        const json = JSON.parse(body || "{}");
        if (json.preset) preset = json.preset;
        if (json.text) text = json.text;
      } catch (e) {}

      const plaudModule = require('./integrations/plaud');
      const result = plaudModule.processAudioStream(preset, text);

      if (preset === "INVENTORY_COUNT" && result.entities && result.entities.skuUpdates) {
        result.entities.skuUpdates.forEach(up => {
          const item = state.inventory.find(i => i.id === up.sku);
          if (item) {
            item.totalStock = up.available;
            if (up.marketAllocated !== undefined) item.marketAllocated = up.marketAllocated;
            if (up.onlineReserved !== undefined) item.onlineReserved = up.onlineReserved;
            if (up.status) item.status = up.status;
          }
        });
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, result, state }));
    });
    return;
  }

  if (pathname === "/api/voice-brief" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      const plaudModule = require('./integrations/plaud');
      const data = plaudModule.processAudioStream("BAND_MISSION_BRIEF");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, ...data }));
    });
    return;
  }

  if (pathname === "/api/wholesale/quote" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      let inquiry = "Hey Brandon, this is Palm Beach Gourmet Market. Can we get 24 bags of your Swicy Mango Tajín and 20 Galaxy Gelatin for our Friday weekend rush? Need wholesale pricing!";
      try {
        const json = JSON.parse(body || "{}");
        if (json.text) inquiry = json.text;
      } catch (e) {}
      const quote = processWholesaleInquiry(inquiry);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, quote }));
    });
    return;
  }

  if (pathname === "/api/neo4j/graph") {
    const causal = sponsors.neo4j.queryCausalImpact("SKU-STRAWBERRY");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      nodes: [
        { id: "SKU-STRAWBERRY", label: "SKU: Strawberry Slices", group: "inventory", color: "#ff4466" },
        { id: "SKU-MANGO", label: "SKU: Swicy Mango Tajín", group: "inventory", color: "#ffa500" },
        { id: "SKU-GALAXY", label: "SKU: Galaxy Gelatin Cubes", group: "inventory", color: "#00f0ff" },
        { id: "OFFER-DUO", label: "Offer: Jupiter Sunrise Duo", group: "bundle", color: "#ff0077" },
        { id: "OFFER-SWICY", label: "Offer: Swicy Cosmic Star-Pack", group: "bundle", color: "#00ff9d" },
        { id: "CHAN-IG", label: "Instagram (@coastalfreezeco)", group: "channel", color: "#c13584" },
        { id: "CHAN-TT", label: "TikTok (@coastalfreeze)", group: "channel", color: "#ff0050" },
        { id: "CHAN-FB", label: "Facebook (Coastal Freeze)", group: "channel", color: "#1877f2" },
        { id: "CHAN-X", label: "X (@coastal_freeze)", group: "channel", color: "#ffffff" },
        { id: "CHAN-TH", label: "Threads (@coastalfreezeco)", group: "channel", color: "#999999" },
        { id: "TASK-SEAL", label: "Kitchen Task: COM-02 Sealing", group: "commitment", color: "#f5a623" },
        { id: "STORE-SHOPIFY", label: "Shopify Storefront Sync", group: "commerce", color: "#96bf48" }
      ],
      links: [
        { source: "SKU-STRAWBERRY", target: "OFFER-DUO", relationship: "COMPOSES" },
        { source: "SKU-GALAXY", target: "OFFER-DUO", relationship: "COMPOSES" },
        { source: "SKU-MANGO", target: "OFFER-SWICY", relationship: "COMPOSES" },
        { source: "SKU-GALAXY", target: "OFFER-SWICY", relationship: "COMPOSES" },
        { source: "OFFER-DUO", target: "CHAN-IG", relationship: "PROMOTES" },
        { source: "OFFER-DUO", target: "CHAN-TT", relationship: "PROMOTES" },
        { source: "OFFER-SWICY", target: "CHAN-IG", relationship: "PIVOT_REPLACE" },
        { source: "OFFER-SWICY", target: "CHAN-TT", relationship: "PIVOT_REPLACE" },
        { source: "OFFER-SWICY", target: "CHAN-FB", relationship: "PIVOT_REPLACE" },
        { source: "OFFER-SWICY", target: "CHAN-X", relationship: "PIVOT_REPLACE" },
        { source: "OFFER-SWICY", target: "CHAN-TH", relationship: "PIVOT_REPLACE" },
        { source: "OFFER-SWICY", target: "TASK-SEAL", relationship: "RE_ROUTES" },
        { source: "OFFER-SWICY", target: "STORE-SHOPIFY", relationship: "LOCKS_STOCK" }
      ],
      causalProof: causal
    }));
    return;
  }

  if (pathname === "/api/feedback/submit" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: true,
        pointsEarned: 25,
        status: "RECORDED_IN_HACKATHON_CLI",
        message: "Developer feedback recorded for all 12 tools! Points added to team score."
      }));
    });
    return;
  }

  if (pathname === "/api/band/room") {
    const bandRoom = require('./integrations/band_room');
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(bandRoom.getRoomState()));
    return;
  }

  if (pathname === "/api/crusoe/status") {
    const crusoe = require('./integrations/crusoe');
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(crusoe.getCrusoeTelemetry()));
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, "public", pathname === "/" ? "index.html" : pathname);

  if (pathname === "/approve") {
    filePath = path.join(__dirname, "public", "approve.html");
  }

  if (pathname === "/demo" || pathname === "/presentation") {
    filePath = path.join(__dirname, "public", "presentation.html");
  }

  // Serve media files if requested from /media/
  if (pathname.startsWith("/media/")) {
    filePath = path.join(__dirname, pathname);
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(__dirname, "public", "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4"
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🐙 DREAMNETIOPI — YOUR BUSINESS, COORDINATED`);
  console.log(`AI Operations Crew & Rehearsal Simulator for Small Merchants`);
  console.log(`The AI Conference Hack Day 2026 — Pier 48, San Francisco`);
  console.log(`Running live at: http://localhost:${PORT}`);
  console.log(`================================================================`);
});
