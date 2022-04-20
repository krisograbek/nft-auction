import React from 'react'
import { useEthers } from '@usedapp/core';
import { shortenAddress } from '../utils/helpers';
import { useBid } from '../utils/hooks';

const Header = () => {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const { auctionInterface } = useBid();
  console.log('in Header', auctionInterface);
  return (
    <div>
      <h2>
        {!account ? "Please connect your wallet." : `Connected Wallet: ${shortenAddress(account)}`}
      </h2>
      {!account ? (
        <button className="connect" onClick={() => activateBrowserWallet()}>
          Connect
        </button>
      ) : (
        <button className="disconnect" onClick={() => deactivate()}>
          Disconnect
        </button>
      )}
    </div>
  );
}

export default Header;