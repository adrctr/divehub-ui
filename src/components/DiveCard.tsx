import { 
  Card, 
  Text, 
  Group, 
  Badge, 
  ActionIcon, 
  Tooltip, 
  Stack, 
  Divider, 
  Avatar,
  Transition,
  Box,
  ThemeIcon,
  RingProgress,
  Flex
} from "@mantine/core";
import type { Dive } from "../types/Dive";
import { 
  IconEdit, 
  IconTrash, 
  IconMapPin, 
  IconClock, 
  IconRipple,
  IconFish,
  IconCalendar,
  IconToolsKitchen2
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface DiveCardsListProps {
  dive: Dive;
  deleteDive: (diveId: number) => Promise<void>;
}

export function DiveCard({ dive, deleteDive }: DiveCardsListProps) {
  const [hovered, setHovered] = useState(false);
  
  // Calculer une couleur basée sur la profondeur
  const getDepthColor = (depth: number) => {
    if (depth < 10) return "green";
    if (depth < 20) return "yellow";
    if (depth < 30) return "orange";
    return "red";
  };

  // Calculer un pourcentage pour la visualisation de la profondeur (max 40m)
  const depthPercentage = Math.min((dive.depth / 40) * 100, 100);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card 
      shadow={hovered ? "xl" : "md"} 
      padding="lg" 
      radius="lg" 
      withBorder
      style={{ 
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
        background: hovered ? 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)' : undefined
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Stack gap="md">
        {/* En-tête avec titre et date */}
        <Group justify="space-between" align="flex-start">
          <Box style={{ flex: 1 }}>
            <Group gap="sm" align="center">
              <ThemeIcon 
                size="lg" 
                radius="lg" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
              >
                <IconFish size={20} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="xl" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.25)' }} lineClamp={1}>
                  {dive.diveName}
                </Text>
                <Group gap={4} align="center" mt={2}>
                  <IconCalendar size={14} color="#666" />
                  <Text size="sm" c="dimmed">
                    {formatDate(dive.diveDate)}
                  </Text>
                </Group>
              </div>
            </Group>
          </Box>
          
          {/* Badge supprimé à la demande de l'utilisateur */}
        </Group>

        {/* Description */}
        {dive.description ? (
          <Text size="sm" style={{ lineHeight: 1.5, color: '#e0e0e0', textShadow: '0 1px 6px rgba(0,0,0,0.18)' }}>
            {dive.description}
          </Text>
        ) : (
          <Text size="sm" style={{ color: '#b0b0b0', fontStyle: 'italic', textShadow: '0 1px 6px rgba(0,0,0,0.18)' }}>
            Aucune description disponible
          </Text>
        )}

        <Divider variant="dashed" />

        {/* Statistiques principales avec icônes et couleurs */}
        <Group gap="lg" grow>
          <Flex direction="column" align="center" gap="xs">
            <Group gap="xs" align="center">
              <ThemeIcon 
                size="sm" 
                radius="xl" 
                color={getDepthColor(dive.depth)}
                variant="light"
              >
                <IconRipple size={16} />
              </ThemeIcon>
              <Text size="sm" c="dimmed" fw={500}>
                Profondeur
              </Text>
            </Group>
            <Group gap="xs" align="center">
              <RingProgress
                size={40}
                thickness={4}
                sections={[{ value: depthPercentage, color: getDepthColor(dive.depth) }]}
                label={
                  <Text size="xs" ta="center" fw={700}>
                    {dive.depth}m
                  </Text>
                }
              />
            </Group>
          </Flex>

          <Flex direction="column" align="center" gap="xs">
            <Group gap="xs" align="center">
              <ThemeIcon 
                size="sm" 
                radius="xl" 
                color="indigo"
                variant="light"
              >
                <IconClock size={16} />
              </ThemeIcon>
              <Text size="sm" c="dimmed" fw={500}>
                Durée
              </Text>
            </Group>
            <Group gap="xs" align="center">
              <Text size="xl" fw={700} c="indigo">
                {dive.duration}
              </Text>
              <Text size="sm" c="dimmed">
                min
              </Text>
            </Group>
          </Flex>
        </Group>

        {/* Section équipement */}
        <Box>
          <Group gap="xs" align="center" mb="xs">
            <ThemeIcon 
              size="sm" 
              radius="xl" 
              color="green"
              variant="light"
            >
              <IconToolsKitchen2 size={16} />
            </ThemeIcon>
            <Text size="sm" fw={600} style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
              Équipement utilisé
            </Text>
          </Group>
          
          <Group gap="xs" wrap="wrap">
            {Array.isArray(dive.equipments) && dive.equipments.length > 0 ? (
              dive.equipments.map((eq) => (
                <Badge 
                  key={eq.equipmentId} 
                  color="green" 
                  variant="dot"
                  size="md"
                  style={{ textTransform: 'none' }}
                >
                  {eq.equipmentName}
                </Badge>
              ))
            ) : (
              <Badge color="gray" variant="outline" size="md">
                Aucun équipement renseigné
              </Badge>
            )}
          </Group>
        </Box>

        <Divider />

        {/* Actions avec animation */}
        <Group justify="flex-end" gap="sm">
          <Transition 
            mounted={hovered} 
            transition="slide-left" 
            duration={200}
          >
            {(styles) => (
              <div style={styles}>
                <Tooltip label="Supprimer cette plongée" withArrow position="top">
                  <ActionIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDive(dive.diveId);
                    }}
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'red', to: 'pink' }}
                    aria-label="Supprimer la plongée"
                    style={{ 
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Tooltip>
              </div>
            )}
          </Transition>

          <Tooltip label="Modifier cette plongée" withArrow position="top">
            <ActionIcon
              component={Link}
              to={`/dives/${dive.diveId}/edit`}
              size="lg"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              aria-label="Modifier la plongée"
              style={{ 
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
}
