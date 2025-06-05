import { useEffect, useState } from 'react';
import { Table, Title, Loader, Center, Text } from '@mantine/core';

export interface Dive {
  id: number;
  date: Date;
  location: string;
  depth: number;
}

export default function DiveList() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://localhost:7186/api/Dive/All') // <-- adapte si tu utilises HTTP
      .then((res) => {
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(setDives)
      .catch((err) => {
        console.error('Erreur lors du chargement des plongées :', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (dives.length === 0) {
    return <Text>Aucune plongée enregistrée pour le moment.</Text>;
  }

  return (
    <>
      <Title order={2} mb="md">Liste des plongées</Title>
      <Table striped highlightOnHover withTableBorder>
        <thead>
          <tr>
            <th>Date</th>
            <th>Lieu</th>
            <th>Profondeur (m)</th>
          </tr>
        </thead>
        <tbody>
          {dives.map((dive) => (
            <tr key={dive.id}>
              <td>{new Date(dive.date).toLocaleDateString()}</td>
              <td>{dive.location}</td>
              <td>{dive.depth}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}