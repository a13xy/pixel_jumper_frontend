import Phaser from "phaser";
import { Boot } from "./scenes/boot";
import { Game } from "./scenes/game";
import { GameOver } from "./scenes/game-over";
import { MainMenu } from "./scenes/main-menu";
import { Preloader } from "./scenes/preloader";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [Boot, Preloader, MainMenu, Game, GameOver],
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;
