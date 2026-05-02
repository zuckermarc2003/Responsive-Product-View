import { useState } from "react";
import {
  ShoppingCart, Globe, Footprints,
  ChevronRight, ShoppingBag, Zap, Eye,
  ChevronLeft, Instagram, Facebook, Twitter,
} from "lucide-react";

const NAV = ["الرئيسية", "أحذية", "صندال", "أقمصة", "سراويل"];

const SECTIONS = [
  {
    type: "Shoes",
    subtitle: "Men's Shoes",
    badge: "New Arrivals",
    products: [
      { id: 1, category: "Classic", ref: "8676", name: "HERMES Premium Oxford", price: 546, promo: 35, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=75" },
      { id: 2, category: "Casual", ref: "7574", name: "Castorio Daily Sneaker", price: 380, promo: 0, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=75" },
      { id: 3, category: "Sport", ref: "9231", name: "Velocity Pro Runner", price: 620, promo: 20, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=75" },
      { id: 4, category: "Formal", ref: "4512", name: "Executive Derby Lace", price: 850, promo: 0, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=75" },
    ],
  },
  {
    type: "Sandals",
    subtitle: "Sandals",
    badge: "Summer 2025",
    products: [
      { id: 5, category: "Beach", ref: "3301", name: "Monte Comfort Slide", price: 220, promo: 15, img: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=75" },
      { id: 6, category: "Sport", ref: "2209", name: "Trek Pro Sandal", price: 340, promo: 0, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=75" },
      { id: 7, category: "Classic", ref: "1105", name: "Leather Strap Thong", price: 190, promo: 10, img: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=75" },
      { id: 8, category: "Luxury", ref: "4433", name: "Milano Flat Mule", price: 480, promo: 0, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=75" },
    ],
  },
];

/* ── Card ── */
function Card({ p }: { p: typeof SECTIONS[0]["products"][0] }) {
  const [hov, setHov] = useState(false);
  const final = (p.price * (1 - p.promo * 0.01)).toFixed(2);
  const hasPromo = p.promo > 0;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: `1.5px solid ${hov ? "#0d6efd" : "#e5e7eb"}`,
      boxShadow: hov ? "0 16px 40px rgba(13,110,253,.14)" : "0 2px 12px rgba(0,0,0,.06)",
      transform: hov ? "translateY(-6px)" : "translateY(0)",
      transition: "all .28s cubic-bezier(.22,1,.36,1)",
      cursor: "pointer", display: "flex", flexDirection: "column" as const,
    }}>
      <div style={{ position: "relative", paddingTop: "70%", overflow: "hidden", background: "#f3f4f6" }}>
        <img src={p.img} alt={p.name} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transform: hov ? "scale(1.07)" : "scale(1)",
          transition: "transform .45s cubic-bezier(.22,1,.36,1)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.22) 0%,transparent 55%)", pointerEvents: "none" }} />
        {hasPromo && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
            textTransform: "uppercase" as const, padding: "3px 9px", borderRadius: 20,
            boxShadow: "0 2px 6px rgba(239,68,68,.45)",
            display: "flex", alignItems: "center", gap: 3,
          }}><Zap size={9} fill="currentColor" /> {p.promo}% OFF</span>
        )}
        <div style={{
          position: "absolute", bottom: 10, left: "50%",
          transform: `translateX(-50%) translateY(${hov ? 0 : 10}px)`,
          opacity: hov ? 1 : 0, transition: "all .22s ease",
          background: "rgba(255,255,255,.92)", color: "#111827", fontSize: 10,
          fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const,
          padding: "5px 14px", borderRadius: 20, display: "flex", alignItems: "center",
          gap: 5, whiteSpace: "nowrap" as const, pointerEvents: "none" as const,
          boxShadow: "0 2px 8px rgba(0,0,0,.12)",
        }}><Eye size={11} /> Quick View</div>
      </div>
      <div style={{ padding: "13px 13px 0", flex: 1 }}>
        <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9ca3af" }}>
          {p.category} · {p.ref}
        </p>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, lineHeight: 1.35, color: "#111827" }}>
          {p.name}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#16a34a" }}>{final} MAD</span>
          {hasPromo && <span style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>{p.price}.00</span>}
        </div>
      </div>
      <div style={{ padding: "11px 13px 13px" }}>
        <button style={{
          width: "100%", padding: "10px 0", border: "none", borderRadius: 8,
          background: hov ? "#0d6efd" : "#111827",
          color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase" as const, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          transition: "background .2s ease",
        }}><ShoppingBag size={13} /> View Product</button>
      </div>
    </div>
  );
}

/* ── Section header ── */
function SectionHeader({ badge, subtitle, onSeeAll }: { badge: string; subtitle: string; onSeeAll: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, flexWrap: "wrap" as const, gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 4, height: 44, borderRadius: 4, background: "linear-gradient(180deg,#0d6efd,#0a58ca)", flexShrink: 0 }} />
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#0d6efd" }}>
            {badge}
          </p>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1, display: "flex", alignItems: "center", gap: 10 }}>
            {/* Icon left — bounces up-left */}
            <span style={{ display: "inline-block", color: "#0d6efd", fontSize: 22, animation: "iconBL 1.6s ease-in-out infinite" }}>
              <Footprints size={22} />
            </span>
            {subtitle}
            {/* Icon right — bounces up-right */}
            <span style={{ display: "inline-block", color: "#0d6efd", fontSize: 22, animation: "iconBR 1.6s ease-in-out infinite" }}>
              <Footprints size={22} />
            </span>
          </h2>
        </div>
      </div>

      {/* "See All" pill — fully styled */}
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onSeeAll}
        style={{
          padding: "10px 28px",
          background: hov ? "#0d6efd" : "transparent",
          border: "1.5px solid #0d6efd",
          color: hov ? "#ffffff" : "#0d6efd",
          borderRadius: 40,
          fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          transition: "all .2s ease",
          outline: "none",
        }}
      >
        See All <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ── Mini carousel with arrow nav ── */
function ProductRow({ products }: { products: typeof SECTIONS[0]["products"] }) {
  const [offset, setOffset] = useState(0);
  const VISIBLE = 4;
  const maxOffset = Math.max(0, products.length - VISIBLE);
  const slice = products.slice(offset, offset + VISIBLE);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {slice.map(p => <Card key={p.id} p={p} />)}
      </div>
      {/* Dots + arrows */}
      {maxOffset > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 20 }}>
          <button onClick={() => setOffset(o => Math.max(0, o - 1))} disabled={offset === 0} style={{
            width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${offset === 0 ? "#d1d5db" : "#0d6efd"}`,
            background: "transparent", color: offset === 0 ? "#d1d5db" : "#0d6efd", cursor: offset === 0 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><ChevronLeft size={15} /></button>

          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button key={i} onClick={() => setOffset(i)} style={{
              width: i === offset ? 22 : 8, height: 8, borderRadius: 4, border: "none",
              background: i === offset ? "#0d6efd" : "#d1d5db",
              cursor: "pointer", transition: "all .25s ease", padding: 0,
            }} />
          ))}

          <button onClick={() => setOffset(o => Math.min(maxOffset, o + 1))} disabled={offset >= maxOffset} style={{
            width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${offset >= maxOffset ? "#d1d5db" : "#0d6efd"}`,
            background: "transparent", color: offset >= maxOffset ? "#d1d5db" : "#0d6efd", cursor: offset >= maxOffset ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><ChevronRight size={15} /></button>
        </div>
      )}

      {/* "See all" redirect button — styled, prominent */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <SeeAllButton />
      </div>
    </div>
  );
}

function SeeAllButton() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "11px 40px",
        background: hov ? "#0d6efd" : "transparent",
        border: "1.5px solid #0d6efd",
        color: hov ? "#ffffff" : "#0d6efd",
        borderRadius: 40,
        fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 8,
        transition: "all .22s ease",
        outline: "none",
        boxShadow: hov ? "0 6px 20px rgba(13,110,253,.25)" : "none",
      }}
    >
      See All Shoes <ChevronRight size={15} />
    </button>
  );
}

/* ── Page ── */
export function HomePage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>

      {/* keyframes injected inline */}
      <style>{`
        @keyframes iconBL { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(-14deg)} }
        @keyframes iconBR { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(14deg)} }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ background: "#0d6efd", padding: "0 24px", boxShadow: "0 2px 16px rgba(13,110,253,.3)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,.3)" }}>
              <Footprints size={20} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>AL-FURQA STORE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, direction: "rtl" }}>
            {NAV.map((n, i) => (
              <a key={i} href="#" style={{
                color: i === 0 ? "#fff" : "rgba(255,255,255,.78)", fontWeight: i === 0 ? 700 : 500,
                fontSize: 13, textDecoration: "none", padding: "6px 12px", borderRadius: 8,
                background: i === 0 ? "rgba(255,255,255,.18)" : "transparent",
              }}>{n}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,.35)", borderRadius: 20, color: "#fff", padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <Globe size={14} /> العربية
            </button>
            <button style={{ background: "rgba(255,255,255,.15)", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 20, color: "#fff", padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <ShoppingCart size={15} />
              <span style={{ background: "#fff", color: "#0d6efd", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
              السلة
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: 460, overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1400&q=80" alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.3) 60%,transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#0d6efd,#60a5fa)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#60a5fa", marginBottom: 12 }}>✦ New Season 2025</span>
          <h1 style={{ margin: "0 0 16px", fontSize: 50, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 500 }}>
            Step Into<br /><span style={{ color: "#60a5fa" }}>Premium</span><br />Footwear
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: 14, color: "rgba(255,255,255,.75)", maxWidth: 360, lineHeight: 1.6 }}>
            Discover our curated collection — handcrafted for style and comfort.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <button style={{ padding: "13px 30px", background: "#0d6efd", border: "none", borderRadius: 40, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 8px 24px rgba(13,110,253,.45)", display: "flex", alignItems: "center", gap: 8 }}>
              Shop Now <ChevronRight size={16} />
            </button>
            <button style={{ padding: "13px 26px", background: "rgba(255,255,255,.12)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 40, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer" }}>
              Browse Collection
            </button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 28, right: 60, display: "flex", gap: 32 }}>
          {[["500+", "Products"], ["4.9★", "Rating"], ["Free", "Delivery"]].map(([val, lbl], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>{val}</p>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 10, overflowX: "auto" }}>
          {["All", "Shoes", "Sandals", "Shirts", "Pants", "Sport", "Formal", "Casual"].map((cat, i) => (
            <button key={i} style={{
              padding: "8px 20px", borderRadius: 40,
              border: `1.5px solid ${i === 0 ? "#0d6efd" : "#e5e7eb"}`,
              background: i === 0 ? "#0d6efd" : "transparent",
              color: i === 0 ? "#fff" : "#374151",
              fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* ── Product sections ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 24px 60px", display: "flex", flexDirection: "column", gap: 56 }}>
        {SECTIONS.map((s, si) => (
          <div key={si}>
            <SectionHeader badge={s.badge} subtitle={s.subtitle} onSeeAll={() => {}} />
            <ProductRow products={s.products} />
            {si < SECTIONS.length - 1 && (
              <div style={{ marginTop: 48, height: 1, background: "linear-gradient(90deg,transparent,#e5e7eb,transparent)" }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Trust bar ── */}
      <div style={{ background: "#0d6efd", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { icon: <ShoppingBag size={24} />, title: "Free Shipping", desc: "On orders over 500 MAD" },
            { icon: <Zap size={24} />, title: "Fast Delivery", desc: "2–4 business days" },
            { icon: <ShoppingCart size={24} />, title: "Easy Returns", desc: "30-day return policy" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ color: "#fff", opacity: 0.9, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.7)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "#111827", padding: "36px 24px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36, marginBottom: 28 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#0d6efd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Footprints size={17} color="#fff" />
                </div>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>AL-FURQA STORE</span>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9ca3af", lineHeight: 1.6, maxWidth: 220 }}>
                Premium footwear crafted for comfort and style. Serving Morocco since 2018.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Icon size={14} color="#9ca3af" />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Shop", links: ["Men's Shoes", "Sandals", "Sport", "Sale"] },
              { title: "Company", links: ["About", "Contact", "Blog"] },
              { title: "Support", links: ["FAQ", "Returns", "Track Order"] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280" }}>{col.title}</p>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{ display: "block", color: "#9ca3af", fontSize: 12, marginBottom: 7, textDecoration: "none" }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>© 2025 AL-FURQA STORE. All rights reserved.</p>
            <div style={{ display: "flex", gap: 14 }}>
              {["Privacy", "Terms"].map((l, i) => <a key={i} href="#" style={{ color: "#6b7280", fontSize: 11, textDecoration: "none" }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
