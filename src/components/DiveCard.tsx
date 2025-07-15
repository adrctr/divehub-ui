import { Card, Text, Group, Badge, ActionIcon, Tooltip, Stack, Divider } from "@mantine/core";
import type { Dive } from "../types/Dive";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";

interface DiveCardsListProps {
  dive: Dive;
  deleteDive: (diveId: number) => Promise<void>;
}

export function DiveCard({ dive, deleteDive }: DiveCardsListProps) {
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            {dive.diveName}
          </Text>
          <Badge color="blue" variant="light">
            {new Date(dive.diveDate).toLocaleDateString()}
          </Badge>
        </Group>
        <Text size="sm" color="dimmed" mb="xs">
          {dive.description || (
            <span style={{ color: "#888" }}>Aucune description</span>
          )}
        </Text>
        <Divider />
        <Group gap="md">
          <Text size="sm">
            Profondeur : <b>{dive.depth} m</b>
          </Text>
          <Text size="sm">
            Durée : <b>{dive.duration} min</b>
          </Text>
        </Group>
        <Group gap="xs" wrap="wrap">
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
        <Divider />
        <Group justify="flex-end" gap="xs">
          <Tooltip label="Supprimer" withArrow>
            <ActionIcon
              onClick={() => deleteDive(dive.diveId)}
              size="lg"
              color="red"
              variant="light"
              aria-label="Supprimer la plongée"
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Modifier" withArrow>
            <ActionIcon
              component={Link}
              to={`/dives/${dive.diveId}/edit`}
              size="lg"
              color="blue"
              variant="light"
              aria-label="Modifier la plongée"
            >
              <IconEdit size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
}
