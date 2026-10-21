import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./lib/theme";
import { UiDesignProvider } from "./ui-designs/UiDesignProvider";
import { confirmPreviewDesign, loadDesignCss, readPreviewRequest, readStoredDesign } from "./ui-designs/registry";
import "./index.css";

const previewRequest = readPreviewRequest();
const root = ReactDOM.createRoot(document.getElementById("root"));

(previewRequest ? confirmPreviewDesign(previewRequest) : Promise.resolve(null))
  .then((preview) => {
    const initialDesign = preview || readStoredDesign();
    document.documentElement.dataset.ui = initialDesign;
    return loadDesignCss(initialDesign);
  })
  .finally(() => {
    root.render(
      <BrowserRouter>
        <ThemeProvider>
          <UiDesignProvider>
            <App />
          </UiDesignProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  });
