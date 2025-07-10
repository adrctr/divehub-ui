import { Modal, TextInput, Button } from "@mantine/core";
import { useState } from "react";

interface AddEquipmentModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (equipmentName: string) => void;
}

export function AddEquipmentModal({ opened, onClose, onAdd }: AddEquipmentModalProps) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Ajouter un nouvel équipement" centered>
      <TextInput
        label="Nom de l'équipement"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        autoFocus
      />
      <Button mt="md" onClick={handleAdd}>
        Ajouter
      </Button>
    </Modal>
  );
}