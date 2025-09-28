import { Route, Routes } from "react-router-dom";
import Homepage from "@/pages/HomePage";

function App() {
  return <Route path="/" element={<Homepage />} />;
}

export default App;
