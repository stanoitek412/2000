import { Shield, CheckCircle, Lock, Eye, Key, AlertTriangle } from 'lucide-react';

export function SecurityChecklist() {
  const items = [
    {
      icon: Lock,
      title: '密钥本地存储',
      desc: '所有密钥材料使用 tcx-wasm 在设备本地生成和管理，永远不会传输到任何服务器。',
    },
    {
      icon: Key,
      title: '自托管签名',
      desc: '交易签名完全在浏览器端 WASM 环境中完成，私钥在签名后立即从内存中清除。',
    },
    {
      icon: Eye,
      title: '透明交易解码',
      desc: '签名前完整展示交易详情，包括收款地址、金额、网络等，防止盲签。',
    },
    {
      icon: Shield,
      title: '多层安全审查',
      desc: '支付前强制完成安全检查清单，确保用户充分了解交易风险。',
    },
    {
      icon: AlertTriangle,
      title: '风险实时提示',
      desc: '每一步操作都提供清晰的风险提示和安全建议，帮助用户做出明智决策。',
    },
    {
      icon: CheckCircle,
      title: '用户完全控制',
      desc: '用户拥有完全的资产控制权，可以随时导出助记词、重置钱包，无需任何第三方许可。',
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--surface-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <Shield size={28} color="var(--primary)" />
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>安全设计</div>
        <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
          基于 Token UI Security 材料的安全架构
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              style={{
                padding: '14px',
                background: 'var(--card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reference */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: 'var(--surface-blue)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '11px',
          color: 'var(--text-secondary-gray)',
          lineHeight: 1.6,
        }}
      >
        <strong>参考来源：</strong>Token UI Security SKILL.md — Wallet Risk Control Security Skill。
        本项目的安全设计深度参考了 Token UI 官方安全材料，包括核心威胁参考（恶意合约交互与盲签、钓鱼与地址欺骗、授权滥用）、
        签名前解码与展示要求、安全检查清单等。
      </div>
    </div>
  );
}
