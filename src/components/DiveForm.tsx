import "dayjs/locale/fr";
import { useForm } from "@mantine/form";
import { TextInput, NumberInput, Button, Textarea, Modal } from "@mantine/core";
import { DatesProvider, DatePickerInput } from "@mantine/dates";
import type { DiveDto } from "../types/Dive";

interface DiveFormProps {
  opened: boolean;
  addNewDive: (dive: DiveDto) => void;
  close: () => void;
}

export function DiveForm(props: DiveFormProps) {
  // If you don't need 'diveId', you should remove it from the Dive type definition.
  // Then, update the form to match the new Dive type:
  const form = useForm<DiveDto>({
    initialValues: {
      diveDate: new Date(),
      diveName: "",
      depth: 0,
      description: "",
      duration: 0,
    },
  });

  const handleSubmit = async () => {
    await props.addNewDive(form.values);
    form.reset();
    props.close();
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.close}
      title="Ajouter une plongée"
      centered
    >
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

        <NumberInput
          label="Durée (minutes)"
          min={1}
          max={240}
          placeholder="Ex: 45"
          mt="md"
          {...form.getInputProps("duration")}
          error={form.errors.duration}
          required/>

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
      </form>
    </Modal>
  );
}
