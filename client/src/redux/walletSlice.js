import { createSlice } from "@reduxjs/toolkit";
import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from "@bandprotocol/bandchain.js";
import { grpcUrl } from "../api";

const client = new Client(grpcUrl);

const initialState = {
  address: null,
  mnemonic: "",
  balance: 0,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addWallet: (state, action) => {
      state.address = action.payload.address;
      state.mnemonic = action.payload.mnemonic;
    },
    removeWallet: (state, action) => {
      state.address = "";
      state.mnemonic = "";
      state.balance = 0;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload.balance;
    },
  },
});

export const { addWallet, removeWallet, updateBalance } = walletSlice.actions;

export default walletSlice.reducer;
