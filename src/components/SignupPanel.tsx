import { Button, Container, Title, Stack, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { useAuth0 } from "@auth0/auth0-react";
import { setSignupFlag } from "../utils/signupUtils";

export function SignupPanel() {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    // Marquer que c'est un processus de signup
    setSignupFlag();
    loginWithRedirect({
      authorizationParams: { 
        screen_hint: 'signup' 
      }
    });
  };

  return (
    <Container size="xs" py="xl">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Stack gap="md" align="center">
          <ThemeIcon color="blue" size="xl" radius="xl">
            <IconUserPlus size={32} />
          </ThemeIcon>
          <Title order={2} ta="center">
            Créez votre compte DiveHub
          </Title>
          <Text ta="center" color="dimmed">
            L’inscription est rapide et gratuite. Rejoignez la communauté DiveHub pour gérer vos plongées et équipements.
          </Text>
          <Button
            leftSection={<IconUserPlus size={18} />}
            size="md"
            onClick={() => handleSignup()}
          >
            S’enregistrer
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}