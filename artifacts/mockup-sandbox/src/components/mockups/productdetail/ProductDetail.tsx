import { useState } from "react";
import {
  ChevronLeft, ChevronRight, ShoppingCart, Zap,
  Star, Truck, MessageSquare, Plus, X, ChevronDown,
  Footprints, Shirt,
} from "lucide-react";

const IMAGES = [
  "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80",
];

const SIZES = [
  { size: 39, qty: 3 },
  { size: 40, qty: 5 },
  { size: 41, qty: 0 },
  { size: 42, qty: 2 },
  { size: 43, qty: 4 },
  { size: 44, qty: 0 },
  { size: 45, qty: 1 },
];

const REVIEWS = [
  { name: "Youssef B.", stars: 5, date: "2025-04-10", text: "Excellent quality! Very comfortable and stylish. Fits perfectly." },
  { name: "Ahmed K.",   stars: 4, date: "2025-03-28", text: "Great shoes, arrived quickly. The leather is premium quality." },
  { name: "Karim M.",  stars: 5, date: "2025-03-15", text: "Exactly as described. Will buy again from AL-FURQA store." },
];

const RELATED = [
  { id: 1, name: "Castorio Daily", cat: "Casual", ref: "7574", price: 380, promo: 0, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75" },
  { id: 2, name: "Velocity Pro",   cat: "Sport",  ref: "9231", price: 620, promo: 20, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=75" },
  { id: 3, name: "Executive Derby", cat: "Formal", ref: "4512", price: 850, promo: 0, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=75" },
  { id: 4, name: "Monaco Slide",   cat: "Casual", ref: "3301", price: 220, promo: 15, img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&q=75" },
];

/* ── Small related card ── */
function RelatedCard({ p }: { p: typeof RELATED[0] }) {
  const [hov, setHov] = useState(false);
  const final = (p.price * (1 - p.promo * 0.01)).toFixed(2);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: `1.5px solid ${hov ? "#0e92e4" : "#e5e7eb"}`,
      boxShadow: hov ? "0 16px 40px rgba(14,146,228,.13)" : "0 2px 10px rgba(0,0,0,.05)",
      transform: hov ? "translateY(-5px)" : "none",
      transition: "all .28s cubic-bezier(.22,1,.36,1)", cursor: "pointer",
    }}>
      <div style={{ position: "relative", paddingTop: "70%", overflow: "hidden", background: "#f3f4f6" }}>
        <img src={p.img} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .4s ease" }} />
        {p.promo > 0 && <span style={{ position: "absolute", top: 8, right: 8, background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3 }}><Zap size={9} fill="white" /> {p.promo}% OFF</span>}
      </div>
      <div style={{ padding: "12px 12px 14px" }}>
        <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>{p.cat} · {p.ref}</p>
        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#111827" }}>{p.name}</p>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#16a34a" }}>{final} MAD</span>
        {p.promo > 0 && <span style={{ marginLeft: 6, fontSize: 11, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>{p.price}.00</span>}
      </div>
    </div>
  );
}

/* ── Review modal ── */
function ReviewModal({ onClose }: { onClose: () => void }) {
  const [stars, setStars] = useState(0);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,.18)", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
            <MessageSquare size={18} color="#0e92e4" /> Add a Review
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#6b7280", fontSize: 18 }}><X size={18} /></button>
        </div>
        <hr style={{ borderColor: "#e5e7eb", margin: "0 0 16px" }} />
        {["Your Name", "Email Address"].map((lbl, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", marginBottom: 5 }}>{lbl}</label>
            <input style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", background: "#fafbfc", boxSizing: "border-box" }} placeholder={lbl} />
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", marginBottom: 5 }}>Rating</label>
          <div style={{ display: "flex", gap: 6 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setStars(n)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 28, color: n <= stars ? "#fbbf24" : "#e5e7eb", transition: "transform .15s ease", transform: "scale(1)" }}>★</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", marginBottom: 5 }}>Your Review</label>
          <textarea style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", background: "#fafbfc", minHeight: 90, resize: "vertical" as const, boxSizing: "border-box" as const }} maxLength={300} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ flex: 1, padding: 11, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,.3)" }}>Submit Review</button>
          <button onClick={onClose} style={{ padding: "11px 18px", background: "transparent", border: "1.5px solid #e5e7eb", borderRadius: 10, color: "#6b7280", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export function ProductDetail() {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const PRICE = 546; const PROMO = 35;
  const final = (PRICE * (1 - PROMO * 0.01)).toFixed(2);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav style={{ background: "#0e92e4", padding: "0 28px", boxShadow: "0 2px 16px rgba(14,146,228,.3)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,.3)" }}>
              <Footprints size={19} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>AL-FURQA STORE</span>
          </div>
          <div style={{ display: "flex", gap: 6, direction: "rtl" as const }}>
            {["الرئيسية","أحذية","صندال"].map((n,i) => (
              <a key={i} href="#" style={{ color: i===0?"#fff":"rgba(255,255,255,.75)", fontWeight: i===0?700:500, fontSize: 13, textDecoration: "none", padding: "6px 12px", borderRadius: 8, background: i===0?"rgba(255,255,255,.18)":"transparent" }}>{n}</a>
            ))}
          </div>
          <button style={{ background: "rgba(0,0,0,.65)", border: "1.5px solid transparent", borderRadius: 999, color: "#fff", padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <ShoppingCart size={15} />
            <span style={{ background: "#0e92e4", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,.2)" }}>2</span>
            السلة
          </button>
        </div>
      </nav>

      {/* ── Main layout card ── */}
      <div style={{ maxWidth: 1200, margin: "32px auto", padding: "32px", background: "#fff", borderRadius: 20, boxShadow: "0 4px 32px rgba(0,0,0,.07)", display: "flex", gap: 44, alignItems: "flex-start" }}>

        {/* Images column */}
        <div style={{ width: 460, flexShrink: 0, display: "flex", gap: 10 }}>

          {/* Thumbnail strip */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {IMAGES.map((src, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{
                width: 72, height: 72, borderRadius: 10, overflow: "hidden",
                border: `2.5px solid ${i === activeImg ? "#0e92e4" : "transparent"}`,
                opacity: i === activeImg ? 1 : 0.45, cursor: "pointer",
                transition: "all .25s ease", boxShadow: i === activeImg ? "0 0 0 2px rgba(14,146,228,.2)" : "none",
              }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div style={{ flex: 1, height: 460, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.1)", position: "relative", background: "#f3f4f6" }}>
            <img src={IMAGES[activeImg]} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "all .4s ease" }} />
            {/* Nav arrows */}
            {[ChevronLeft, ChevronRight].map((Icon, i) => (
              <button key={i} onClick={() => setActiveImg(a => i===0 ? Math.max(0,a-1) : Math.min(IMAGES.length-1,a+1))} style={{
                position: "absolute", top: "50%", [i===0?"left":"right"]: 10,
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,.32)", border: "none", borderRadius: "50%",
                width: 34, height: 34, color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}><Icon size={14} /></button>
            ))}
          </div>
        </div>

        {/* Info column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ background: "#0e92e4", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20 }}>Shoe</span>
            <span style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>REF: 8676</span>
          </div>

          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#111827", letterSpacing: "0.03em", textTransform: "uppercase" }}>HERMES PREMIUM</h1>
          <h2 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 500, color: "#6b7280", textTransform: "capitalize" }}>Oxford Classic Collection</h2>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 0 18px" }} />

          {/* Promo badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#fff0f0,#fff5f5)", color: "#ef4444", border: "1.5px solid #fecaca", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 20, marginBottom: 14 }}>
            <Zap size={12} /> -35% PROMOTION
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 26, flexWrap: "wrap" }}>
            <span style={{ fontSize: 34, fontWeight: 900, color: "#16a34a", letterSpacing: "-0.02em" }}>{final} MAD</span>
            <span style={{ fontSize: 16, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>{PRICE}.00 MAD</span>
          </div>

          {/* Sizes */}
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 10 }}>SELECT SIZE</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {SIZES.map((s, i) => {
              const oos = s.qty === 0;
              const sel = selectedSize === s.size;
              return (
                <button key={i} onClick={() => !oos && setSelectedSize(s.size)} style={{
                  minWidth: 46, height: 46, padding: "0 12px", borderRadius: 10,
                  border: `1.5px solid ${sel ? "#0e92e4" : oos ? "#e5e7eb" : "#e5e7eb"}`,
                  background: sel ? "#0e92e4" : oos ? "#fafafa" : "#fff",
                  color: sel ? "#fff" : oos ? "#d1d5db" : "#111827",
                  fontSize: 13, fontWeight: 700, cursor: oos ? "not-allowed" : "pointer",
                  textDecoration: oos ? "line-through" : "none",
                  boxShadow: sel ? "0 0 0 3px rgba(14,146,228,.2)" : "none",
                  transition: "all .18s ease",
                }}>{s.size}</button>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "15px 20px", background: "#111827", color: "#fff",
              border: "2px solid #111827", borderRadius: 12, fontSize: 14, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(17,24,39,.18)", transition: "all .22s ease",
            }}>
              <ShoppingCart size={17} /> ADD TO CART
            </button>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "15px 20px", background: "transparent", color: "#0e92e4",
              border: "2px solid #0e92e4", borderRadius: 12, fontSize: 14, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all .22s ease",
            }}>
              <Zap size={17} /> ORDER NOW
            </button>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "linear-gradient(135deg,#f0fdf4,#f5fffe)", border: "1.5px solid #bbf7d0", borderRadius: 10, fontSize: 13, color: "#166534", fontWeight: 700 }}>
            <Truck size={17} /> Free delivery within Casablanca · 2–4 business days
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 28px" }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb", padding: "24px 28px", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>

          <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "2px solid #e5e7eb" }}>
            <MessageSquare size={20} color="#0e92e4" /> Customer Reviews
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{REVIEWS.length} reviews</span>
          </h3>

          {(expanded ? REVIEWS : REVIEWS.slice(0, 2)).map((r, i) => (
            <div key={i} style={{ margin: "10px 0", padding: "16px 18px", background: "#f5f6fa", borderRadius: 14, border: "1.5px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#0e92e4,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>{r.name[0]}</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>{r.name}</span>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(j => <Star key={j} size={13} color={j<=r.stars?"#fbbf24":"#e5e7eb"} fill={j<=r.stars?"#fbbf24":"#e5e7eb"} />)}
                </div>
                <span style={{ color: "#9ca3af", fontSize: 12, marginLeft: "auto" }}>{new Date(r.date).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{r.text}</p>
            </div>
          ))}

          {REVIEWS.length > 2 && (
            <button onClick={() => setExpanded(e => !e)} style={{
              display: "flex", alignItems: "center", gap: 6, margin: "14px auto", padding: "8px 28px",
              border: "1.5px solid #0e92e4", color: "#0e92e4", background: "transparent",
              borderRadius: 40, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em",
              textTransform: "uppercase", cursor: "pointer",
            }}>
              {expanded ? "Show Less" : "Show All Reviews"} <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
          )}

          <button onClick={() => setShowModal(true)} style={{
            display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, padding: "10px 22px",
            background: "#0e92e4", color: "#fff", border: "none", borderRadius: 40,
            fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
            cursor: "pointer", boxShadow: "0 4px 14px rgba(14,146,228,.3)",
          }}>
            <Plus size={15} /> Write a Review
          </button>
        </div>
      </div>

      {/* ── Related products ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 22, fontWeight: 900, color: "#111827", letterSpacing: "-0.01em", margin: "16px 0 24px", position: "relative" }}>
          <span style={{ display: "inline-block", color: "#0e92e4", animation: "iconBL 1.6s ease-in-out infinite" }}><Footprints size={22} /></span>
          More Shoes You'll Love
          <span style={{ display: "inline-block", color: "#0e92e4", animation: "iconBR 1.6s ease-in-out infinite" }}><Footprints size={22} /></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {RELATED.map(p => <RelatedCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "#111827", padding: "36px 28px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 36 }}>
          <div>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "#0e92e4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Footprints size={26} color="#fff" />
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#fff" }}>AL FIRDAOUS STORE</p>
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", lineHeight: 1.6, maxWidth: 220 }}>Premium footwear crafted for comfort and style.</p>
          </div>
          {[
            { title: "Policies", links: ["Terms of Use", "Privacy Policy"] },
            { title: "Contact", links: ["+212 600 000 000", "alfirdaousstore@gmail.com"] },
          ].map((col, i) => (
            <div key={i}>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280" }}>{col.title}</p>
              {col.links.map((l, j) => <a key={j} href="#" style={{ display: "block", color: "#9ca3af", fontSize: 12, marginBottom: 7, textDecoration: "none" }}>{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#1f2937,transparent)", margin: "28px 0 0" }} />
          <p style={{ textAlign: "center", padding: "16px 0", fontSize: 11, color: "#6b7280" }}>© 2025 AL FIRDAOUS STORE. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes iconBL { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(-14deg)} }
        @keyframes iconBR { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(14deg)} }
      `}</style>

      {showModal && <ReviewModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
