import "dayjs/locale/fr";
import { useForm } from "@mantine/form";
import {
  TextInput,
  NumberInput,
  Button,
  Textarea,
  MultiSelect,
} from "@mantine/core";
import { DatesProvider, DatePickerInput } from "@mantine/dates";
import type { Dive } from "../types/Dive";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useDiveApi } from "../hooks/useDiveApi";
import { useEquipmentApi } from "../hooks/useEquipmentApi";
import { AddEquipmentModal } from "./AddEquipmentModal";
import { useDisclosure } from "@mantine/hooks";

interface DiveFormProps {
  submitDive: (dive: Dive) => void;
  diveId?: number;
  isSubmitting?: boolean;
}

export function DiveForm(props: DiveFormProps) {
  const form = useForm<Dive>({
    initialValues: {
      diveId: props.diveId || 0,
      userId: 0, // Sera défini automatiquement côté API
      diveDate: new Date(),
      diveName: "",
      depth: 0,
      description: "",
      duration: 0,
      equipments: [],
    },
  });

  const { dives } = useDiveApi();
  const { equipments, addNewEquipment } = useEquipmentApi();

  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  const [equipmentModalOpened, { open: openEquipmentModal, close: closeEquipmentModal }] = useDisclosure(false);

  useEffect(() => {
    if (props.diveId) {
      const dive = dives.find((d) => d.diveId === props.diveId);
      if (dive) {
        form.setValues({
          diveDate: dive.diveDate ? new Date(dive.diveDate) : new Date(),
          diveName: dive.diveName || "",
          depth: dive.depth || 0,
          description: dive.description || "",
          duration: dive.duration || 0,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.diveId, dives]);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // Map selected equipment names to EquipmentDto objects
      const selectedEquipmentDtos = equipments.filter((eq) =>
        selectedEquipments.includes(eq.equipmentName)
      );

      const values = { ...form.values, equipments: selectedEquipmentDtos };
      await props.submitDive(values);
      
      // Réinitialiser le formulaire seulement si l'ajout a réussi
      form.reset();
      setSelectedEquipments([]);
      
      // Ne pas naviguer automatiquement - laisser le composant parent gérer ça
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      // L'erreur sera gérée par le composant parent
    }
  };

  // Sync selectedEquipments with form when editing an existing dive
  useEffect(() => {
    if (props.diveId) {
      const dive = dives.find((d) => d.diveId === props.diveId);
      if (dive && dive.equipments) {
        setSelectedEquipments(dive.equipments.map((eq) => eq.equipmentName));
      }
    }
  }, [props.diveId, dives]);

  return (
    <>
      <AddEquipmentModal
        opened={equipmentModalOpened}
        onClose={closeEquipmentModal}
        onAdd={(newEquipmentName) => {
          if (
            newEquipmentName &&
            !equipments.some((eq) => eq.equipmentName === newEquipmentName)
          ) {
            addNewEquipment({ equipmentName: newEquipmentName });
            setSelectedEquipments((prev) => [...prev, newEquipmentName]);
          }
        }}
      />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <DatesProvider settings={{ locale: "fr" }}>
          <DatePickerInput
            label="Date de la plongée"
            placeholder="choisissez une date"
            valueFormat="DD MMMM YYYY"
            {...form.getInputProps("diveDate")}
            error={form.errors.diveDate}
          />
        </DatesProvider>
        <TextInput
          label="Nom de la plongée"
          placeholder="Plongée à la grotte, Plongée épave..."
          mt="md"
          {...form.getInputProps("diveName")}
          error={form.errors.diveName}
          required
        />
        <NumberInput
          label="Profondeur (m)"
          min={0}
          max={200}
          placeholder="Ex: 30"
          mt="md"
          {...form.getInputProps("depth")}
          error={form.errors.depth}
          required
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <MultiSelect
            label="Équipement utilisé"
            placeholder="Sélectionnez ou ajoutez de l'équipement"
            data={equipments.map((eq) => eq.equipmentName)}
            value={selectedEquipments}
            clearable
            onChange={setSelectedEquipments}
            style={{ flex: 1 }}
          />
          <Button
            variant="light"
            color="blue"
            style={{ height: 36 }}
            onClick={openEquipmentModal}
            type="button"
          >
            +
          </Button>
        </div>

        <NumberInput
          label="Durée (minutes)"
          min={1}
          max={240}
          placeholder="Ex: 45"
          mt="md"
          {...form.getInputProps("duration")}
          error={form.errors.duration}
          required
        />

        <Textarea
          label="Description"
          placeholder="Conditions, visibilité, impressions..."
          mt="md"
          {...form.getInputProps("description")}
          error={form.errors.description}
        />

        <Button type="submit" mt="xl" loading={props.isSubmitting} disabled={props.isSubmitting}>
          Enregistrer
        </Button>
        <Button
          variant="default"
          mt="xl"
          ml="md"
          onClick={() => navigate("/dives")}
          type="button"
        >
          Annuler
        </Button>
      </form>
    </>
  );
}
