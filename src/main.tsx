import { initMercadoPago } from "@mercadopago/sdk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";

import "./index.css";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "pt-BR" });

// biome-ignore lint/style/noNonNullAssertion: required by React
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
