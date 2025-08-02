import {
  Button,
  Container,
  Title,
  Stack,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconLogin, IconUserPlus } from "@tabler/icons-react";
import { useAuth0 } from "@auth0/auth0-react";

export function AuthPanel() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container size="xs" px="md" py="xl" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper 
        shadow="md" 
        radius="md" 
        p="xl" 
        withBorder
        style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
      >
        <Stack gap="lg" align="center">
          <ThemeIcon color="blue" size="xl" radius="xl">
            <IconLogin size={32} />
          </ThemeIcon>
          <Title 
            order={2} 
            ta="center" 
            style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", lineHeight: 1.2 }}
          >
            Bienvenue sur DiveHub
          </Title>
          <Text 
            ta="center" 
            c="dimmed"
            style={{ fontSize: "clamp(0.875rem, 3vw, 1rem)" }}
          >
            Connectez-vous ou créez un compte pour accéder à vos plongées et
            statistiques.
          </Text>

          <Stack gap="sm" w="100%">
            <Button
              fullWidth
              leftSection={<IconLogin size={18} />}
              onClick={() => loginWithRedirect()}
              size="lg"
              style={{ height: "48px" }}
            >
              Se connecter
            </Button>
            <Button
              fullWidth
              leftSection={<IconUserPlus size={18} />}
              variant="outline"
              onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
              size="lg"
              style={{ height: "48px" }}
            >
              S'enregistrer
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
