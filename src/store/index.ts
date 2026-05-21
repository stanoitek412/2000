import { create } from 'zustand';
import type { Product } from '../data/products';
import type { ParsedIntent } from '../lib/intent-parser';

export interface WalletState {
  isInitialized: boolean;
  keystoreJson: string | null;
  password: string | null;
  address: string | null;
  mnemonic: string | null;
  chain: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SecurityCheck {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  severity: 'info' | 'warning' | 'danger';
}

export interface PaymentState {
  step: 'cart' | 'security-review' | 'signing' | 'success';
  redemptionCode: string | null;
  txHash: string | null;
  signature: string | null;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  intent?: ParsedIntent;
}

interface AppState {
  wallet: WalletState;
  setWallet: (wallet: Partial<WalletState>) => void;
  resetWallet: () => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;

  payment: PaymentState;
  setPayment: (payment: Partial<PaymentState>) => void;
  resetPayment: () => void;

  securityChecks: SecurityCheck[];
  toggleSecurityCheck: (id: string) => void;
  resetSecurityChecks: () => void;

  aiMessages: AIMessage[];
  addAIMessage: (message: AIMessage) => void;
  clearAIMessages: () => void;

  showDemoBanner: boolean;
  setShowDemoBanner: (show: boolean) => void;
}

const defaultSecurityChecks: SecurityCheck[] = [
  {
    id: 'verify-merchant',
    label: '验证商户身份',
    description: '确认 Bitrefill 是经过验证的合法商户，拥有良好的行业声誉和用户评价。',
    checked: false,
    severity: 'info',
  },
  {
    id: 'check-amount',
    label: '核对支付金额',
    description: '确认支付金额与商品价格一致，没有额外的隐藏费用或不合理收费。',
    checked: false,
    severity: 'warning',
  },
  {
    id: 'verify-address',
    label: '验证收款地址',
    description: '确认收款地址属于 Bitrefill 官方地址，而非钓鱼或恶意地址。完整地址已显示，未截断。',
    checked: false,
    severity: 'danger',
  },
  {
    id: 'check-network',
    label: '确认网络类型',
    description: '确认当前使用的是正确的区块链网络（Ethereum Mainnet），而非测试网或其他链。',
    checked: false,
    severity: 'warning',
  },
  {
    id: 'understand-irreversible',
    label: '理解交易不可逆',
    description: '区块链交易一旦确认将无法撤回。请确认您了解此操作的不可逆性。',
    checked: false,
    severity: 'danger',
  },
  {
    id: 'key-self-custody',
    label: '确认密钥自托管',
    description: '您的私钥始终由您自己掌控，签名过程在本地完成，密钥不会离开您的设备。',
    checked: false,
    severity: 'info',
  },
];

const initialWallet: WalletState = {
  isInitialized: false,
  keystoreJson: null,
  password: null,
  address: null,
  mnemonic: null,
  chain: 'ETHEREUM',
};

const initialPayment: PaymentState = {
  step: 'cart',
  redemptionCode: null,
  txHash: null,
  signature: null,
};

export const useStore = create<AppState>((set) => ({
  wallet: { ...initialWallet },
  setWallet: (wallet) =>
    set((state) => ({ wallet: { ...state.wallet, ...wallet } })),
  resetWallet: () => set({ wallet: { ...initialWallet } }),

  cart: [],
  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  clearCart: () => set({ cart: [] }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart:
        quantity <= 0
          ? state.cart.filter((item) => item.product.id !== productId)
          : state.cart.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
    })),

  payment: { ...initialPayment },
  setPayment: (payment) =>
    set((state) => ({ payment: { ...state.payment, ...payment } })),
  resetPayment: () => set({ payment: { ...initialPayment } }),

  securityChecks: [...defaultSecurityChecks],
  toggleSecurityCheck: (id) =>
    set((state) => ({
      securityChecks: state.securityChecks.map((check) =>
        check.id === id ? { ...check, checked: !check.checked } : check
      ),
    })),
  resetSecurityChecks: () =>
    set({ securityChecks: [...defaultSecurityChecks] }),

  aiMessages: [],
  addAIMessage: (message) =>
    set((state) => ({ aiMessages: [...state.aiMessages, message] })),
  clearAIMessages: () => set({ aiMessages: [] }),

  showDemoBanner: true,
  setShowDemoBanner: (show) => set({ showDemoBanner: show }),
}));
