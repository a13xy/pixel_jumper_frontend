import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthPage } from "./features/auth";
import { GamePage } from "./features/game";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/play" element={<GamePage />} />
        </Routes>
    </BrowserRouter>
);
