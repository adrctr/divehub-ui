import 'dayjs/locale/fr';
import { useForm } from "@mantine/form";
import { TextInput, NumberInput, Button, Textarea } from "@mantine/core";
import { DatesProvider, DatePickerInput } from "@mantine/dates";
import type { DiveDto } from "../types/Dive";
import { useDiveApi } from "../hooks/useDiveApi";

export function DiveForm() {
  // If you don't need 'diveId', you should remove it from the Dive type definition.
  // Then, update the form to match the new Dive type:
  const form = useForm<DiveDto>({
    initialValues: {
      diveDate: new Date(),
      diveName: "",
      depth: 0,
      description: "",
    },
  });

  const addNewDive = useDiveApi().addNewDive;

  const handleSubmit = async () => {
    addNewDive(form.values).then(() => {
      form.reset();
    });
  };

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
      {/* <TextInput
      label="Lieu"
      placeholder="Ex: Marseille, Epave du Liban"
      mt="md"
      {...form.getInputProps("location")}
      /> */}

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

      <Textarea
      label="description"
      placeholder="Conditions, visibilité, impressions..."
      mt="md"
      {...form.getInputProps("description")}
      error={form.errors.description}
      />

      <Button type="submit" mt="xl">
      Enregistrer
      </Button>
    </form>
  );
}
