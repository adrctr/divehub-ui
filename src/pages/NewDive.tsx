import {  useNavigate } from "react-router-dom";
import { DiveForm } from "../components/DiveForm";
import type { DiveDto } from "../types/Dive";
import { useDiveApi } from "../hooks/useDiveApi";

export default function NewDive() {
    const navigate = useNavigate();
  const { addNewDive } = useDiveApi();
  
  const handleUpdate = async (diveDto: DiveDto) => {
    await addNewDive(diveDto);
    navigate("/dives");
  };

  return (
    <div>
      <h2>Ajouter la plongée</h2>
      <DiveForm
        submitDive={handleUpdate}
      />
    </div>
  );
}