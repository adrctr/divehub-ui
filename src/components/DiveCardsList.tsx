import { Card, Text, Group, Badge, SimpleGrid } from "@mantine/core";
import type { Dive } from "../types/Dive";

interface DiveCardsListProps {
  dives: Dive[];
}

export function DiveCardsList({ dives }: DiveCardsListProps) {
  return (
    <SimpleGrid cols={3} >
      {dives.map((dive) => (
        <Card key={dive.diveId} shadow="sm" padding="lg" radius="md" withBorder>
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
          </Group>
        </Card>
      ))}
    </SimpleGrid >
  );
}