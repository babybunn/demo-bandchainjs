import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
  name: "",
  privateKey: "",
  pubkey: "",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addWallet: (state, action) => {
      state.address = action.payload.address;
      state.name = action.payload.name;
      state.privateKey = action.payload.privateKey;
      state.pubkey = action.payload.privateKey;
    },
    removeWallet: (state, action) => {
      state.address = null;
      state.name = "";
      state.privateKey = "";
      state.pubkey = "";
    },
  },
});

export const { addWallet, removeWallet } = walletSlice.actions;

export default walletSlice.reducer;
