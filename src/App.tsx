// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { Loader, Center } from "@mantine/core";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiveList from "./pages/DiveList";
import EditDive from "./pages/EditDive";
import Home from "./pages/Home";
import NewDive from "./pages/NewDive";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthPanel } from "./components/AuthPanel";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  // Affiche le panneau d'authentification si non connecté
  if (!isAuthenticated) {
    return <AuthPanel />;
  }

  // Si connecté, affiche le header de bienvenue + bouton logout, puis le routeur
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dives" element={<DiveList />} />
            <Route path="dives/:id/edit" element={<EditDive />} />
            <Route path="dives/new" element={<NewDive />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
