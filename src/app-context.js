import { createContext } from "react";

export const ModalContext = createContext({
  isShow: false,
  setIsShow: () => {},
});
