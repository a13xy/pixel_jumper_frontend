import { Scene } from "phaser";
import { EventBus } from "../config/event-bus";
import { apiClient } from "../../../services";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    init() {
        // Game state
        this.score = 0;
        this.gameOver = false;
        this.platformSpeed = 2;
        this.platformSpeedIncrement = 0.1;
        this.platformSpeedMax = 5;
        this.platformGap = 120;
        this.platformWidthMin = 80; // Smaller platforms
        this.platformWidthMax = 150; // Smaller max width
        this.screenSpeed = 2; // Start with screen movement
        this.autoJumpForce = -850;
        this.playerSpeed = 400; // Faster horizontal movement
        this.touchedPlatforms = new Set(); // Keep track of platforms we've touched
        this.gameStarted = true; // Game starts immediately
        this.startDelay = 60; // Frames to wait before enabling death
        this.cameraY = 0; // Track camera position manually
    }

    create() {
        // Set world bounds
        this.physics.world.setBounds(0, 0, this.game.config.width, Number.MAX_SAFE_INTEGER);
        
        // Add background
        this.background = this.add.tileSprite(
            this.game.config.width / 2, 
            384, 
            this.game.config.width, 
            768, 
            'background-3'
        );
        
        // Create physics groups
        this.groundGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        
        this.platformsGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        
        // Create ground platform (full width) - position it near the bottom of the screen
        const groundY = 600; // Fixed position
        this.groundPlatform = this.groundGroup.create(this.game.config.width / 2, groundY, 'tile-1');
        this.groundPlatform.displayWidth = this.game.config.width;
        this.groundPlatform.displayHeight = 32;
        this.groundPlatform.refreshBody();
        
        // Create initial platforms
        for (let i = 1; i < 10; i++) {
            this.createPlatform(groundY - (i * this.platformGap));
        }
        
        // Create player with physics - position it directly ON the ground platform
        this.player = this.physics.add.sprite(this.game.config.width / 2, groundY - 32, 'player-idle');
        this.player.setCollideWorldBounds(false); // Allow player to go beyond world bounds
        this.player.setBounce(0);
        this.player.setGravityY(800);
        this.player.setSize(20, 30);
        this.player.setOffset(6, 2);
        this.player.anims.play('idle', true);
        
        // IMPORTANT: Disable camera follow completely
        this.cameras.main.setBounds(0, 0, this.game.config.width, Number.MAX_SAFE_INTEGER);
        
        // Add collision between player and ground (no filter)
        this.physics.add.collider(this.player, this.groundGroup);
        
        // Add collision between player and platforms (with filter)
        this.physics.add.collider(
            this.player, 
            this.platformsGroup, 
            this.handlePlatformCollision, 
            this.checkPlatformCollision, 
            this
        );
        
        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(100);
        
        // Add game over text (hidden initially)
        this.gameOverText = this.add.text(this.game.config.width / 2, 384, 'Game Over', {
            fontSize: '64px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setVisible(false);
        
        // Add restart text (hidden initially)
        this.restartText = this.add.text(this.game.config.width / 2, 450, 'Click to restart', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setVisible(false);
        
        // Create death zone
        this.createDeathZone();
        
        // Emit event for React component
        EventBus.emit("current-scene-ready", this);
        
        // Debug text
        this.debugText = this.add.text(16, 60, '', {
            fontSize: '18px',
            fill: '#fff'
        }).setScrollFactor(0).setDepth(100);
    }
    
    createDeathZone() {
        // Position death zone below the camera view
        const deathY = this.game.config.height + 400;
        this.deathZone = this.add.zone(this.game.config.width / 2, deathY, this.game.config.width, 20);
        this.physics.world.enable(this.deathZone);
        this.deathZone.body.setAllowGravity(false);
        this.deathZone.body.setImmovable(true);
        
        // Add collision between player and death zone
        this.physics.add.overlap(this.player, this.deathZone, this.handleDeath, null, this);
    }

    update() {
        if (this.gameOver) {
            return;
        }
        
        // Decrement start delay
        if (this.startDelay > 0) {
            this.startDelay--;
        }
        
        // CRITICAL: Move all game objects up instead of moving the camera
        if (this.gameStarted) {
            // Update our manual camera position tracker
            this.cameraY += this.screenSpeed;
            
            // Move all platforms down (which gives the effect of the screen moving up)
            this.groundGroup.getChildren().forEach(platform => {
                platform.y += this.screenSpeed;
            });
            
            this.platformsGroup.getChildren().forEach(platform => {
                platform.y += this.screenSpeed;
            });
            
            // Move the player down by the same amount to maintain relative position
            this.player.y += this.screenSpeed;
            
            // Move the death zone down too
            this.deathZone.y += this.screenSpeed;
        }
        
        // Update debug text
        this.debugText.setText(
            `Player Y: ${Math.floor(this.player.y)}\n` +
            `Player X: ${Math.floor(this.player.x)}\n` +
            `Death Zone Y: ${Math.floor(this.deathZone.y)}\n` +
            `Ground Y: ${Math.floor(this.groundPlatform.y)}\n` +
            `Camera Y: ${Math.floor(this.cameraY)}\n` +
            `Screen Speed: ${this.screenSpeed.toFixed(2)}`
        );
        
        // Handle player movement
        this.handlePlayerMovement();
        
        // Handle screen wrapping for player
        this.handleScreenWrap();
        
        // Update platforms
        this.updatePlatforms();
        
        // Auto-jump when touching ground
        if (this.player.body.touching.down) {
            this.player.setVelocityY(this.autoJumpForce);
            this.player.anims.play('jump', true);
        }
        
        // Play fall animation when falling
        if (this.player.body.velocity.y > 100) {
            this.player.anims.play('fall', true);
        }
        
        // Check if player has fallen below the visible area
        if (this.startDelay <= 0 && this.player.y > this.game.config.height + 200) {
            this.handleDeath();
        }
        
        // Update background parallax
        this.background.tilePositionY = this.cameraY * 0.5;
    }

    handleScreenWrap() {
        // Wrap player horizontally when they go beyond the screen edges
        if (this.player.x < 0) {
            this.player.x = this.game.config.width;
        } else if (this.player.x > this.game.config.width) {
            this.player.x = 0;
        }
    }

    createPlatform(y) {
        let width, x;
        
        // Check if this should be a checkpoint platform (every 100 platforms)
        const isCheckpoint = Math.floor(this.score / 100) * 100 + 99 === this.score;
        
        if (isCheckpoint) {
            // Create full-width checkpoint platform
            width = this.game.config.width;
            x = width / 2;
            const platform = this.platformsGroup.create(x, y, 'tile-1');
            platform.displayWidth = width;
            platform.displayHeight = 32;
            platform.refreshBody();
            platform.setTint(0xffff00); // Make checkpoint platforms yellow
            return platform;
        } else {
            // Create normal platform
            width = Phaser.Math.Between(this.platformWidthMin, this.platformWidthMax);
            x = Phaser.Math.Between(width / 2, this.game.config.width - width / 2);
            const platform = this.platformsGroup.create(x, y, `tile-${Phaser.Math.Between(1, 20)}`);
            platform.displayWidth = width;
            platform.displayHeight = 32;
            platform.refreshBody();
            return platform;
        }
    }

    updatePlatforms() {
        // Get the highest platform's y position
        let highestY = Number.MAX_SAFE_INTEGER;
        this.platformsGroup.getChildren().forEach(platform => {
            if (platform.y < highestY) {
                highestY = platform.y;
            }
        });
        
        // Create new platforms as needed
        while (highestY > 0) {
            highestY -= this.platformGap;
            this.createPlatform(highestY);
        }
        
        // Remove platforms that are too far below
        this.platformsGroup.getChildren().forEach(platform => {
            if (platform.y > this.game.config.height + 200) {
                platform.destroy();
            }
        });
    }

    handlePlayerMovement() {
        // Horizontal movement with increased speed
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.flipX = true;
            if (this.player.body.touching.down) {
                this.player.anims.play('run', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.flipX = false;
            if (this.player.body.touching.down) {
                this.player.anims.play('run', true);
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down) {
                this.player.anims.play('idle', true);
            }
        }
    }

    checkPlatformCollision(player, platform) {
        // Only allow collision from above
        return player.body.velocity.y > 0 && player.y < platform.y;
    }

    handlePlatformCollision(player, platform) {
        // If we haven't touched this platform before, increment score
        if (!this.touchedPlatforms.has(platform)) {
            this.score++;
            this.scoreText.setText(`Score: ${this.score}`);
            this.touchedPlatforms.add(platform);
            
            // Increase screen speed as score increases
            this.screenSpeed = Math.min(
                this.platformSpeedMax,
                2 + (this.score / 20) * this.platformSpeedIncrement
            );
        }
    }

    handleDeath() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        
        // Stop player movement and screen movement
        this.player.setVelocity(0, 0);
        this.player.setGravityY(0);
        this.screenSpeed = 0;
        
        // Show game over text
        this.gameOverText.setVisible(true);
        this.restartText.setVisible(true);
        
        // Send score to backend
        this.sendScore();
        
        // Add click event to restart
        this.input.on('pointerdown', () => {
            this.scene.start('GameOver', { score: this.score });
        });
    }

    async sendScore() {
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);

        // Only send score if user is logged in
        if (user) {
            try {
                const response = await apiClient.put(`/provide-result?login=${parsedUser.login}&score=${this.score}`);
                console.log('Score submitted successfully:', response.data);
            } catch (error) {
                console.error('Error submitting score:', error);
            }
        } else {
            console.log('User not logged in, score not submitted');
        }
    }

    changeScene() {
        this.scene.start("GameOver", { score: this.score });
    }
}
