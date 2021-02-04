//Ethersjs stuff
import { Contract } from "@ethersproject/contracts";
import { isAddress } from "@ethersproject/address";

export default function fetcher(library, ...args) {
  if (isAddress(args[0])) {
    const [address, abi, method, ...params] = args;
    const contract = new Contract(address, abi, library.getSigner());
    return contract[method](...params);
  }
  const [method, ...params] = args;
  return library[method](...params);
}
