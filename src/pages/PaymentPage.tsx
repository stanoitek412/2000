import { Header } from '../components/layout/Header';
import { SecurityReview } from '../components/payment/SecurityReview';
import { PaymentConfirm } from '../components/payment/PaymentConfirm';
import { PaymentSuccess } from '../components/payment/PaymentSuccess';
import { useStore } from '../store';

export function PaymentPage() {
  const { payment } = useStore();

  return (
    <div>
      <Header title="支付" showBack />

      {/* Step Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          gap: '8px',
        }}
      >
        {[
          { step: 'security-review', label: '安全审查', num: 1 },
          { step: 'signing', label: '签名确认', num: 2 },
          { step: 'success', label: '支付成功', num: 3 },
        ].map((s, i) => {
          const isActive = payment.step === s.step;
          const isDone =
            payment.step === 'signing'
              ? s.step === 'security-review'
              : payment.step === 'success'
              ? s.step !== 'success'
              : false;

          return (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isActive
                    ? 'var(--primary)'
                    : isDone
                    ? 'var(--success)'
                    : 'var(--muted)',
                  color: isActive || isDone ? '#fff' : 'var(--muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {isDone ? '✓' : s.num}
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                {s.label}
              </span>
              {i < 2 && (
                <div
                  style={{
                    width: '24px',
                    height: '1px',
                    background: isDone ? 'var(--success)' : 'var(--border)',
                    margin: '0 4px',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {payment.step === 'security-review' && <SecurityReview />}
      {payment.step === 'signing' && <PaymentConfirm />}
      {payment.step === 'success' && <PaymentSuccess />}
    </div>
  );
}
