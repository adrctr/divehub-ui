import { Button, Container, Title, Stack, Paper, Text, Group, ThemeIcon } from "@mantine/core";
import { IconLogin, IconUserPlus } from "@tabler/icons-react";
import { useAuth0 } from "@auth0/auth0-react";

export function AuthPanel() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container size="xs" py="xl">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Stack gap="md" align="center">
          <ThemeIcon color="blue" size="xl" radius="xl">
            <IconLogin size={32} />
          </ThemeIcon>
          <Title order={2} ta="center">
            Bienvenue sur DiveHub
          </Title>
          <Text ta="center">
            Connectez-vous ou créez un compte pour accéder à vos plongées et statistiques.
          </Text>
          <Group grow>
            <Button
              leftSection={<IconLogin size={18} />}
              onClick={() => loginWithRedirect()}
              size="md"
            >
              Se connecter
            </Button>
            <Button
              leftSection={<IconUserPlus size={18} />}
              variant="outline"
              onClick={() => loginWithRedirect({ screen_hint: "signup" })}
              size="md"
            >
              S'enregistrer
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}