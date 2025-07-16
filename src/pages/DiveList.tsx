import {
  Title,
  Loader,
  Center,
  Text,
  Flex,
  SimpleGrid,
  Group,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useDiveApi } from "../hooks/useDiveApi";
import { DiveCard } from "../components/DiveCard";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

/**
 * Composant pour afficher la liste des plongées.
 * Récupère les données depuis l'API et les affiche dans un tableau.
 */
export default function DiveList() {
  const { dives, loading, error, removeDive } = useDiveApi();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (error) {
    return <Text>Erreur lors du chargement des plongées : {error}</Text>;
  }

  return (
    <Flex direction="column" gap="lg" justify="center">
      <Group justify="space-between" mb="md">
        <Title order={2}>Liste des plongées</Title>
        <Tooltip label="Ajouter une plongée" withArrow>
          <ActionIcon
            color="blue"
            size="xl"
            variant="filled"
            onClick={() => navigate("/dives/new")}
            aria-label="Ajouter une plongée"
          >
            <IconPlus size={28} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {!dives || dives.length === 0 ? (
        <Text>Aucune plongée enregistrée pour le moment.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {dives.map((dive) => (
            <DiveCard key={dive.diveId} dive={dive} deleteDive={removeDive} />
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
}
