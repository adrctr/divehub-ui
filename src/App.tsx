// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Loader, Center } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiveList from "./pages/DiveList";
import EditDive from "./pages/EditDive";
import Home from "./pages/Home";
import NewDive from "./pages/NewDive";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthPanel } from "./components/AuthPanel";
import { SignupPanel } from "./components/SignupPanel";
import { AuthProvider } from "./components/AuthProvider";

export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }
  console.log("App rendered, isAuthenticated:", isAuthenticated);

  // Si connecté, affiche le header de bienvenue + bouton logout, puis le routeur
  return (
    <>
      <Notifications />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {isAuthenticated ? (
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="signin" element={<AuthPanel />} />
                <Route path="signup" element={<SignupPanel />} />
                <Route path="dives" element={<DiveList />} />
                <Route path="dives/:id/edit" element={<EditDive />} />
                <Route path="dives/new" element={<NewDive />} />
              </Route>
            ) : (
              <>
                <Route path="/" element={<AuthPanel />} />
                <Route path="signup" element={<SignupPanel />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
