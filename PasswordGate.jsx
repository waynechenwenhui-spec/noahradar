import React, { useState, useEffect } from 'react';

const PASSWORD = 'noah2026';
const STORAGE_KEY = 'noah-radar-auth';

// ============ Logo (和 App.jsx 里同款) ============
// 从 App.jsx 里复制过来的诺亚 logo base64
const NOAH_LOGO = "data:image/jpeg;base64,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";

function PasswordGate({ children }) {
  const [authorized, setAuthorized] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'ok';
    } catch (e) {
      return false;
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === PASSWORD) {
      try { sessionStorage.setItem(STORAGE_KEY, 'ok'); } catch (err) {}
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (authorized) {
    return children;
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #F7F3EA 0%, #FDFBF5 50%, #F7F3EA 100%)',
        fontFamily: '"PingFang SC", "Noto Serif SC", "Source Han Serif", serif',
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake-anim { animation: shake 0.45s ease; }
      `}</style>

      <div
        className={shake ? 'shake-anim' : ''}
        style={{
          width: '420px',
          maxWidth: '92vw',
          background: '#FDFBF5',
          border: '1px solid rgba(139, 111, 42, 0.15)',
          boxShadow: '0 2px 8px rgba(26, 31, 46, 0.04), 0 12px 32px rgba(26, 31, 46, 0.05)',
          padding: '48px 40px',
        }}
      >
        {/* Logo */}
        <div
          className="mb-8 flex items-center justify-center"
          style={{
            background: '#000000',
            borderRadius: '2px',
            padding: '14px 24px',
          }}
        >
          <img src={NOAH_LOGO} alt="NOAH" style={{ height: 'auto', width: '100%', maxWidth: '180px' }} />
        </div>

        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#8B6F2A',
              marginBottom: '12px',
            }}
          >
            Content Intelligence
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#1A1F2E',
              letterSpacing: '0.02em',
              marginBottom: '6px',
              fontWeight: 500,
            }}
          >
            NOAH Content Radar
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#8A8578',
              letterSpacing: '0.05em',
            }}
          >
            · 请输入访问密码 ·
          </div>
        </div>

        {/* 输入框 */}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(false);
            }}
            autoFocus
            placeholder="请输入密码"
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(139, 111, 42, 0.04)',
              border: error ? '1px solid #C55A3B' : '1px solid rgba(139, 111, 42, 0.2)',
              color: '#1A1F2E',
              fontSize: '14px',
              letterSpacing: '0.1em',
              outline: 'none',
              fontFamily: 'inherit',
              borderRadius: '2px',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => !error && (e.target.style.borderColor = '#8B6F2A')}
            onBlur={(e) => !error && (e.target.style.borderColor = 'rgba(139, 111, 42, 0.2)')}
          />

          {error && (
            <div
              style={{
                color: '#C55A3B',
                fontSize: '12px',
                marginTop: '8px',
                letterSpacing: '0.05em',
              }}
            >
              密码错误,请重试
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '14px',
              background: 'linear-gradient(90deg, #8B6F2A 0%, #6B5220 100%)',
              color: '#FDFBF5',
              border: 'none',
              fontSize: '13px',
              letterSpacing: '0.3em',
              cursor: 'pointer',
              fontFamily: 'inherit',
              borderRadius: '2px',
              transition: 'filter 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.filter = 'brightness(1.1)')}
            onMouseLeave={(e) => (e.target.style.filter = 'brightness(1)')}
          >
            进  入
          </button>
        </form>

        {/* 底部说明 */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(139, 111, 42, 0.1)',
            textAlign: 'center',
            fontSize: '10px',
            color: '#A8A598',
            letterSpacing: '0.1em',
          }}
        >
          诺亚海外内容策划团队内部工具 · 请勿外传链接
        </div>
      </div>
    </div>
  );
}

export default PasswordGate;
