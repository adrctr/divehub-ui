// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiveList from "./pages/DiveList";

export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<h2>Bienvenue sur DiveHub 🌊</h2>} />
            <Route path="dives" element={<DiveList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
