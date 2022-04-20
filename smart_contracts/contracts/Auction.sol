//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.12;

import "ERC721Holder.sol";
import "Ownable.sol";
import "ReentrancyGuard.sol";
import "Address.sol";
import "PaymentSplitter.sol";
import "IERC721.sol";

contract Auction is ERC721Holder, Ownable, ReentrancyGuard, PaymentSplitter {
    enum AUCTION_STATE {
        OPEN,
        CLOSED
    }

    /// ------------------------------------------------------
    /// Storage var
    /// ------------------------------------------------------

    ///@notice Timestamp when auction was started
    uint256 public startAuction;

    ///@notice Timestamp when auction was finished (24h after starting)
    uint256 public endAuction;

    ///@notice Price in ether of the current winning bid
    uint256 public bidPrice;

    ///@notice Address of the current winner bidder
    address public bidder;

    ///@notice Track when someone made a bid
    bool private isBidded = false;

    ///@notice NFT address
    address NFTaddress;

    ///@notice State of the auction
    AUCTION_STATE private auctionState = AUCTION_STATE.CLOSED;

    /// ------------------------------------------------------
    /// Constants
    /// ------------------------------------------------------

    ///@notice Auction will last for 24h (86400 seconds)
    uint256 private constant AUCTION_DURATION = 86400;

    ///@notice Min price for NFT
    uint256 private constant MIN_PRICE = 5 ether;

    ///@notice A new bid must be 0.2 ether greater
    uint256 private constant MIN_BID = 200000000000000000;

    ///@notice Address of the team
    address[] private addressTeam = [
        0x66aB6D9362d4F35596279692F0251Db635165871,
        0x33A4622B82D4c04a53e170c638B944ce27cffce3,
        0x0063046686E46Dc6F15918b61AE2B121458534a5
    ];

    ///@notice Share for address
    uint256[] private sharesTeam = [10, 10, 80];

    /// ------------------------------------------------------
    /// Events
    /// ------------------------------------------------------

    event LaunchAuction(uint256 StartTimestamp, uint256 EndTimestamp);
    event Bid(address indexed BidderAddress, uint256 BidPrice);

    /// ------------------------------------------------------
    /// Errors
    /// ------------------------------------------------------

    error Error_AuctionNotClosed();
    error Error_AuctionNotOpen();
    error Error_AuctionDeadlineEnded();
    error Error_BidTooLow(uint256 yourBid, uint256 expectedBid);
    error Error_AuctionNotEnded();

    /// ------------------------------------------------------
    /// Init
    /// ------------------------------------------------------
    constructor() PaymentSplitter(addressTeam, sharesTeam) {}

    /// ------------------------------------------------------
    /// Admin action
    /// ------------------------------------------------------

    function startingAuction(address _NFTaddress) external onlyOwner {
        if (auctionState != AUCTION_STATE.CLOSED) {
            revert Error_AuctionNotClosed();
        }
        auctionState = AUCTION_STATE.OPEN;
        startAuction = block.timestamp;
        endAuction = startAuction + AUCTION_DURATION;
        NFTaddress = _NFTaddress;
        emit LaunchAuction(startAuction, endAuction);
    }

    function endingAuction() external onlyOwner {
        if (block.timestamp < endAuction) {
            revert Error_AuctionNotEnded();
        }
        IERC721(NFTaddress).approve(bidder, 1);
        IERC721(NFTaddress).safeTransferFrom(address(this), bidder, 1);
    }

    function withdrawFund() external onlyOwner {
        if (block.timestamp < endAuction) {
            revert Error_AuctionNotEnded();
        }

        release(payable(addressTeam[0]));
        release(payable(addressTeam[1]));
        release(payable(addressTeam[2]));
    }

    /// ------------------------------------------------------
    /// Users actions
    /// ------------------------------------------------------

    function setBid() external payable nonReentrant {
        if (auctionState == AUCTION_STATE.CLOSED) {
            revert Error_AuctionNotOpen();
        }
        if (block.timestamp > endAuction) {
            revert Error_AuctionDeadlineEnded();
        }
        if (msg.value < MIN_PRICE) {
            revert Error_BidTooLow({
                yourBid: msg.value,
                expectedBid: MIN_PRICE
            });
        }
        if (msg.value < (bidPrice + MIN_BID)) {
            revert Error_BidTooLow({
                yourBid: msg.value,
                expectedBid: bidPrice + MIN_BID
            });
        }
        if (isBidded == false) {
            // Handle first bid
            _setBidder(msg.sender, msg.value);
            isBidded = true;
        } else {
            // Handle other bids
            uint256 _valueToSend = bidPrice;
            address _recipient = bidder;
            bidPrice = 0;
            Address.sendValue(payable(_recipient), _valueToSend);
            _setBidder(msg.sender, msg.value);
        }
    }

    /// ------------------------------------------------------
    /// Internal functions
    /// ------------------------------------------------------

    function _setBidder(address _bidder, uint256 _bidPrice) private {
        bidder = _bidder;
        bidPrice = _bidPrice;
        emit Bid(_bidder, _bidPrice);
    }
}
