import { Card, Group, Text } from "@mantine/core";
import { useDiveApi } from "../hooks/useDiveApi";

export function DivesStats() {
  const { dives } = useDiveApi();

  return (
    <Card withBorder p="xl" radius="md">
      <div>
        <Text fz="xl">Statistiques des plongées</Text>
        <Group mt="lg">
          <Text fz="md" c="dimmed">
            Plongées enregistrées : {dives.length}
          </Text>
          <Text fz="md" c="dimmed">
            Profondeur max :{" "}
            {dives.length > 0
              ? Math.max(...dives.map((dive) => dive.depth))
              : "N/A"}{" "}
            m
          </Text>
            <Text fz="md" c="dimmed">
            Durée moyenne :{" "}
            {dives.length > 0
              ? (
                dives.reduce((sum, dive) => sum + (dive.duration ?? 0), 0) /
                dives.length
              )
              : "N/A"}{" "}
            min
            </Text>
        </Group>
      </div>
    </Card>
  );
}
