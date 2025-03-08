import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game
    this.load.setPath("assets");

    // Load character animations
    this.load.spritesheet('player-idle', '1 Main Characters/1/Idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-run', '1 Main Characters/1/Run.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-jump', '1 Main Characters/1/Jump.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-fall', '1 Main Characters/1/Fall.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-double-jump', '1 Main Characters/1/Double_Jump.png', { frameWidth: 32, frameHeight: 32 });
    
    // Load platform tiles
    this.load.image('tileset', '2 Locations/Tiles/Tileset.png');
    
    // Load individual platform tiles
    for (let i = 1; i <= 20; i++) {
      const num = i < 10 ? `0${i}` : i;
      this.load.image(`tile-${i}`, `2 Locations/Tiles/Tile_${num}.png`);
    }
    
    // Load background
    this.load.image('background-1', '2 Locations/Backgrounds/1.png');
    this.load.image('background-2', '2 Locations/Backgrounds/2.png');
    this.load.image('background-3', '2 Locations/Backgrounds/3.png');
    this.load.image('background-4', '2 Locations/Backgrounds/4.png');
    this.load.image('background-5', '2 Locations/Backgrounds/5.png');
    this.load.image('background-6', '2 Locations/Backgrounds/6.png');
  }

  create() {
    // Create animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player-run', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player-jump', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNumbers('player-fall', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'double-jump',
      frames: this.anims.generateFrameNumbers('player-double-jump', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: 0
    });

    //  Move to the MainMenu
    this.scene.start("MainMenu");
  }
}
