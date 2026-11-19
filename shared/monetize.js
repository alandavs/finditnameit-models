// Monetization module for Find It Name It
// Drop into any page. Config drives offers per model.

const OFFERS = {
  engine: {
    category: "mechanical",
    title: "Engine Tools & Parts",
    items: [
      { name: "Spark Plug Socket Set", url: "https://www.amazon.com/s?k=spark+plug+socket+set", note: "For the plugs you just found" },
      { name: "Engine Diagnostic Kit", url: "https://www.amazon.com/s?k=obd2+scanner", note: "Read codes on real engines" },
      { name: "Torque Wrench", url: "https://www.amazon.com/s?k=torque+wrench", note: "Proper fastener tension" }
    ],
    sponsor: { label: "Sponsor this engine model", subject: "Engine model sponsorship" }
  },
  turbo: {
    category: "mechanical",
    title: "Turbo & Forced Induction",
    items: [
      { name: "Turbo Rebuild Kit", url: "https://www.amazon.com/s?k=turbo+rebuild+kit", note: "Seals and bearings" },
      { name: "Boost Gauge", url: "https://www.amazon.com/s?k=boost+gauge", note: "Monitor pressure" },
      { name: "Intercooler", url: "https://www.amazon.com/s?k=intercooler", note: "Cool the charge" }
    ],
    sponsor: { label: "Sponsor this turbo model", subject: "Turbo model sponsorship" }
  },
  diesel: {
    category: "mechanical",
    title: "Diesel Tools",
    items: [
      { name: "Injector Puller", url: "https://www.amazon.com/s?k=diesel+injector+puller", note: "Remove stuck injectors" },
      { name: "Compression Tester", url: "https://www.amazon.com/s?k=diesel+compression+tester", note: "Check cylinder health" },
      { name: "Glow Plug Set", url: "https://www.amazon.com/s?k=glow+plugs", note: "Cold start parts" }
    ],
    sponsor: { label: "Sponsor this diesel model", subject: "Diesel model sponsorship" }
  },
  pump: {
    category: "mechanical",
    title: "Pump & Fluid Handling",
    items: [
      { name: "Centrifugal Pump", url: "https://www.amazon.com/s?k=centrifugal+pump", note: "Replacement or upgrade" },
      { name: "Impeller Puller", url: "https://www.amazon.com/s?k=impeller+puller", note: "Service tool" },
      { name: "Mechanical Seal Kit", url: "https://www.amazon.com/s?k=mechanical+seal+kit", note: "Stop leaks" }
    ],
    sponsor: { label: "Sponsor this pump model", subject: "Pump model sponsorship" }
  },
  heart: {
    category: "biology",
    title: "Anatomy Learning",
    items: [
      { name: "Heart Model", url: "https://www.amazon.com/s?k=anatomical+heart+model", note: "Physical reference" },
      { name: "Anatomy Textbook", url: "https://www.amazon.com/s?k=human+anatomy+textbook", note: "Deeper study" },
      { name: "Stethoscope", url: "https://www.amazon.com/s?k=stethoscope", note: "Listen to real hearts" }
    ],
    sponsor: { label: "Sponsor this anatomy model", subject: "Anatomy model sponsorship" }
  },
  default: {
    category: "general",
    title: "Related Products",
    items: [
      { name: "3D Learning Tools", url: "https://www.amazon.com/s?k=3d+educational+model", note: "Physical models" }
    ],
    sponsor: { label: "Sponsor a model", subject: "Model sponsorship" }
  }
};

const SPONSOR_EMAIL = "alanddavis@gmail.com";

export function initMonetize(modelKey = "default") {
  const config = OFFERS[modelKey] || OFFERS.default;
  const panel = document.createElement("div");
  panel.id = "monetize";
  panel.innerHTML = `
    <style>
      #monetize { position:fixed; bottom:90px; right:16px; width:280px; background:#1e2438; border:1px solid #3a4060; border-radius:12px; padding:12px; z-index:20; font-size:13px; color:#EAEDF6; box-shadow:0 8px 24px rgba(0,0,0,.4); }
      #monetize h4 { margin:0 0 8px; color:#FFB547; font-size:14px; }
      #monetize a { color:#FFB547; text-decoration:none; display:block; padding:4px 0; }
      #monetize a:hover { text-decoration:underline; }
      #monetize .note { color:#9AA2BF; font-size:11px; }
      #monetize .sponsor { margin-top:10px; padding-top:8px; border-top:1px solid #3a4060; }
      #monetize .sponsor a { color:#4ADE9A; }
      #monetize .disc { margin-top:6px; font-size:10px; color:#666; }
      #monetize .close { position:absolute; top:6px; right:8px; background:none; border:none; color:#888; cursor:pointer; font-size:16px; }
    </style>
    <button class="close" onclick="this.parentElement.style.display='none'">×</button>
    <h4>${config.title}</h4>
    ${config.items.map(item => `<a href="${item.url}" target="_blank" rel="noopener sponsored" data-offer="${item.name}">${item.name}<span class="note"> — ${item.note}</span></a>`).join("")}
    <div class="sponsor"><a href="mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(config.sponsor.subject)}">${config.sponsor.label}</a></div>
    <div class="disc">As an Amazon Associate we may earn from qualifying purchases.</div>
  `;
  document.body.appendChild(panel);

  // simple click tracking
  panel.querySelectorAll("a[data-offer]").forEach(a => {
    a.addEventListener("click", () => {
      console.log("affiliate_click", { model: modelKey, offer: a.dataset.offer });
      // later: send to analytics endpoint
    });
  });
}
