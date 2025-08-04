import { DivesStats } from "../components/DivesStats";
import { useAuthContext } from "../contexts/AuthContext";
import { Paper, Text, Group, Badge } from "@mantine/core";
import { combineNames } from "../utils/nameUtils";

export default function Home() {
  const { currentUser, userId } = useAuthContext();

  return (
    <>
      <h2>Bienvenue sur DiveHub 🌊</h2>
      
      {currentUser && (
        <Paper p="md" mb="lg" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">Utilisateur connecté</Text>
              <Text fw={500}>{combineNames(currentUser.firstName, currentUser.lastName)}</Text>
              <Text size="sm" c="dimmed">{currentUser.email}</Text>
            </div>
            <div>
              <Badge color="green" variant="light">
                ID Utilisateur: {userId}
              </Badge>
            </div>
          </Group>
        </Paper>
      )}
      
      <DivesStats />
    </>
  );
}
