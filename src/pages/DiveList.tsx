import {
  Title,
  Loader,
  Center,
  Text,
  Button,
  Flex,
  SimpleGrid,
} from "@mantine/core";
import { useDiveApi } from "../hooks/useDiveApi";
import { DiveCard } from "../components/DiveCard";
import { useNavigate } from "react-router-dom";

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

  if (!dives || dives.length === 0) {
    return (
      <>
        <Text>Aucune plongée enregistrée pour le moment.</Text>
        <Button variant="filled">Ajouter une plongée</Button>
      </>
    );
  }

  return (
    <Flex direction={"column"} gap={"lg"} justify={"center"}>
      <Title order={2} mb="md">
        Liste des plongées
      </Title>
      <Button onClick={() => navigate("/dives/new")} variant="filled">
        Ajouter une plongée
      </Button>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {dives.map((dive) => (
          <DiveCard key={dive.diveId} dive={dive} deleteDive={removeDive} />
        ))}
      </SimpleGrid>
    </Flex>
  );
}
