import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ShoppingCart, AlertTriangle } from 'lucide-react';
import { parseIntent } from '../../lib/intent-parser';
import { useStore, type AIMessage } from '../../store';
import { products } from '../../data/products';
import { useNavigate } from 'react-router-dom';

export function AIChat() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { aiMessages, addAIMessage, addToCart, wallet } = useStore();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    addAIMessage(userMessage);
    setInput('');
    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const intent = parseIntent(userMessage.content);

    const assistantMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: intent.responseText,
      timestamp: Date.now(),
      intent,
    };
    addAIMessage(assistantMessage);
    setIsProcessing(false);
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  const quickActions = [
    '给我买一张 100 美元的 Amazon 礼品卡',
    '帮我充值 30 美元 AT&T 话费',
    '有什么游戏礼品卡推荐？',
    '我想买 Steam 充值卡',
    '推荐一些热门礼品卡',
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px - 72px)',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {aiMessages.length === 0 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--brand-secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
              }}
            >
              🤖
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
              AI 电商助手
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
              用自然语言告诉我您想要什么，<br />
              我会帮您找到商品并完成下单
            </p>

            {/* Quick Actions */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '20px',
                textAlign: 'left',
              }}
            >
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  style={{
                    padding: '10px 14px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--foreground)',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'var(--surface-blue)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--card)';
                  }}
                >
                  <Sparkles size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className="animate-fade-in"
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius:
                  msg.role === 'user'
                    ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)'
                    : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--card)',
                color: msg.role === 'user' ? '#fff' : 'var(--foreground)',
                fontSize: '14px',
                lineHeight: 1.6,
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              }}
            >
              {msg.content}

              {/* Show matched products */}
              {msg.role === 'assistant' && msg.intent && msg.intent.matchedProducts.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {msg.intent.matchedProducts.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: 'var(--background)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{product.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                          {product.currency} {product.price}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        style={{
                          padding: '4px 10px',
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <ShoppingCart size={12} />
                        加购
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--card)',
                borderRadius: 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
                border: '1px solid var(--border)',
                fontSize: '14px',
                color: 'var(--muted-foreground)',
              }}
            >
              <span className="animate-pulse">🤔 正在理解您的意图...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--background)',
        }}
      >
        {!wallet.keystoreJson && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: 'var(--warning-surface)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '8px',
              fontSize: '11px',
              color: 'var(--warning)',
            }}
          >
            <AlertTriangle size={12} />
            请先创建钱包才能下单购买
          </div>
        )}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="输入您的需求，如「给我买一张 Amazon 礼品卡」"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              color: 'var(--foreground)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              background: input.trim() ? 'var(--primary)' : 'var(--muted)',
              color: input.trim() ? '#fff' : 'var(--muted-foreground)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
