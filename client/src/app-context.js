import { createContext } from "react";

export const ModalContext = createContext({
  isShow: false,
  setIsShow: () => {},
  isShowCreateWallet: false,
  setIsShowCreateWallet: () => {},
});

export const ModalDelegateContext = createContext({
  isShowModal: false,
  setIsShowModal: () => {},
  isShowModalRedelegate: false,
  setIsShowModalRedelegate: () => {},
  isShowModalReinvest: false,
  setIsShowModalReInvest: () => {},
});
