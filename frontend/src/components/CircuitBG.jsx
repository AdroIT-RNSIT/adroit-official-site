/**
 * CircuitBG.jsx — PCB/circuit-board SVG background
 * Pure SVG, fixed-position, responsive (preserveAspectRatio slice).
 * Colors driven entirely by CSS variables — no JS re-render on theme change.
 */
const CX = 720, CY = 450;

function pt(r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [+(CX + r * Math.cos(rad)).toFixed(2), +(CY + r * Math.sin(rad)).toFixed(2)];
}

// Clockwise arc from startDeg to endDeg around center (CX,CY) at radius r
function arc(r, startDeg, endDeg) {
  const [x1, y1] = pt(r, startDeg);
  const [x2, y2] = pt(r, endDeg);
  let span = endDeg - startDeg;
  if (span <= 0) span += 360;
  const large = span > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

// Polyline path from array of [x,y] points
function poly(pts) {
  return "M " + pts.map((p) => p.join(",")).join(" L ");
}

export default function CircuitBG() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="circuit-bg pointer-events-none select-none"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    >
      <defs>
        {/* Glow filter — activated via CSS in dark mode */}
        <filter id="circuit-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Vignette mask — fades circuit to nothing at edges */}
        <radialGradient id="vfade" cx="50%" cy="50%" r="55%">
          <stop offset="15%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="vm">
          <rect width="1440" height="900" fill="url(#vfade)" />
        </mask>
      </defs>

      {/* Everything masked + (optionally) glowed via CSS */}
      <g mask="url(#vm)" className="circuit-group">

        {/* ═══════════════════════════════════════════
            CONCENTRIC RINGS
        ═══════════════════════════════════════════ */}

        {/* Center solid dot */}
        <circle cx={CX} cy={CY} r="5" className="circuit-dot-fill" />

        {/* Ring r=42 — tiny dashed orbit */}
        <circle cx={CX} cy={CY} r="42" className="circuit-main" strokeDasharray="4 5" />

        {/* Ring r=72 — 4 arcs at diagonal corners (NE/SE/SW/NW), 65° each */}
        <path d={arc(72, 282, 347)} className="circuit-main" strokeWidth="1.5" />
        <path d={arc(72, 12, 77)}   className="circuit-main" strokeWidth="1.5" />
        <path d={arc(72, 102, 167)} className="circuit-main" strokeWidth="1.5" />
        <path d={arc(72, 192, 257)} className="circuit-main" strokeWidth="1.5" />

        {/* Cardinal tick marks on ring 72 */}
        {[0, 90, 180, 270].map((a) => {
          const [x1, y1] = pt(63, a);
          const [x2, y2] = pt(81, a);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className="circuit-main" strokeWidth="1.5" />;
        })}

        {/* Ring r=140 — 4 arcs at diagonal corners, 75° each */}
        <path d={arc(140, 278, 353)} className="circuit-main" strokeWidth="1" />
        <path d={arc(140, 7, 82)}    className="circuit-main" strokeWidth="1" />
        <path d={arc(140, 97, 172)}  className="circuit-main" strokeWidth="1" />
        <path d={arc(140, 187, 262)} className="circuit-main" strokeWidth="1" />

        {/* Small tick marks on ring 140 at every 30° */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a) => {
          const [x1, y1] = pt(133, a);
          const [x2, y2] = pt(147, a);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className="circuit-main" strokeWidth="1" />;
        })}

        {/* Dashed ring r=165 */}
        <circle cx={CX} cy={CY} r="165" className="circuit-faint" strokeDasharray="6 8" />

        {/* Ring r=230 — 4 main arcs at N/E/S/W (85° each) */}
        <path d={arc(230, 318, 43)}  className="circuit-main" strokeWidth="1" />
        <path d={arc(230, 48, 133)}  className="circuit-main" strokeWidth="1" />
        <path d={arc(230, 138, 222)} className="circuit-main" strokeWidth="1" />
        <path d={arc(230, 228, 312)} className="circuit-main" strokeWidth="1" />

        {/* Corner notch ticks on ring 230 at 45°/135°/225°/315° */}
        {[45, 135, 225, 315].map((a) => {
          const [x1, y1] = pt(220, a);
          const [x2, y2] = pt(240, a);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className="circuit-accent" strokeWidth="2" />;
        })}

        {/* Dashed inner orbit at r=250 */}
        <circle cx={CX} cy={CY} r="250" className="circuit-faint" strokeDasharray="3 6" />

        {/* Ring r=330 — 4 arcs at N/E/S/W (100° each) */}
        <path d={arc(330, 310, 50)}  className="circuit-secondary" strokeWidth="1" />
        <path d={arc(330, 40, 140)}  className="circuit-secondary" strokeWidth="1" />
        <path d={arc(330, 130, 230)} className="circuit-secondary" strokeWidth="1" />
        <path d={arc(330, 220, 320)} className="circuit-secondary" strokeWidth="1" />

        {/* Dashed ring r=355 */}
        <circle cx={CX} cy={CY} r="355" className="circuit-faint" strokeDasharray="5 9" />

        {/* Ring r=440 — 4 arcs at diagonal corners (110° each) */}
        <path d={arc(440, 260, 370)}  className="circuit-faint" strokeWidth="1" />
        <path d={arc(440, 350, 100)}  className="circuit-faint" strokeWidth="1" />
        <path d={arc(440, 80, 190)}   className="circuit-faint" strokeWidth="1" />
        <path d={arc(440, 170, 280)}  className="circuit-faint" strokeWidth="1" />

        {/* Outer ring r=570 — 2 sweeping arcs */}
        <path d={arc(570, 195, 345)} className="circuit-outer" strokeWidth="0.75" />
        <path d={arc(570, 15, 165)}  className="circuit-outer" strokeWidth="0.75" />

        {/* ═══════════════════════════════════════════
            CIRCUIT TRACES (with L-bend routing)
        ═══════════════════════════════════════════ */}

        {/* ── RIGHT SIDE ── */}
        {/* Main right arm */}
        <path d={poly([[860,450],[1050,450],[1050,280],[1300,280],[1440,280]])} className="circuit-main" strokeWidth="1" />
        {/* Branch up to top edge */}
        <path d={poly([[1200,280],[1200,100],[1440,100]])} className="circuit-secondary" strokeWidth="1" />
        {/* Lower right arm */}
        <path d={poly([[1050,450],[1050,620],[1300,620],[1440,620]])} className="circuit-main" strokeWidth="1" />
        {/* Branch down */}
        <path d={poly([[1200,620],[1200,800],[1440,800]])} className="circuit-secondary" strokeWidth="1" />
        {/* Direct horizontal */}
        <path d={poly([[950,450],[1160,450],[1440,450]])} className="circuit-faint" strokeWidth="0.75" />
        {/* NE diagonal connect (r330 NE) */}
        <path d={poly([[953,217],[1100,217],[1440,217]])} className="circuit-secondary" strokeWidth="1" />
        <path d={poly([[1100,217],[1100,280]])} className="circuit-secondary" strokeWidth="1" />
        {/* SE diagonal connect */}
        <path d={poly([[953,683],[1100,683],[1440,683]])} className="circuit-secondary" strokeWidth="1" />
        <path d={poly([[1100,683],[1100,620]])} className="circuit-secondary" strokeWidth="1" />
        {/* Secondary right horizontals */}
        <path d={poly([[950,450],[950,330],[1150,330],[1440,330]])} className="circuit-faint" strokeWidth="0.75" />
        <path d={poly([[950,450],[950,570],[1150,570],[1440,570]])} className="circuit-faint" strokeWidth="0.75" />

        {/* ── LEFT SIDE ── */}
        {/* Main left arm */}
        <path d={poly([[580,450],[390,450],[390,270],[140,270],[0,270]])} className="circuit-main" strokeWidth="1" />
        {/* Branch up to edge */}
        <path d={poly([[240,270],[240,100],[0,100]])} className="circuit-secondary" strokeWidth="1" />
        {/* Lower left arm */}
        <path d={poly([[390,450],[390,630],[140,630],[0,630]])} className="circuit-main" strokeWidth="1" />
        {/* Branch down */}
        <path d={poly([[240,630],[240,800],[0,800]])} className="circuit-secondary" strokeWidth="1" />
        {/* Direct horizontal */}
        <path d={poly([[490,450],[280,450],[0,450]])} className="circuit-faint" strokeWidth="0.75" />
        {/* NW diagonal connect (r330 NW) */}
        <path d={poly([[487,217],[340,217],[0,217]])} className="circuit-secondary" strokeWidth="1" />
        <path d={poly([[340,217],[340,270]])} className="circuit-secondary" strokeWidth="1" />
        {/* SW diagonal connect */}
        <path d={poly([[487,683],[340,683],[0,683]])} className="circuit-secondary" strokeWidth="1" />
        <path d={poly([[340,683],[340,630]])} className="circuit-secondary" strokeWidth="1" />
        {/* Secondary left horizontals */}
        <path d={poly([[490,450],[490,330],[290,330],[0,330]])} className="circuit-faint" strokeWidth="0.75" />
        <path d={poly([[490,450],[490,570],[290,570],[0,570]])} className="circuit-faint" strokeWidth="0.75" />

        {/* ── TOP SIDE ── */}
        {/* Main vertical up */}
        <path d={poly([[720,310],[720,180],[520,180],[520,0]])} className="circuit-main" strokeWidth="1" />
        <path d={poly([[720,180],[900,180],[900,0]])} className="circuit-main" strokeWidth="1" />
        {/* Secondary branches */}
        <path d={poly([[520,180],[380,180],[380,0]])} className="circuit-secondary" strokeWidth="1" />
        <path d={poly([[900,180],[1040,180],[1040,0]])} className="circuit-secondary" strokeWidth="1" />
        {/* Direct center vertical */}
        <path d={poly([[720,120],[720,0]])} className="circuit-faint" strokeWidth="0.75" />
        {/* NE outer corner (r440 NE) */}
        <path d={poly([[1031,139],[1200,139],[1200,100]])} className="circuit-faint" strokeWidth="0.75" />
        {/* NW outer corner */}
        <path d={poly([[409,139],[240,139],[240,100]])} className="circuit-faint" strokeWidth="0.75" />

        {/* ── BOTTOM SIDE ── */}
        {/* Main vertical down */}
        <path d={poly([[720,590],[720,720],[520,720],[520,900]])} className="circuit-main" strokeWidth="1" />
        <path d={poly([[720,720],[900,720],[900,900]])} className="circuit-main" strokeWidth="1" />
        {/* Secondary branches */}
        <path d={poly([[520,720],[380,720],[380,900]])} className="circuit-secondary" strokeWidth="1" />
        <path d={poly([[900,720],[1040,720],[1040,900]])} className="circuit-secondary" strokeWidth="1" />
        {/* Direct center */}
        <path d={poly([[720,780],[720,900]])} className="circuit-faint" strokeWidth="0.75" />
        {/* SE outer corner */}
        <path d={poly([[1031,761],[1200,761],[1200,800]])} className="circuit-faint" strokeWidth="0.75" />
        {/* SW outer corner */}
        <path d={poly([[409,761],[240,761],[240,800]])} className="circuit-faint" strokeWidth="0.75" />

        {/* ── SHORT DIAGONAL CONNECTORS (from r=230 corners to traces) ── */}
        <path d={poly([[883,287],[1050,287],[1050,280]])} className="circuit-faint" strokeWidth="0.75" />
        <path d={poly([[557,287],[390,287],[390,270]])} className="circuit-faint" strokeWidth="0.75" />
        <path d={poly([[883,613],[1050,613],[1050,620]])} className="circuit-faint" strokeWidth="0.75" />
        <path d={poly([[557,613],[390,613],[390,630]])} className="circuit-faint" strokeWidth="0.75" />

        {/* ═══════════════════════════════════════════
            NODE PADS (dots at junctions)
        ═══════════════════════════════════════════ */}

        {/* Ring junction nodes */}
        {[0,90,180,270].map((a) => {
          const [x, y] = pt(72, a);
          return <circle key={`r72-${a}`} cx={x} cy={y} r="3" className="circuit-dot-fill" />;
        })}
        {[0,90,180,270].map((a) => {
          const [x, y] = pt(140, a);
          return <circle key={`r140-${a}`} cx={x} cy={y} r="3.5" className="circuit-dot-fill" />;
        })}
        {[45,135,225,315].map((a) => {
          const [x, y] = pt(230, a);
          return <circle key={`r230d-${a}`} cx={x} cy={y} r="4" className="circuit-dot-accent" />;
        })}
        {[0,90,180,270].map((a) => {
          const [x, y] = pt(230, a);
          return <circle key={`r230-${a}`} cx={x} cy={y} r="3" className="circuit-dot-fill" />;
        })}

        {/* Right side nodes */}
        {[[860,450],[950,450],[1050,450],[1160,450],
          [1050,280],[1300,280],[1200,280],[1200,100],
          [1050,620],[1300,620],[1200,620],[1200,800],
          [953,217],[1100,217],[953,683],[1100,683],
          [1031,139],[1200,139]
        ].map(([x,y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="3" className="circuit-dot-fill" />)}

        {/* Left side nodes */}
        {[[580,450],[490,450],[390,450],[280,450],
          [390,270],[240,270],[140,270],[240,100],
          [390,630],[240,630],[140,630],[240,800],
          [487,217],[340,217],[487,683],[340,683],
          [409,139],[240,139]
        ].map(([x,y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="3" className="circuit-dot-fill" />)}

        {/* Top side nodes */}
        {[[720,310],[720,220],[720,180],[720,120],
          [520,180],[900,180],[380,180],[1040,180]
        ].map(([x,y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="3" className="circuit-dot-fill" />)}

        {/* Bottom side nodes */}
        {[[720,590],[720,680],[720,720],[720,780],
          [520,720],[900,720],[380,720],[1040,720]
        ].map(([x,y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="3" className="circuit-dot-fill" />)}

        {/* Diagonal connector nodes */}
        {[[883,287],[557,287],[883,613],[557,613],
          [1031,761],[409,761]
        ].map(([x,y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="2.5" className="circuit-dot-fill" />)}

        {/* Large accent nodes at ring intersections */}
        {[[860,450],[580,450],[720,310],[720,590]].map(([x,y]) =>
          <circle key={`accent-${x},${y}`} cx={x} cy={y} r="5" className="circuit-dot-accent" />
        )}

      </g>
    </svg>
  );
}
