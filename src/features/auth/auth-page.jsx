import { useNavigate } from "react-router";

export function AuthPage() {
    const navigate = useNavigate();

    return <button onClick={() => navigate("/play")}>Play</button>;
}
