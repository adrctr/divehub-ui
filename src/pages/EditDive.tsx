import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DiveForm } from "../components/DiveForm";

import { useDiveApi } from "../hooks/useDiveApi";
import type { Dive } from "../types/Dive";

export default function EditDive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dive, setDive] = useState<Dive | null>(null);
  const { dives, updateExistingDive } = useDiveApi();

  useEffect(() => {
    const found = dives.find((d) => d.diveId === Number(id));
    setDive(found ?? null);
  }, [id,dives]);

  const handleUpdate = async (diveDto: Dive) => {
    if (!dive) return;
    await updateExistingDive({ ...dive, ...diveDto });
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