import { useRef } from "react";
import { PhaserGame } from "./components/phaser-game";
import "./styles/game.css";

export function GamePage() {
    //  References to the PhaserGame component
    const phaserRef = useRef();

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        // You can handle scene changes here if needed
        console.log("Current scene:", scene.scene.key);
    };

    return (
        <div className="game-container">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    );
}
