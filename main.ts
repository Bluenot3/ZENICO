// assembly/main.ts

import { Context, storage, u128, PersistentMap } from "near-sdk-as"

@nearBindgen
class Token {
  balances: PersistentMap<string, u128> = new PersistentMap("b:");
  totalSupply: u128;

  constructor(initialSupply: u128) {
    this.totalSupply = initialSupply;
    this.balances.set(Context.sender, initialSupply);
  }

  transfer(receiver: string, amount: u128): boolean {
    let senderBalance = this.balances.getSome(Context.sender);
    if (senderBalance >= amount) {
      this.balances.set(Context.sender, senderBalance - amount);
      let receiverBalance = this.balances.get(receiver, u128.Zero);
      this.balances.set(receiver, receiverBalance + amount);
      return true;
    }
    return false;
  }
}

export function init(initialSupply: u128): Token {
  return new Token(initialSupply);
}

export function transfer(receiver: string, amount: u128): boolean {
  let contract = new Token(u128.Zero); // or load from storage
  return contract.transfer(receiver, amount);
}
