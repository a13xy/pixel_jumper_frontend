import { Scene } from "phaser";
import { EventBus } from "../config/event-bus";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    init(data) {
        // Get score from previous scene
        this.score = data.score || 0;
    }

    create() {
        // Add background
        this.add.image(this.game.config.width / 2, 384, 'background-5').setScale(2);

        // Add game over text
        this.add
            .text(this.game.config.width / 2, 250, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Add score text
        this.add
            .text(this.game.config.width / 2, 350, `Your Score: ${this.score}`, {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Add restart button
        const restartButton = this.add
            .text(this.game.config.width / 2, 450, "Play Again", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        // Add hover effect
        restartButton.on("pointerover", () => {
            restartButton.setStyle({ fill: "#ffff00" });
        });

        restartButton.on("pointerout", () => {
            restartButton.setStyle({ fill: "#ffffff" });
        });

        // Restart game on click
        restartButton.on("pointerdown", () => {
            this.changeScene();
        });

        // Add main menu button
        const menuButton = this.add
            .text(this.game.config.width / 2, 530, "Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        // Add hover effect
        menuButton.on("pointerover", () => {
            menuButton.setStyle({ fill: "#ffff00" });
        });

        menuButton.on("pointerout", () => {
            menuButton.setStyle({ fill: "#ffffff" });
        });

        // Go to main menu on click
        menuButton.on("pointerdown", () => {
            this.scene.start("MainMenu");
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}
