import { useState } from "react";
import { ShoppingBag, Eye, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: 1,
    category: "Classic Men",
    ref: "8676",
    name: "HERMES Premium Oxford",
    price: 546.00,
    promo: 35,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
  },
  {
    id: 2,
    category: "Casual",
    ref: "7574",
    name: "Castorio Daily Sneaker",
    price: 380.00,
    promo: 0,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    id: 3,
    category: "Sport",
    ref: "9231",
    name: "Velocity Pro Runner",
    price: 620.00,
    promo: 20,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  },
  {
    id: 4,
    category: "Formal",
    ref: "4512",
    name: "Executive Derby Lace",
    price: 850.00,
    promo: 0,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
  },
  {
    id: 5,
    category: "Premium",
    ref: "3301",
    name: "Monte Carlo Loafer",
    price: 720.00,
    promo: 15,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    id: 6,
    category: "Classic",
    ref: "2209",
    name: "Atelier Brogue Wing",
    price: 490.00,
    promo: 0,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  },
];

const VISIBLE = 4;

export function ProductCarousel() {
  const [offset, setOffset] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const maxOffset = products.length - VISIBLE;
  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));
  const visible = products.slice(offset, offset + VISIBLE);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f6fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 1200 }}>

        {/* ── Section header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 4, height: 40, borderRadius: 4, background: "linear-gradient(180deg,#0d6efd,#0a58ca)" }} />
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0d6efd" }}>
                New Collection
              </p>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                Men's Shoes
              </h2>
            </div>
          </div>

          {/* Nav arrows */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { fn: prev, disabled: offset === 0, icon: <ChevronLeft size={18}/> },
              { fn: next, disabled: offset >= maxOffset, icon: <ChevronRight size={18}/> },
            ].map(({ fn, disabled, icon }, i) => (
              <button key={i} onClick={fn} disabled={disabled} style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `1.5px solid ${disabled ? "#d1d5db" : "#0d6efd"}`,
                background: disabled ? "transparent" : "rgba(13,110,253,0.07)",
                color: disabled ? "#d1d5db" : "#0d6efd",
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {visible.map((product) => {
            const hovered = hoveredId === product.id;
            const finalPrice = (product.price * (1 - product.promo * 0.01)).toFixed(2);
            const hasPromo = product.promo > 0;

            return (
              <div key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: "#ffffff",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: `1.5px solid ${hovered ? "#0d6efd" : "#e5e7eb"}`,
                  boxShadow: hovered
                    ? "0 16px 40px rgba(13,110,253,0.15)"
                    : "0 2px 12px rgba(0,0,0,0.06)",
                  transform: hovered ? "translateY(-6px)" : "translateY(0)",
                  transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}>

                {/* Image */}
                <div style={{ position: "relative", paddingTop: "72%", overflow: "hidden", background: "#f3f4f6" }}>
                  <img src={product.image} alt={product.name} style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover",
                    transform: hovered ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                  }} />

                  {/* Overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 55%)",
                    opacity: hovered ? 0.5 : 0.7,
                    transition: "opacity 0.3s",
                    pointerEvents: "none",
                  }} />

                  {/* Promo badge */}
                  {hasPromo && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      background: "linear-gradient(135deg,#ef4444,#dc2626)",
                      color: "#fff", fontSize: 10, fontWeight: 800,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      padding: "3px 9px", borderRadius: 20,
                      boxShadow: "0 2px 6px rgba(239,68,68,0.45)",
                      display: "flex", alignItems: "center", gap: 3,
                    }}>
                      <Zap size={9} fill="currentColor"/>
                      {product.promo}% OFF
                    </div>
                  )}

                  {/* Quick view */}
                  <div style={{
                    position: "absolute", bottom: 10, left: "50%",
                    transform: `translateX(-50%) translateY(${hovered ? 0 : 12}px)`,
                    opacity: hovered ? 1 : 0,
                    transition: "all 0.22s ease",
                    background: "rgba(255,255,255,0.9)",
                    color: "#111827", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    padding: "5px 14px", borderRadius: 20,
                    display: "flex", alignItems: "center", gap: 5,
                    whiteSpace: "nowrap", pointerEvents: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}>
                    <Eye size={11}/> Quick View
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "14px 14px 0", flex: 1 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
                    {product.category} · {product.ref}
                  </p>
                  <p style={{
                    margin: "0 0 10px", fontSize: 13, fontWeight: 700,
                    lineHeight: 1.35, color: "#111827",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {product.name}
                  </p>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.02em" }}>
                      {finalPrice} MAD
                    </span>
                    {hasPromo && (
                      <span style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>
                        {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: "12px 14px 14px" }}>
                  <button style={{
                    width: "100%", padding: "10px 0",
                    border: "none", borderRadius: 8,
                    background: hovered ? "#0d6efd" : "#111827",
                    color: "#ffffff", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    transition: "background 0.2s ease",
                  }}>
                    <ShoppingBag size={13}/>
                    View Product
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28 }}>
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button key={i} onClick={() => setOffset(i)} style={{
              width: i === offset ? 22 : 8, height: 8,
              borderRadius: 4, border: "none",
              background: i === offset ? "#0d6efd" : "#d1d5db",
              cursor: "pointer", transition: "all 0.25s ease", padding: 0,
            }} />
          ))}
        </div>

        {/* See all */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button style={{
            padding: "11px 32px",
            background: "transparent",
            border: "1.5px solid #0d6efd",
            color: "#0d6efd", borderRadius: 40,
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="#0d6efd"; (e.currentTarget as HTMLButtonElement).style.color="#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; (e.currentTarget as HTMLButtonElement).style.color="#0d6efd"; }}>
            See All Men's Shoes →
          </button>
        </div>

      </div>
    </div>
  );
}
