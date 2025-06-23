import {  useNavigate } from "react-router-dom";
import { DiveForm } from "../components/DiveForm";
import { addDive } from "../services/diveApi";
import type { DiveDto } from "../types/Dive";

export default function NewDive() {
  const navigate = useNavigate();
 
  
  const handleUpdate = async (diveDto: DiveDto) => {
    await addDive(diveDto);
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