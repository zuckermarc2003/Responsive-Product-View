import { useState } from "react";
import {
  ShoppingCart, Globe, Home, Footprints, Shirt, Menu, X,
  ChevronRight, ShoppingBag, Zap, Eye, ChevronLeft,
  MapPin, Phone, Mail, Instagram, Facebook, Twitter,
} from "lucide-react";

/* ── Sample data ─────────────────────────────────────────────── */
const NAV = [
  { label: "الرئيسية", en: "Home" },
  { label: "أحذية", en: "Shoes" },
  { label: "صندال", en: "Sandals" },
  { label: "أقمصة", en: "Shirts" },
  { label: "سراويل", en: "Pants" },
];

const SECTIONS = [
  {
    type: "Shoes",
    label: "أحذية",
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
    label: "صندال",
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

/* ── Card ────────────────────────────────────────────────────── */
function Card({ p }: { p: typeof SECTIONS[0]["products"][0] }) {
  const [hov, setHov] = useState(false);
  const final = (p.price * (1 - p.promo * 0.01)).toFixed(2);
  const hasPromo = p.promo > 0;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: `1.5px solid ${hov ? "#0d6efd" : "#e5e7eb"}`,
        boxShadow: hov ? "0 16px 40px rgba(13,110,253,.14)" : "0 2px 12px rgba(0,0,0,.06)",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition: "all .28s cubic-bezier(.22,1,.36,1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      {/* image */}
      <div style={{ position: "relative", paddingTop: "70%", overflow: "hidden", background: "#f3f4f6" }}>
        <img src={p.img} alt={p.name} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover",
          transform: hov ? "scale(1.07)" : "scale(1)",
          transition: "transform .45s cubic-bezier(.22,1,.36,1)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.22) 0%,transparent 55%)", pointerEvents: "none" }} />
        {hasPromo && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff", fontSize: 10, fontWeight: 800,
            letterSpacing: "0.06em", textTransform: "uppercase" as const,
            padding: "3px 9px", borderRadius: 20,
            boxShadow: "0 2px 6px rgba(239,68,68,.45)",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <Zap size={9} fill="currentColor" /> {p.promo}% OFF
          </span>
        )}
        <div style={{
          position: "absolute", bottom: 10, left: "50%",
          transform: `translateX(-50%) translateY(${hov ? 0 : 10}px)`,
          opacity: hov ? 1 : 0, transition: "all .22s ease",
          background: "rgba(255,255,255,.92)", color: "#111827",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase" as const, padding: "5px 14px",
          borderRadius: 20, display: "flex", alignItems: "center", gap: 5,
          whiteSpace: "nowrap" as const, pointerEvents: "none" as const,
          boxShadow: "0 2px 8px rgba(0,0,0,.12)",
        }}>
          <Eye size={11} /> Quick View
        </div>
      </div>
      {/* body */}
      <div style={{ padding: "13px 13px 0", flex: 1 }}>
        <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9ca3af" }}>
          {p.category} · {p.ref}
        </p>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, lineHeight: 1.35, color: "#111827",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
          {p.name}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.02em" }}>{final} MAD</span>
          {hasPromo && <span style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>{p.price}.00</span>}
        </div>
      </div>
      {/* cta */}
      <div style={{ padding: "11px 13px 13px" }}>
        <button style={{
          width: "100%", padding: "10px 0", border: "none", borderRadius: 8,
          background: hov ? "#0d6efd" : "#111827",
          color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase" as const, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          transition: "background .2s ease",
        }}>
          <ShoppingBag size={13} /> View Product
        </button>
      </div>
    </div>
  );
}

/* ── Section title ───────────────────────────────────────────── */
function SectionTitle({ subtitle, badge, icon }: { subtitle: string; badge: string; icon: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 0 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 4, height: 44, borderRadius: 4, background: "linear-gradient(180deg,#0d6efd,#0a58ca)", flexShrink: 0 }} />
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0d6efd" }}>
            {badge}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {subtitle}
            </h2>
            <span style={{ color: "#0d6efd", display: "flex", alignItems: "center", fontSize: 22 }}>{icon}</span>
          </div>
        </div>
      </div>
      <button style={{
        padding: "9px 22px", background: "transparent",
        border: "1.5px solid #0d6efd", color: "#0d6efd",
        borderRadius: 40, fontSize: 12, fontWeight: 700,
        letterSpacing: "0.07em", textTransform: "uppercase",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        transition: "all .2s ease",
      }}>
        See All <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(2);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0d6efd",
        boxShadow: "0 2px 16px rgba(13,110,253,.35)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid rgba(255,255,255,.3)",
            }}>
              <Footprints size={20} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>AL-FURQA STORE</span>
          </div>

          {/* Desktop nav — RTL */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, direction: "rtl" }}>
            {NAV.map((n, i) => (
              <a key={i} href="#" style={{
                color: i === 0 ? "#fff" : "rgba(255,255,255,.78)",
                fontWeight: i === 0 ? 700 : 500,
                fontSize: 13, textDecoration: "none",
                padding: "6px 12px", borderRadius: 8,
                background: i === 0 ? "rgba(255,255,255,.18)" : "transparent",
                transition: "all .15s ease",
              }}>{n.label}</a>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,.35)", borderRadius: 20, color: "#fff", padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <Globe size={14} /> العربية
            </button>
            <button style={{ background: "rgba(255,255,255,.15)", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 20, color: "#fff", padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <ShoppingCart size={15} />
              <span style={{ background: "#fff", color: "#0d6efd", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              السلة
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1400&q=80"
          alt="Hero"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.3) 60%, transparent 100%)" }} />
        {/* Blue tint stripe at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#0d6efd,#60a5fa)" }} />

        {/* Text */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#60a5fa", marginBottom: 12 }}>
            ✦ New Season 2025
          </span>
          <h1 style={{ margin: "0 0 16px", fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 520 }}>
            Step Into<br />
            <span style={{ color: "#60a5fa" }}>Premium</span><br />
            Footwear
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "rgba(255,255,255,.75)", maxWidth: 380, lineHeight: 1.6 }}>
            Discover our curated collection of handcrafted shoes, sandals, and more — built for style and comfort.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <button style={{
              padding: "14px 32px", background: "#0d6efd", border: "none",
              borderRadius: 40, color: "#fff", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer",
              boxShadow: "0 8px 24px rgba(13,110,253,.45)",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all .2s ease",
            }}>
              Shop Now <ChevronRight size={16} />
            </button>
            <button style={{
              padding: "14px 28px", background: "rgba(255,255,255,.12)",
              backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,.3)",
              borderRadius: 40, color: "#fff", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer",
            }}>
              Browse Collection
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          position: "absolute", bottom: 32, right: 60,
          display: "flex", gap: 32,
        }}>
          {[["500+", "Products"], ["4.9★", "Rating"], ["Free", "Delivery"]].map(([val, lbl], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>{val}</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 10, overflowX: "auto" }}>
          {["All", "Shoes", "Sandals", "Shirts", "Pants", "Sport", "Formal", "Casual"].map((cat, i) => (
            <button key={i} style={{
              padding: "8px 20px", borderRadius: 40, border: "1.5px solid",
              borderColor: i === 0 ? "#0d6efd" : "#e5e7eb",
              background: i === 0 ? "#0d6efd" : "transparent",
              color: i === 0 ? "#fff" : "#374151",
              fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer",
              transition: "all .15s ease",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* ── Product Sections ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        {SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: si < SECTIONS.length - 1 ? 64 : 0 }}>
            <SectionTitle
              subtitle={section.subtitle}
              badge={section.badge}
              icon={<Footprints size={22} />}
            />

            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {section.products.map((p) => <Card key={p.id} p={p} />)}
            </div>

            {/* Divider */}
            {si < SECTIONS.length - 1 && (
              <div style={{ marginTop: 48, height: 1, background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)" }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Trust bar ── */}
      <div style={{ background: "#0d6efd", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { icon: <ShoppingBag size={26} />, title: "Free Shipping", desc: "On orders over 500 MAD" },
            { icon: <Zap size={26} />, title: "Fast Delivery", desc: "2–4 business days" },
            { icon: <ShoppingCart size={26} />, title: "Easy Returns", desc: "30-day return policy" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
      <footer style={{ background: "#111827", padding: "40px 24px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 32 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "#0d6efd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Footprints size={18} color="#fff" />
                </div>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>AL-FURQA STORE</span>
              </div>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "#9ca3af", lineHeight: 1.6, maxWidth: 240 }}>
                Premium footwear crafted for comfort and style. Serving Morocco since 2018.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Icon size={15} color="#9ca3af" />
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Shop", links: ["Men's Shoes", "Women's Shoes", "Sandals", "Sport", "Sale"] },
              { title: "Company", links: ["About Us", "Contact", "Careers", "Blog"] },
              { title: "Support", links: ["FAQ", "Returns", "Shipping", "Track Order"] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280" }}>{col.title}</p>
                {col.links.map((link, j) => (
                  <a key={j} href="#" style={{ display: "block", color: "#9ca3af", fontSize: 13, marginBottom: 8, textDecoration: "none", transition: "color .15s ease" }}>{link}</a>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #1f2937", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>© 2025 AL-FURQA STORE. All rights reserved.</p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Privacy", "Terms", "Cookies"].map((l, i) => (
                <a key={i} href="#" style={{ color: "#6b7280", fontSize: 12, textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
