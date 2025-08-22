import {  useNavigate } from "react-router-dom";
import { DiveForm } from "../components/DiveForm";
import type { DiveDto } from "../types/Dive";
import { useDiveApi } from "../hooks/useDiveApi";
import { showDiveAddedNotification, showDiveErrorNotification } from "../utils/userNotifications";
import { useState } from "react";

export default function NewDive() {
    const navigate = useNavigate();
  const { addNewDive } = useDiveApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpdate = async (diveDto: DiveDto) => {
    if (isSubmitting) return; // Éviter les soumissions multiples
    
    setIsSubmitting(true);
    try {
      await addNewDive(diveDto);
      showDiveAddedNotification();
      navigate("/dives");
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la plongée:', error);
      showDiveErrorNotification();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Ajouter la plongée</h2>
      <DiveForm
        submitDive={handleUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}