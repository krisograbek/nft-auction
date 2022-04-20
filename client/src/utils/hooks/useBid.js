import { ContractABI, ContractAddress } from "../constants";
import { constants, utils } from "ethers";
import { Contract } from '@ethersproject/contracts';
import { useCall } from "@usedapp/core";

export const useBid = async () => {
  const auctionInterface = new utils.Interface(ContractABI);
  const auctionContract = new Contract(ContractAddress, ContractABI);

  console.log('auctionInterface', auctionInterface);
  console.log('auctionContract', auctionContract);

  try {
    const owner = useCall({ contract: auctionContract, method: 'owner', args: [] });
    console.log(owner)

  } catch (error) {
    console.log(error)
  }

  return { auctionInterface };
}
