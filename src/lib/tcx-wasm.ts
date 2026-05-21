import init, {
  create_keystore,
  derive_accounts,
  sign_tx,
  export_mnemonic,
  cache_keystore,
  clear_cached_keystore,
} from '@consenlabs/tcx-wasm';

let wasmInitialized = false;

export async function initWasm(): Promise<void> {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
}

export function isWasmReady(): boolean {
  return wasmInitialized;
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
}

export async function createWallet(params: CreateWalletParams): Promise<WalletResult> {
  await initWasm();

  const keystoreJson = create_keystore(
    JSON.stringify({
      password: params.password,
      mnemonic: params.mnemonic,
      network: params.network || 'MAINNET',
    })
  );

  const accounts = JSON.parse(
    derive_accounts(
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
    export_mnemonic(
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
}

export async function signTransaction(params: SignTxParams): Promise<SignTxResult> {
  await initWasm();

  const result = JSON.parse(
    sign_tx(
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
}

export function cacheKeystore(keystoreJson: string): void {
  cache_keystore(keystoreJson);
}

export function clearCachedKeystore(): void {
  clear_cached_keystore();
}
