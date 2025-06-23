import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DiveForm } from "../components/DiveForm";
import { getDives, updateDive } from "../services/diveApi";
import type { Dive, DiveDto } from "../types/Dive";

export default function EditDive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dive, setDive] = useState<Dive | null>(null);

  useEffect(() => {
    getDives().then((dives) => {
      const found = dives.find((d) => d.diveId === Number(id));
      setDive(found ?? null);
    });
  }, [id]);

  const handleUpdate = async (diveDto: DiveDto) => {
    if (!dive) return;
    await updateDive({ ...dive, ...diveDto });
    navigate("/dives");
  };

  if (!dive) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Modifier la plongée</h2>
      <DiveForm
        submitDive={handleUpdate}
        diveId={dive.diveId}    
      />
    </div>
  );
}