import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Main: Starting app");
createRoot(document.getElementById("root")!).render(<App />);
