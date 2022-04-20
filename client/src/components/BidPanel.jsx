import React from 'react'

const lastBids = [
  { address: "0xMY-ADDRESS", value: 42 },
  { address: "0xMY-ADDRESS", value: 41 },
  { address: "0xMY-ADDRESS", value: 40 },
]

const BidPanel = () => {
  return (
    <div className='bidContainer'>
      <h2>Bid Area</h2>
      <div className='bidPanel'>
        <div className='bidImage'>Image</div>
        <div className='bidDetails'>
          <h1>ODDLY ENOUGH 1:1 NFT</h1>
          <p>Ali Chaaban XYKONE</p>
          <div className='flexBasic'>
            <div className='flexItem'>
              <p>Current Bid</p>
              <h2>Eth Value</h2>
            </div>
            <div className='flexItem'>
              <p>Auction ends in</p>
              <h2>Time to the end</h2>
            </div>
          </div>
          <div className='flexBasic'>
            <input className='flexGrow' type="text" placeholder="place bid" />
            <button >Place Bid</button>
          </div>
          <p style={{ textAlign: "left" }}>Last bids</p>
          {lastBids.slice(-3).map(({ address, value }) => (
            <div className='flexBasic'>
              <div className='flexGrow'> {address} </div>
              <div> {value} Eth</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BidPanel