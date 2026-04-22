import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Calendar, Radio, Users, Flame, Sparkles, ChevronRight, ExternalLink, Filter, Play, Eye, MessageCircle, Clock, Globe, Briefcase, Mic, Heart, Target, Zap, ArrowUpRight, Search, RefreshCw, Bell, ChevronDown, Tv, TrendingDown, Copy, Check, FileText } from 'lucide-react';
import radarData from './data/data.json';
import {
  buildTopicScriptPrompt,
  buildBriefingPackagePrompt,
  buildNewsToTopicPrompt,
  buildCalendarAnglesPrompt,
  buildCompetitorAnalysisPrompt,
  DAILY_CRAWL_PROMPT,
} from './prompts.js';

const NOAH_LOGO = "data:image/jpeg;base64,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";


// ===== Toast 提示组件 =====
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

// ===== 抓取 Prompt 弹窗 =====
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
          点击下方按钮复制完整的抓取 Prompt,然后到 Claude 对话里粘贴执行。Claude 会自动抓取今日新闻、竞品动态、日历节点,并生成新的 data.json 文件。
        </p>
        <div className="p-4 mb-5 max-h-64 overflow-y-auto text-[11px] leading-relaxed font-mono" style={{ background: 'rgba(139, 111, 42, 0.04)', color: '#4A5268', whiteSpace: 'pre-wrap' }}>
          {DAILY_CRAWL_PROMPT.slice(0, 600)}...
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px]" style={{ color: '#8A8578' }}>
            Prompt 长度:约 {DAILY_CRAWL_PROMPT.length} 字符
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

export default function NoahContentRadar() {
  const [activeModule, setActiveModule] = useState('briefing');
  const [newsTab, setNewsTab] = useState('macro');
  const [calendarView, setCalendarView] = useState('list');
  const [competitorTab, setCompetitorTab] = useState('youtube');
  const [competitorGroup, setCompetitorGroup] = useState('all');
  const [filterPlate, setFilterPlate] = useState('all');
  const [filterColumn, setFilterColumn] = useState('all');
  const [filterFunction, setFilterFunction] = useState('all');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [crawlModalOpen, setCrawlModalOpen] = useState(false);

  // 复制到剪贴板 + 弹 Toast
  const copyToClipboard = (text, successMsg = '✅ 已复制 Prompt,请到 Claude 对话里粘贴') => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMsg(successMsg);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    }).catch(() => {
      setToastMsg('❌ 复制失败,请检查浏览器权限');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    });
  };

  // 格式化日期
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

  // ========== 从 data.json 读取所有动态数据 ==========
  const topBriefings = radarData.briefings || [];
  const newsData = radarData.news || { macro: [], market: [], chinese: [] };
  const calendarEvents = radarData.calendar || [];
  const topics = radarData.topics || [];
  const competitorContentRaw = radarData.competitors || [];
  const weeklyInsight = radarData.weeklyInsight || {};

  // 一级板块定义(这些是诺亚官方框架,不会变,保留在代码中)
  const plates = [
    { id: 'all', name: '全部', icon: '🎯', color: '#8B6F2A' },
    { id: 'connect', name: '连接全球华人的财富世界', icon: '🌏', color: '#7A5D20' },
    { id: 'market', name: '全球市场判断', icon: '📊', color: '#3B5F8A' },
    { id: 'dialogue', name: '观点现场', icon: '🎙️', color: '#7A5D40' },
    { id: 'beyond', name: '财富之外', icon: '✨', color: '#6B5B80' },
  ];

  const columns = {
    all: '全部栏目',
    connect: ['全球华人财富观察', '品牌广告', '我们是谁', '品牌故事', '与世界同行'],
    market: ['一周世界', '诺亚CIO观察', 'Noya来了'],
    dialogue: ['诺亚对话', '人物与判断'],
    beyond: ['听见世界', '世界与家', '向善而行'],
  };

  const functions = [
    { id: 'all', name: '全部功能', color: '#8B6F2A' },
    { id: 'acquire', name: '拉新内容', color: '#C55A3B' },
    { id: 'trust', name: '建立信任', color: '#3B5F8A' },
    { id: 'warmth', name: '品牌温度', color: '#7A5D20' },
    { id: 'basic', name: '基础认知', color: '#6B5B80' },
  ];

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      if (filterPlate !== 'all' && t.plate !== filterPlate) return false;
      if (filterColumn !== 'all' && t.column !== filterColumn) return false;
      if (filterFunction !== 'all' && t.function !== filterFunction) return false;
      return true;
    });
  }, [filterPlate, filterColumn, filterFunction, topics]);

  // 竞品分组
  const competitors = useMemo(() => ({
    groupA: [...new Set(competitorContentRaw.filter(c => c.group === 'A').map(c => c.account))].map(name => ({ name })),
    groupB: [...new Set(competitorContentRaw.filter(c => c.group === 'B').map(c => c.account))].map(name => ({ name })),
  }), [competitorContentRaw]);

  // 为与原代码兼容,别名 competitorContent
  const competitorContent = competitorContentRaw;

    const moduleConfig = [
    { id: 'briefing', name: '今日早报', icon: Zap, badge: 3 },
    { id: 'news', name: '重大新闻', icon: Radio, badge: null },
    { id: 'calendar', name: '90天日历', icon: Calendar, badge: 12 },
    { id: 'topics', name: '选题生成器', icon: Sparkles, badge: 8 },
    { id: 'competitors', name: '竞品动态', icon: Users, badge: 47 },
  ];

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
          copyToClipboard(DAILY_CRAWL_PROMPT, '✅ 已复制抓取 Prompt,请到 Claude 对话粘贴执行');
          setCrawlModalOpen(false);
        }}
      />
      <div className="relative flex">
        {/* ============ 左侧导航 ============ */}
        <aside className="w-64 min-h-screen border-r sticky top-0 h-screen overflow-y-auto" style={{ 
          borderColor: 'rgba(139, 111, 42, 0.08)',
          background: 'rgba(253, 251, 245, 0.85)',
          backdropFilter: 'blur(20px)',
        }}>
          <div className="p-6 border-b" style={{ borderColor: 'rgba(139, 111, 42, 0.12)' }}>
            <div className="flex flex-col gap-3">
              <div 
                className="w-full flex items-center justify-center px-5 py-4"
                style={{
                  background: '#000000',
                  borderRadius: '2px',
                }}
              >
                <img src={NOAH_LOGO} alt="NOAH" className="w-full h-auto object-contain" />
              </div>
              <div className="flex items-baseline justify-between px-1">
                <div className="text-[#1A1F2E] text-[13px] font-semibold tracking-[0.15em]">RADAR</div>
                <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: '#8B6F2A' }}>Content Intelligence</div>
              </div>
            </div>
          </div>

          <nav className="p-3">
            {moduleConfig.map(m => {
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
                <span>上次抓取</span>
                <span style={{ color: '#4A5268' }}>今日 {formatTime(radarData.meta?.lastUpdated) || '07:00'}</span>
              </div>
              <div className="flex justify-between">
                <span>数据源</span>
                <span style={{ color: '#4A5268' }}>{radarData.meta?.sources || 18} 个</span>
              </div>
              <div className="flex justify-between">
                <span>抓取成功</span>
                <span style={{ color: '#4A7A4A' }}>✓ 100%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ============ 主内容区 ============ */}
        <main className="flex-1 px-10 py-8 max-w-[1400px]">
          
          {/* 顶部日期条 */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: 'rgba(139, 111, 42, 0.12)' }}>
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] mb-2" style={{ color: '#8B6F2A' }}>Tuesday · Morning Briefing</div>
              <div className="text-[#1A1F2E] text-3xl font-light" style={{ letterSpacing: '0.02em' }}>
                {formatDate(radarData.meta?.lastUpdated) || '2026 年 4 月 21 日'}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(74, 122, 74, 0.1)', border: '1px solid rgba(74, 122, 74, 0.35)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4A7A4A', boxShadow: '0 0 8px #4A7A4A' }} />
                <span className="text-[12px]" style={{ color: '#4A7A4A' }}>数据实时</span>
              </div>
              <button className="px-4 py-2 text-[12px] flex items-center gap-2" style={{ background: 'rgba(139, 111, 42, 0.08)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.15)' }}>
                <RefreshCw className="w-3 h-3" />
                手动刷新
              </button>
            </div>
          </div>

          {/* ============ 模块一:今日早报 ============ */}
          {activeModule === 'briefing' && (
            <div>
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide">今日必看</h2>
                <span className="text-[12px]" style={{ color: '#8A8578' }}>AI 从过去 24 小时抓取的 347 条信息中筛选</span>
              </div>
              
              <div className="grid grid-cols-1 gap-5">
                {topBriefings.map((b, i) => (
                  <div key={b.id} className="group relative overflow-hidden transition-all hover:translate-x-1" style={{
                    background: 'linear-gradient(135deg, rgba(139, 111, 42, 0.08) 0%, rgba(253, 251, 245, 0.9) 100%)',
                    border: '1px solid rgba(139, 111, 42, 0.08)',
                  }}>
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: 'linear-gradient(180deg, #8B6F2A 0%, transparent 100%)' }} />
                    
                    <div className="p-6 pl-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[11px] font-mono" style={{ color: '#8B6F2A' }}>#{String(i + 1).padStart(2, '0')}</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ background: 'rgba(197, 90, 59, 0.1)', border: '1px solid rgba(197, 90, 59, 0.25)' }}>
                          <Flame className="w-3 h-3" style={{ color: '#C55A3B' }} />
                          <span className="text-[11px]" style={{ color: '#C55A3B' }}>热度 {b.heat}</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5" style={{ color: '#8A8578', background: 'rgba(74, 82, 104, 0.06)' }}>{b.format}</span>
                      </div>
                      
                      <h3 className="text-[#1A1F2E] text-xl mb-2 leading-snug group-hover:text-[#8B6F2A] transition-colors">{b.title}</h3>
                      <p className="text-[13px] mb-5 leading-relaxed" style={{ color: '#4A5268' }}>{b.summary}</p>
                      
                      <div className="flex items-start gap-3 p-4 mb-4" style={{ background: 'rgba(139, 111, 42, 0.06)', borderLeft: '2px solid #8B6F2A' }}>
                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#8B6F2A' }} />
                        <div>
                          <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#8B6F2A' }}>诺亚视角建议</div>
                          <div className="text-[13px]" style={{ color: '#1A1F2E' }}>{b.noahAngle}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[12px]" style={{ color: '#8A8578' }}>建议栏目 · <span style={{ color: '#7A5D20' }}>{b.column}</span></span>
                        <button 
                          onClick={() => copyToClipboard(buildBriefingPackagePrompt(b), '✅ 已复制今日早报物料包 Prompt,请到 Claude 对话粘贴')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] transition-all hover:brightness-95 cursor-pointer" 
                          style={{ background: 'rgba(139, 111, 42, 0.08)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.25)' }}
                        >
                          <Copy className="w-3 h-3" /> 生成内容物料包
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ 模块二:重大新闻 ============ */}
          {activeModule === 'news' && (
            <div>
              <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide mb-6">重大新闻事件监测</h2>
              
              <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'rgba(139, 111, 42, 0.12)' }}>
                {[
                  { id: 'macro', label: '宏观财经', icon: Globe },
                  { id: 'market', label: '市场与资产', icon: TrendingUp },
                  { id: 'chinese', label: '高净值华人关注', icon: Heart },
                ].map(t => {
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
                {newsData[newsTab].map((n, i) => (
                  <div key={i} className="p-4 flex items-center gap-5 transition-all hover:translate-x-1" style={{
                    background: 'rgba(139, 111, 42, 0.04)',
                    border: '1px solid rgba(139, 111, 42, 0.1)',
                  }}>
                    <div className="text-[11px] font-mono" style={{ color: '#8A8578', minWidth: '60px' }}>{n.time}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5" style={{ 
                          color: n.tag.includes('诺亚核心') ? '#8B6F2A' : '#8A8578', 
                          background: n.tag.includes('诺亚核心') ? 'rgba(139, 111, 42, 0.08)' : 'rgba(74, 82, 104, 0.05)',
                          border: n.tag.includes('诺亚核心') ? '1px solid rgba(139, 111, 42, 0.3)' : 'none',
                        }}>{n.tag}</span>
                        <span className="text-[11px]" style={{ color: '#8A8578' }}>{n.source}</span>
                      </div>
                      <div className="text-[14px]" style={{ color: '#1A1F2E' }}>{n.title}</div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8A8578' }}>热度</div>
                        <div className="text-[13px] font-mono" style={{ color: n.heat > 85 ? '#C55A3B' : '#4A5268' }}>{n.heat}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8A8578' }}>契合</div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <div key={s} className="w-1 h-3" style={{ background: s <= n.match ? '#8B6F2A' : 'rgba(139, 111, 42, 0.1)' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ 模块三:90天日历 ============ */}
          {activeModule === 'calendar' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide">未来 90 天内容日历</h2>
                <div className="flex gap-1">
                  {[
                    { id: 'list', label: '列表视图' },
                    { id: 'month', label: '月视图' },
                  ].map(v => (
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

              {/* 三层图例 */}
              <div className="flex gap-5 mb-6 p-4" style={{ background: 'rgba(139, 111, 42, 0.04)', border: '1px solid rgba(139, 111, 42, 0.1)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#3B5F8A' }} />
                  <span className="text-[12px]" style={{ color: '#4A5268' }}>财经大事件</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#8B6F2A' }} />
                  <span className="text-[12px]" style={{ color: '#4A5268' }}>诺亚选题时点</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#7A5D40' }} />
                  <span className="text-[12px]" style={{ color: '#4A5268' }}>品牌日历</span>
                </div>
              </div>

              {calendarView === 'list' && (
                <div className="space-y-2">
                  {calendarEvents.map((e, i) => {
                    const colors = { market: '#3B5F8A', noah: '#8B6F2A', brand: '#7A5D40' };
                    return (
                      <div key={i} className="p-4 flex items-center gap-5 transition-all hover:translate-x-1 cursor-pointer" style={{
                        background: 'rgba(139, 111, 42, 0.04)',
                        border: '1px solid rgba(139, 111, 42, 0.1)',
                        borderLeft: `3px solid ${colors[e.type]}`,
                      }}>
                        <div className="text-center" style={{ minWidth: '80px' }}>
                          <div className="text-[16px]" style={{ color: '#1A1F2E' }}>{e.date}</div>
                          <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: colors[e.type] }}>
                            {e.daysAway} 天后
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5" style={{ 
                              color: colors[e.type],
                              background: `${colors[e.type]}1A`,
                            }}>{e.layer}</span>
                            {e.noah && (
                              <span className="text-[10px] px-2 py-0.5" style={{ color: '#8B6F2A', background: 'rgba(139, 111, 42, 0.12)' }}>
                                ⭐ 诺亚高适配
                              </span>
                            )}
                          </div>
                          <div className="text-[14px] mb-0.5" style={{ color: '#1A1F2E' }}>{e.title}</div>
                          <div className="text-[12px]" style={{ color: '#8A8578' }}>{e.desc}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>切入角度</div>
                          <div className="text-[18px] font-light" style={{ color: '#8B6F2A' }}>{e.angles}</div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(buildCalendarAnglesPrompt(e), '✅ 已复制日历节点切入角度 Prompt,请到 Claude 对话粘贴')}
                          className="px-3 py-2 flex items-center gap-1.5 text-[11px] transition-all hover:brightness-95 cursor-pointer flex-shrink-0"
                          style={{ background: 'rgba(139, 111, 42, 0.06)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.2)' }}
                        >
                          <Copy className="w-3 h-3" /> 展开 {e.angles} 个角度
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {calendarView === 'month' && (
                <div className="grid grid-cols-7 gap-0" style={{ border: '1px solid rgba(139, 111, 42, 0.12)' }}>
                  {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                    <div key={d} className="p-3 text-center text-[11px] uppercase tracking-widest" style={{ 
                      background: 'rgba(139, 111, 42, 0.06)',
                      color: '#8B6F2A',
                      borderBottom: '1px solid rgba(139, 111, 42, 0.12)',
                    }}>{d}</div>
                  ))}
                  {Array.from({length: 35}).map((_, i) => {
                    const day = i - 0;  // 4月21日是周一,offset 0
                    const dateStr = day >= 1 && day <= 30 ? `4月${day}日` : day > 30 && day <= 61 ? `5月${day - 30}日` : day > 61 ? `6月${day - 61}日` : '';
                    const event = calendarEvents.find(e => e.date === dateStr);
                    const colors = { market: '#3B5F8A', noah: '#8B6F2A', brand: '#7A5D40' };
                    const isToday = dateStr === '4月21日';
                    return (
                      <div key={i} className="min-h-[90px] p-2 border-r border-b" style={{ 
                        borderColor: 'rgba(139, 111, 42, 0.1)',
                        background: isToday ? 'rgba(139, 111, 42, 0.1)' : 'transparent',
                      }}>
                        <div className="text-[10px] mb-2" style={{ color: isToday ? '#8B6F2A' : '#8A8578' }}>
                          {dateStr.replace('4月', '').replace('5月', '').replace('6月', '').replace('日', '')}
                          {isToday && <span className="ml-1 text-[9px] uppercase">today</span>}
                        </div>
                        {event && (
                          <div className="p-1.5 mb-1 text-[10px] leading-tight cursor-pointer" style={{ 
                            background: `${colors[event.type]}15`,
                            borderLeft: `2px solid ${colors[event.type]}`,
                            color: '#1A1F2E',
                          }}>
                            {event.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============ 模块四:选题生成器 ============ */}
          {activeModule === 'topics' && (
            <div>
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide mb-1">选题生成器</h2>
                  <p className="text-[12px]" style={{ color: '#8A8578' }}>AI 基于前三模块自动生成 · 1:1 对齐诺亚官方内容框架</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px]" style={{ color: '#8A8578' }}>
                    匹配到 <span style={{ color: '#8B6F2A' }}>{filteredTopics.length}</span> 个选题
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_280px] gap-6">
                {/* 左侧选题流 */}
                <div className="space-y-4">
                  {filteredTopics.map(t => {
                    const plateColor = plates.find(p => p.id === t.plate)?.color || '#8B6F2A';
                    const plateName = plates.find(p => p.id === t.plate)?.name;
                    const plateIcon = plates.find(p => p.id === t.plate)?.icon;
                    const funcColor = functions.find(f => f.id === t.function)?.color;
                    const funcName = functions.find(f => f.id === t.function)?.name;
                    const isExpanded = expandedTopic === t.id;
                    
                    return (
                      <div key={t.id} className="overflow-hidden transition-all" style={{
                        background: 'linear-gradient(135deg, rgba(139, 111, 42, 0.05) 0%, rgba(253, 251, 245, 0.6) 100%)',
                        border: '1px solid rgba(139, 111, 42, 0.12)',
                        boxShadow: '0 1px 2px rgba(26, 31, 46, 0.03), 0 2px 8px rgba(26, 31, 46, 0.02)',
                      }}>
                        <div className="p-5">
                          {/* 标签行 */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-[10px] flex items-center gap-1 px-2 py-1" style={{ 
                              background: `${plateColor}15`,
                              color: plateColor,
                              border: `1px solid ${plateColor}30`,
                            }}>{plateIcon} {plateName}</span>
                            <span className="text-[10px] px-2 py-1" style={{ 
                              background: 'rgba(245, 240, 225, 0.05)',
                              color: '#7A5D20',
                            }}>📺 {t.column}</span>
                            <span className="text-[10px] px-2 py-1" style={{ 
                              background: `${funcColor}15`,
                              color: funcColor,
                            }}>{funcName}</span>
                            <span className="text-[10px] px-2 py-1" style={{ color: '#8A8578' }}>⏱ {t.format}</span>
                            <span className="text-[10px] px-2 py-1" style={{ color: '#8A8578' }}>📈 {t.priority}</span>
                          </div>
                          
                          {/* 选题标题 */}
                          <h3 className="text-[18px] mb-3 leading-snug" style={{ color: '#1A1F2E' }}>{t.title}</h3>
                          
                          {/* Hook */}
                          <div className="p-3 mb-4" style={{ background: 'rgba(139, 111, 42, 0.06)', borderLeft: '2px solid rgba(139, 111, 42, 0.4)' }}>
                            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8B6F2A' }}>Hook 建议</div>
                            <div className="text-[13px] italic" style={{ color: '#1A1F2E', fontFamily: '"Noto Serif SC", serif' }}>"{t.hook}"</div>
                          </div>
                          
                          {/* 展开的NOAH适配度自检 */}
                          {isExpanded && (
                            <div className="mb-4 p-4 space-y-2" style={{ background: 'rgba(74, 122, 74, 0.06)', border: '1px solid rgba(74, 122, 74, 0.2)' }}>
                              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#4A7A4A' }}>NOAH 适配度自检（来自官方选题判断标准）</div>
                              {[
                                { q: '它属于哪个一级板块？', a: plateName, ok: t.selfCheck.plate },
                                { q: '它承担什么作用？', a: funcName, ok: t.selfCheck.function },
                                { q: '它适合什么内容形式？', a: t.format, ok: t.selfCheck.form },
                                { q: '这是 NOAH 更适合讲的题吗？', a: '贴合全球华人视角 + 财富判断能力', ok: t.selfCheck.noah },
                              ].map((c, i) => (
                                <div key={i} className="flex items-start gap-2 text-[12px]">
                                  <div className="mt-0.5" style={{ color: c.ok ? '#4A7A4A' : '#8A8578' }}>{c.ok ? '✓' : '○'}</div>
                                  <div className="flex-1">
                                    <div style={{ color: '#4A5268' }}>{c.q}</div>
                                    <div className="mt-0.5" style={{ color: '#1A1F2E' }}>→ {c.a}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => setExpandedTopic(isExpanded ? null : t.id)}
                              className="text-[12px] flex items-center gap-1" 
                              style={{ color: '#8A8578' }}
                            >
                              {isExpanded ? '收起' : '查看适配度自检'} 
                              <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
                            </button>
                            <button 
                              onClick={() => copyToClipboard(buildTopicScriptPrompt(t), '✅ 已复制脚本大纲 Prompt,请到 Claude 对话粘贴')}
                              className="px-4 py-2 text-[12px] flex items-center gap-2 transition-all hover:brightness-110 cursor-pointer" 
                              style={{
                                background: 'linear-gradient(90deg, #8B6F2A 0%, #6B5220 100%)',
                                color: '#FDFBF5',
                              }}
                            >
                              <Copy className="w-3 h-3" /> 生成详细脚本大纲
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 右侧筛选器 */}
                <div className="space-y-6">
                  <div className="sticky top-8">
                    {/* Filter 1 */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-3 h-3" style={{ color: '#8B6F2A' }} />
                        <span className="text-[11px] uppercase tracking-widest" style={{ color: '#8B6F2A' }}>一级板块</span>
                      </div>
                      <div className="space-y-1">
                        {plates.map(p => {
                          const active = filterPlate === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => { setFilterPlate(p.id); setFilterColumn('all'); }}
                              className="w-full text-left px-3 py-2 text-[12px] transition-all flex items-center gap-2"
                              style={{
                                background: active ? `${p.color}15` : 'transparent',
                                color: active ? p.color : '#4A5268',
                                borderLeft: active ? `2px solid ${p.color}` : '2px solid transparent',
                              }}
                            >
                              <span>{p.icon}</span>
                              <span className="flex-1">{p.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filter 2 */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Tv className="w-3 h-3" style={{ color: '#8B6F2A' }} />
                        <span className="text-[11px] uppercase tracking-widest" style={{ color: '#8B6F2A' }}>栏目</span>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => setFilterColumn('all')}
                          className="w-full text-left px-3 py-2 text-[12px] transition-all"
                          style={{
                            background: filterColumn === 'all' ? 'rgba(139, 111, 42, 0.08)' : 'transparent',
                            color: filterColumn === 'all' ? '#8B6F2A' : '#4A5268',
                            borderLeft: filterColumn === 'all' ? '2px solid #8B6F2A' : '2px solid transparent',
                          }}
                        >全部栏目</button>
                        {filterPlate === 'all' 
                          ? Object.values(columns).slice(1).flat().map(c => (
                              <button
                                key={c}
                                onClick={() => setFilterColumn(c)}
                                className="w-full text-left px-3 py-2 text-[12px]"
                                style={{
                                  background: filterColumn === c ? 'rgba(139, 111, 42, 0.08)' : 'transparent',
                                  color: filterColumn === c ? '#8B6F2A' : '#4A5268',
                                  borderLeft: filterColumn === c ? '2px solid #8B6F2A' : '2px solid transparent',
                                }}
                              >{c}</button>
                            ))
                          : (columns[filterPlate] || []).map(c => (
                              <button
                                key={c}
                                onClick={() => setFilterColumn(c)}
                                className="w-full text-left px-3 py-2 text-[12px]"
                                style={{
                                  background: filterColumn === c ? 'rgba(139, 111, 42, 0.08)' : 'transparent',
                                  color: filterColumn === c ? '#8B6F2A' : '#4A5268',
                                  borderLeft: filterColumn === c ? '2px solid #8B6F2A' : '2px solid transparent',
                                }}
                              >{c}</button>
                            ))
                        }
                      </div>
                    </div>

                    {/* Filter 3 */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-3 h-3" style={{ color: '#8B6F2A' }} />
                        <span className="text-[11px] uppercase tracking-widest" style={{ color: '#8B6F2A' }}>内容功能</span>
                      </div>
                      <div className="space-y-1">
                        {functions.map(f => {
                          const active = filterFunction === f.id;
                          return (
                            <button
                              key={f.id}
                              onClick={() => setFilterFunction(f.id)}
                              className="w-full text-left px-3 py-2 text-[12px] transition-all"
                              style={{
                                background: active ? `${f.color}15` : 'transparent',
                                color: active ? f.color : '#4A5268',
                                borderLeft: active ? `2px solid ${f.color}` : '2px solid transparent',
                              }}
                            >{f.name}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ 模块五:竞品动态 ============ */}
          {activeModule === 'competitors' && (
            <div>
              <h2 className="text-[#1A1F2E] text-2xl font-light tracking-wide mb-6">竞争对手动态监测</h2>
              
              {/* 周度对标洞察 */}
              <div className="p-6 mb-8" style={{ 
                background: 'linear-gradient(135deg, rgba(197, 90, 59, 0.06) 0%, rgba(253, 251, 245, 0.3) 100%)',
                border: '1px solid rgba(197, 90, 59, 0.15)',
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4" style={{ color: '#C55A3B' }} />
                  <span className="text-[11px] uppercase tracking-widest" style={{ color: '#C55A3B' }}>本周对标洞察</span>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>竞品本周发布</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[28px] font-light" style={{ color: '#1A1F2E' }}>{weeklyInsight.competitorTotal}</span>
                      <span className="text-[12px]" style={{ color: '#8A8578' }}>条</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>诺亚本周发布</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[28px] font-light" style={{ color: '#8B6F2A' }}>{weeklyInsight.noahTotal}</span>
                      <span className="text-[12px]" style={{ color: '#8A8578' }}>条</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>高频选题</div>
                    <div className="text-[13px]" style={{ color: '#1A1F2E' }}>{weeklyInsight.topTopic}</div>
                    <div className="text-[11px] mt-1" style={{ color: '#4A7A4A' }}>✓ 诺亚已覆盖</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8A8578' }}>未覆盖热点</div>
                    <div className="text-[13px]" style={{ color: '#1A1F2E' }}>{weeklyInsight.missedTopic}</div>
                    <div className="text-[11px] mt-1" style={{ color: '#C55A3B' }}>⚠ 建议立项</div>
                  </div>
                </div>
              </div>

              {/* 监测对象 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] uppercase tracking-widest" style={{ color: '#8B6F2A' }}>监测名单</span>
                  <span className="text-[11px]" style={{ color: '#8A8578' }}>（共 12 家）</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4" style={{ background: 'rgba(139, 111, 42, 0.04)', border: '1px solid rgba(139, 111, 42, 0.12)' }}>
                    <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: '#7A5D20' }}>Group A · 海外华人财富机构</div>
                    <div className="flex flex-wrap gap-1.5">
                      {competitors.groupA.map(c => (
                        <span key={c.name} className="text-[11px] px-2 py-1" style={{ background: 'rgba(122, 93, 32, 0.08)', color: '#1A1F2E' }}>{c.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4" style={{ background: 'rgba(59, 95, 138, 0.04)', border: '1px solid rgba(59, 95, 138, 0.1)' }}>
                    <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: '#3B5F8A' }}>Group B · 全球私行/财富品牌</div>
                    <div className="flex flex-wrap gap-1.5">
                      {competitors.groupB.map(c => (
                        <span key={c.name} className="text-[11px] px-2 py-1" style={{ background: 'rgba(59, 95, 138, 0.1)', color: '#1A1F2E' }}>{c.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 平台Tab */}
              <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'rgba(139, 111, 42, 0.12)' }}>
                {[
                  { id: 'youtube', label: 'YouTube（主力）', count: 47 },
                  { id: 'linkedin', label: 'LinkedIn', count: 23 },
                  { id: 'x', label: 'X / Twitter', count: 89 },
                ].map(p => {
                  const active = competitorTab === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setCompetitorTab(p.id)}
                      className="px-5 py-3 text-[13px] flex items-center gap-2"
                      style={{
                        color: active ? '#8B6F2A' : '#8A8578',
                        borderBottom: active ? '2px solid #8B6F2A' : '2px solid transparent',
                        marginBottom: '-1px',
                      }}
                    >
                      {p.label}
                      <span className="text-[10px] px-1.5 py-0.5" style={{ background: active ? 'rgba(139, 111, 42, 0.1)' : 'rgba(74, 82, 104, 0.06)', color: active ? '#8B6F2A' : '#8A8578' }}>{p.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* 分组筛选 */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'A', label: 'Group A · 华人机构' },
                  { id: 'B', label: 'Group B · 全球私行' },
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setCompetitorGroup(g.id)}
                    className="px-3 py-1.5 text-[11px]"
                    style={{
                      background: competitorGroup === g.id ? 'rgba(139, 111, 42, 0.08)' : 'transparent',
                      color: competitorGroup === g.id ? '#8B6F2A' : '#8A8578',
                      border: competitorGroup === g.id ? '1px solid rgba(139, 111, 42, 0.3)' : '1px solid rgba(74, 82, 104, 0.08)',
                    }}
                  >{g.label}</button>
                ))}
              </div>

              {/* 内容流 */}
              {competitorTab === 'youtube' && (
                <div className="space-y-3">
                  {competitorContent
                    .filter(c => {
                      if (competitorGroup === 'all') return true;
                      const inGroupA = competitors.groupA.some(x => x.name === c.account);
                      return competitorGroup === 'A' ? inGroupA : !inGroupA;
                    })
                    .map((c, i) => (
                    <div key={i} className="p-5 transition-all hover:translate-x-1" style={{
                      background: c.viral ? 'linear-gradient(90deg, rgba(197, 90, 59, 0.06) 0%, rgba(139, 111, 42, 0.04) 100%)' : 'rgba(139, 111, 42, 0.04)',
                      border: c.viral ? '1px solid rgba(197, 90, 59, 0.25)' : '1px solid rgba(139, 111, 42, 0.12)',
                    }}>
                      <div className="flex items-start gap-4">
                        {/* 模拟缩略图 */}
                        <div className="w-32 h-20 flex-shrink-0 flex items-center justify-center relative" style={{
                          background: `linear-gradient(135deg, ${c.viral ? '#C55A3B' : '#3B5F8A'}20 0%, ${c.viral ? '#6B5220' : '#7A5D40'}20 100%)`,
                          border: '1px solid rgba(245, 240, 225, 0.1)',
                        }}>
                          <Play className="w-6 h-6" style={{ color: '#1A1F2E' }} fill="#1A1F2E" />
                          <span className="absolute bottom-1 right-1 text-[9px] px-1 font-mono" style={{ background: 'rgba(0,0,0,0.8)', color: '#1A1F2E' }}>{c.duration}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[12px]" style={{ color: '#7A5D20' }}>{c.account}</span>
                            <span className="text-[11px]" style={{ color: '#8A8578' }}>· {c.time}</span>
                            {c.viral && (
                              <span className="text-[10px] px-2 py-0.5 flex items-center gap-1" style={{ background: 'rgba(197, 90, 59, 0.15)', color: '#C55A3B', border: '1px solid rgba(197, 90, 59, 0.35)' }}>
                                <Flame className="w-2.5 h-2.5" /> 爆款预警
                              </span>
                            )}
                          </div>
                          <div className="text-[14px] mb-2" style={{ color: '#1A1F2E' }}>{c.title}</div>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-[11px] flex items-center gap-1" style={{ color: '#8A8578' }}>
                              <Eye className="w-3 h-3" /> {c.views}
                            </span>
                            <span className="text-[11px] flex items-center gap-1" style={{ color: c.viral ? '#C55A3B' : '#8A8578' }}>
                              <MessageCircle className="w-3 h-3" /> 互动率 {c.rate}
                            </span>
                          </div>
                          
                          <div className="p-3 mb-2" style={{ background: 'rgba(139, 111, 42, 0.06)', borderLeft: '2px solid #8B6F2A' }}>
                            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8B6F2A' }}>AI 摘要</div>
                            <div className="text-[12px] leading-relaxed" style={{ color: '#4A5268' }}>{c.aiSummary}</div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[11px]" style={{ 
                              color: c.overlap.includes('未覆盖') ? '#C55A3B' : c.overlap.includes('直接竞品') ? '#C55A3B' : c.overlap.includes('可对标') ? '#8B6F2A' : '#4A7A4A'
                            }}>
                              📍 {c.overlap}
                            </span>
                            <button 
                              onClick={() => copyToClipboard(buildCompetitorAnalysisPrompt(c), '✅ 已复制竞品分析 Prompt,请到 Claude 对话粘贴')}
                              className="text-[11px] flex items-center gap-1 px-2.5 py-1 transition-all hover:brightness-95 cursor-pointer"
                              style={{ background: 'rgba(139, 111, 42, 0.06)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.2)' }}
                            >
                              <Copy className="w-3 h-3" /> 深度分析
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {competitorTab === 'linkedin' && (
                <div className="p-16 text-center" style={{ background: 'rgba(139, 111, 42, 0.04)', border: '1px dashed rgba(139, 111, 42, 0.1)' }}>
                  <div className="text-[13px]" style={{ color: '#8A8578' }}>LinkedIn 抓取流 · 数据结构同 YouTube Tab</div>
                  <div className="text-[11px] mt-2" style={{ color: '#8A8578' }}>（原型演示占位 · 真实数据接入后启用）</div>
                </div>
              )}

              {competitorTab === 'x' && (
                <div className="p-16 text-center" style={{ background: 'rgba(139, 111, 42, 0.04)', border: '1px dashed rgba(139, 111, 42, 0.1)' }}>
                  <div className="text-[13px]" style={{ color: '#8A8578' }}>X / Twitter 抓取流 · 数据结构同 YouTube Tab</div>
                  <div className="text-[11px] mt-2" style={{ color: '#8A8578' }}>（原型演示占位 · 真实数据接入后启用）</div>
                </div>
              )}

              {/* 底部导出 */}
              <div className="mt-6 flex items-center justify-between p-4" style={{ background: 'rgba(139, 111, 42, 0.04)', border: '1px solid rgba(139, 111, 42, 0.1)' }}>
                <span className="text-[12px]" style={{ color: '#8A8578' }}>可导出本周竞品对标周报（PDF）</span>
                <button className="px-4 py-2 text-[12px]" style={{ background: 'rgba(139, 111, 42, 0.08)', color: '#8B6F2A', border: '1px solid rgba(139, 111, 42, 0.3)' }}>
                  下载周报 ↓
                </button>
              </div>
            </div>
          )}

          {/* ============ 底部署名 ============ */}
          <div className="mt-16 pt-6 border-t text-center" style={{ borderColor: 'rgba(139, 111, 42, 0.1)' }}>
            <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: '#8A8578' }}>
              NOAH Content Radar · v1.1 · Prototype
            </div>
            <div className="text-[10px] mt-1" style={{ color: '#A8A598' }}>
              服务于诺亚海外内容策划 / 编导团队 · 数据更新:每日 07:00 (GMT+8)
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
