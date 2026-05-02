import { useState } from "react";
import { Eye, ShoppingBag, ChevronLeft, ChevronRight, Zap } from "lucide-react";

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>

        {/* ── Section header ─────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 4,
                height: 40,
                borderRadius: 4,
                background: "linear-gradient(180deg, #f59e0b, #ef4444)",
              }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f59e0b" }}>
                New Collection
              </p>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                Men's Shoes
              </h2>
            </div>
          </div>

          {/* Nav arrows */}
          <div style={{ display: "flex", gap: 10 }}>
            {[{ fn: prev, disabled: offset === 0, icon: <ChevronLeft size={18} /> },
              { fn: next, disabled: offset >= maxOffset, icon: <ChevronRight size={18} /> }].map(({ fn, disabled, icon }, i) => (
              <button
                key={i}
                onClick={fn}
                disabled={disabled}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "1.5px solid",
                  borderColor: disabled ? "#333" : "#f59e0b",
                  background: disabled ? "transparent" : "rgba(245,158,11,0.1)",
                  color: disabled ? "#444" : "#f59e0b",
                  cursor: disabled ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards row ──────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {visible.map((product) => {
            const hovered = hoveredId === product.id;
            const finalPrice = (product.price * (1 - product.promo * 0.01)).toFixed(2);
            const hasPromo = product.promo > 0;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: hovered ? "#ffffff" : "#1c1c2e",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1.5px solid ${hovered ? "transparent" : "#2a2a3e"}`,
                  boxShadow: hovered
                    ? "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.3)"
                    : "0 4px 16px rgba(0,0,0,0.3)",
                  transform: hovered ? "translateY(-8px)" : "translateY(0)",
                  transition: "all 0.32s cubic-bezier(0.22,1,0.36,1)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", paddingTop: "75%", overflow: "hidden", background: "#111" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: hovered ? "scale(1.08)" : "scale(1)",
                      transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />

                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
                      opacity: hovered ? 0.3 : 0.6,
                      transition: "opacity 0.3s ease",
                    }}
                  />

                  {/* Promo badge */}
                  {hasPromo && (
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: 20,
                        boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Zap size={10} fill="currentColor" />
                      {product.promo}% OFF
                    </div>
                  )}

                  {/* Quick view on hover */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: "50%",
                      transform: `translateX(-50%) translateY(${hovered ? 0 : 16}px)`,
                      opacity: hovered ? 1 : 0,
                      transition: "all 0.25s ease",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "6px 16px",
                      borderRadius: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Eye size={12} /> Quick View
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 16px 0", flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: hovered ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    {product.category} · {product.ref}
                  </p>
                  <p
                    style={{
                      margin: "0 0 12px",
                      fontSize: 14,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      color: hovered ? "#111827" : "#e5e7eb",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.name}
                  </p>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: hovered ? "#059669" : "#34d399",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {finalPrice} MAD
                    </span>
                    {hasPromo && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                          color: hovered ? "#9ca3af" : "#6b7280",
                          textDecoration: "line-through",
                          textDecorationColor: "#ef4444",
                        }}
                      >
                        {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <button
                    style={{
                      width: "100%",
                      padding: "11px 0",
                      border: "none",
                      borderRadius: 10,
                      background: hovered
                        ? "linear-gradient(135deg, #111827, #1f2937)"
                        : "linear-gradient(135deg, #1e1b4b, #312e81)",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: hovered
                        ? "0 4px 14px rgba(0,0,0,0.25)"
                        : "0 2px 8px rgba(30,27,75,0.4)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ShoppingBag size={14} />
                    View Product
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Dots ───────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setOffset(i)}
              style={{
                width: i === offset ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === offset ? "#f59e0b" : "#333",
                cursor: "pointer",
                transition: "all 0.25s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* ── See all button ─────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <button
            style={{
              padding: "12px 36px",
              background: "transparent",
              border: "1.5px solid #f59e0b",
              color: "#f59e0b",
              borderRadius: 40,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b";
              (e.currentTarget as HTMLButtonElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
            }}
          >
            See All Men's Shoes →
          </button>
        </div>

      </div>
    </div>
  );
}
