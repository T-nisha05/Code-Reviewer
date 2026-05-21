import { useState, useRef, useEffect } from "react";

// ── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  play: "M5 3l14 9-14 9V3z",
  copy: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2M8 4h8",
  check: "M20 6L9 17l-5-5",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  bug: "M8 2l1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM16 14a4 4 0 0 1-8 0",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  loader:
    "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  x: "M18 6L6 18M6 6l12 12",
  down: "M6 9l6 6 6-6",
  info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4",
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C",
  "C#",
  "PHP",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Ruby",
  "HTML/CSS",
  "SQL",
  "Other",
];
const REVIEW_TYPES = [
  { id: "full", label: "Full Review", icon: "star", color: "#f59e0b" },
  { id: "bugs", label: "Bug Detection", icon: "bug", color: "#f87171" },
  { id: "security", label: "Security Audit", icon: "shield", color: "#34d399" },
  { id: "performance", label: "Performance", icon: "zap", color: "#60a5fa" },
];

const SAMPLE_CODE = `function fetchUserData(userId) {
  var query = "SELECT * FROM users WHERE id = " + userId;
  var result = db.execute(query);
  
  for(var i=0;i<result.length;i++){
    console.log(result[i])
  }
  
  var password = "admin123";
  return result
}`;

// ── SCORE RING ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 36,
    circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#f59e0b" : "#f87171";
  return (
    <div style={{ position: "relative", width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="7"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color,
            fontFamily: "monospace",
          }}
        >
          {score}
        </span>
        <span style={{ fontSize: 9, color: "#64748b", letterSpacing: 1 }}>
          SCORE
        </span>
      </div>
    </div>
  );
}

// ── ISSUE CARD ────────────────────────────────────────────────────────────────
function IssueCard({ item, accentColor }) {
  const [open, setOpen] = useState(false);
  const sevColor = { high: "#f87171", medium: "#fb923c", low: "#facc15" };
  const sev = item.severity || "medium";
  return (
    <div
      style={{
        border: `1px solid ${accentColor}22`,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
        background: `${accentColor}06`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1,
            padding: "2px 7px",
            borderRadius: 3,
            background: `${sevColor[sev]}22`,
            color: sevColor[sev],
            border: `1px solid ${sevColor[sev]}44`,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {sev}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 600,
            color: "#e2e8f0",
            fontFamily: "monospace",
          }}
        >
          {item.title}
        </span>
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            padding: "0 14px 14px",
            borderTop: `1px solid ${accentColor}15`,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#94a3b8",
              margin: "12px 0 8px",
              lineHeight: 1.6,
            }}
          >
            {item.description}
          </p>
          {item.fix && (
            <div
              style={{
                background: "#0d1117",
                borderRadius: 6,
                padding: "10px 12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#4ade80",
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                ✅ FIX
              </div>
              <code
                style={{
                  fontSize: 12,
                  color: "#a5f3fc",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {item.fix}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SECTION TAB ───────────────────────────────────────────────────────────────
function SectionTab({ label, icon, color, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 6,
        border: active ? `1px solid ${color}55` : "1px solid transparent",
        background: active ? `${color}12` : "transparent",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.2s",
      }}
    >
      <Icon d={ICONS[icon]} size={13} color={active ? color : "#64748b"} />
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: active ? color : "#64748b",
          fontFamily: "monospace",
        }}
      >
        {label}
      </span>
      {count > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 10,
            background: `${color}22`,
            color,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function AICodeReviewer() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState("JavaScript");
  const [reviewType, setReviewType] = useState("full");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("bugs");
  const [codeCopied, setCodeCopied] = useState(false);
  const lineCount = code.split("\n").length;

  const handleReview = async () => {
    if (!code.trim()) {
      setError("⚠️ Please paste some code to review.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      console.log("Frontend sending request...");

      const response = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          reviewType,
          apiKey,
        }),
      });

      console.log("Response received from backend");

      const data = await response.json();

      console.log(data);

      if (!data.success || !data.data) {
        throw new Error("Invalid response from backend");
      }

      const cleanText = data.data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedData = JSON.parse(cleanText);

      setResult({
        score: Number(parsedData.score) || 0,
        summary:
          parsedData.summary ||
          parsedData.overall_assessment?.summary ||
          "No summary available",

        bugs: parsedData.bugs || [],
        security: parsedData.security || [],
        performance: parsedData.performance || [],
        bestPractices: parsedData.bestPractices || [],
        improvedCode: parsedData.improvedCode || "",
      });

      const firstNonEmpty = [
        "bugs",
        "security",
        "performance",
        "bestPractices",
      ].find((k) => parsedData[k]?.length > 0);

      if (firstNonEmpty) {
        setActiveTab(firstNonEmpty);
      }
    } catch (e) {
      console.error(e);

      setError(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    const text = result ? JSON.stringify(result, null, 2) : "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyImprovedCode = () => {
    navigator.clipboard.writeText(result?.improvedCode || "").then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  const tabData = result
    ? [
        {
          key: "bugs",
          label: "Bugs",
          icon: "bug",
          color: "#f87171",
          items: result.bugs || [],
        },
        {
          key: "security",
          label: "Security",
          icon: "shield",
          color: "#34d399",
          items: result.security || [],
        },
        {
          key: "performance",
          label: "Performance",
          icon: "zap",
          color: "#60a5fa",
          items: result.performance || [],
        },
        {
          key: "bestPractices",
          label: "Best Practices",
          icon: "star",
          color: "#f59e0b",
          items: result.bestPractices || [],
        },
        {
          key: "improvedCode",
          label: "Fixed Code",
          icon: "code",
          color: "#a78bfa",
          items: [],
        },
      ]
    : [];

  const activeItems =
    activeTab === "improvedCode" ? [] : result?.[activeTab] || [];
  const activeColor =
    tabData.find((t) => t.key === activeTab)?.color || "#4ade80";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        background: "#050816",
        color: "#e2e8f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* ── ANIMATED BACKGROUND ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.025) 1px, transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.025) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse at top, rgba(74,222,128,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
          padding: "115px 70px 40px 120px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* ── NAVBAR ── */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 60px 0 120px",
            background: "rgba(5, 8, 22, 0.72)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "rgba(74,222,128,0.12)",
                  border: "1px solid rgba(74,222,128,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={ICONS.code} size={18} color="#4ade80" />
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: -0.5,
                    color: "#f1f5f9",
                  }}
                >
                  AI Code <span style={{ color: "#4ade80" }}>Reviewer</span>
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#94a3b8",
                    letterSpacing: 1,
                    fontWeight: 600,
                  }}
                >
                  POWERED BY GEMINI AI
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 6px #4ade80",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "#4ade80",
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {/* LEFT — Code Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Controls */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {/* Language */}
              <div style={{ flex: 1, minWidth: 120 }}>
                <label
                  style={{
                    fontSize: 11,
                    color: "#cbd5e1",
                    fontWeight: 600,
                    letterSpacing: 1,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  LANGUAGE
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 7,
                      padding: "8px 30px 8px 12px",
                      fontSize: 12,
                      color: "#e2e8f0",
                      appearance: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontFamily: "monospace",
                    }}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <Icon d={ICONS.down} size={12} color="#475569" />
                </div>
              </div>
              {/* Review Type */}
              <div style={{ flex: 1, minWidth: 140 }}>
                <label
                  style={{
                    fontSize: 11,
                    color: "#cbd5e1",
                    fontWeight: 600,
                    letterSpacing: 1,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  REVIEW TYPE
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={reviewType}
                    onChange={(e) => setReviewType(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 7,
                      padding: "8px 30px 8px 12px",
                      fontSize: 12,
                      color: "#e2e8f0",
                      appearance: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontFamily: "monospace",
                    }}
                  >
                    {REVIEW_TYPES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <Icon d={ICONS.down} size={12} color="#475569" />
                </div>
              </div>
            </div>

            {/* Editor */}
            <div
              style={{
                flex: 1,
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Editor Header */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ display: "flex", gap: 5 }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <div
                      key={c}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: c,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    marginLeft: 4,
                    fontWeight: 500,
                  }}
                >
                  {" "}
                  code.
                  {language
                    .toLowerCase()
                    .replace("/", "-")
                    .replace("+", "p")
                    .replace("#", "sharp")}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  {lineCount} lines
                </span>
                <button
                  onClick={() => setCode("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 2,
                    opacity: 0.5,
                  }}
                >
                  <Icon d={ICONS.trash} size={12} color="#94a3b8" />
                </button>
              </div>

              {/* Line Numbers + Textarea */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  background: "#0d1117",
                  minHeight: 320,
                }}
              >
                <div
                  style={{
                    padding: "14px 8px",
                    background: "rgba(0,0,0,0.3)",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    userSelect: "none",
                    minWidth: 36,
                    textAlign: "right",
                  }}
                >
                  {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 11,
                        color: "#334155",
                        lineHeight: "1.6rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your code here..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    padding: "14px 14px",
                    fontSize: 13,
                    color: "#cbd5e1",
                    fontFamily: "monospace",
                    lineHeight: "1.6rem",
                    minHeight: 320,
                  }}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Review Button */}
            <button
              onClick={handleReview}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                border: "none",
                background: loading
                  ? "rgba(74,222,128,0.08)"
                  : "linear-gradient(135deg, #16a34a, #4ade80)",
                color: loading ? "#4ade80" : "#0a0a0f",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: 1,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: loading ? "none" : "0 0 24px rgba(74,222,128,0.25)",
                transition: "all 0.2s",
                fontFamily: "monospace",
              }}
            >
              {loading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <path d={ICONS.loader} />
                  </svg>
                  ANALYZING WITH GEMINI...
                </>
              ) : (
                <>
                  <Icon d={ICONS.play} size={15} color="#0a0a0f" />
                  RUN CODE REVIEW
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.25)",
                  borderRadius: 8,
                  padding: "12px 14px",
                  fontSize: 12,
                  color: "#f87171",
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <Icon d={ICONS.x} size={14} color="#f87171" />
                {error}
              </div>
            )}
          </div>

          {/* RIGHT — Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!result && !loading && (
              <div
                style={{
                  flex: 1,
                  border: "1px dashed rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  minHeight: 400,
                  background: "rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon d={ICONS.eye} size={26} color="rgba(74,222,128,0.4)" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#cbd5e1",
                      marginBottom: 8,
                    }}
                  >
                    Waiting for Review
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      maxWidth: 260,
                      lineHeight: 1.7,
                    }}
                  >
                    Paste your code on the left and hit "Run Code Review"
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div
                style={{
                  flex: 1,
                  border: "1px solid rgba(74,222,128,0.15)",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  minHeight: 400,
                  background: "rgba(74,222,128,0.02)",
                }}
              >
                <div style={{ position: "relative", width: 64, height: 64 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid rgba(74,222,128,0.1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTopColor: "#4ade80",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 8,
                      borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTopColor: "rgba(74,222,128,0.4)",
                      animation: "spin 1.5s linear infinite reverse",
                    }}
                  />
                </div>
           {[
  "Reading your code...",
  "Identifying patterns...",
  "Generating feedback...",
].map((t, i) => (
  <div
    key={i}
    style={{
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.6px",
      color:
        i === 0
          ? "#4ade80"
          : "rgba(226,232,240,0.88)",
      opacity: i === 0 ? 1 : 0.78,
      padding: "2px 0",
      transition: "all 0.3s ease",
      textShadow:
        i === 0
          ? "0 0 10px rgba(74,222,128,0.35)"
          : "none",
    }}
  >
    {i === 0 && "● "}
    {t}
  </div>
))}
              </div>
            )}

            {result && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                }}
              >
                {/* Score + Summary */}
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    padding: "16px",
                    background: "rgba(0,0,0,0.2)",
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <ScoreRing score={result.score || 0} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#cbd5e1",
                        letterSpacing: 1.2,
                        marginBottom: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      REVIEW SUMMARY
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        color: "#dbe4ee",
                        lineHeight: 1.9,
                        fontWeight: 500,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {typeof result.summary === "string"
                        ? result.summary
                        : result.overall_assessment?.summary ||
                          "No summary available"}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        {
                          label: "Bugs",
                          val: result.bugs?.length || 0,
                          color: "#f87171",
                        },
                        {
                          label: "Security",
                          val: result.security?.length || 0,
                          color: "#34d399",
                        },
                        {
                          label: "Perf",
                          val: result.performance?.length || 0,
                          color: "#60a5fa",
                        },
                        {
                          label: "Tips",
                          val: result.bestPractices?.length || 0,
                          color: "#f59e0b",
                        },
                      ].map((b) => (
                        <div
                          key={b.label}
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: `${b.color}15`,
                            border: `1px solid ${b.color}30`,
                            color: b.color,
                          }}
                        >
                          {b.val} {b.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={copyResult}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 6,
                      padding: "6px 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Icon
                      d={copied ? ICONS.check : ICONS.copy}
                      size={13}
                      color={copied ? "#4ade80" : "#64748b"}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        color: copied ? "#4ade80" : "#64748b",
                      }}
                    >
                      {copied ? "Copied!" : "Export"}
                    </span>
                  </button>
                </div>

                {/* Tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    overflowX: "auto",
                    paddingBottom: 2,
                  }}
                >
                  {tabData.map((t) => (
                    <SectionTab
                      key={t.key}
                      label={t.label}
                      icon={t.icon}
                      color={t.color}
                      count={t.items.length}
                      active={activeTab === t.key}
                      onClick={() => setActiveTab(t.key)}
                    />
                  ))}
                </div>

                {/* Tab Content */}
                <div
                  style={{
                    flex: 1,
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 14px",
                      background: "rgba(255,255,255,0.02)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Icon
                      d={
                        ICONS[
                          tabData.find((t) => t.key === activeTab)?.icon ||
                            "star"
                        ]
                      }
                      size={13}
                      color={activeColor}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: activeColor,
                        letterSpacing: 1,
                      }}
                    >
                      {tabData
                        .find((t) => t.key === activeTab)
                        ?.label?.toUpperCase()}
                    </span>
                    {activeTab !== "improvedCode" && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 11,
                          color: "#94a3b8",
                          fontWeight: 500,
                        }}
                      >
                        {activeItems.length} issue
                        {activeItems.length !== 1 ? "s" : ""} found
                      </span>
                    )}
                    {activeTab === "improvedCode" && (
                      <button
                        onClick={copyImprovedCode}
                        style={{
                          marginLeft: "auto",
                          background: "none",
                          border: "1px solid rgba(167,139,250,0.3)",
                          borderRadius: 5,
                          padding: "3px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Icon
                          d={codeCopied ? ICONS.check : ICONS.copy}
                          size={11}
                          color={codeCopied ? "#4ade80" : "#a78bfa"}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            color: codeCopied ? "#4ade80" : "#a78bfa",
                          }}
                        >
                          {codeCopied ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: 12,
                      maxHeight: 340,
                    }}
                  >
                    {activeTab === "improvedCode" ? (
                      <pre
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#a5f3fc",
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                          lineHeight: 1.6,
                        }}
                      >
                        {result.improvedCode || "// No changes needed!"}
                      </pre>
                    ) : activeItems.length === 0 ? (
                      <div
                        style={{ textAlign: "center", padding: "40px 20px" }}
                      >
                        <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#4ade80",
                            fontWeight: 600,
                          }}
                        >
                          No issues found!
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#334155",
                            marginTop: 4,
                          }}
                        >
                          This section looks clean.
                        </div>
                      </div>
                    ) : (
                      activeItems.map((item, i) => (
                        <IssueCard
                          key={i}
                          item={item}
                          accentColor={activeColor}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 40,
            paddingBottom: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Intelligent Code Reviews for Modern Developers
        </div>

        <style>{`
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes pulse  { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
  select option { background: #0d1117; }
  input::placeholder { color: #1e293b; }
  textarea::placeholder { color: #1e293b; }

  @media (max-width: 700px) {
    div[style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
    }
  }

  body {
    margin: 0;
    padding: 0;
    background: #050816;
  }
`}</style>
      </div>
    </div>
  );
}
