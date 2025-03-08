import { Scene } from "phaser";
import { EventBus } from "../config/event-bus";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        // Add background
        this.add.image(this.game.config.width / 2, 384, "background-1").setScale(2);

        // Add title
        this.add
            .text(this.game.config.width / 2, 200, "Pixel Jumper", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Add instructions
        this.add
            .text(this.game.config.width / 2, 300, "Jump up the platforms and reach as high as you can!", {
                fontFamily: "Arial",
                fontSize: 20,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Add controls instructions
        this.add
            .text(this.game.config.width / 2, 350, "Controls: Arrow keys to move, Auto-jump", {
                fontFamily: "Arial",
                fontSize: 18,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Add start button
        const startButton = this.add
            .text(this.game.config.width / 2, 450, "Start Game", {
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
        startButton.on("pointerover", () => {
            startButton.setStyle({ fill: "#ffff00" });
        });

        startButton.on("pointerout", () => {
            startButton.setStyle({ fill: "#ffffff" });
        });

        // Start game on click
        startButton.on("pointerdown", () => {
            this.changeScene();
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}
