// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiveList from "./pages/DiveList";
import Home from "./pages/Home";

export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home/>} />
            <Route path="dives" element={<DiveList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
