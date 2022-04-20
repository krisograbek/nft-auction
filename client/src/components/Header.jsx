import React from 'react'
import { useEtherBalance, useEthers } from '@usedapp/core';
import { shortenAddress } from '../utils/helpers';
import { useBid } from '../utils/hooks';
import { formatEther } from 'ethers/lib/utils';

const Header = () => {
  const { activateBrowserWallet, deactivate, account, chainId } = useEthers();
  const { auctionInterface } = useBid();
  const accountBalance = useEtherBalance(account, { chainId });
  console.log('balance', accountBalance);
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
            {/* sub and mod are there to display 5 decimals */}
            {/* if you want the full number use the following line */}
            {/* {`Your Balance: ${accountBalance && formatEther(accountBalance)} Eth`} */}
            {`Your Balance: ${accountBalance && formatEther(accountBalance.sub(accountBalance.mod(1e13)))} Eth`}
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