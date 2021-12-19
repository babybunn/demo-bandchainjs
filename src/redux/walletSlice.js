import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
  name: "",
  privateKey: null,
  pubkey: null,
  balance: 0,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addWallet: (state, action) => {
      state.address = action.payload.address;
      state.name = action.payload.name;
      state.privateKey = action.payload.privateKey;
      state.pubkey = action.payload.pubkey;
      state.balance = action.payload.balance;
    },
    removeWallet: (state, action) => {
      state.address = null;
      state.name = "";
      state.privateKey = null;
      state.pubkey = null;
      state.balance = 0;
    },
  },
});

export const { addWallet, removeWallet } = walletSlice.actions;

export default walletSlice.reducer;
