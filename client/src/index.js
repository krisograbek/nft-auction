import { DAppProvider, Rinkeby } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: getDefaultProvider('rinkeby'),
  },
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DAppProvider config={config}>
    <App />
  </DAppProvider>
);