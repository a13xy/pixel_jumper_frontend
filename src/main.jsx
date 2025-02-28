import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Auth } from "./routes/auth";
import Play from "./routes/play";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/play" element={<Play />} />
        </Routes>
    </BrowserRouter>
);
