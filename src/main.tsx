import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl="https://ais-dev-vogitor5wiwoqga4fthhyj-112607555481.europe-west2.run.app/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
);
