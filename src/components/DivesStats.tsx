import { Card, Group, Text, ThemeIcon, Stack, Divider, Tooltip } from "@mantine/core";
import { IconChartBar, IconStackBack, IconClock, IconList } from "@tabler/icons-react";
import { useDiveApi } from "../hooks/useDiveApi";

export function DivesStats() {
  const { dives } = useDiveApi();

  const maxDepth =
    dives.length > 0 ? Math.max(...dives.map((dive) => dive.depth)) : "N/A";
  const avgDuration =
    dives.length > 0
      ? (
          dives.reduce((sum, dive) => sum + (dive.duration ?? 0), 0) / dives.length
        ).toFixed(0)
      : "N/A";

  return (
    <Card withBorder p="xl" radius="md" shadow="md">
      <Stack gap="xs">
        <Group gap="xs">
          <ThemeIcon color="blue" size="lg" radius="xl">
            <IconChartBar size={22} />
          </ThemeIcon>
          <Text fz="xl" fw={700}>Statistiques des plongées</Text>
        </Group>
        <Divider my="sm" />
        <Group gap="xl" grow>
          <Tooltip label="Nombre total de plongées" withArrow>
            <Group gap={6}>
              <ThemeIcon color="teal" radius="xl">
                <IconList size={18} />
              </ThemeIcon>
              <Text fz="md" fw={500}>Plongées :</Text>
              <Text fz="md">{dives.length}</Text>
            </Group>
          </Tooltip>
          <Tooltip label="Profondeur maximale enregistrée" withArrow>
            <Group gap={6}>
              <ThemeIcon color="blue" radius="xl">
                <IconStackBack size={18} />
              </ThemeIcon>
              <Text fz="md" fw={500}>Max profondeur :</Text>
              <Text fz="md">{maxDepth} m</Text>
            </Group>
          </Tooltip>
          <Tooltip label="Durée moyenne des plongées" withArrow>
            <Group gap={6}>
              <ThemeIcon color="orange" radius="xl">
                <IconClock size={18} />
              </ThemeIcon>
              <Text fz="md" fw={500}>Durée moyenne :</Text>
              <Text fz="md">{avgDuration} min</Text>
            </Group>
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
}
