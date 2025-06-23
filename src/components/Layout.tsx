import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Burger,
  Stack,
  NavLink,
  Container,
} from "@mantine/core";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure();

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
