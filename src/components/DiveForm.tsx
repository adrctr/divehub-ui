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
import type { DiveDto } from "../types/Dive";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useDiveApi } from "../hooks/useDiveApi";
import { useEquipmentApi } from "../hooks/useEquipmentApi";

interface DiveFormProps {
  submitDive: (dive: DiveDto) => void;
  diveId?: number;
}

export function DiveForm(props: DiveFormProps) {
  const form = useForm<DiveDto>({
    initialValues: {
      diveDate: new Date(),
      diveName: "",
      depth: 0,
      description: "",
      duration: 0,
      equipments: [],
    },
  });

  const { dives } = useDiveApi();
  const { equipments } = useEquipmentApi();

  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

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
  }, [props.diveId, dives]);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Map selected equipment names to EquipmentDto objects
    const selectedEquipmentDtos =
      equipments.filter((eq) => selectedEquipments.includes(eq.equipmentName));
      
    const values = { ...form.values, equipments: selectedEquipmentDtos };
    props.submitDive(values);
    form.reset();
    setSelectedEquipments([]);
    navigate("/dives");
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

      <MultiSelect
        label="Équipement utilisé"
        placeholder="Sélectionnez ou ajoutez de l'équipement"
        data={equipments.map((eq) => eq.equipmentName)}
        value={selectedEquipments}
        clearable
        onChange={setSelectedEquipments}
        mt="md"
      />

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

      <Button type="submit" mt="xl">
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
  );
}
