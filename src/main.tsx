import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

console.log("Auth0 domain:", domain);
console.log("Auth0 clientId:", clientId);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
    </MantineProvider>
  </React.StrictMode>
);
