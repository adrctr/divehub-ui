import { Card, Text, Group, Badge, SimpleGrid, ActionIcon } from "@mantine/core";
import type { Dive } from "../types/Dive";
import { IconTrash } from "@tabler/icons-react";
interface DiveCardsListProps {
  dives: Dive[];
  deleteDive: (diveId: number) => Promise<void>;
}

export function DiveCardsList({ dives, deleteDive }: DiveCardsListProps) {
  return (
    <SimpleGrid cols={3}>
      {dives.map((dive) => (
        <>
          {/* If you want to add a button to edit the dive, you can add it here. */}
          {/* <Button onClick={() => openEditForm(dive)}>Modifier</Button> */}
          <Card
            key={dive.diveId}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
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
            <Group justify="flex-end" mb="xs">
              <ActionIcon
                onClick={() => deleteDive(dive.diveId)}
                size="md"
                color="red"
                aria-label="Danger variant"
              >
                <IconTrash />
              </ActionIcon>
            </Group>
          </Card>
        </>
      ))}
    </SimpleGrid>
  );
}
