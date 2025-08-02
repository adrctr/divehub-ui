import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Burger,
  Stack,
  NavLink,
  Container,
  Avatar,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Outlet } from "react-router-dom";
import { AuthPanel } from "./AuthPanel";
import { IconLogout } from "@tabler/icons-react";
import { useEffect } from "react";
import axios from "axios";

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure();
  const { logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Configure axios with Auth0 token for all API calls
  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        })
        .catch((error) => console.error("Failed to get access token", error));
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleNavClick = () => {
    // Ferme le menu uniquement si on est en mobile (width < sm)
    close();
  };

    // Affiche le panneau d'authentification si non connecté
  if (!isAuthenticated) {
    return <AuthPanel />;
  }

  return (

    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Group align="center" gap="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={600} fz="lg">DiveHub</Text>
          </Group>
          <Group align="center" gap="sm">
            <Avatar src={user?.picture} alt={user?.name ?? ""} radius="xl" size="md" />
            <Text fw={500}>{user?.name}</Text>
            <ActionIcon
              color="red"
              variant="light"
              size="lg"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              <IconLogout size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack>
          <NavLink
            component={Link}
            to="/"
            label="Accueil"
            active={location.pathname === "/"}
            onClick={handleNavClick}
          />
          <NavLink
            component={Link}
            to="/dives"
            label="Plongées"
            active={location.pathname.startsWith("/dives")}
            onClick={handleNavClick}
          />
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size={"md"}>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
