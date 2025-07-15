// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { Button, Container, Title, Loader, Center } from "@mantine/core";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiveList from "./pages/DiveList";
import EditDive from "./pages/EditDive";
import Home from "./pages/Home";
import NewDive from "./pages/NewDive";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dives" element={<DiveList />} />
              <Route path="dives/:id/edit" element={<EditDive />} />
              <Route path="dives/new" element={<NewDive />} />
            </Route>
          </Routes>
          <Container mt="xl">
            <Title order={4}>Bienvenue, {user?.name}</Title>
            <Button
              color="red"
              mt="md"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Se déconnecter
            </Button>
          </Container>
        </BrowserRouter>
      ) : (
        <Container>
          <Title>Bienvenue sur DiveHub</Title>
          <Button mt="md" onClick={() => loginWithRedirect()}>
            Se connecter
          </Button>
          <Button mt="md" variant="outline" onClick={() => loginWithRedirect({ screen_hint: "signup" })}>
            S'enregistrer
          </Button>
        </Container>
      )}
    </>
  );
}
