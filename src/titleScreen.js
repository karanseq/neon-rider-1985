// URL: http://localhost/projects/team-10-tempest
var MAX_MENU_INDEX = 2;

var TitleScreen = function() {
	this.menuIndex = this.MenuContent.MENU_START;
	
	this.startState = false;
	this.startDelay = 70;
	this.blinkDelay = 32;
	this.blinkDelay = this.startDelay - this.blinkDelay;
	this.delayTimer = 0;
	this.showTime = 3;
	this.hideTime = 3;
	this.showState = true;
};

TitleScreen.prototype.MenuContent = {
}


TitleScreen.prototype.preload = function() {
	// load all images
	for (var i = 0; i < titleImageSet.length; ++i) {
		Game.load.image(titleImageSet[i].key, titleImageSet[i].src);
	}

	// load fonts
	for (var i = 0; i < fontSet.length; ++i) {
		Game.load.bitmapFont(fontSet[i].key, fontSet[i].img, fontSet[i].data);
	}

    // load sounds
	for (var i = 0; i < titleAudioSet.length; ++i) {
	    Game.load.audio(titleAudioSet[i].key, titleAudioSet[i].src);
	}
};

TitleScreen.prototype.create = function() {
	this.background = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'titleBackground');
	this.background.anchor = { x: 0.5, y: 0.5 };
	this.background.scale = { x: 0.65, y: 0.65 };

	this.title = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT * 0.4, 'title');
	this.title.anchor = { x: 0.5, y: 0.5 };
	this.title.scale = { x: 0.55, y: 0.55 };

	this.startMenu = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT * 0.87, 'startMenu');;
	this.startMenu.anchor = { x: 0.5, y: 0.5 };
	this.startMenu.scale = { x: 1, y: 1 };
	
	this.music = Game.add.audio('titleBackgroundMusic');
    this.music.play();

	this.spaceKey = Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

TitleScreen.prototype.update = function(){
	this.updateKeys();

	if(this.startState)
	{
		this.startDelay--;
		if(this.startDelay < 0)
		{
			ScreenIndex = 1;
			this.clearScreen();
			tempest.create();
		}
		else if(this.startDelay > this.blinkDelay)
		{
			this.delayTimer++;
			if(this.showState && this.delayTimer > this.showTime)
			{
				this.showState = false;
				this.startMenu.alpha = 0;
				this.delayTimer = 0;
			}
			if(!this.showState && this.delayTimer > this.hideTime)
			{
				this.showState = true;
				this.startMenu.alpha = 1;
				this.delayTimer = 0;
			}
		}
		else if(this.startDelay == this.blinkDelay)
		{
			this.startMenu.alpha = 1;
		}
	}
}

TitleScreen.prototype.updateKeys = function() {
	if (this.spaceKey.isDown) {
		this.startState = true;
		this.music.stop();
	}
};

TitleScreen.prototype.clearScreen = function() {
	this.background.destroy();
	this.title.destroy();;
	this.startMenu.destroy();
    this.music.destroy();

	Game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
	this.spaceKey = null;
};

// TitleScreen.prototype.handleKeySpace = function() {
// 	switch(this.menuIndex)
// 	{
// 		case this.MenuContent.MENU_START:
			
// 		case this.MenuContent.MENU_EXIT:

// 			break;
// 		default:
// 			break;
// 	}
	
// };
