import { createContext, useContext } from "react";
import { DEFAULT_DESIGN } from "./registry";

export const UiDesignContext = createContext({
  design: DEFAULT_DESIGN,
  setDesign: () => {},
  loading: false,
  preview: null,
});

export function useUiDesign() {
  return useContext(UiDesignContext);
}
