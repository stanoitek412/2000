/**
 * tcx-wasm Integration Layer
 * 
 * This module wraps the @consenlabs/tcx-wasm package to provide:
 * - Wallet creation (with mnemonic generation)
 * - Wallet import (from existing mnemonic)
 * - Transaction signing (self-custodial)
 * 
 * All operations run entirely in the browser via WebAssembly.
 * Key material never leaves the user's device.
 * 
 * If WASM fails to load (e.g., unsupported browser), a fallback
 * mock implementation is used for demonstration purposes.
 */

let wasmInitialized = false;
let wasmAvailable = false;

export async function initWasm(): Promise<boolean> {
  if (wasmInitialized) return wasmAvailable;

  try {
    // Dynamic import to prevent build-time resolution issues
    const tcxModule = await import('@consenlabs/tcx-wasm');
    
    // The default export is the init function (named __wbg_init in source)
    const initFn = tcxModule.default;
    if (typeof initFn === 'function') {
      await initFn();
    }
    
    wasmInitialized = true;
    wasmAvailable = true;
    console.log('[tcx-wasm] ✅ Initialized successfully');
    return true;
  } catch (err) {
    console.warn('[tcx-wasm] ⚠️ Failed to initialize, using fallback:', err);
    wasmInitialized = true;
    wasmAvailable = false;
    return false;
  }
}

export function isWasmReady(): boolean {
  return wasmAvailable;
}

export interface CreateWalletParams {
  password: string;
  mnemonic?: string;
  network?: 'MAINNET' | 'TESTNET';
}

export interface WalletResult {
  keystoreJson: string;
  address: string;
  mnemonic: string;
  isFallback?: boolean;
}

export async function createWallet(params: CreateWalletParams): Promise<WalletResult> {
  const available = await initWasm();

  if (available) {
    try {
      const tcxModule = await import('@consenlabs/tcx-wasm');

      const keystoreJson = tcxModule.create_keystore(
        JSON.stringify({
          password: params.password,
          mnemonic: params.mnemonic || '',
          network: params.network || 'MAINNET',
        })
      );

      const accounts = JSON.parse(
        tcxModule.derive_accounts(
          JSON.stringify({
            keystoreJson,
            key: params.password,
            derivations: [
              {
                chain: 'ETHEREUM',
                derivationPath: "m/44'/60'/0'/0/0",
                chainId: '1',
                network: params.network || 'MAINNET',
              },
            ],
          })
        )
      );

      const address = accounts[0]?.address || '';

      const mnemonicResult = JSON.parse(
        tcxModule.export_mnemonic(
          JSON.stringify({
            keystoreJson,
            key: params.password,
          })
        )
      );

      return {
        keystoreJson,
        address,
        mnemonic: mnemonicResult.mnemonic,
      };
    } catch (err) {
      console.warn('[tcx-wasm] create_keystore failed, using fallback:', err);
    }
  }

  // Fallback: generate mock wallet for demo
  return generateFallbackWallet(params);
}

export async function importWallet(mnemonic: string, password: string): Promise<WalletResult> {
  return createWallet({ password, mnemonic, network: 'MAINNET' });
}

export interface SignTxParams {
  keystoreJson: string;
  password: string;
  to: string;
  value: string;
  chainId?: string;
  gasPrice?: string;
  gasLimit?: string;
  nonce?: string;
}

export interface SignTxResult {
  signature: string;
  txHash: string;
  isFallback?: boolean;
}

export async function signTransaction(params: SignTxParams): Promise<SignTxResult> {
  const available = await initWasm();

  if (available) {
    try {
      const tcxModule = await import('@consenlabs/tcx-wasm');

      const result = JSON.parse(
        tcxModule.sign_tx(
          JSON.stringify({
            keystoreJson: params.keystoreJson,
            key: params.password,
            chain: 'ETHEREUM',
            derivationPath: "m/44'/60'/0'/0/0",
            input: {
              nonce: params.nonce || '0',
              gasPrice: params.gasPrice || '20000000000',
              gasLimit: params.gasLimit || '21000',
              to: params.to,
              value: params.value,
              chainId: params.chainId || '1',
            },
          })
        )
      );

      return {
        signature: result.signature,
        txHash: result.txHash,
      };
    } catch (err) {
      console.warn('[tcx-wasm] sign_tx failed, using fallback:', err);
    }
  }

  // Fallback
  return generateFallbackSignature(params);
}

// ==================== Fallback Implementations ====================

function generateFallbackWallet(params: CreateWalletParams): WalletResult {
  const addrHex = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  const address = `0x${addrHex}`;

  const wordList = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  ];
  const mnemonic = params.mnemonic ||
    Array.from({ length: 12 }, () => wordList[Math.floor(Math.random() * wordList.length)]).join(' ');

  const keystoreJson = JSON.stringify({
    version: 3,
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    address: addrHex,
    crypto: {
      ciphertext: 'demo-encrypted-key-data',
      cipherparams: { iv: 'demo-iv' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: { dklen: 32, salt: 'demo-salt', n: 262144, r: 8, p: 1 },
      mac: 'demo-mac',
    },
    _isFallback: true,
  });

  return { keystoreJson, address, mnemonic, isFallback: true };
}

function generateFallbackSignature(_params: SignTxParams): SignTxResult {
  const sigHex = Array.from({ length: 130 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  const hashHex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return {
    signature: `0x${sigHex}`,
    txHash: `0x${hashHex}`,
    isFallback: true,
  };
}
