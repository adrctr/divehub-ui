import { DivesStats } from "../components/DivesStats";

export default function Home() {
  console.log("Rendering Home page");
  return (
    <>
      <h2>Bienvenue sur DiveHub 🌊</h2>
      <DivesStats />
    </>
  );
}
