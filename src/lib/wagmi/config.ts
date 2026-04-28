import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';
const enableTestnet = import.meta.env.VITE_ENABLE_TESTNET === 'true';

export const wagmiConfig = getDefaultConfig({
  appName: 'Prediction Market',
  projectId,
  chains: enableTestnet ? [arbitrumSepolia] : [arbitrum],
  ssr: false,
});
