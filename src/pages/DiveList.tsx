import { Title, Loader, Center, Text, Button, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useDiveApi } from "../hooks/useDiveApi";
import { DiveForm } from "../components/DiveForm.tsx";
import { DiveCardsList } from "../components/DiveCardsList";
/**
 * Composant pour afficher la liste des plongées.
 * Récupère les données depuis l'API et les affiche dans un tableau.
 */
export default function DiveList() {
  const { dives, loading, error, addNewDive, removeDive } = useDiveApi();
  const [opened, { open, close }] = useDisclosure(false);

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
        <Button onClick={open} variant="filled">
          Ajouter une plongée
        </Button>
        <DiveForm opened={opened} addNewDive={addNewDive} close={close} />


      </>
    );
  }

  return (
    <>
      <Flex direction={"column"} gap={"lg"} justify={"center"}>
        <Title order={2} mb="md">
          Liste des plongées
        </Title>
      <Button onClick={open} variant="filled">
        Ajouter une plongée
      </Button>
        <DiveCardsList dives={dives} deleteDive={removeDive} />
        <DiveForm opened={opened} addNewDive={addNewDive} close={close} />
      </Flex>
    </>
  );
}
