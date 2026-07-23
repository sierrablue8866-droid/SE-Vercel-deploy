# Design System: Sierra Estates 3.0 Admin (Intelligence OS)
**Project ID:** `sierra-estates-admin-v3`

## 1. Visual Theme & Atmosphere
The visual identity of Sierra Estates Admin radiates an **Ageless Architectural Sophistication** with **Weightless Tech Spatiality**. It merges warm Egyptian sandstone mineral warmth (`#F8F6F2`) in Light Mode with deep Vantablack OLED depth (`#070E1A`) in Dark Mode. The interface feels uncrowded, dense with high-value telemetry, yet effortless to scan.

---

## 2. Color Palette & Roles

| Natural Language Description | Hex Code | Functional Role |
| :--- | :--- | :--- |
| **Sandstone Mineral Ivory** | `#F8F6F2` | Primary canvas background in Light Mode |
| **Pure Alabaster Surface** | `#FFFFFF` | Elevated card & modal container backgrounds |
| **Deep Vantablack OLED** | `#070E1A` | Primary canvas background in Dark Mode |
| **Midnight Navy Surface** | `#0B1626` | Card background in Dark Mode |
| **High-Contrast Slate Header** | `#0F172A` | Primary typography for headings, titles, & metrics |
| **Warm Sandstone Muted Slate** | `#475569` | Secondary metadata text & table column labels |
| **Royal Cairo Gold Accent** | `#C8961A` | High-value AI indicators, active state fills & badges |
| **Vivid Electric Sky Blue** | `#00AEFF` | Focus rings, key action buttons & real-time telemetry |
| **Emerald Signal Green** | `#10B981` | Online agent statuses, positive ROI & system health |
| **Crimson Alert Red** | `#EF4444` | High-priority escalation badges & deletion triggers |

---

## 3. Typography Rules
- **Primary Brand Font**: `Inter` / `Plus Jakarta Sans` — Clean, crisp, high-x-height sans-serif for UI controls and body data.
- **Data & Telemetry Font**: `JetBrains Mono` — Monospaced typography for monetary values (`EGP 25,000,000`), model scores (`AI 94`), and log timestamps.
- **Display Serif Accent**: `Cormorant Garamond` — Elegantly weighted serif for section titles and top-level executive headers.

---

## 4. Component Stylings

* **Buttons (`.btn-gold`, `.btn-slate`):**
  - Pill-shaped or rounded-lg with 8px/12px horizontal padding.
  - Interactive haptic physics: `transition: transform 200ms cubic-bezier(0.32, 0.72, 0, 1)`.
  - Active press effect: `active:scale-[0.97]`.
* **Cards & Containers (`.kpi-card`, `.card`):**
  - Subtly rounded corners (`border-radius: 16px`).
  - **Light Mode Elevation**: Soft ambient dual-layer clay shadow (`6px 6px 18px #e4dfd5, -6px -6px 18px #ffffff, inset 1px 1px 2px #ffffff`).
  - **Dark Mode Elevation**: Diffused glassmorphism glow (`0 20px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)`).
* **Inputs & Form Controls:**
  - Soft mineral stroke (`border: 1px solid rgba(15, 23, 42, 0.12)`).
  - Focused state ring: `outline: 2px solid #00AEFF; outline-offset: 2px`.

---

## 5. Layout Principles
- **Spatial Rhythm**: 16px base grid spacing with 24px/32px section paddings.
- **Sidebar Layout**: Collapsible 240px fixed left sidebar with instant micro-animation transitions.
- **Responsive Density**: Fluid grid auto-fit (`minmax(min(100%, 320px), 1fr)`).
