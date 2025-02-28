import { useNavigate } from "react-router";

export function Auth() {
    const navigate = useNavigate();

    return <button onClick={() => navigate("/play")}>Play</button>;
}
