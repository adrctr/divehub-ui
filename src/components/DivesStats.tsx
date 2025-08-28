import { 
  Card, 
  Group, 
  Text, 
  ThemeIcon, 
  Stack, 
  SimpleGrid, 
  Skeleton,
  Badge,
  Paper,
  Box
} from "@mantine/core";
import { 
  IconChartBar, 
  IconStackBack, 
  IconClock, 
  IconList,
  IconTrendingUp,
  IconCalendar
} from "@tabler/icons-react";
import { useDiveApi } from "../hooks/useDiveApi";

export function DivesStats() {
  const { dives, loading } = useDiveApi();

  // Calculs des statistiques avec gestion des cas d'erreur
  const divesArray = Array.isArray(dives) ? dives : [];
  const totalDives = divesArray.length;
  const maxDepth = totalDives > 0 ? Math.max(...divesArray.map((dive) => dive.depth)) : 0;
  const avgDuration = totalDives > 0
    ? Math.round(divesArray.reduce((sum, dive) => sum + (dive.duration ?? 0), 0) / totalDives)
    : 0;
  
  // Dernière plongée
  const lastDive = totalDives > 0 
    ? [...divesArray].sort((a, b) => new Date(b.diveDate).getTime() - new Date(a.diveDate).getTime())[0]
    : null;

  const StatCard = ({ icon, title, value, unit, color, description, trend }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    unit?: string;
    color: string;
    description: string;
    trend?: "up" | "down" | "neutral";
  }) => (
    <Paper
      p="lg"
      radius="md"
      withBorder
      style={{
        transition: 'all 0.5s ease',
        cursor: 'pointer',
        background: 'var(--mantine-color-dark-7)',
        borderColor: 'var(--mantine-color-dark-4)',
      }}
      styles={{
        root: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--mantine-shadow-lg)',
            background: 'var(--mantine-color-dark-6)',
          }
        }
      }}
    >
      <Group justify="space-between" mb="xs">
        <Box>
          <ThemeIcon
            size="xl"
            radius="xl"
            color={color}
            variant="light"
            style={{
              background: `var(--mantine-color-${color}-9)`,
              color: `var(--mantine-color-${color}-3)`,
            }}
          >
            {icon}
          </ThemeIcon>
        </Box>
        {trend && (
          <Badge
            color={trend === "up" ? "green" : trend === "down" ? "red" : "blue"}
            variant="light"
            size="sm"
          >
            <IconTrendingUp size={12} />
          </Badge>
        )}
      </Group>
      
      <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
        {title}
      </Text>
      
      <Group gap={4} align="baseline">
        <Text size="xl" fw={700} c={`${color}.4`}>
          {loading ? "..." : value}
        </Text>
        {unit && <Text size="sm" c="dimmed">{unit}</Text>}
      </Group>
      
      <Text size="xs" c="dimmed" mt="xs">
        {description}
      </Text>
    </Paper>
  );

  if (loading) {
    return (
      <Card 
        withBorder 
        p="xl" 
        radius="md" 
        shadow="sm"
        style={{
          background: 'var(--mantine-color-dark-8)',
          borderColor: 'var(--mantine-color-dark-4)',
        }}
      >
        <Stack gap="md">
          <Group gap="xs">
            <Skeleton height={32} width={32} radius="xl" />
            <Skeleton height={24} width={200} />
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} height={120} radius="md" />
            ))}
          </SimpleGrid>
        </Stack>
      </Card>
    );
  }

  return (
    <Card 
      withBorder 
      p="xl" 
      radius="md" 
      shadow="sm"
      style={{
        background: 'var(--mantine-color-dark-8)',
        borderColor: 'var(--mantine-color-dark-4)',
      }}
    >
      <Stack gap="lg">
        {/* En-tête avec animation */}
        <Group gap="xs" style={{ animation: 'fadeInUp 0.8s ease' }}>
          <ThemeIcon 
            color="blue" 
            size="xl" 
            radius="xl"
            variant="light"
            style={{
              background: 'var(--mantine-color-blue-9)',
              color: 'var(--mantine-color-blue-3)',
            }}
          >
            <IconChartBar size={24} />
          </ThemeIcon>
          <Box>
            <Text size="xl" fw={700} c="blue.4">
              Statistiques des plongées
            </Text>
            <Text size="sm" c="dimmed">
              Aperçu de votre activité de plongée
            </Text>
          </Box>
        </Group>

        {/* Grille des statistiques */}
        <SimpleGrid 
          cols={{ base: 1, sm: 2, lg: 4 }} 
          spacing="md"
          style={{ animation: 'fadeInUp 0.8s ease' }}
        >
          <StatCard
            icon={<IconList size={20} />}
            title="Total plongées"
            value={totalDives}
            color="teal"
            description="Nombre total de plongées enregistrées"
            trend={totalDives > 0 ? "up" : "neutral"}
          />
          
          <StatCard
            icon={<IconStackBack size={20} />}
            title="Profondeur max"
            value={maxDepth}
            unit="m"
            color="blue"
            description="Record de profondeur atteint"
            trend={maxDepth > 30 ? "up" : "neutral"}
          />
          
          <StatCard
            icon={<IconClock size={20} />}
            title="Durée moyenne"
            value={avgDuration}
            unit="min"
            color="orange"
            description="Temps moyen sous l'eau"
            trend={avgDuration > 45 ? "up" : "neutral"}
          />
          
          <StatCard
            icon={<IconCalendar size={20} />}
            title="Dernière plongée"
            value={lastDive ? new Date(lastDive.diveDate).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'short' 
            }) : "Aucune"}
            color="purple"
            description={lastDive ? `${lastDive.diveName}` : "Aucune plongée enregistrée"}
            trend="neutral"
          />
        </SimpleGrid>

        {/* Message d'encouragement si aucune plongée */}
        {totalDives === 0 && (
          <Paper 
            p="md" 
            radius="md" 
            style={{
              background: 'var(--mantine-color-yellow-9)',
              color: 'var(--mantine-color-yellow-3)',
              textAlign: 'center',
              border: '1px solid var(--mantine-color-yellow-7)',
            }}
          >
            <Text size="sm" fw={500}>
              🤿 Commencez votre aventure sous-marine en ajoutant votre première plongée !
            </Text>
          </Paper>
        )}
      </Stack>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
