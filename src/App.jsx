import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Calendar, Radio, Sparkles, Globe, Heart, Star,
  RefreshCw, ChevronDown, Copy, Check, Zap, MessageSquare,
} from 'lucide-react';
import radarData from './data/data.json';
import {
  buildBriefingPackagePrompt,
  buildNewsToTopicPrompt,
  buildCalendarAnglesPrompt,
  buildPromptWeChat,
  buildPromptXiaohongshu,
  buildPromptVideoChannel,
  buildPromptX,
  buildPromptLinkedIn,
  buildPromptZhihu,
  buildPromptYouTube,
  buildPromptReddit,
  buildPromptQuora,
  DAILY_CRAWL_PROMPT,
} from './prompts.js';

const PLATFORM_CONFIG = [
  { id: 'wechat',        label: '微信公众号',  color: '#8B6F2A', builder: buildPromptWeChat },
  { id: 'xiaohongshu',   label: '小红书',      color: '#8B6F2A', builder: buildPromptXiaohongshu },
  { id: 'videoChannel',  label: '视频号',      color: '#8B6F2A', builder: buildPromptVideoChannel },
  { id: 'x',             label: 'X（Twitter）',color: '#8B6F2A', builder: buildPromptX },
  { id: 'linkedin',      label: 'LinkedIn',    color: '#8B6F2A', builder: buildPromptLinkedIn },
  { id: 'zhihu',         label: '知乎',        color: '#7A5D20', builder: buildPromptZhihu },
  { id: 'youtube',       label: 'YouTube',     color: '#7A5D20', builder: buildPromptYouTube },
  { id: 'reddit',        label: 'Reddit',      color: '#7A5D20', builder: buildPromptReddit },
  { id: 'quora',         label: 'Quora',       color: '#7A5D20', builder: buildPromptQuora },
];

const PRIORITY_COLORS = { red: '#C8453E', yellow: '#D4A04F', green: '#7A8B6F' };
const PRIORITY_LABELS = { red: '🔴 必发', yellow: '🟡 周内', green: '🟢 备用' };
const PRIORITY_BG = { red: 'rgba(200, 69, 62, 0.1)', yellow: 'rgba(212, 160, 79, 0.1)', green: 'rgba(122, 139, 111, 0.1)' };

const CATEGORY_LABELS = {
  fed: '美联储', central_bank: '央行决议', earnings: '财报季',
  data: '经济数据', tax: '税务', immigration: '移民政策', conference: '国际会议',
};

// ===== Toast =====
function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div
      className="fixed top-8 left-1/2 z-50 toast-enter px-5 py-3 flex items-center gap-2"
      style={{
        transform: 'translateX(-50%)',
        background: '#1A1F2E',
        color: '#FDFBF5',
        borderRadius: '2px',
        boxShadow: '0 8px 24px rgba(26, 31, 46, 0.2)',
        fontSize: '13px',
      }}
    >
      <Check className="w-4 h-4" style={{ color: '#8B6F2A' }} />
      {message}
    </div>
  );
}

// ===== Manual Refresh Modal =====
function CrawlModal({ visible, onClose, onCopy }) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-8"
      style={{ background: 'rgba(26, 31, 46, 0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full p-8"
        style={{ background: '#FDFBF5', border: '1px solid rgba(139, 111, 42, 0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-4 h-4" style={{ color: '#8B6F2A' }} />
          <h3 className="text-[16px] text-[#1A1F2E] font-semibold tracking-wide">手动刷新雷达数据</h3>
        </div>
        <p className="text-[13px] mb-5 leading-relaxed" style={{ color: '#4A5268' }}>
          点击下方按钮复制完整的抓取 Prompt，然后到 Claude 对话里粘贴执行。
          Claude 会自动搜索今日新闻、生成全平台选题并输出新版 data.json。
        </p>
        <div
          className="p-4 mb-5 max-h-64 overflow-y-auto text-[11px] leading-relaxed font-mono"
          style={{ background: 'rgba(139, 111, 42, 0.04)', color: '#4A5268', whiteSpace: 'pre-wrap' }}
        >
          {DAILY_CRAWL_PROMPT.slice(0, 600)}...
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px]" style={{ color: '#8A8578' }}>
            Prompt 长度：约 {DAILY_CRAWL_PROMPT.length} 字符
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[12px]"
              style={{ color: '#8A8578', border: '1px solid rgba(74, 82, 104, 0.15)' }}
            >取消</button>
            <button
              onClick={onCopy}
              className="px-4 py-2 text-[12px] flex items-center gap-2"
              style={{ background: 'linear-gradient(90deg, #8B6F2A 0%, #6B5220 100%)', color: '#FDFBF5' }}
            >
              <Copy className="w-3 h-3" /> 复制完整 Prompt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Platform Buttons Component =====
function PlatformButtons({ topic, copyToClipboard, copiedPlatforms, setCopiedPlatforms }) {
  const handleCopy = (p, e) => {
    e.stopPropagation();
    const promptText = p.builder(topic);
    copyToClipboard(promptText, `✅ 已复制 ${p.label} 的 Prompt，到 Claude 对话粘贴即可`);
    setCopiedPlatforms((prev) => ({ ...prev, [p.id]: true }));
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {PLATFORM_CONFIG.map((p) => {
        const copied = copiedPlatforms[p.id];
        return (
          <button
            key={p.id}
            onClick={(e) => handleCopy(p, e)}
            className="px-2.5 py-1.5 text-[11px] transition-all duration-150 flex items-center gap-1"
            style={{
              color: copied ? '#FDFBF5' : '#8B6F2A',
              background: copied ? 'linear-gradient(90deg, #8B6F2A 0%, #6B5220 100%)' : '#FDFBF5',
              border: copied ? '1px solid transparent' : `1px solid rgba(139, 111, 42, 0.25)`,
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.target.style.background = 'linear-gradient(90deg, #8B6F2A 0%, #6B5220 100%)';
                e.target.style.color = '#FDFBF5';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.target.style.background = '#FDFBF5';
                e.target.style.color = '#8B6F2A';
              }
            }}
          >
            {copied && <Check className="w-2.5 h-2.5" />}
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

export default function NoahContentRadar() {
  const [activeModule, setActiveModule] = useState('briefing');
  const [newsTab, setNewsTab] = useState('macro');
  const [calendarView, setCalendarView] = useState('list');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedHints, setExpandedHints] = useState({});
  const [copiedPlatforms, setCopiedPlatforms] = useState({});
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [crawlModalOpen, setCrawlModalOpen] = useState(false);

  const copyToClipboard = (text, successMsg = '✅ 已复制 Prompt，请到 Claude 对话里粘贴') => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMsg(successMsg);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    }).catch(() => {
      setToastMsg('❌ 复制失败，请检查浏览器权限');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    });
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
    } catch (e) { return ''; }
  };
  const formatTime = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch (e) { return ''; }
  };

  // ===== Data =====
  const dailyBriefing = radarData.dailyBriefing || [];
  const newsData = radarData.news || { macro: [], market: [], hnwi: [] };
  const calendarEvents = radarData.calendar || [];
  const topics = radarData.topics || [];
  const summary = radarData.summary || {};

  const getScoreStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= score ? '#8B6F2A' : '#E8E4DA'}
          color={i <= score ? '#8B6F2A' : '#E8E4DA'}
        />
      );
    }
    return stars;
  };

  const platformLabelMap = Object.fromEntries(PLATFORM_CONFIG.map((p) => [p.id, p.label]));

  const moduleConfig = [
    { id: 'briefing', name: '今日早报', icon: Zap, badge: dailyBriefing.length || null },
    { id: 'news', name: '重点新闻', icon: Radio, badge: null },
    { id: 'calendar', name: '90天日历', icon: Calendar, badge: calendarEvents.length || null },
    { id: 'topics', name: '选题生成器', icon: Sparkles, badge: topics.length || null },
  ];

  // Group calendar by week
  const calendarByWeek = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    for (const ev of calendarEvents) {
      currentWeek.push(ev);
      if (currentWeek.length >= 3) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }, [calendarEvents]);

  return (
    <div className="min-h-screen w-full" style={{
      background: 'linear-gradient(180deg, #F7F3EA 0%, #FDFBF5 50%, #F7F3EA 100%)',
      fontFamily: '"PingFang SC", "Noto Serif SC", "Source Han Serif", serif',
    }}>
      <Toast message={toastMsg} visible={toastVisible} />
      <CrawlModal
        visible={crawlModalOpen}
        onClose={() => setCrawlModalOpen(false)}
        onCopy={() => {
          copyToClipboard(DAILY_CRAWL_PROMPT, '✅ 已复制抓取 Prompt，请到 Claude 对话粘贴执行');
          setCrawlModalOpen(false);
        }}
      />
      <div className="relative flex">
        {/* ===== Sidebar ===== */}
        <aside className="w-64 min-h-screen border-r sticky top-0 h-screen overflow-y-auto" style={{
          borderColor: 'rgba(139, 111, 42, 0.08)',
          background: 'rgba(253, 251, 245, 0.85)',
          backdropFilter: 'blur(20px)',
        }}>
          <div className="p-6 border-b" style={{ borderColor: 'rgba(139, 111, 42, 0.12)' }}>
            <div className="flex flex-col gap-3">
              <div
                className="w-full flex items-center justify-center px-5 py-4"
                style={{ background: '#000000', borderRadius: '2px' }}
              >
                <span className="text-[#FDFBF5] text-lg font-bold tracking-[0.15em]">NOAH</span>
              </div>
              <div className="flex items-baseline justify-between px-1">
                <div className="text-[#1A1F2E] text-[13px] font-semibold tracking-[0.15em]">RADAR</div>
                <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: '#8B6F2A' }}>v2.0 · 全平台</div>
              </div>
            </div>
          </div>

          <nav className="p-3">
            {moduleConfig.map((m) => {
              const Icon = m.icon;
              const active = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className="w-full flex items-center justify-between px-4 py-3 mb-1 transition-all text-left group"
                  style={{
                    background: active ? 'linear-gradient(90deg, rgba(139, 111, 42, 0.08) 0%, transparent 100%)' : 'transparent',
                    borderLeft: active ? '2px solid #8B6F2A' : '2px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-[18px] h-[18px]" style={{ color: active ? '#8B6F2A' : '#8A8578' }} />
                    <span style={{ color: active ? '#1A1F2E' : '#4A5268', fontSize: '14px', letterSpacing: '0.02em' }}>{m.name}</span>
                  </div>
                  {m.badge !== null && (
                    <span className="text-[10px] px-2 py-0.5 font-medium" style={{
                      background: active ? 'rgba(139, 111, 42, 0.15)' : 'rgba(74, 82, 104, 0.08)',
                      color: active ? '#8B6F2A' : '#8A8578',
                      borderRadius: '2px',
                    }}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mx-3 my-4 p-4 border" style={{
            borderColor: 'rgba(139, 111, 42, 0.08)',
            background: 'rgba(139, 111, 42, 0.04)',
          }}>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-3 h-3" style={{ color: '#8B6F2A' }} />
              <span className="text-[11px] uppercase tracking-widest" style={{ color: '#8B6F2A' }}>更新状态</span>
            </div>
            <div className="text-[11px] space-y-2" style={{ color: '#8A8578' }}>
              <div className="flex justify-between">
                <span>上次更新</span>
                <span style={{ color: '#4A5268' }}>{formatTime(radarData.lastUpdated) || '08:00'}</span>
              </div>
              <div className="flex justify-between">
                <span>今日早报</span>
                <span style={{ color: '#4A5268' }}>{dailyBriefing.length} 条</span>
              </div>
              <div className="flex justify-between">
                <span>全平台选题</span>
                <span style={{ color: '#4A5268' }}>{topics.length} 个</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ===== Main Content ===== */}
        <main className="flex-1 px-10 py-8 max-w-[1400px]">

          {/* ===== Header ===== */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: 'rgba(139, 111, 42, 0.12)' }}>
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] mb-2" style={{ color: '#8B6F2A' }}>
                {(radarData.lastUpdated || '').includes('T') ? new Date(radarData.lastUpdated).toLocaleDateString('en-US', { weekday: 'long' }) : 'Wednesday'} · 8:00 AM
              </div>
              <div className="text-[#1A1F2E] text-3xl font-light" style={{ letterSpacing: '0.02em' }}>
                {formatDate(radarData.lastUpdated) || '2026 年 5 月 6 日'}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(74, 122, 74, 0.1)', border: '1px solid rgba(74, 122, 74, 0.35)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4A7A4A', boxShadow: '0 0 8px #4A7A4A' }} />
                <span className="text-[12px]" style={{ color: '#4A7A4A' }}>数据就绪</span>
              </div>
              <button
                onClick={() => setCrawlModalOpen(true)}
                className="px-4 py-2 text-[12px] flex items-center gap-2 transition-all hover:brightness-95"
                style={{ background: 'rgba(139, 111, 42, 0.08)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.15)' }}
              >
                <RefreshCw className="w-3 h-3" />
                🔄 手动刷新数据
              </button>
            </div>
          </div>

          {/* ===== Module 1: 今日早报 ===== */}
          {activeModule === 'briefing' && (
            <div>
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide">🌅 今日早报</h2>
                <span className="text-[12px]" style={{ color: '#8A8578' }}>
                  3 条今日最火话题 · 与全球华人高净值人群直接相关
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {dailyBriefing.map((b) => (
                  <div
                    key={b.id}
                    className="group relative overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 111, 42, 0.08) 0%, rgba(253, 251, 245, 0.9) 100%)',
                      border: '1px solid rgba(139, 111, 42, 0.08)',
                    }}
                    onClick={() => { setActiveModule('topics'); setExpandedTopic(b.id); }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #8B6F2A 0%, transparent 100%)' }} />
                    <div className="p-6">
                      <h3 className="text-[#1A1F2E] text-[17px] mb-3 leading-snug font-medium">{b.title}</h3>

                      <div className="flex items-start gap-3 p-3 mb-4" style={{ background: 'rgba(139, 111, 42, 0.06)', borderLeft: '2px solid #8B6F2A' }}>
                        <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#8B6F2A' }} />
                        <div className="text-[12px] leading-relaxed" style={{ color: '#1A1F2E' }}>{b.oneLineNoahAngle}</div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] uppercase tracking-wider mr-1" style={{ color: '#8A8578' }}>评分</span>
                          {getScoreStars(b.score)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(b.suitablePlatforms || []).map((pid) => (
                          <span
                            key={pid}
                            className="text-[10px] px-2 py-0.5"
                            style={{ background: 'rgba(139, 111, 42, 0.1)', color: '#7A5D20', border: '1px solid rgba(139, 111, 42, 0.2)' }}
                          >
                            #{platformLabelMap[pid] || pid}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Module 2: 重点新闻 ===== */}
          {activeModule === 'news' && (
            <div>
              <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide mb-6">📰 重点新闻</h2>

              <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'rgba(139, 111, 42, 0.12)' }}>
                {[
                  { id: 'macro', label: '宏观', icon: Globe },
                  { id: 'market', label: '市场', icon: TrendingUp },
                  { id: 'hnwi', label: '高净值华人', icon: Heart },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = newsTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setNewsTab(t.id)}
                      className="flex items-center gap-2 px-5 py-3 text-[13px] transition-all"
                      style={{
                        color: active ? '#8B6F2A' : '#8A8578',
                        borderBottom: active ? '2px solid #8B6F2A' : '2px solid transparent',
                        marginBottom: '-1px',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                {(newsData[newsTab] || []).map((n) => (
                  <div
                    key={n.id}
                    className="p-5 transition-all hover:translate-x-1"
                    style={{
                      background: 'rgba(139, 111, 42, 0.04)',
                      border: '1px solid rgba(139, 111, 42, 0.1)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px]" style={{ color: '#8A8578' }}>{n.source}</span>
                          <span className="text-[11px]" style={{ color: '#A8A598' }}>· {n.time}</span>
                        </div>
                        <div className="text-[15px] mb-2" style={{ color: '#1A1F2E' }}>{n.title}</div>
                        <div className="text-[12px] leading-relaxed" style={{ color: '#4A5268' }}>{n.summary}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(buildNewsToTopicPrompt(n), '✅ 已复制策划选题 Prompt，请到 Claude 对话粘贴')}
                          className="px-3 py-2 text-[11px] flex items-center gap-1.5 transition-all hover:brightness-95"
                          style={{ background: 'rgba(139, 111, 42, 0.08)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.2)' }}
                        >
                          <Copy className="w-3 h-3" /> 策划成选题
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Module 3: 90天日历 ===== */}
          {activeModule === 'calendar' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide">📅 未来 90 天财经日历</h2>
                <div className="flex gap-1">
                  {[
                    { id: 'list', label: '列表视图' },
                    { id: 'month', label: '月视图' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setCalendarView(v.id)}
                      className="px-4 py-2 text-[12px]"
                      style={{
                        background: calendarView === v.id ? 'rgba(139, 111, 42, 0.08)' : 'transparent',
                        color: calendarView === v.id ? '#8B6F2A' : '#8A8578',
                        border: calendarView === v.id ? '1px solid rgba(139, 111, 42, 0.3)' : '1px solid rgba(74, 82, 104, 0.1)',
                      }}
                    >{v.label}</button>
                  ))}
                </div>
              </div>

              {calendarView === 'list' && (
                <div className="space-y-2">
                  {calendarEvents.map((e) => (
                    <div
                      key={e.date + e.event}
                      className="p-4 flex items-center gap-5 transition-all hover:translate-x-1"
                      style={{
                        background: 'rgba(139, 111, 42, 0.04)',
                        border: '1px solid rgba(139, 111, 42, 0.1)',
                        borderLeft: `3px solid ${
                          e.importance === 3 ? '#8B6F2A' : e.importance === 2 ? '#D4A04F' : '#8A8578'
                        }`,
                      }}
                    >
                      <div className="text-center" style={{ minWidth: '70px' }}>
                        <div className="text-[14px]" style={{ color: '#1A1F2E' }}>{e.date.replace('2026-', '').replace('-', '月').replace('-', '日')}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5" style={{
                            color: '#7A5D20',
                            background: 'rgba(122, 93, 32, 0.08)',
                          }}>
                            {CATEGORY_LABELS[e.category] || e.category}
                          </span>
                          <span style={{ color: '#8B6F2A', fontSize: '12px' }}>
                            {'⭐'.repeat(e.importance)}
                          </span>
                        </div>
                        <div className="text-[14px] mb-0.5" style={{ color: '#1A1F2E' }}>{e.event}</div>
                        <div className="text-[12px]" style={{ color: '#8A8578' }}>{e.brief}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(buildCalendarAnglesPrompt(e), '✅ 已复制切入角度 Prompt，请到 Claude 对话粘贴')}
                        className="px-3 py-2 flex items-center gap-1.5 text-[11px] transition-all hover:brightness-95 flex-shrink-0"
                        style={{ background: 'rgba(139, 111, 42, 0.06)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.2)' }}
                      >
                        <Copy className="w-3 h-3" /> 展开角度
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {calendarView === 'month' && (
                <div className="grid grid-cols-7 gap-0" style={{ border: '1px solid rgba(139, 111, 42, 0.12)' }}>
                  {['一', '二', '三', '四', '五', '六', '日'].map((d) => (
                    <div key={d} className="p-3 text-center text-[11px] uppercase tracking-widest" style={{
                      background: 'rgba(139, 111, 42, 0.06)',
                      color: '#8B6F2A',
                      borderBottom: '1px solid rgba(139, 111, 42, 0.12)',
                    }}>{d}</div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = i;
                    let dateStr = '';
                    if (day >= 0 && day <= 24) dateStr = `2026-05-${String(day + 7).padStart(2, '0')}`;
                    else if (day >= 25) dateStr = `2026-06-${String(day - 24).padStart(2, '0')}`;
                    const event = calendarEvents.find((e) => e.date === dateStr);
                    return (
                      <div key={i} className="min-h-[90px] p-2 border-r border-b" style={{
                        borderColor: 'rgba(139, 111, 42, 0.1)',
                      }}>
                        <div className="text-[10px] mb-2" style={{ color: '#8A8578' }}>
                          {dateStr.slice(8)}
                        </div>
                        {event && (
                          <div
                            className="p-1.5 mb-1 text-[10px] leading-tight cursor-pointer"
                            style={{
                              background: 'rgba(139, 111, 42, 0.1)',
                              borderLeft: `2px solid ${event.importance === 3 ? '#8B6F2A' : '#D4A04F'}`,
                              color: '#1A1F2E',
                            }}
                          >
                            {event.event}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== Module 4: 全平台选题生成器 ===== */}
          {activeModule === 'topics' && (
            <div>
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide mb-1">🎬 全平台选题生成器</h2>
                  <p className="text-[12px]" style={{ color: '#8A8578' }}>
                    每个选题下挂 9 个平台按钮 · 点击复制对应 Prompt 到 Claude 对话使用
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {summary.firstChoicePlatform && (
                    <span className="text-[12px]" style={{ color: '#8A8578' }}>
                      首发推荐 · <span style={{ color: '#8B6F2A' }}>{summary.firstChoicePlatform}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {topics.map((t) => {
                  const isExpanded = expandedTopic === t.id;
                  const hintOpen = expandedHints[t.id];
                  return (
                    <div key={t.id} className="overflow-hidden transition-all" style={{
                      background: 'linear-gradient(135deg, rgba(139, 111, 42, 0.05) 0%, rgba(253, 251, 245, 0.6) 100%)',
                      border: '1px solid rgba(139, 111, 42, 0.12)',
                      boxShadow: '0 1px 2px rgba(26, 31, 46, 0.03), 0 2px 8px rgba(26, 31, 46, 0.02)',
                    }}>
                      <div className="p-6">
                        {/* Header row */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] px-2 py-0.5 flex items-center gap-1" style={{
                            background: PRIORITY_BG[t.priority],
                            color: PRIORITY_COLORS[t.priority],
                            border: `1px solid ${PRIORITY_COLORS[t.priority]}40`,
                          }}>
                            {PRIORITY_LABELS[t.priority] || t.priority}
                          </span>
                          <span className="text-[11px]" style={{ color: '#8A8578' }}>
                            🗓️ {t.source}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[20px] mb-4 leading-snug" style={{ color: '#1A1F2E' }}>{t.title}</h3>

                        {/* Background & Angle */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3" style={{ background: 'rgba(74, 82, 104, 0.04)' }}>
                            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>📌 背景</div>
                            <div className="text-[13px] leading-relaxed" style={{ color: '#4A5268' }}>{t.background}</div>
                          </div>
                          <div className="p-3" style={{ background: 'rgba(139, 111, 42, 0.06)', borderLeft: '2px solid #8B6F2A' }}>
                            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8B6F2A' }}>💡 诺亚的角度</div>
                            <div className="text-[13px] leading-relaxed" style={{ color: '#1A1F2E' }}>{t.noahAngle}</div>
                          </div>
                        </div>

                        {/* Quotes */}
                        <div className="flex gap-4 mb-4">
                          <div className="flex-1 p-3 text-center" style={{ background: 'rgba(139, 111, 42, 0.04)' }}>
                            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>🔑 中文金句</div>
                            <div className="text-[13px] italic leading-relaxed" style={{ color: '#1A1F2E', fontFamily: '"Noto Serif SC", serif' }}>「{t.quote_zh}」</div>
                          </div>
                          <div className="flex-1 p-3 text-center" style={{ background: 'rgba(139, 111, 42, 0.04)' }}>
                            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>🔑 英文金句</div>
                            <div className="text-[12px] italic leading-relaxed" style={{ color: '#1A1F2E' }}>"{t.quote_en}"</div>
                          </div>
                        </div>

                        {/* Platform Hints (collapsible) */}
                        {t.platformHints && (
                          <div className="mb-4">
                            <button
                              onClick={() => setExpandedHints((prev) => ({ ...prev, [t.id]: !prev[t.id] }))}
                              className="flex items-center gap-1.5 text-[12px] mb-2"
                              style={{ color: '#8A8578' }}
                            >
                              <MessageSquare className="w-3 h-3" />
                              查看平台思路
                              <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: hintOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                            </button>
                            {hintOpen && (
                              <div className="grid grid-cols-3 gap-2 p-4" style={{ background: 'rgba(139, 111, 42, 0.04)', border: '1px solid rgba(139, 111, 42, 0.1)' }}>
                                {PLATFORM_CONFIG.map((p) => {
                                  const hint = t.platformHints[p.id];
                                  return hint ? (
                                    <div key={p.id} className="text-[11px] leading-relaxed" style={{ color: '#4A5268' }}>
                                      <span style={{ color: p.color, fontWeight: 500 }}>{p.label}：</span>
                                      {hint}
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 9 Platform Buttons */}
                        <div className="pt-4 border-t" style={{ borderColor: 'rgba(139, 111, 42, 0.1)' }}>
                          <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: '#8B6F2A' }}>
                            📱 复制平台 Prompt
                          </div>
                          <PlatformButtons
                            topic={t}
                            copyToClipboard={copyToClipboard}
                            copiedPlatforms={copiedPlatforms}
                            setCopiedPlatforms={setCopiedPlatforms}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== Footer ===== */}
          <div className="mt-16 pt-6 border-t text-center" style={{ borderColor: 'rgba(139, 111, 42, 0.1)' }}>
            <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: '#8A8578' }}>
              NOAH Content Radar · v2.0 · 全平台选题中枢
            </div>
            <div className="text-[10px] mt-1" style={{ color: '#A8A598' }}>
              服务于诺亚品牌部全平台内容策划 · 数据更新：每日 08:00（GMT+8）
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
