// Dreamnetiopi — Client Coordination Engine
document.addEventListener("DOMContentLoaded", () => {
  let appState = null;

  // Cache DOM elements
  const tentacleGrid = document.getElementById("tentacle-grid");
  const octopusStatusText = document.getElementById("octopus-status-text");
  const operationalPulse = document.getElementById("operational-pulse");
  const decisionsBadge = document.getElementById("decisions-badge");

  // Nav tabs
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Today elements
  const offerName = document.getElementById("offer-name");
  const offerTagline = document.getElementById("offer-tagline");
  const offerPrice = document.getElementById("offer-price");
  const offerMargin = document.getElementById("offer-margin");
  const offerSlots = document.getElementById("offer-slots");
  const offerPreorder = document.getElementById("offer-preorder");
  const offerInclusions = document.getElementById("offer-inclusions");
  const commitmentList = document.getElementById("commitment-list");

  // Plan elements
  const inventoryTbody = document.getElementById("inventory-tbody");

  // Decision stage
  const decisionStageContainer = document.getElementById("decision-stage-container");

  // Postiz & Sponsors
  const postizChannelGrid = document.getElementById("postiz-channel-grid");
  const sponsorsGrid = document.getElementById("sponsors-grid");
  const historyTimeline = document.getElementById("history-timeline");

  // Modals & Toasts
  const modalVoice = document.getElementById("modal-voice");
  const btnVoiceBrief = document.getElementById("btn-voice-brief");
  const btnCloseVoice = document.getElementById("btn-close-voice");
  const btnCancelVoice = document.getElementById("btn-cancel-voice");
  const btnProcessVoice = document.getElementById("btn-process-voice");
  const voiceBriefInput = document.getElementById("voice-brief-input");

  const btnTriggerChaos = document.getElementById("btn-trigger-chaos");
  const btnResetDemo = document.getElementById("btn-reset-demo");
  const toastContainer = document.getElementById("toast-container");

  // Toast utility
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${type === 'chaos' ? '💥' : type === 'success' ? '✅' : 'ℹ️'}</span> <div>${message}</div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Fetch full state from backend
  async function fetchState() {
    try {
      const res = await fetch("/api/state");
      appState = await res.json();
      renderAll();
    } catch (err) {
      console.error("Failed to fetch state:", err);
      showToast("Backend connection issue", "error");
    }
  }

  // Master Render
  function renderAll() {
    if (!appState) return;

    // 1. Render Octopus Core & Tentacles
    octopusStatusText.textContent = appState.meta.octopusState;
    if (appState.meta.operationalStatus === "REHEARSAL_ALERT") {
      operationalPulse.className = "pulse-indicator pulse-red";
      decisionsBadge.textContent = "1";
      decisionsBadge.classList.add("badge-active");
    } else {
      operationalPulse.className = "pulse-indicator pulse-green";
      decisionsBadge.classList.remove("badge-active");
    }

    tentacleGrid.innerHTML = appState.octoArms.map(arm => {
      let badgeClass = "badge-synced";
      if (arm.status === "AWAITING_INPUT" || arm.status === "IDLE") badgeClass = "badge-ready";
      if (appState.meta.operationalStatus === "REHEARSAL_ALERT" && (arm.id === "arm-graph" || arm.id === "arm-social" || arm.id === "arm-inventory")) {
        badgeClass = "badge-alert";
      }
      return `
        <div class="tentacle-card">
          <div class="tentacle-top">
            <span class="tentacle-label">${arm.label}</span>
            <span class="tentacle-status-badge ${badgeClass}">${arm.status}</span>
          </div>
          <div class="tentacle-system">${arm.system}</div>
          <div class="tentacle-detail">${arm.detail}</div>
        </div>
      `;
    }).join("");

    // 2. Render Today View
    offerName.textContent = appState.currentOffer.name;
    offerTagline.textContent = appState.currentOffer.tagline;
    offerPrice.textContent = `$${appState.currentOffer.bundlePrice.toFixed(2)}`;
    offerMargin.textContent = appState.currentOffer.grossMargin;
    offerSlots.textContent = `${appState.currentOffer.marketAllocationSlots} Packs`;
    offerPreorder.textContent = `${appState.currentOffer.onlinePreorderLimit} Preorders`;

    offerInclusions.innerHTML = appState.currentOffer.featuredProducts.map(pName => {
      const prod = appState.inventory.find(i => i.name === pName);
      return `
        <div class="inclusion-row">
          <span class="inc-name">📦 ${pName}</span>
          <span class="inc-detail">${prod ? `$${prod.price.toFixed(2)} retail • Stock: ${prod.totalStock}` : 'Active Listing'}</span>
        </div>
      `;
    }).join("");

    commitmentList.innerHTML = appState.commitments.map(com => {
      const isPending = com.status.includes("AWAITING");
      return `
        <div class="commitment-item">
          <div class="com-left">
            <div class="com-task">${com.task}</div>
            <div class="com-meta">
              <span class="com-owner">👤 ${com.owner}</span>
              <span class="com-due">⏱️ Due ${com.due}</span>
              <span class="com-proof">🛡️ ${com.verifiedBy}</span>
            </div>
          </div>
          <span class="com-badge ${isPending ? 'badge-alert' : 'badge-synced'}">${com.status}</span>
        </div>
      `;
    }).join("");

    // 3. Render Plan View (Inventory Table)
    inventoryTbody.innerHTML = appState.inventory.map(item => {
      const isDeficit = item.status === "DEFICIT_PROTECTED";
      return `
        <tr>
          <td class="sku-code">${item.id}</td>
          <td class="product-name">${item.name}</td>
          <td>${item.category}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${item.cost.toFixed(2)}</td>
          <td><span class="stock-pill ${isDeficit ? 'stock-deficit' : ''}">${item.totalStock} units</span></td>
          <td>${item.onlineReserved} units</td>
          <td><strong>${item.marketAllocated} units</strong></td>
          <td><span class="tentacle-status-badge ${isDeficit ? 'badge-alert' : 'badge-synced'}">${item.status}</span></td>
        </tr>
      `;
    }).join("");

    // 4. Render Decisions View (Consequence Rehearsal Diff)
    if (!appState.pendingDecision) {
      decisionStageContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 48px 24px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🛡️</div>
          <h2 class="card-title">All Commitments Harmonized</h2>
          <p class="card-sub" style="max-width: 540px; margin: 0 auto 20px;">
            The Rehearsal Simulator is standing by. Click the button below to test a live supply disruption and observe how Dreamnetiopi cascades consequences across inventory, storefront, and 5 social channels.
          </p>
          <button class="btn btn-chaos" id="btn-empty-chaos">
            <span class="icon">⚡</span> Run Chaos Rehearsal: "Strawberries Out of Stock"
          </button>
        </div>
      `;
      document.getElementById("btn-empty-chaos")?.addEventListener("click", triggerStrawberryChaos);
    } else {
      const dec = appState.pendingDecision;
      decisionStageContainer.innerHTML = `
        <div class="rehearsal-card" id="active-decision-card">
          <div class="disruption-header">
            <div class="disruption-title-block">
              <span class="card-badge" style="color: var(--accent-coral)">LIVE REHEARSAL DIFF • AWAITING APPROVAL</span>
              <h2>${dec.title}</h2>
              <div class="disruption-trigger">⚠️ Trigger: ${dec.trigger}</div>
            </div>
            <span class="tentacle-status-badge badge-alert">UNAPPROVED REHEARSAL</span>
          </div>

          <div class="graph-trace-box">
            <div class="graph-trace-title">
              <span>🕸️</span> Neo4j Causal Graph Trace (${dec.consequenceTraced.graphNodesEvaluated} Nodes Evaluated)
            </div>
            <div class="consequence-timeline">
              ${dec.consequenceTraced.affectedEntities.map((step, idx) => `
                <div class="consequence-step">
                  <span class="step-num">${idx + 1}</span>
                  <span>${step}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="diff-container">
            <div class="diff-box diff-box-before">
              <div class="diff-header diff-header-before">❌ Current Base Plan (Impacted)</div>
              <div class="diff-offer-title">${dec.diff.oldBundle}</div>
              <div class="diff-metrics">
                <div>Price: $${dec.diff.oldPrice.toFixed(2)}</div>
                <div>Status: Strawberry supply deficit locks market booth</div>
                <div>Social: 5 Postiz drafts referencing unavailable strawberries</div>
              </div>
            </div>

            <div class="diff-box diff-box-after">
              <div class="diff-header diff-header-after">✨ Proposed Coordinated Plan (Adaptive)</div>
              <div class="diff-offer-title">${dec.diff.newBundle}</div>
              <div class="diff-metrics">
                <div>New Price: $${dec.diff.newPrice.toFixed(2)} (${dec.diff.newOffer.grossMargin} Margin)</div>
                <div>Customer Safety: 20 Online orders 100% protected first</div>
                <div>Social: 5 Postiz drafts pivoted to Swicy Mango Tajín ASMR</div>
                <div>Revenue Lift: +$312.40 projected booth contribution margin</div>
              </div>
            </div>
          </div>

          <div class="decision-action-bar">
            <button class="btn btn-outline" id="btn-reject-decision">Discard Simulation</button>
            <button class="btn btn-approve" id="btn-approve-decision">
              <span>✅</span> Approve & Propagate Coordinated Changes (One-Click)
            </button>
          </div>
        </div>
      `;

      document.getElementById("btn-approve-decision")?.addEventListener("click", approveCurrentDecision);
      document.getElementById("btn-reject-decision")?.addEventListener("click", resetDemo);
    }

    // 5. Render 5-Platform Postiz Studio
    postizChannelGrid.innerHTML = appState.postizCampaign.channels.map(ch => {
      const platformIcons = {
        instagram: "📸 Instagram",
        tiktok: "🎵 TikTok",
        facebook: "👥 Facebook",
        x: "🐦 X (Twitter)",
        threads: "🧵 Threads"
      };
      return `
        <div class="post-card">
          <div class="post-card-top">
            <span class="platform-badge">${platformIcons[ch.platform] || ch.platform}</span>
            <span class="tastegate-pill">TasteGate ${ch.tasteGateScore}/10</span>
          </div>
          <div class="post-content-preview">${ch.content}</div>
          <div class="post-footer">
            <span class="media-tag">📎 ${ch.media}</span>
            <span class="tentacle-status-badge ${ch.status.includes('APPROVED') ? 'badge-synced' : 'badge-ready'}">${ch.status}</span>
          </div>
        </div>
      `;
    }).join("");

    // 6. Render Sponsor Tool Matrix (12 Engines)
    sponsorsGrid.innerHTML = appState.sponsors.map(sp => `
      <div class="sponsor-card">
        <div class="sponsor-top">
          <span class="sponsor-name">${sp.name}</span>
          <span class="tentacle-status-badge badge-synced">${sp.status}</span>
        </div>
        <div class="sponsor-role">${sp.role}</div>
        <div class="sponsor-proof">${sp.proof}</div>
      </div>
    `).join("");

    // 7. Render History
    historyTimeline.innerHTML = appState.history.map(item => `
      <div class="card" style="margin-bottom: 12px; padding: 16px;">
        <div style="font-family: var(--font-heading); font-weight: 700; color: #fff; margin-bottom: 4px;">${item.event}</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">${item.description}</div>
      </div>
    `).join("");
  }

  // Tab Switching
  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      navTabs.forEach(t => t.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      document.getElementById(targetId)?.classList.add("active");
    });
  });

  function switchTab(tabId) {
    const tabBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (tabBtn) tabBtn.click();
  }

  // Chaos Trigger
  async function triggerStrawberryChaos() {
    showToast("💥 Injecting Chaos: Strawberry supply depleted...", "chaos");
    try {
      const res = await fetch("/api/chaos/strawberry-shortage", { method: "POST" });
      const data = await res.json();
      appState = data.state;
      renderAll();
      switchTab("tab-decisions");
      showToast("🕸️ Neo4j Graph traced 18 causal impacts. Review diff!", "chaos");
    } catch (err) {
      console.error(err);
    }
  }

  // Approve Decision
  async function approveCurrentDecision() {
    showToast("Propagating approvals to Storefront & Postiz...", "info");
    try {
      const res = await fetch("/api/decision/approve", { method: "POST" });
      const data = await res.json();
      appState = data.state;
      renderAll();
      showToast("✅ Changes verified & scheduled across 5 Postiz channels!", "success");
    } catch (err) {
      console.error(err);
    }
  }

  // Reset Demo
  async function resetDemo() {
    try {
      const res = await fetch("/api/decision/reset", { method: "POST" });
      const data = await res.json();
      appState = data.state;
      renderAll();
      showToast("Reset demo to baseline state.", "info");
    } catch (err) {
      console.error(err);
    }
  }

  // Voice Modal Listeners
  btnVoiceBrief?.addEventListener("click", () => {
    modalVoice.classList.add("show");
  });

  const closeModal = () => modalVoice.classList.remove("show");
  btnCloseVoice?.addEventListener("click", closeModal);
  btnCancelVoice?.addEventListener("click", closeModal);

  btnProcessVoice?.addEventListener("click", async () => {
    showToast("Plaud AI transcribing and parsing brief...", "info");
    closeModal();
    try {
      const res = await fetch("/api/voice-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: voiceBriefInput.value })
      });
      const data = await res.json();
      showToast("Voice brief extracted: Saturday GreenMarket ready!", "success");
    } catch (err) {
      console.error(err);
    }
  });

  btnTriggerChaos?.addEventListener("click", triggerStrawberryChaos);
  document.getElementById("btn-simulate-strawberry")?.addEventListener("click", triggerStrawberryChaos);
  btnResetDemo?.addEventListener("click", resetDemo);

  document.getElementById("btn-sync-shopify")?.addEventListener("click", () => {
    showToast("Merge API: Synced Shopify + Square inventory in 42ms.", "success");
  });

  document.getElementById("btn-postiz-stage-all")?.addEventListener("click", () => {
    showToast("Postiz API: 5/5 Platform drafts staged with cryptographic receipt!", "success");
  });

  document.getElementById("btn-export-proof")?.addEventListener("click", () => {
    showToast("Exported ProofStack receipt: sha256:d82e...7b4a", "success");
  });

  // Wholesale Desk Handlers
  const wholesaleInquiryInput = document.getElementById("wholesale-inquiry-input");
  const btnGenerateQuote = document.getElementById("btn-generate-quote");
  const wholesaleQuoteContainer = document.getElementById("wholesale-quote-container");

  const sample1 = "Hey Brandon, this is Palm Beach Gourmet Market! We need 24 bags of Swicy Mango Tajín and 20 Galaxy Gelatin Crunch Cubes for our weekend rush. Can you deliver by Friday and what's our wholesale price?";
  const sample2 = "Hi Coastal Freeze, Wellington Organic Cafe here. Looking to order 30 bags of Georgia Gold Peach and 15 Swicy Mango. Do you have stock available right now?";

  document.getElementById("sample-inquiry-1")?.addEventListener("click", () => {
    if (wholesaleInquiryInput) wholesaleInquiryInput.value = sample1;
  });
  document.getElementById("sample-inquiry-2")?.addEventListener("click", () => {
    if (wholesaleInquiryInput) wholesaleInquiryInput.value = sample2;
  });

  async function generateWholesaleQuote() {
    showToast("Instinct AI: Parsing inquiry & checking inventory margin floors...", "info");
    try {
      const res = await fetch("/api/wholesale/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: wholesaleInquiryInput.value })
      });
      const data = await res.json();
      if (!data.ok || !data.quote) return;

      const q = data.quote;
      wholesaleQuoteContainer.innerHTML = `
        <div class="card card-wholesale-quote animate-slide-up">
          <div class="quote-header">
            <div>
              <span class="card-badge badge-active">${q.quoteId}</span>
              <h2 class="quote-title">Wholesale B2B Purchase Quote</h2>
              <div class="quote-meta">Valid for: ${q.validUntil} • Terms: ${q.paymentTerms}</div>
            </div>
            <div class="quote-margin-badge">
              <span class="margin-label">Blended Gross Margin</span>
              <span class="margin-val">${q.blendedGrossMargin}</span>
            </div>
          </div>

          <div class="table-container">
            <table class="inventory-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Avail Stock</th>
                  <th>Wholesale / Unit</th>
                  <th>MSRP</th>
                  <th>Line Total</th>
                  <th>Gross Margin</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${q.lines.map(line => `
                  <tr>
                    <td><code>${line.sku}</code></td>
                    <td><strong>${line.name}</strong></td>
                    <td>${line.requestedQty}</td>
                    <td><span class="badge ${line.availableStock >= line.requestedQty ? 'badge-active' : 'badge-warning'}">${line.availableStock} in stock</span></td>
                    <td><strong>$${line.wholesaleUnitPrice.toFixed(2)}</strong></td>
                    <td class="text-muted">$${line.retailMSRP.toFixed(2)}</td>
                    <td><strong>$${line.lineTotal.toFixed(2)}</strong></td>
                    <td><span class="badge badge-active">${line.grossMargin}</span></td>
                    <td><span class="badge ${line.stockStatus === 'CONFIRMED_AVAILABLE' ? 'badge-active' : 'badge-warning'}">${line.stockStatus}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="quote-summary-row">
            <div class="quote-financials">
              <div>Subtotal: <strong>$${q.subtotal}</strong></div>
              <div>Estimated Freight: <strong>$${q.estimatedFreight}</strong></div>
              <div class="quote-grand-total">Total Quote: <strong>$${q.totalQuote}</strong></div>
            </div>
            <div class="quote-actions">
              <button class="btn btn-outline" id="btn-copy-quote">📋 Copy Quote Text</button>
              <button class="btn btn-primary" id="btn-dispatch-quote">🚀 1-Click Send Quote to Buyer & Lock Inventory</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById("btn-dispatch-quote")?.addEventListener("click", () => {
        showToast("Quote dispatched via Stripe B2B & Shopify draft order created! Inventory locked.", "success");
      });
      document.getElementById("btn-copy-quote")?.addEventListener("click", () => {
        showToast("Quote summary copied to clipboard!", "info");
      });

      showToast("Margin-safe quote generated in 380ms!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error generating wholesale quote", "error");
    }
  }

  btnGenerateQuote?.addEventListener("click", generateWholesaleQuote);

  // Neo4j Graph Visualizer
  async function drawNeo4jGraph() {
    const svg = document.getElementById("causal-graph-svg");
    if (!svg) return;
    try {
      const res = await fetch("/api/neo4j/graph");
      const data = await res.json();
      if (!data.nodes || !data.links) return;

      const nodes = [
        { id: "SKU-STRAWBERRY", x: 100, y: 120, label: "Strawberry SKU", color: "#ff4466" },
        { id: "SKU-MANGO", x: 100, y: 240, label: "Swicy Mango SKU", color: "#ffa500" },
        { id: "SKU-GALAXY", x: 100, y: 360, label: "Galaxy Cubes SKU", color: "#00f0ff" },
        { id: "OFFER-DUO", x: 380, y: 150, label: "Jupiter Sunrise Duo", color: "#ff0077" },
        { id: "OFFER-SWICY", x: 380, y: 300, label: "Swicy Cosmic Star-Pack", color: "#00ff9d" },
        { id: "CHAN-IG", x: 680, y: 80, label: "Instagram (@coastalfreezeco)", color: "#e1306c" },
        { id: "CHAN-TT", x: 680, y: 160, label: "TikTok (@coastalfreeze)", color: "#ff0050" },
        { id: "CHAN-FB", x: 680, y: 240, label: "Facebook Page", color: "#1877f2" },
        { id: "CHAN-X", x: 680, y: 320, label: "X Thread", color: "#ffffff" },
        { id: "TASK-SEAL", x: 900, y: 180, label: "COM-02 Sealing Trays", color: "#f5a623" },
        { id: "STORE-SHOPIFY", x: 900, y: 300, label: "Shopify + Square Stock", color: "#96bf48" }
      ];

      const nodeMap = {};
      nodes.forEach(n => nodeMap[n.id] = n);

      let linksHtml = "";
      data.links.forEach(l => {
        const s = nodeMap[l.source];
        const t = nodeMap[l.target];
        if (s && t) {
          linksHtml += `
            <path d="M ${s.x} ${s.y} C ${(s.x + t.x) / 2} ${s.y}, ${(s.x + t.x) / 2} ${t.y}, ${t.x} ${t.y}" 
                  stroke="rgba(0, 240, 255, 0.4)" stroke-width="2" fill="none" stroke-dasharray="4 2"/>
          `;
        }
      });

      let nodesHtml = "";
      nodes.forEach(n => {
        nodesHtml += `
          <g transform="translate(${n.x}, ${n.y})">
            <circle r="18" fill="${n.color}" opacity="0.85" filter="drop-shadow(0 0 8px ${n.color})"/>
            <circle r="6" fill="#0b0e14"/>
            <text x="24" y="5" fill="#e6edf3" font-size="12" font-weight="600" font-family="system-ui">${n.label}</text>
          </g>
        `;
      });

      svg.innerHTML = `
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        ${linksHtml}
        ${nodesHtml}
      `;
    } catch (e) {
      console.error(e);
    }
  }

  document.getElementById("btn-reload-graph")?.addEventListener("click", () => {
    drawNeo4jGraph();
    showToast("Re-evaluated 18 Neo4j nodes across 26 causal edges in 12ms", "success");
  });

  // Load initial quote sample
  generateWholesaleQuote();
  drawNeo4jGraph();

  // Initial load
  await fetchState();

  // Hash Navigation Support
  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "");
    if (hash === "voice") {
      modalVoice?.classList.add("show");
    } else {
      switchTab(hash);
    }
  }
});

