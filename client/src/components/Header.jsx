import React from 'react'
import { useEtherBalance, useEthers } from '@usedapp/core';
import { shortenAddress } from '../utils/helpers';
import { useBid } from '../utils/hooks';
import { formatEther } from 'ethers/lib/utils';

const Header = () => {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const { auctionInterface } = useBid();
  const accountBalance = useEtherBalance(account);
  console.log('in Header', auctionInterface);
  return (
    <div>
      {!account ? (
        <h2>
          Please connect your wallet.
        </h2>
      )
        : (
          <h2>
            {`Connected Wallet: ${shortenAddress(account)}`}
            <br />
            {`Your Balance: ${formatEther(accountBalance)} Eth`}
          </h2>
        )
      }
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