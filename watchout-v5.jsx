import { useState } from "react";

const T = {
  bg: "#FAFAFA", card: "#FFFFFF", text: "#1A1A1A", sub: "#8E8E93",
  border: "#F0F0F0", accent: "#0A84FF", green: "#34C759", red: "#FF3B30",
  orange: "#FF9500", tag: "#F2F2F7",
};

const I = {
  home: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>,
  chart: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18M7 16l4-4 4 4 6-6"/></svg>,
  shop: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>,
  user: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  sell: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  bell: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  search: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  arrow: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>,
  up: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#34C759" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>,
  down: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#FF3B30" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>,
  close: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>,
  back: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>,
  camera: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>,
  check: <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#34C759" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  truck: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>,
  plus: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>,
  chevDown: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg>,
  chevUp: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 15l7-7 7 7"/></svg>,
};

function Spark({ data, w = 50, h = 20, color = T.green }) {
  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / r) * (h - 4) - 2}`).join(" ");
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const WATCHES = [
  { id: 1, brand: "Rolex", model: "Submariner", ref: "126610LN", price: 13200000, change: 2.3, img: "🖤", history: [12500000, 12800000, 13000000, 12900000, 13100000, 13200000] },
  { id: 2, brand: "Rolex", model: "Daytona", ref: "116500LN", price: 32500000, change: -1.1, img: "⬜", history: [33200000, 33000000, 32800000, 32600000, 32700000, 32500000] },
  { id: 3, brand: "Rolex", model: "GMT-Master II", ref: "126710BLNR", price: 19800000, change: 0.8, img: "🔵", history: [19200000, 19400000, 19500000, 19600000, 19700000, 19800000] },
  { id: 4, brand: "Omega", model: "Speedmaster", ref: "310.30.42", price: 5800000, change: -0.5, img: "⚫", history: [5900000, 5850000, 5900000, 5850000, 5820000, 5800000] },
  { id: 5, brand: "AP", model: "Royal Oak", ref: "15500ST", price: 38500000, change: 3.1, img: "🔷", history: [36500000, 37000000, 37500000, 37800000, 38200000, 38500000] },
  { id: 6, brand: "Rolex", model: "Datejust", ref: "126334", price: 11500000, change: 1.5, img: "💎", history: [11000000, 11100000, 11200000, 11300000, 11400000, 11500000] },
];
const COLLECTION = [
  { ...WATCHES[0], purchasePrice: 12000000, date: "2023.06" },
  { ...WATCHES[3], purchasePrice: 5500000, date: "2022.11" },
  { ...WATCHES[5], purchasePrice: 10800000, date: "2024.01" },
];
const NEWS = [
  { id: 1, title: "롤렉스 2025 신작 미리보기: Watches & Wonders", source: "Hodinkee", time: "2시간 전" },
  { id: 2, title: "오데마 피게, 로열오크 50주년 한정판 추가 발매", source: "바이버 매거진", time: "5시간 전" },
  { id: 3, title: "중고 시계 시장 2025년 전망 리포트", source: "WatchCharts", time: "1일 전" },
];
const TRADE_ITEMS = [
  { id: 1, brand: "Rolex", model: "서브마리너 데이트", ref: "126610LN", price: 12800000, condition: "A급", year: "2023", loc: "서울 강남", kit: "풀박스", badge: "green", badgeText: "시세 이하", img: "🖤", type: "sell", author: "watchman", time: "1시간 전" },
  { id: 2, brand: "Omega", model: "스피드마스터", ref: "310.30.42", price: 5900000, condition: "S급", year: "2024", loc: "서울 종로", kit: "풀박스+영수증", badge: "yellow", badgeText: "시세 수준", img: "⚫", type: "sell", author: "omega_fan", time: "3시간 전" },
  { id: 3, brand: "Rolex", model: "데이토나", ref: "116500LN", price: 34000000, condition: "A급", year: "2022", loc: "부산", kit: "보증서만", badge: "red", badgeText: "시세 이상", img: "⬜", type: "buy", author: "collector_kr", time: "5시간 전" },
];
const ACCESSORY_ITEMS = [
  { id: 10, title: "롤렉스 오이스터 순정 스트랩 (새상품)", price: 450000, category: "스트랩/브레이슬릿", img: "⌚", author: "parts_kr", time: "2시간 전", condition: "S급" },
  { id: 11, title: "울프 와인더 4구 (British Racing)", price: 680000, category: "와인더/보관함", img: "🗄️", author: "luxbox", time: "4시간 전", condition: "A급" },
  { id: 12, title: "베르종 시계 공구 세트 16종", price: 120000, category: "공구/도구", img: "🔧", author: "toolmaster", time: "6시간 전", condition: "S급" },
  { id: 13, title: "시계 보호 필름 (41mm용 5매)", price: 15000, category: "보호필름/케이스", img: "🛡️", author: "film_shop", time: "1일 전", condition: "S급" },
];
const COMMUNITY_POSTS = [
  { id: 1, title: "데이토나 vs 스피드마스터, 어떤 게 더 나을까요?", author: "watchlover", comments: 23, likes: 45, time: "30분 전", category: "자유" },
  { id: 2, title: "첫 롤렉스 추천 부탁드립니다 (예산 1500)", author: "newbie2025", comments: 18, likes: 32, time: "1시간 전", category: "질문" },
  { id: 3, title: "공지: WATCHOUT 오픈 기념 이벤트 안내", author: "관리자", comments: 5, likes: 67, time: "2일 전", category: "공지", pinned: true },
  { id: 4, title: "로열오크 15500ST 실착 후기", author: "APfan", comments: 31, likes: 89, time: "3시간 전", category: "후기" },
  { id: 5, title: "롤렉스 AD 매장 구매 팁 공유합니다", author: "rolex_daily", comments: 42, likes: 110, time: "6시간 전", category: "정보" },
  { id: 6, title: "시계 보관함 추천 좀 해주세요", author: "careful_owner", comments: 15, likes: 28, time: "8시간 전", category: "자유" },
];

const fmt = (n) => n?.toLocaleString("ko-KR") + "원";
const fmtShort = (n) => { if (n >= 10000000) return (n / 10000000).toFixed(1) + "천만"; if (n >= 10000) return (n / 10000).toFixed(0) + "만"; return n?.toLocaleString("ko-KR"); };
const pct = (v) => (v > 0 ? `+${v}%` : `${v}%`);

// ═══════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState(false);
  const [sheetStep, setSheetStep] = useState(1);
  const [sheetData, setSheetData] = useState({});
  const [sheetDone, setSheetDone] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [detailWatch, setDetailWatch] = useState(null);
  const [collectionView, setCollectionView] = useState(false);
  const [tradeDetail, setTradeDetail] = useState(null);
  const [tradeForm, setTradeForm] = useState(false);
  const [communityWrite, setCommunityWrite] = useState(false);
  const [appBanner, setAppBanner] = useState(true);

  const openSheet = (prefill) => { setSheet(true); setSheetStep(prefill?.brand ? 3 : 1); setSheetDone(false); setSheetData(prefill || {}); };

  if (detailWatch) return <Shell><DetailScreen watch={detailWatch} onBack={() => setDetailWatch(null)} /></Shell>;
  if (collectionView) return (
    <Shell><CollectionScreen onBack={() => setCollectionView(false)} onSell={openSheet} onDetail={setDetailWatch} />
      {sheet && <BuybackSheet step={sheetStep} setStep={setSheetStep} data={sheetData} setData={setSheetData} done={sheetDone} setDone={setSheetDone} onClose={() => setSheet(false)} />}
    </Shell>
  );
  if (tradeDetail) return <Shell><TradeDetailScreen item={tradeDetail} onBack={() => setTradeDetail(null)} /></Shell>;
  if (tradeForm) return <Shell><TradeFormScreen onBack={() => setTradeForm(false)} /></Shell>;
  if (communityWrite) return <Shell><CommunityWriteScreen onBack={() => setCommunityWrite(false)} /></Shell>;

  const screens = {
    home: <HomeScreen onSell={openSheet} setTab={setTab} />,
    price: <PriceScreen onDetail={setDetailWatch} />,
    buyback: <BuybackPage onApply={openSheet} />,
    trade: <TradeScreen onItem={setTradeDetail} onForm={() => setTradeForm(true)} />,
    community: <CommunityScreen onLogin={() => setLoginModal(true)} onWrite={() => setCommunityWrite(true)} />,
    mypage: <MyPageScreen onLogin={() => setLoginModal(true)} onCollection={() => setCollectionView(true)} />,
  };

  return (
    <Shell>
      {appBanner && <AppBanner onClose={() => setAppBanner(false)} />}
      {screens[tab]}
      <BottomNav tab={tab} setTab={setTab} />
      {sheet && <BuybackSheet step={sheetStep} setStep={setSheetStep} data={sheetData} setData={setSheetData} done={sheetDone} setDone={setSheetDone} onClose={() => setSheet(false)} />}
      {loginModal && <LoginModal onClose={() => setLoginModal(false)} />}
    </Shell>
  );
}


function AppBanner({ onClose }) {
  return (
    <div style={{ background: "#FFF", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid " + T.border, position: "sticky", top: 0, zIndex: 95 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: T.text, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 10, fontWeight: 800 }}>W</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700 }}>WATCHOUT 앱으로 더 편하게</div><div style={{ fontSize: 10, color: T.sub }}>푸시 알림 · 시세 알림 · 빠른 접근</div></div>
      <button style={{ padding: "6px 12px", borderRadius: 6, background: T.accent, color: "#FFF", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>앱 열기</button>
      <button onClick={onClose} style={{ background: "none", border: "none", color: T.sub, cursor: "pointer", padding: 2 }}>{I.close}</button>
    </div>
  );
}

function Shell({ children }) {
  return <div style={{
    maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: T.bg,
    position: "relative", overflow: "hidden",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
    color: T.text, fontSize: 14, lineHeight: 1.5, boxShadow: "0 0 60px rgba(0,0,0,0.06)",
  }}>{children}</div>;
}

function Header({ title, right, onBack }) {
  return (
    <div style={{
      padding: "52px 20px 12px", display: "flex", justifyContent: "space-between",
      alignItems: "center", background: "#FFF", borderBottom: `1px solid ${T.border}`,
      position: "sticky", top: 0, zIndex: 90,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onBack && <button onClick={onBack} style={ib}>{I.back}</button>}
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{title}</span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>{right || <button style={ib}>{I.bell}</button>}</div>
    </div>
  );
}

const ib = { background: "none", border: "none", padding: 4, cursor: "pointer", color: T.text, display: "flex" };

// ─── Bottom Nav — 즉시매입은 전용 탭 ───
function BottomNav({ tab, setTab }) {
  const items = [
    { key: "home", label: "홈", icon: I.home },
    { key: "price", label: "시세", icon: I.chart },
    { key: "buyback", label: "즉시매입", icon: I.sell, special: true },
    { key: "trade", label: "시계거래", icon: I.shop },
    { key: "mypage", label: "MY", icon: I.user },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: 390, maxWidth: "100%", background: "#FFF",
      borderTop: `1px solid ${T.border}`, display: "flex",
      paddingBottom: "env(safe-area-inset-bottom, 16px)", paddingTop: 6, zIndex: 100,
    }}>
      {items.map((it) => (
        <button key={it.key} onClick={() => setTab(it.key)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          gap: 2, background: "none", border: "none", cursor: "pointer", padding: "4px 0",
          color: it.special ? "#FFF" : tab === it.key ? T.accent : T.sub,
        }}>
          {it.special ? (
            <div style={{
              width: 46, height: 46, borderRadius: 23, background: T.text,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: -20, boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            }}>{it.icon}</div>
          ) : (
            <div style={{ opacity: tab === it.key ? 1 : 0.5 }}>{it.icon}</div>
          )}
          <span style={{ fontSize: 10, fontWeight: tab === it.key ? 600 : 400 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
//  HOME
// ═══════════════════════════════════════
function HomeScreen({ onSell, setTab }) {
  return (
    <div style={{ paddingBottom: 90 }}>
      <Header title="WATCHOUT" />
      <div style={{ padding: "16px 20px 0", display: "flex", gap: 10 }}>
        {[
          { label: "자유게시판", emoji: "💬", color: "#EEF4FF", action: () => setTab("community") },
          { label: "내 컬렉션", emoji: "⌚", color: "#FFF4E6" },
          { label: "즉시매입", emoji: "💰", color: "#E8F8EE", action: () => setTab("buyback") },
          { label: "시계거래", emoji: "🤝", color: "#FEF0F0", action: () => setTab("trade") },
        ].map((a) => (
          <div key={a.label} onClick={a.action} style={{
            flex: 1, textAlign: "center", padding: "14px 4px", borderRadius: 14,
            background: a.color, cursor: "pointer",
          }}>
            <div style={{ fontSize: 22 }}>{a.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>{a.label}</div>
          </div>
        ))}
      </div>

      <SectionTitle title="💬 커뮤니티 최신글" action={() => setTab("community")} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ ...cd }}>
          {COMMUNITY_POSTS.slice(0, 3).map((p, i) => (
            <div key={p.id} style={{ padding: "10px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 5px", borderRadius: 3,
                  background: p.category === "질문" ? "#EEF4FF" : p.category === "후기" ? "#E8F8EE" : T.tag,
                  color: p.category === "질문" ? T.accent : p.category === "후기" ? T.green : T.sub,
                }}>{p.category}</span>
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
              </div>
              <div style={{ fontSize: 11, color: T.sub, marginTop: 3, display: "flex", gap: 8 }}>
                <span>{p.author}</span><span>💬{p.comments}</span><span>❤️{p.likes}</span>
                <span style={{ marginLeft: "auto" }}>{p.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      <SectionTitle title="🤝 시계거래 최신 매물" action={() => setTab("trade")} />
      <div style={{ padding: "0 20px", display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {TRADE_ITEMS.map((m) => (
          <div key={m.id} style={{ ...cd, minWidth: 200, maxWidth: 220, flexShrink: 0, cursor: "pointer", padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: T.tag,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, position: "relative" }}>
                {m.img}
                <div style={{ position: "absolute", top: -2, right: -2, fontSize: 7, fontWeight: 700,
                  padding: "1px 4px", borderRadius: 3, background: m.type === "sell" ? T.red : T.accent, color: "#FFF" }}>{m.type === "sell" ? "판매" : "구매"}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.brand} {m.model}</div>
                <div style={{ fontSize: 10, color: T.sub }}>{m.condition} · {m.year}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>{fmt(m.price)}</div>
            <div style={{ fontSize: 10, color: T.sub, marginTop: 2 }}>{m.author} · {m.time}</div>
          </div>
        ))}
      </div>
    
      <SectionTitle title="📰 시계 뉴스" />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {NEWS.map((n) => (
          <div key={n.id} style={{ ...cd, cursor: "pointer" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
            <div style={{ fontSize: 11, color: T.sub }}>{n.source} · {n.time}</div>
          </div>
        ))}
      </div>
    
      {/* 즉시매입 미니 배너 */}
      <div style={{ padding: "20px 20px 0" }}>
        <div onClick={() => setTab("buyback")} style={{
          background: T.text, borderRadius: 14, padding: "16px 18px", color: "#FFF",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>💰</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>내 시계, 최고가로 즉시 매입</div>
            <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>출장방문 · 현장감정 · 즉시입금</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)" }}>{I.arrow}</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  즉시매입 전용 안내 페이지
// ═══════════════════════════════════════
function BuybackPage({ onApply }) {
  const [faqOpen, setFaqOpen] = useState(null);

  const faqs = [
    { q: "어떤 브랜드를 매입하나요?", a: "롤렉스, 파텍필립, 오데마피게, 오메가, 카르티에, IWC, 파네라이 등 주요 럭셔리 브랜드를 매입합니다. 기타 브랜드도 문의해 주세요." },
    { q: "매입 가격은 어떻게 결정되나요?", a: "국내외 실거래 시세 데이터를 기반으로 시계의 모델, 연식, 컨디션, 구성품을 종합적으로 고려하여 업계 최고가를 제시합니다." },
    { q: "출장 가능 지역은 어디인가요?", a: "현재 서울·경기 전 지역 출장 매입이 가능하며, 그 외 지역은 택배 매입으로 진행합니다." },
    { q: "입금은 얼마나 걸리나요?", a: "현장에서 최종 금액 합의 후 즉시 계좌이체합니다. 별도의 대기 시간이 없습니다." },
  ];

  return (
    <div style={{ paddingBottom: 90 }}>
      <Header title="즉시매입" />

      {/* Hero Section */}
      <div style={{ padding: "28px 20px 24px", background: "#FFF", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, background: T.tag, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
        }}>💰</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 16, lineHeight: 1.3 }}>
          찾아가서 최고가로<br />즉시 매입합니다
        </div>
        <div style={{ fontSize: 13, color: T.sub, marginTop: 8, lineHeight: 1.5 }}>
          사진만 보내주시면 직접 방문하여<br />현장에서 감정하고 바로 입금해 드립니다
        </div>
      </div>
    
      {/* Trust Badges */}
      <div style={{ padding: "0 20px", display: "flex", gap: 8, marginTop: -4 }}>
        {[
          { icon: "🚗", label: "출장 방문", desc: "원하시는 장소로" },
          { icon: "🔍", label: "현장 감정", desc: "전문가 즉석 진단" },
          { icon: "💸", label: "즉시 입금", desc: "합의 후 바로 이체" },
        ].map((b) => (
          <div key={b.label} style={{
            flex: 1, ...cd, textAlign: "center", padding: "16px 8px",
          }}>
            <div style={{ fontSize: 24 }}>{b.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{b.label}</div>
            <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{b.desc}</div>
          </div>
        ))}
      </div>
    
      {/* Process Steps */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>매입 진행 과정</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { step: 1, icon: "📸", title: "시계 정보 입력", desc: "브랜드, 모델, 사진을 보내주세요", time: "30초" },
            { step: 2, icon: "📞", title: "전문가 연락", desc: "빠른 시간 내에 연락드립니다", time: "당일" },
            { step: 3, icon: "🚗", title: "출장 방문", desc: "원하시는 시간·장소로 방문합니다", time: "협의" },
            { step: 4, icon: "🔍", title: "현장 감정", desc: "실물 확인 후 최종 금액을 제시합니다", time: "10분" },
            { step: 5, icon: "💸", title: "즉시 입금", desc: "합의 즉시 계좌이체 완료", time: "즉시" },
          ].map((s, i) => (
            <div key={s.step} style={{ display: "flex", gap: 14 }}>
              {/* Timeline line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16, background: T.text, color: "#FFF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>{s.step}</div>
                {i < 4 && <div style={{ width: 2, height: 32, background: T.border }} />}
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingBottom: i < 4 ? 16 : 0, paddingTop: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{s.title}</span>
                  <span style={{
                    fontSize: 10, color: T.accent, background: "#EEF4FF",
                    padding: "1px 6px", borderRadius: 4, fontWeight: 600, marginLeft: "auto",
                  }}>{s.time}</span>
                </div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 2, marginLeft: 22 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      {/* Why WATCHOUT */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>왜 WATCHOUT인가요?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "📊", title: "데이터 기반 최고가", desc: "국내외 실거래 시세를 분석하여 업계 최고 수준의 매입가를 제시합니다" },
            { icon: "🏠", title: "편리한 출장 매입", desc: "매장 방문 없이, 원하시는 장소에서 편하게 거래할 수 있습니다" },
            { icon: "⚡", title: "빠른 현금화", desc: "현장에서 감정 완료 즉시 계좌이체. 복잡한 절차 없이 바로 입금됩니다" },
            { icon: "🛡️", title: "안전한 거래", desc: "전 과정 대면 거래로 진행되며, 투명한 가격 산정 기준을 안내합니다" },
          ].map((item) => (
            <div key={item.title} style={{ ...cd, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: T.tag,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 2, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      {/* Brands */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>매입 가능 브랜드</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["ROLEX", "Patek Philippe", "Audemars Piguet", "Omega", "Cartier", "IWC", "Panerai", "기타 문의"].map((b) => (
            <div key={b} style={{
              padding: "8px 14px", borderRadius: 10, background: "#FFF",
              border: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600,
            }}>{b}</div>
          ))}
        </div>
      </div>
    
      {/* FAQ */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>자주 묻는 질문</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{
              borderBottom: `1px solid ${T.border}`,
            }}>
              <div
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{
                  padding: "14px 0", display: "flex", justifyContent: "space-between",
                  alignItems: "center", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>{f.q}</span>
                <span style={{ color: T.sub, flexShrink: 0 }}>{faqOpen === i ? I.chevUp : I.chevDown}</span>
              </div>
              {faqOpen === i && (
                <div style={{
                  padding: "0 0 14px", fontSize: 13, color: T.sub, lineHeight: 1.6,
                }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    
      {/* Sticky CTA */}
      <div style={{ padding: "24px 20px 8px" }}>
        <button onClick={() => onApply()} style={{
          width: "100%", padding: "16px", borderRadius: 14,
          background: T.text, color: "#FFF", border: "none",
          fontSize: 16, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          즉시매입 신청하기
        </button>
        <div style={{ textAlign: "center", fontSize: 11, color: T.sub, marginTop: 8 }}>
          사진 3장이면 충분해요 · 평균 30초 소요
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  PRICE
// ═══════════════════════════════════════
function PriceScreen({ onDetail }) {
  const [brand, setBrand] = useState("전체");
  const brands = ["전체", "Rolex", "Omega", "AP", "Patek", "Cartier"];
  const filtered = brand === "전체" ? WATCHES : WATCHES.filter((w) => w.brand === brand);
  return (
    <div style={{ paddingBottom: 90 }}>
      <Header title="시세" />
      <div style={{ padding: "12px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: T.tag, borderRadius: 12 }}>
          <span style={{ color: T.sub }}>{I.search}</span>
          <input placeholder="브랜드, 모델명, 레퍼런스 검색" style={{ border: "none", background: "none", flex: 1, fontSize: 14, outline: "none", color: T.text }} />
        </div>
      </div>
      <div style={{ padding: "0 20px 4px", display: "flex", gap: 6, overflowX: "auto" }}>
        {brands.map((b) => (
          <button key={b} onClick={() => setBrand(b)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap",
            background: brand === b ? T.text : T.tag, color: brand === b ? "#FFF" : T.sub,
          }}>{b}</button>
        ))}
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.sub, marginBottom: 8 }}>{filtered.length}개 모델</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((w) => (
            <div key={w.id} onClick={() => onDetail(w)} style={{ ...cd, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{w.img}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{w.brand} {w.model}</div><div style={{ fontSize: 11, color: T.sub }}>{w.ref}</div></div>
              <Spark data={w.history} w={50} h={22} color={w.change >= 0 ? T.green : T.red} />
              <div style={{ textAlign: "right", minWidth: 90 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{fmt(w.price)}</div>
                <div style={{ fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end", color: w.change > 0 ? T.green : T.red }}>{w.change > 0 ? I.up : I.down} {pct(w.change)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// DETAIL
function DetailScreen({ watch, onBack }) {
  const data = watch.history; const mx = Math.max(...data), mn = Math.min(...data);
  return (
    <div style={{ paddingBottom: 40 }}>
      <Header title={`${watch.brand} ${watch.model}`} onBack={onBack} />
      <div style={{ textAlign: "center", padding: "24px 20px 16px", background: "#FFF" }}>
        <div style={{ width: 100, height: 100, borderRadius: 24, background: T.tag, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>{watch.img}</div>
        <div style={{ fontSize: 12, color: T.sub, marginTop: 8 }}>{watch.ref}</div>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{fmt(watch.price)}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 14, fontWeight: 600, color: watch.change > 0 ? T.green : T.red }}>{watch.change > 0 ? I.up : I.down} {pct(watch.change)} (이번 주)</div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ ...cd }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>6주 시세 추이</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
            {data.map((p, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 8, color: T.sub, marginBottom: 4 }}>{fmtShort(p)}</div>
                <div style={{ width: "100%", borderRadius: 6, height: `${((p - mn) / ((mx - mn) || 1)) * 60 + 20}px`,
                  background: i === data.length - 1 ? (watch.change >= 0 ? T.green : T.red) : T.tag }} />
                <span style={{ fontSize: 9, color: T.sub, marginTop: 4 }}>{i === data.length - 1 ? "현재" : `${data.length - i}주전`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// COLLECTION
function CollectionScreen({ onBack, onSell, onDetail }) {
  const total = COLLECTION.reduce((s, c) => s + c.price, 0);
  const tp = COLLECTION.reduce((s, c) => s + c.purchasePrice, 0);
  const gain = total - tp; const gP = ((gain / tp) * 100).toFixed(1);
  const ph = [28000000, 28500000, 29200000, 29500000, 30100000, total];
  return (
    <div style={{ paddingBottom: 40 }}>
      <Header title="내 컬렉션" onBack={onBack} right={<button style={{ ...ib, fontSize: 13, fontWeight: 600, color: T.accent, display: "flex", alignItems: "center", gap: 4 }}>{I.plus} 추가</button>} />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ ...cd, background: T.text, color: "#FFF", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>총 자산 가치</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>{fmt(total)}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: gain > 0 ? T.green : T.red }}>
                {gain > 0 ? "▲ +" : "▼ "}{fmt(gain)} ({gP}%)
              </span>
            </div>
            <Spark data={ph} w={80} h={36} color={T.green} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 10, opacity: 0.4 }}>총 투자금</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{fmt(tp)}</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 10, opacity: 0.4 }}>보유</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{COLLECTION.length}개</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 10, opacity: 0.4 }}>주간</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, color: T.green }}>+1.2%</div></div>
          </div>
        </div>
      </div>
      <SectionTitle title="보유 시계" />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {COLLECTION.map((c) => {
          const g = c.price - c.purchasePrice; const gp = ((g / c.purchasePrice) * 100).toFixed(1);
          return (
            <div key={c.id} style={{ ...cd }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{c.img}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{c.brand} {c.model}</div><div style={{ fontSize: 11, color: T.sub }}>{c.ref} · 매입 {fmt(c.purchasePrice)}</div></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <Spark data={c.history} w={44} h={18} color={g >= 0 ? T.green : T.red} />
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(c.price)}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: g > 0 ? T.green : T.red }}>{g > 0 ? "+" : ""}{gp}%</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={() => onDetail(c)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer", color: T.text }}>시세 상세</button>
                <button onClick={() => onSell({ brand: c.brand, model: c.model, ref: c.ref })} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: T.text, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>즉시매입 신청</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// TRADE
function TradeScreen({ onItem, onForm }) {
  const [sec, setSec] = useState("시계");
  const [brand, setBrand] = useState("전체");
  const [so, setSo] = useState(false);
  const brands = ["전체", "Rolex", "Omega", "AP", "Patek", "Cartier"];
  const accCats = ["전체", "스트랩/브레이슬릿", "와인더/보관함", "공구/도구", "보호필름/케이스"];
  const [ac, setAc] = useState("전체");
  const fW = brand === "전체" ? TRADE_ITEMS : TRADE_ITEMS.filter(m => m.brand === brand);
  const fA = ac === "전체" ? ACCESSORY_ITEMS : ACCESSORY_ITEMS.filter(a => a.category === ac);
  return (
    <div style={{ paddingBottom: 90 }}>
      <Header title="시계거래" right={<div style={{ display: "flex", gap: 8, alignItems: "center" }}><button onClick={() => setSo(!so)} style={ib}>{I.search}</button><button onClick={onForm} style={{ padding: "6px 14px", borderRadius: 8, background: T.text, color: "#FFF", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>매물 등록</button></div>} />
      {so && <div style={{ padding: "8px 20px", background: "#FFF", borderBottom: "1px solid " + T.border }}><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: T.tag, borderRadius: 12 }}><span style={{ color: T.sub }}>{I.search}</span><input autoFocus placeholder="모델명, 레퍼런스 검색" style={{ border: "none", background: "none", flex: 1, fontSize: 14, outline: "none", color: T.text }} /></div></div>}
      <div style={{ padding: "0 20px", display: "flex", borderBottom: "1px solid " + T.border, background: "#FFF" }}>
        {["시계", "시계용품"].map(s => <button key={s} onClick={() => setSec(s)} style={{ padding: "10px 20px", fontSize: 14, fontWeight: sec === s ? 700 : 500, color: sec === s ? T.text : T.sub, background: "none", border: "none", borderBottom: sec === s ? "2px solid " + T.text : "2px solid transparent", cursor: "pointer" }}>{s}</button>)}
      </div>
      {sec === "시계" ? <>
        <div style={{ padding: "10px 20px", display: "flex", gap: 6, overflowX: "auto" }}>{brands.map(b => <button key={b} onClick={() => setBrand(b)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: brand === b ? T.text : T.tag, color: brand === b ? "#FFF" : T.sub }}>{b}</button>)}</div>
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {fW.map(m => (
            <div key={m.id} onClick={() => onItem(m)} style={{ ...cd, cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 80, height: 80, borderRadius: 12, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>{m.img}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: T.sub, marginBottom: 2 }}>{m.condition} · {m.year} · {m.kit}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{m.brand} {m.model}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{m.ref}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>{fmt(m.price)}</span>
                    <span style={{ fontSize: 11, color: T.sub }}>{m.loc} · {m.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </> : <>
        <div style={{ padding: "10px 20px", display: "flex", gap: 6, overflowX: "auto" }}>{accCats.map(c => <button key={c} onClick={() => setAc(c)} style={{ padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: ac === c ? T.text : T.tag, color: ac === c ? "#FFF" : T.sub }}>{c}</button>)}</div>
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {fA.map(a => (
            <div key={a.id} style={{ ...cd, cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{a.img}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: T.accent, fontWeight: 600, marginBottom: 2 }}>{a.category}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}><span style={{ fontSize: 15, fontWeight: 800 }}>{fmt(a.price)}</span><span style={{ fontSize: 11, color: T.sub }}>{a.condition} · {a.time}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function CommunityScreen({ onLogin, onWrite }) {
  const [at, setAt] = useState("전체");
  const tabs = ["전체", "자유", "질문", "후기", "정보"];
  const filtered = at === "전체" ? COMMUNITY_POSTS : COMMUNITY_POSTS.filter((p) => p.category === at || p.pinned);
  const cc = (c) => ({ "자유": T.sub, "질문": T.accent, "후기": T.green, "정보": T.orange, "공지": T.red }[c] || T.sub);
  return (
    <div style={{ paddingBottom: 90 }}>
      <Header title="커뮤니티" right={<button style={{ padding: "6px 14px", borderRadius: 8, background: T.text, color: "#FFF", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>글쓰기</button>} />
      <div style={{ padding: "0 20px", display: "flex", borderBottom: `1px solid ${T.border}`, background: "#FFF", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setAt(t)} style={{ padding: "10px 16px", fontSize: 13, fontWeight: at === t ? 700 : 500, color: at === t ? T.text : T.sub, background: "none", border: "none", borderBottom: at === t ? `2px solid ${T.text}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>
      <div style={{ padding: "0 20px" }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ padding: "14px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              {p.pinned ? <span style={{ fontSize: 10, fontWeight: 700, color: "#FFF", background: T.red, padding: "1px 6px", borderRadius: 4 }}>공지</span>
                : <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: `${cc(p.category)}18`, color: cc(p.category) }}>{p.category}</span>}
              <span style={{ fontSize: 14, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
            </div>
            <div style={{ display: "flex", gap: 10, fontSize: 12, color: T.sub }}>
              <span>{p.author}</span><span>💬 {p.comments}</span><span>❤️ {p.likes}</span><span style={{ marginLeft: "auto" }}>{p.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ ...cd, textAlign: "center", padding: "20px", background: T.tag, border: "none" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>커뮤니티에 참여해보세요</div>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 12 }}>글을 읽으려면 로그인이 필요합니다</div>
          <button onClick={onLogin} style={{ padding: "10px 24px", borderRadius: 10, background: T.text, color: "#FFF", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>로그인하기</button>
        </div>
      </div>
    </div>
  );
}

// MY PAGE
function MyPageScreen({ onLogin, onCollection }) {
  return (
    <div style={{ paddingBottom: 90 }}>
      <Header title="MY" />
      <div onClick={onLogin} style={{ padding: "20px", display: "flex", gap: 14, alignItems: "center", background: "#FFF", cursor: "pointer" }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👤</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700 }}>로그인이 필요합니다</div><div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>카카오로 간편하게 시작하세요</div></div>
        {I.arrow}
      </div>
      <div style={{ padding: "0 20px", marginTop: 12 }}>
        <div style={{ ...cd, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: T.sub }}>Lv.0</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>비회원</div><div style={{ fontSize: 11, color: T.sub }}>시세 조회, 뉴스, 매물 목록 열람 가능</div></div>
        </div>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div onClick={onCollection} style={{ ...cd, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFF4E6", border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>⌚</span>
            <div><div style={{ fontSize: 14, fontWeight: 700 }}>내 컬렉션</div><div style={{ fontSize: 12, color: T.sub }}>시계를 등록하고 자산 가치를 추적하세요</div></div>
          </div>
          {I.arrow}
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        {[
          { section: "활동", items: ["즉시매입 견적 내역", "내 매물 관리", "메시지함"] },
          { section: "설정", items: ["알림 설정", "시세 알림 관리", "언어 설정", "앱 정보"] },
          { section: "지원", items: ["공지사항", "자주 묻는 질문"] },
        ].map((g) => (
          <div key={g.section} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.sub, marginBottom: 8, paddingLeft: 4 }}>{g.section}</div>
            <div style={{ background: "#FFF", borderRadius: 14, overflow: "hidden" }}>
              {g.items.map((item, i) => (
                <div key={item} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: i < g.items.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 14 }}>{item}</span>{I.arrow}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  BUYBACK SHEET
// ═══════════════════════════════════════
function BuybackSheet({ step, setStep, data, setData, done, setDone, onClose }) {
  const N = 5;
  const brands = ["ROLEX", "Patek Philippe", "Audemars Piguet", "Omega", "Cartier", "IWC", "Panerai", "기타"];
  const conds = [{ v: "S", l: "S급", d: "미착용·새상품" }, { v: "A", l: "A급", d: "양호한 상태" }, { v: "B", l: "B급", d: "사용감 있음" }];
  const kits = ["풀박스", "보증서/워런티", "영수증", "여분 링크", "설명서"];
  const ok = () => { if (step === 1) return !!data.brand; if (step === 2) return !!data.model; if (step === 3) return !!data.condition; if (step === 4) return true; if (step === 5) return !!data.phone; return false; };

  if (done) return (
    <SW onClose={onClose}>
      <div style={{ textAlign: "center", padding: "32px 20px" }}>
        {I.check}
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 16 }}>즉시매입 신청 완료</div>
        <div style={{ marginTop: 16, padding: "16px", background: T.tag, borderRadius: 12, textAlign: "left" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{data.brand} {data.model}</div>
          {data.ref && <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{data.ref}</div>}
          <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{data.condition}급 {data.year && `· ${data.year}`}{data.kits?.length > 0 && ` · ${data.kits.join(", ")}`}</div>
        </div>
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#E8F8EE", borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.green }}>📞 빠른 시간 내에 연락드리겠습니다</div>
          <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>출장 방문 → 현장 감정 → 즉시 입금</div>
        </div>
        <button onClick={onClose} style={{ marginTop: 20, width: "100%", padding: "14px", borderRadius: 12, background: T.text, color: "#FFF", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>확인</button>
      </div>
    </SW>
  );

  return (
    <SW onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div><span style={{ fontSize: 17, fontWeight: 700 }}>즉시매입 신청</span><div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>출장방문 · 현장감정 · 즉시입금</div></div>
        <button onClick={onClose} style={ib}>{I.close}</button>
      </div>
      <div style={{ display: "flex", gap: 4, margin: "12px 0 20px" }}>
        {Array.from({ length: N }).map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? T.text : T.border }} />)}
      </div>
      <div style={{ minHeight: 280 }}>
        {step === 1 && <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>어떤 브랜드인가요?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {brands.map((b) => <button key={b} onClick={() => setData({ ...data, brand: b })} style={{ padding: "14px 12px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "center", border: data.brand === b ? `2px solid ${T.text}` : `1px solid ${T.border}`, background: data.brand === b ? T.tag : "#FFF", color: T.text }}>{b}</button>)}
          </div>
        </div>}
        {step === 2 && <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>모델 정보를 알려주세요</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label style={lb}>모델명 *</label><input value={data.model || ""} onChange={(e) => setData({ ...data, model: e.target.value })} placeholder="예: 서브마리너 데이트" style={ip} /></div>
            <div><label style={lb}>레퍼런스 번호</label><input value={data.ref || ""} onChange={(e) => setData({ ...data, ref: e.target.value })} placeholder="예: 126610LN (모르면 비워두세요)" style={ip} /></div>
            <div><label style={lb}>연식</label><input value={data.year || ""} onChange={(e) => setData({ ...data, year: e.target.value })} placeholder="예: 2023년" style={ip} /></div>
            <div style={{ fontSize: 11, color: T.sub }}>※ 정확하지 않아도 괜찮아요</div>
          </div>
        </div>}
        {step === 3 && <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>상태와 구성품</div>
          <label style={lb}>컨디션 *</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {conds.map((c) => <button key={c.v} onClick={() => setData({ ...data, condition: c.v })} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, textAlign: "center", cursor: "pointer", border: data.condition === c.v ? `2px solid ${T.text}` : `1px solid ${T.border}`, background: data.condition === c.v ? T.tag : "#FFF" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{c.l}</div><div style={{ fontSize: 10, color: T.sub, marginTop: 2 }}>{c.d}</div>
            </button>)}
          </div>
          <label style={lb}>구성품 (있는 것만 선택)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {kits.map((k) => { const s = data.kits?.includes(k); return <button key={k} onClick={() => { const c = data.kits || []; setData({ ...data, kits: s ? c.filter(x => x !== k) : [...c, k] }); }} style={{ padding: "8px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: s ? `2px solid ${T.text}` : `1px solid ${T.border}`, background: s ? T.tag : "#FFF", color: T.text }}>{s ? "✓ " : ""}{k}</button>; })}
          </div>
        </div>}
        {step === 4 && <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>사진 첨부</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {["전면 *", "후면 *", "측면"].map((l) => <div key={l} style={{ aspectRatio: "1", borderRadius: 14, border: `2px dashed ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: T.tag }}><div style={{ color: T.sub }}>{I.camera}</div><div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>{l}</div></div>)}
          </div>
          <div style={{ fontSize: 11, color: T.sub, marginTop: 12, lineHeight: 1.6 }}>※ 최소 2장 (전면, 후면 필수)<br />※ 사진이 선명할수록 정확한 견적이 가능합니다</div>
        </div>}
        {step === 5 && <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>연락처</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label style={lb}>연락받으실 번호 *</label><input value={data.phone || ""} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="010-0000-0000" style={ip} type="tel" /></div>
            <div><label style={lb}>희망 거래 지역</label><input value={data.location || ""} onChange={(e) => setData({ ...data, location: e.target.value })} placeholder="예: 서울 강남" style={ip} /></div>
          </div>
        </div>}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 0.4, padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 600, background: T.tag, border: "none", cursor: "pointer", color: T.text }}>이전</button>}
        <button onClick={() => step < N ? setStep(step + 1) : setDone(true)} disabled={!ok()} style={{ flex: 1, padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600, background: ok() ? T.text : T.border, color: ok() ? "#FFF" : T.sub, border: "none", cursor: ok() ? "pointer" : "default" }}>
          {step < N ? "다음" : "즉시매입 신청하기"}
        </button>
      </div>
    </SW>
  );
}

function SW({ onClose, children }) {
  return <>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, animation: "fi .2s" }} />
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 390, maxWidth: "100%", background: "#FFF", borderRadius: "20px 20px 0 0", padding: "12px 20px 32px", zIndex: 201, maxHeight: "88vh", overflowY: "auto", animation: "su .3s ease" }}>
      <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 12px" }} />
      {children}
    </div>
    <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes su{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>
  </>;
}


/* ── TRADE DETAIL ── */
function TradeDetailScreen({ item, onBack }) {
  return (
    <div style={{ paddingBottom: 100 }}>
      <Header title="매물 상세" onBack={onBack} right={<div style={{ display: "flex", gap: 8 }}><button style={ib}>{I.heart}</button><button style={ib}>{I.share}</button></div>} />
      <div style={{ width: "100%", height: 280, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>{item.img}</div>
      <div style={{ padding: "16px 20px", background: "#FFF", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid " + T.border }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: T.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{item.author}</span><span style={{ fontSize: 10, fontWeight: 600, color: T.accent, background: "#EEF4FF", padding: "1px 6px", borderRadius: 4 }}>{item.authorLevel}</span></div><div style={{ fontSize: 11, color: T.sub, marginTop: 1 }}>거래 후기 12건 · 평점 4.8</div></div>
      </div>
      <div style={{ padding: "16px 20px", background: "#FFF" }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{fmt(item.price)}</div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.brand} {item.model}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[{ l: "레퍼런스", v: item.ref }, { l: "연식", v: item.year + "년" }, { l: "컨디션", v: item.condition }, { l: "구성품", v: item.kit }, { l: "거래 방식", v: "직거래" }, { l: "거래 지역", v: item.loc }].map(r => <div key={r.l} style={{ padding: "10px 12px", background: T.tag, borderRadius: 10 }}><div style={{ fontSize: 10, color: T.sub, marginBottom: 2 }}>{r.l}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.v}</div></div>)}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>상세 설명</div>
        <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.7 }}>{item.desc}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, fontSize: 12, color: T.sub }}><span>조회 {item.views}</span><span>관심 {item.likes}</span><span>{item.time}</span></div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 390, maxWidth: "100%", background: "#FFF", borderTop: "1px solid " + T.border, padding: "12px 20px", paddingBottom: "env(safe-area-inset-bottom,20px)", display: "flex", gap: 10, zIndex: 100 }}>
        <button style={{ width: 48, height: 48, borderRadius: 12, border: "1px solid " + T.border, background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>{I.heart}</button>
        <button style={{ flex: 1, padding: "14px", borderRadius: 12, background: T.text, color: "#FFF", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{I.msg} 판매자에게 메시지</button>
      </div>
    </div>
  );
}

/* ── TRADE FORM ── */
function TradeFormScreen({ onBack }) {
  const [ft, setFt] = useState("시계");
  return (
    <div style={{ paddingBottom: 100 }}>
      <Header title="매물 등록" onBack={onBack} />
      <div style={{ padding: "12px 20px", display: "flex", gap: 6 }}>{["시계", "시계용품"].map(t => <button key={t} onClick={() => setFt(t)} style={{ padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: ft === t ? T.text : T.tag, color: ft === t ? "#FFF" : T.sub }}>{t}</button>)}</div>
      <div style={{ padding: "0 20px" }}>
        {ft === "시계" ? <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div><label style={lb}>브랜드 *</label><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>{["Rolex", "Omega", "AP", "Patek", "Cartier", "기타"].map(b => <button key={b} style={{ padding: "10px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "1px solid " + T.border, background: "#FFF", cursor: "pointer", color: T.text }}>{b}</button>)}</div></div>
          <div><label style={lb}>모델명 *</label><input placeholder="예: 서브마리너 데이트" style={ip} /></div>
          <div><label style={lb}>레퍼런스 번호</label><input placeholder="예: 126610LN" style={ip} /></div>
          <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={lb}>연식 *</label><input placeholder="2023" style={ip} /></div><div style={{ flex: 1 }}><label style={lb}>컨디션 *</label><select style={{ ...ip, appearance: "none" }}><option>선택</option><option>S급 (미착용)</option><option>A급 (양호)</option><option>B급 (사용감)</option></select></div></div>
          <div><label style={lb}>구성품 *</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{["풀박스", "보증서", "영수증", "여분 링크", "설명서"].map(k => <button key={k} style={{ padding: "7px 12px", borderRadius: 20, fontSize: 12, border: "1px solid " + T.border, background: "#FFF", cursor: "pointer", color: T.text }}>{k}</button>)}</div></div>
          <div><label style={lb}>희망 가격 (원) *</label><input placeholder="12,800,000" style={ip} /></div>
          <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={lb}>거래 방식</label><select style={{ ...ip, appearance: "none" }}><option>직거래</option><option>택배</option><option>모두 가능</option></select></div><div style={{ flex: 1 }}><label style={lb}>거래 지역</label><input placeholder="서울 강남" style={ip} /></div></div>
          <div><label style={lb}>사진 (최소 3장) *</label><div style={{ display: "flex", gap: 8, overflowX: "auto" }}>{["전면", "후면", "측면", "+"].map(l => <div key={l} style={{ width: 80, height: 80, borderRadius: 12, border: "2px dashed " + T.border, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: T.tag, flexShrink: 0, color: T.sub }}>{l === "+" ? <span style={{ fontSize: 24 }}>+</span> : <>{I.camera}<div style={{ fontSize: 9, marginTop: 2 }}>{l}</div></>}</div>)}</div></div>
          <div><label style={lb}>상세 설명</label><textarea placeholder="구매처, 오버홀 이력, 특이사항 등" style={{ ...ip, height: 100, resize: "none" }} /></div>
        </div> : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div><label style={lb}>카테고리 *</label><select style={{ ...ip, appearance: "none" }}><option>선택</option><option>스트랩/브레이슬릿</option><option>와인더/보관함</option><option>공구/도구</option><option>보호필름/케이스</option><option>기타</option></select></div>
          <div><label style={lb}>제목 *</label><input placeholder="상품명을 입력하세요" style={ip} /></div>
          <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={lb}>가격 (원) *</label><input placeholder="120,000" style={ip} /></div><div style={{ flex: 1 }}><label style={lb}>상태</label><select style={{ ...ip, appearance: "none" }}><option>S급</option><option>A급</option><option>B급</option></select></div></div>
          <div><label style={lb}>사진 *</label><div style={{ display: "flex", gap: 8 }}>{[1, 2, 3].map(n => <div key={n} style={{ width: 80, height: 80, borderRadius: 12, border: "2px dashed " + T.border, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: T.tag, flexShrink: 0, color: T.sub }}>{I.camera}</div>)}</div></div>
          <div><label style={lb}>상세 설명</label><textarea placeholder="상품 설명을 작성해주세요" style={{ ...ip, height: 100, resize: "none" }} /></div>
        </div>}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 390, maxWidth: "100%", background: "#FFF", borderTop: "1px solid " + T.border, padding: "12px 20px", paddingBottom: "env(safe-area-inset-bottom,20px)", zIndex: 100 }}><button style={{ width: "100%", padding: "14px", borderRadius: 12, background: T.text, color: "#FFF", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>등록하기</button></div>
    </div>
  );
}

/* ── COMMUNITY WRITE ── */
function CommunityWriteScreen({ onBack }) {
  const [cat, setCat] = useState("");
  return (
    <div style={{ paddingBottom: 100 }}>
      <Header title="글쓰기" onBack={onBack} />
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div><label style={lb}>카테고리 *</label><div style={{ display: "flex", gap: 6 }}>{["자유", "질문", "후기", "정보"].map(c => <button key={c} onClick={() => setCat(c)} style={{ flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: cat === c ? "2px solid " + T.text : "1px solid " + T.border, background: cat === c ? T.tag : "#FFF", color: T.text }}>{c}</button>)}</div></div>
        <div><label style={lb}>제목 *</label><input placeholder="제목을 입력하세요" style={ip} /></div>
        <div><label style={lb}>내용 *</label><textarea placeholder="내용을 입력하세요" style={{ ...ip, height: 200, resize: "none", lineHeight: 1.6 }} /></div>
        <div><label style={lb}>사진 첨부 (선택)</label><div style={{ display: "flex", gap: 8 }}>{[1, 2, 3].map(n => <div key={n} style={{ width: 72, height: 72, borderRadius: 12, border: "2px dashed " + T.border, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: T.tag, color: T.sub }}>{n === 1 ? I.camera : "+"}</div>)}</div></div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 390, maxWidth: "100%", background: "#FFF", borderTop: "1px solid " + T.border, padding: "12px 20px", paddingBottom: "env(safe-area-inset-bottom,20px)", zIndex: 100 }}><button style={{ width: "100%", padding: "14px", borderRadius: 12, background: T.text, color: "#FFF", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>등록하기</button></div>
    </div>
  );
}

function LoginModal({ onClose }) {
  return <SW onClose={onClose}>
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>로그인</div>
      <div style={{ fontSize: 13, color: T.sub, marginBottom: 24 }}>간편하게 시작하세요</div>
      <button style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#FEE500", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}>카카오로 시작하기</button>
      <button style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#03C75A", color: "#FFF", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}>네이버로 시작하기</button>
      <button style={{ width: "100%", padding: "14px", borderRadius: 12, border: `1px solid ${T.border}`, background: "#FFF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Apple로 시작하기</button>
    </div>
  </SW>;
}

function SectionTitle({ title, action }) {
  return <div style={{ padding: "16px 20px 8px", fontSize: 15, fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span>{title}</span><span onClick={action} style={{ fontSize: 12, color: T.sub, cursor: "pointer" }}>더보기 →</span>
  </div>;
}

const cd = { background: "#FFF", borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}` };
const lb = { fontSize: 12, fontWeight: 600, color: T.sub, display: "block", marginBottom: 6 };
const ip = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, outline: "none", background: "#FFF", color: T.text, boxSizing: "border-box" };