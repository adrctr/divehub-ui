import { Table, Title, Loader, Center, Text } from '@mantine/core';
import { useDiveApi } from '../hooks/useDiveApi';
import { StatsDives } from '../components/StatsDives';
import { DiveForm } from '../components/DiveForm.tsx';
/**
 * Composant pour afficher la liste des plongées.
 * Récupère les données depuis l'API et les affiche dans un tableau.
 */
export default function DiveList() {
  const { dives, loading, error } = useDiveApi();

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (error) {
    return <Text >Erreur lors du chargement des plongées : {error}</Text>;
  }

  if (!dives || dives.length === 0) {
    return <Text>Aucune plongée enregistrée pour le moment.</Text>;
  }

  return (
    <>
    <StatsDives />
      <Title order={2} mb="md">Liste des plongées</Title>
      <Table striped highlightOnHover withTableBorder>
        <thead>
          <tr>
            <th>Nom de la plongée</th>
            <th>Date</th>
            <th>Description</th>
            <th>Profondeur (m)</th>
          </tr>
        </thead>
        <tbody>
          {dives.map((dive) => (
            <tr key={dive.diveId}>
              <td>{dive.diveName}</td>
              <td>{new Date(dive.diveDate).toLocaleDateString()}</td>
              <td>{dive.description}</td>
              <td>{dive.depth}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <DiveForm />
    </>
  );
}
