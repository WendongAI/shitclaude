import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CSSProperties } from "react";

const colors = {
  bg: "#f7f6f1",
  surface: "#fffefd",
  ink: "#1e1e1d",
  muted: "#77716c",
  line: "#e7e2dc",
  accent: "#dc775d",
  accentStrong: "#c94c3c",
  green: "#4d8f68",
  gold: "#9c8346",
};

const signals = [
  ["系统时区", "+30"],
  ["浏览器语言", "+17"],
  ["IP 定位", "+25"],
  ["中文字体", "+20"],
  ["GPU 渲染", "+8"],
  ["Intl 区域", "+10"],
  ["数字格式", "+5"],
  ["屏幕 DPI", "+3"],
];

const countries = ["中国", "新加坡", "日本", "韩国", "英国", "加拿大"];

export const ShitClaudePromo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const score = Math.round(interpolate(frame, [40, 145], [0, 85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const scanProgress = interpolate(frame, [105, 245], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const codexProgress = spring({ frame: frame - 280, fps, config: { damping: 18, stiffness: 120 } });
  const ctaProgress = spring({ frame: frame - 455, fps, config: { damping: 20, stiffness: 80 } });

  return (
    <AbsoluteFill style={styles.page}>
      <div style={styles.noise} />
      <Header />

      <section
        style={{
          ...styles.hero,
          transform: `translateY(${interpolate(intro, [0, 1], [70, 0])}px)`,
          opacity: intro,
        }}
      >
        <div style={styles.heroText}>
          <p style={styles.kicker}>ShitClaude.site</p>
          <h1 style={styles.title}>你会被封号吗？</h1>
          <p style={styles.subtitle}>14 维度 Claude / Codex 地区画像检测</p>
        </div>
        <div style={styles.badges}>
          <Badge label="纯本地扫描" />
          <Badge label="IP 交叉验证" />
          <Badge label="结果零上传" />
        </div>
      </section>

      <section style={styles.device}>
        <div style={styles.browserBar}>
          <span style={styles.dotRed} />
          <span style={styles.dotGold} />
          <span style={styles.dotGreen} />
          <span style={styles.url}>shitclaude.site/zh</span>
        </div>

        <div style={styles.panel}>
          <div style={styles.mascotWrap}>
            <Img
              src={staticFile("mascot/ceo-gun.png")}
              style={{
                ...styles.mascot,
                transform: `translateX(${interpolate(frame, [30, 100], [-34, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px) scale(${interpolate(frame, [30, 100], [0.92, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            />
          </div>
          <div style={styles.result}>
            <ScoreRing score={score} />
            <div style={styles.risk}>高风险</div>
            <div style={styles.verdict}>你绝对是「Claude 中国用户」</div>
            <div style={styles.button}>开始检测</div>
          </div>
          <div style={styles.signalArea}>
            <p style={styles.signalTitle}>命中的信号</p>
            <div style={styles.signalGrid}>
              {signals.slice(0, 6).map((signal, index) => (
                <SignalChip key={signal[0]} label={signal[0]} value={signal[1]} index={index} frame={frame} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          ...styles.scanLayer,
          opacity: interpolate(frame, [120, 155, 250, 280], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ ...styles.scanLine, height: `${scanProgress * 100}%` }} />
        <h2 style={styles.layerTitle}>不是看一个点，是交叉验证</h2>
        <div style={styles.checkGrid}>
          {signals.map((signal, index) => (
            <CheckCard key={signal[0]} label={signal[0]} index={index} frame={frame} />
          ))}
        </div>
      </section>

      <section
        style={{
          ...styles.codexLayer,
          opacity: interpolate(frame, [270, 310, 430, 455], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(codexProgress, [0, 1], [70, 0])}px)`,
        }}
      >
        <h2 style={styles.codexTitle}>Codex 也可以检测</h2>
        <p style={styles.codexSub}>同一套区域指纹，给 Claude 和 Codex 各自出风险画像。</p>
        <div style={styles.dualCards}>
          <ProductCard name="Claude" score="85" label="高风险" tone="hot" />
          <ProductCard name="Codex" score="78" label="可疑" tone="codex" />
        </div>
        <Terminal frame={frame} />
      </section>

      <section
        style={{
          ...styles.ctaLayer,
          opacity: ctaProgress,
          transform: `scale(${interpolate(ctaProgress, [0, 1], [0.94, 1])})`,
        }}
      >
        <p style={styles.finalKicker}>本地检测，结果不上传</p>
        <h2 style={styles.finalTitle}>上线前先测自己</h2>
        <div style={styles.finalUrl}>shitclaude.site</div>
        <div style={styles.countryRow}>
          {countries.map((country, index) => (
            <span key={country} style={{ ...styles.countryChip, opacity: interpolate(frame, [480 + index * 8, 500 + index * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              {country}
            </span>
          ))}
        </div>
      </section>
    </AbsoluteFill>
  );
};

const Header = () => (
  <div style={styles.header}>
    <div style={styles.brandMark}>✋</div>
    <div style={styles.brand}>ShitClaude</div>
    <div style={styles.lang}>中文</div>
  </div>
);

const Badge = ({ label }: { label: string }) => (
  <span style={styles.badge}>
    <i style={styles.badgeDot} />
    {label}
  </span>
);

const ScoreRing = ({ score }: { score: number }) => {
  return (
    <div
      style={{
        ...styles.scoreRing,
        background: `radial-gradient(circle at center, ${colors.surface} 0 57%, transparent 58%), conic-gradient(${colors.accentStrong} ${score}%, #ece9e2 0)`,
      }}
    >
      <strong style={styles.scoreNumber}>{score}</strong>
      <span style={styles.scoreTotal}>/ 100</span>
    </div>
  );
};

const SignalChip = ({ label, value, index, frame }: { label: string; value: string; index: number; frame: number }) => {
  const opacity = interpolate(frame, [130 + index * 8, 150 + index * 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ ...styles.signalChip, opacity, transform: `translateY(${(1 - opacity) * 16}px)` }}>
      {label} <strong>{value}</strong>
    </span>
  );
};

const CheckCard = ({ label, index, frame }: { label: string; index: number; frame: number }) => {
  const opacity = interpolate(frame, [150 + index * 7, 172 + index * 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ ...styles.checkCard, opacity, transform: `translateX(${(1 - opacity) * 30}px)` }}>
      <span style={styles.checkIcon}>✓</span>
      <span>{label}</span>
    </div>
  );
};

const ProductCard = ({ name, score, label, tone }: { name: string; score: string; label: string; tone: "hot" | "codex" }) => (
  <div style={styles.productCard}>
    <div style={styles.productTop}>
      <span style={styles.productName}>{name}</span>
      <span style={{ ...styles.productPill, color: tone === "hot" ? colors.accentStrong : "#2f6f72" }}>{label}</span>
    </div>
    <div style={styles.productScore}>{score}</div>
    <div style={styles.productBar}>
      <div style={{ ...styles.productFill, width: `${score}%`, background: tone === "hot" ? colors.accentStrong : "#2f8f92" }} />
    </div>
  </div>
);

const Terminal = ({ frame }: { frame: number }) => {
  const lines = [
    "$ scan --target claude",
    "timezone: Asia/Shanghai",
    "intl: zh-CN",
    "$ scan --target codex",
    "risk: suspicious region profile",
  ];
  return (
    <div style={styles.terminal}>
      {lines.map((line, index) => {
        const chars = Math.floor(interpolate(frame, [330 + index * 18, 350 + index * 18], [0, line.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }));
        return <div key={line} style={styles.terminalLine}>{line.slice(0, chars)}</div>;
      })}
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  page: {
    color: colors.ink,
    background: `linear-gradient(180deg, #faf9f5 0%, ${colors.bg} 46%, #f9f8f4 100%)`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    overflow: "hidden",
  },
  noise: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 20% 12%, rgba(255,255,255,.92), transparent 420px), radial-gradient(circle at 84% 72%, rgba(220,119,93,.10), transparent 480px)",
  },
  header: {
    position: "absolute",
    top: 42,
    left: 58,
    right: 58,
    height: 74,
    display: "flex",
    alignItems: "center",
    gap: 18,
    zIndex: 5,
  },
  brandMark: {
    width: 52,
    height: 52,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: colors.accent,
    color: "#fff",
    fontSize: 26,
  },
  brand: {
    fontSize: 36,
    fontWeight: 800,
  },
  lang: {
    marginLeft: "auto",
    padding: "12px 24px",
    borderRadius: 28,
    background: colors.accent,
    color: "#fff",
    fontSize: 24,
    fontWeight: 760,
  },
  hero: {
    position: "absolute",
    top: 164,
    left: 58,
    right: 58,
  },
  heroText: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  kicker: {
    margin: 0,
    color: colors.accentStrong,
    fontSize: 24,
    fontWeight: 800,
  },
  title: {
    margin: 0,
    fontSize: 96,
    lineHeight: 1.02,
    fontWeight: 880,
  },
  subtitle: {
    margin: 0,
    color: colors.muted,
    fontSize: 34,
    fontWeight: 600,
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 34,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 20px",
    border: `1px solid ${colors.line}`,
    borderRadius: 30,
    background: "rgba(255,255,255,.74)",
    color: "#595955",
    fontSize: 23,
    fontWeight: 700,
  },
  badgeDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: colors.green,
    boxShadow: "0 0 0 6px rgba(77,143,104,.1)",
  },
  device: {
    position: "absolute",
    left: 58,
    right: 58,
    top: 440,
    height: 980,
    borderRadius: 36,
    background: "rgba(255,255,255,.78)",
    border: `1px solid ${colors.line}`,
    boxShadow: "0 34px 80px rgba(68,57,44,.12)",
    overflow: "hidden",
  },
  browserBar: {
    height: 70,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 28px",
    borderBottom: `1px solid ${colors.line}`,
    background: "rgba(250,249,245,.78)",
  },
  dotRed: { width: 14, height: 14, borderRadius: "50%", background: "#e36857" },
  dotGold: { width: 14, height: 14, borderRadius: "50%", background: "#dfb54d" },
  dotGreen: { width: 14, height: 14, borderRadius: "50%", background: "#63ad76" },
  url: {
    marginLeft: 18,
    color: colors.muted,
    fontSize: 21,
    fontWeight: 650,
  },
  panel: {
    display: "grid",
    gridTemplateColumns: "0.84fr 1.16fr",
    gridTemplateRows: "1fr auto",
    gap: 20,
    padding: "52px 56px 42px",
    height: 910,
  },
  mascotWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: 355,
    filter: "drop-shadow(0 24px 24px rgba(72,55,34,.12))",
  },
  result: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  scoreRing: {
    width: 330,
    height: 330,
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 118,
    lineHeight: 0.85,
    fontWeight: 900,
  },
  scoreTotal: {
    marginTop: 16,
    color: "#87827d",
    fontFamily: '"SF Mono", Consolas, monospace',
    fontSize: 31,
    fontStyle: "italic",
    fontWeight: 800,
  },
  risk: {
    padding: "14px 38px",
    border: "1px solid rgba(201,76,60,.22)",
    borderRadius: 34,
    background: "#fff2f0",
    color: colors.accentStrong,
    fontSize: 34,
    fontWeight: 800,
  },
  verdict: {
    color: "#66615f",
    fontSize: 31,
    fontWeight: 720,
    textAlign: "center",
  },
  button: {
    padding: "23px 58px",
    borderRadius: 54,
    background: colors.accent,
    color: "#fff8f4",
    fontSize: 34,
    fontWeight: 800,
    boxShadow: "0 18px 34px rgba(220,119,93,.28), 0 4px 0 rgba(181,78,56,.4)",
  },
  signalArea: {
    gridColumn: "1 / -1",
    textAlign: "center",
  },
  signalTitle: {
    margin: "0 0 20px",
    color: "#615d59",
    fontSize: 23,
    fontWeight: 700,
  },
  signalGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 13,
  },
  signalChip: {
    padding: "13px 18px",
    borderRadius: 28,
    border: "1px solid rgba(201,76,60,.24)",
    background: "#fff6f4",
    color: "#a74b4a",
    fontSize: 21,
    fontWeight: 760,
  },
  scanLayer: {
    position: "absolute",
    left: 58,
    right: 58,
    top: 520,
    height: 820,
    padding: 48,
    borderRadius: 36,
    background: "rgba(30,30,29,.92)",
    color: "#fff",
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 8,
    background: colors.accent,
  },
  layerTitle: {
    margin: "0 0 34px",
    fontSize: 54,
    lineHeight: 1.08,
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
  },
  checkCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "22px 24px",
    borderRadius: 20,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.16)",
    fontSize: 27,
    fontWeight: 760,
  },
  checkIcon: {
    display: "grid",
    placeItems: "center",
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: colors.green,
    fontSize: 22,
  },
  codexLayer: {
    position: "absolute",
    left: 58,
    right: 58,
    top: 488,
    minHeight: 900,
    padding: 54,
    borderRadius: 38,
    background: colors.surface,
    border: `1px solid ${colors.line}`,
    boxShadow: "0 34px 80px rgba(68,57,44,.12)",
  },
  codexTitle: {
    margin: 0,
    fontSize: 72,
    lineHeight: 1.02,
    fontWeight: 880,
  },
  codexSub: {
    width: 760,
    margin: "18px 0 38px",
    color: colors.muted,
    fontSize: 30,
    lineHeight: 1.32,
    fontWeight: 620,
  },
  dualCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 22,
  },
  productCard: {
    padding: 28,
    borderRadius: 28,
    background: "#fbf7f3",
    border: `1px solid ${colors.line}`,
  },
  productTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 32,
    fontWeight: 850,
  },
  productPill: {
    padding: "8px 15px",
    borderRadius: 18,
    background: "#fff",
    fontSize: 19,
    fontWeight: 800,
  },
  productScore: {
    marginTop: 26,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 96,
    lineHeight: 1,
    fontWeight: 900,
  },
  productBar: {
    height: 16,
    borderRadius: 10,
    background: "#e8e2da",
    overflow: "hidden",
  },
  productFill: {
    height: "100%",
    borderRadius: 10,
  },
  terminal: {
    marginTop: 28,
    minHeight: 200,
    padding: 28,
    borderRadius: 24,
    background: "#1f1f1d",
    color: "#f7f6f1",
    fontFamily: '"SF Mono", Consolas, monospace',
    fontSize: 24,
    lineHeight: 1.55,
  },
  terminalLine: {
    minHeight: 37,
  },
  ctaLayer: {
    position: "absolute",
    left: 58,
    right: 58,
    top: 440,
    height: 980,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 42,
    background: colors.ink,
    color: "#fff",
    boxShadow: "0 36px 90px rgba(30,30,29,.25)",
  },
  finalKicker: {
    margin: 0,
    color: "#f4b5a5",
    fontSize: 28,
    fontWeight: 800,
  },
  finalTitle: {
    margin: "24px 0 28px",
    fontSize: 88,
    lineHeight: 1.05,
    fontWeight: 900,
    textAlign: "center",
  },
  finalUrl: {
    padding: "24px 44px",
    borderRadius: 42,
    background: colors.accent,
    color: "#fff8f4",
    fontSize: 42,
    fontWeight: 860,
  },
  countryRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    width: 760,
    marginTop: 42,
  },
  countryChip: {
    padding: "12px 20px",
    borderRadius: 28,
    background: "rgba(255,255,255,.10)",
    border: "1px solid rgba(255,255,255,.16)",
    color: "#f7f6f1",
    fontSize: 23,
    fontWeight: 760,
  },
};
