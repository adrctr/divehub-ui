import { Card, Text, Group, Badge, ActionIcon } from "@mantine/core";
import type { Dive } from "../types/Dive";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
interface DiveCardsListProps {
  dive: Dive;
  deleteDive: (diveId: number) => Promise<void>;
}

export function DiveCard({ dive, deleteDive }: DiveCardsListProps) {
  return (
    <Card key={dive.diveId} shadow="sm" padding="md" radius="md" withBorder>
      <Group mb="xs">
        <Text>{dive.diveName}</Text>
        <Badge color="blue" variant="light">
          {new Date(dive.diveDate).toLocaleDateString()}
        </Badge>
      </Group>
      <Text size="sm" mb="xs">
        {dive.description}
      </Text>
      <Group>
        <Text size="sm">Profondeur : {dive.depth} m</Text>
        <Text size="sm">Durée : {dive.duration} min</Text>
      </Group>
      <Group justify="space-flex end" mb="xs">
        <Text size="sm">Équipement :</Text>
        {Array.isArray(dive.equipments) && dive.equipments.length > 0 ? (
          dive.equipments.map((eq) => (
            <Badge key={eq.equipmentId} color="green" variant="light">
              {eq.equipmentName}
            </Badge>
          ))
        ) : (
          <Badge color="gray" variant="light">
            Aucun équipement
          </Badge>
        )}
      </Group>
      <Group justify="space-flex end" mb="xs">
        <ActionIcon
          onClick={() => deleteDive(dive.diveId)}
          size="md"
          color="red"
          aria-label="Danger variant"
        >
          <IconTrash />
        </ActionIcon>
        <ActionIcon
          component={Link}
          to={`/dives/${dive.diveId}/edit`}
          size="md"
          color="blue"
          aria-label="Edit dive"
        >
          <IconEdit />
        </ActionIcon>
      </Group>
    </Card>
  );
}
