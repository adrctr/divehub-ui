import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Burger,
  Stack,
  NavLink,
  Container,
  Title,
  Button,
} from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure();
    const { logout, user} = useAuth0();

  const handleNavClick = () => {
    // Ferme le menu uniquement si on est en mobile (width < sm)
    close();
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <span style={{ fontWeight: 600, fontSize: 20 }}>DiveHub</span>
           <Group>
            <Title order={5} fw={400} style={{ marginRight: 16 }}>
              Bienvenue, {user?.name}
            </Title>
            <Button
              color="red"
              size="xs"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Se déconnecter
            </Button>
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
        <Container size={"md"} >
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
