/*******************************************************************************
 * Better Quick Tiles KWin script
 *
 * This script will allow cyclign through mutliple sizes for each shortcut key
 *
 ******************************************************************************/

/**
 * Holds all modes the window can be in.
 */
var MODES = {
	FLOATING			: 0, //Any position/size not matching those below

	UP_LEFT_ONE_THIRD 	: 1, 	//x = 0, 	y = 0, 		w = 33%, 	h=50%
	UP_LEFT_HALF 		: 2, 	//x = 0, 	y = 0, 		w = 50%, 	h=50%
	UP_LEFT_TWO_THIRD 	: 3, 	//x = 0, 	y = 0, 		w = 66%, 	h=50%

	UP_CENTER_CENTER 	: 4, 	//x = 33%, 	y = 0, 		w = 33%, 	h=50%
	UP_CENTER_FULL 		: 5, 	//x = 0, 	y = 0, 		w = 100%, 	h=50%

	UP_RIGHT_ONE_THIRD 	: 6, 	//x = 66%, 	y = 0, 		w = 33%, 	h=50%
	UP_RIGHT_HALF 		: 7, 	//x = 50%,	y = 0, 		w = 50%, 	h=50%
	UP_RIGHT_TWO_THIRD 	: 8, 	//x = 33%, 	y = 0, 		w = 66%, 	h=50%

	RIGHT_ONE_THIRD 	: 9, 	//x = 66%, 	y = 0, 		w = 33%, 	h=100%
	RIGHT_HALF 			: 10, 	//x = 50%, 	y = 0, 		w = 50%, 	h=100%
	RIGHT_TWO_THIRD 	: 11, 	//x = 33%, 	y = 0, 		w = 66%, 	h=100%

	CENTER_CENTER 		: 12, 	//x = 33%, 	y = 0, 		w = 33%, 	h=100%
	CENTER_FULL 		: 13, 	//x = 0, 	y = 0, 		w = 100%, 	h=100%

	LEFT_ONE_THIRD 		: 14, 	//x = 0, 	y = 0, 		w = 33%, 	h=100%
	LEFT_HALF 			: 15, 	//x = 0, 	y = 0, 		w = 50%, 	h=100%
	LEFT_TWO_THIRD 		: 16, 	//x = 0, 	y = 0, 		w = 66%, 	h=100%

	DOWN_LEFT_ONE_THIRD : 17, 	//x = 0, 	y = 50%, 	w = 33%, 	h=50%
	DOWN_LEFT_HALF 		: 18, 	//x = 0,	y = 50%, 	w = 50%, 	h=50%
	DOWN_LEFT_TWO_THIRD : 19, 	//x = 0, 	y = 50%, 	w = 66%, 	h=50%

	DOWN_CENTER_CENTER 	: 20, 	//x = 33%, 	y = 50%, 	w = 33%, 	h=50%
	DOWN_CENTER_FULL 	: 21, 	//x = 0, 	y = 50%, 	w = 100%, 	h=50%

	DOWN_RIGHT_ONE_THIRD : 22, 	//x = 66%, 	y = 50%, 	w = 33%, 	h=50%
	DOWN_RIGHT_HALF 	 : 23, 	//x = 50%, 	y = 50%, 	w = 50%, 	h=50%
	DOWN_RIGHT_TWO_THIRD : 24 	//x = 33%, 	y = 50%, 	w = 66%, 	h=50%
};


/**
 * Holds all gird points and sizes (beside left and upper edge which are always 0)
 *
 * updateToCurrentScreen needs to be called to update these points.
 */
var Grid = {
	oneThirdX 	: null,
	halfX 		: null,
	twoThirdX 	: null,

	halfY 		: null,

	oneThirdW 	: null,
    halfW 		: null,
	twoThirdW 	: null,
	fullW 		: null,

	halfH 		: null,
	fullH 		: null,

	/**
	 * Updates the points and sizes based on the current active screen
	 *
     * Modify this, if you want to move the grid borders
	 */
	updateToCurrentScreen : function () {
		var screenBounds = BQT.getActiveScreenBounds();

		this.oneThirdX 	= screenBounds.width/3;
		this.halfX 		= screenBounds.width/2;
		this.twoThirdX 	= screenBounds.width/3*2;

		this.halfY 		= screenBounds.height/2;

		this.oneThirdW 	= screenBounds.width/3;
        this.halfW 		= screenBounds.width/2;
		this.twoThirdW 	= screenBounds.width/3*2;
		this.fullW 		= screenBounds.width;

		this.halfH 		= screenBounds.height/2;
		this.fullH 		= screenBounds.height;
	}
};


/**
 * Main object for Better Quick Tile plugin
 */
var BQT = {

	init : function() {
        print("Initializing");
		this.registerShortcuts();
	},

	/**
	 * Registers all shortcuts this extension does provide
	 */
	registerShortcuts : function() {
        print("Registering shortcuts");
		var shortcutPrefix = "Better Quick Tiles 4";

		registerShortcut(shortcutPrefix + "Up Left", shortcutPrefix + "Up Left", "Meta+Num+7", ShortCutFunctions.upLeft);
		registerShortcut(shortcutPrefix + "Up Center", shortcutPrefix + "Up Center", "Meta+Num+8", ShortCutFunctions.upCenter);
		registerShortcut(shortcutPrefix + "Up Right", shortcutPrefix + "Up Right", "Meta+Num+9", ShortCutFunctions.upRight);
		registerShortcut(shortcutPrefix + "Left", shortcutPrefix + "Left", "Meta+Num+4", ShortCutFunctions.left);
		registerShortcut(shortcutPrefix + "Center", shortcutPrefix + "Center", "Meta+Num+5", ShortCutFunctions.center);
		registerShortcut(shortcutPrefix + "Right", shortcutPrefix + "Right", "Meta+Num+6", ShortCutFunctions.right);
		registerShortcut(shortcutPrefix + "Down Left", shortcutPrefix + "Down Left", "Meta+Num+1", ShortCutFunctions.downLeft);
		registerShortcut(shortcutPrefix + "Down Center", shortcutPrefix + "Down Center", "Meta+Num+2", ShortCutFunctions.downCenter);
		registerShortcut(shortcutPrefix + "Down Right", shortcutPrefix + "Down Right", "Meta+Num+3", ShortCutFunctions.downRight);

        print("Shortcuts registered")
	},

	/**
	 *	Get the bounds of the currently active window relative to the screen it is on.
	 *
	 *	@returns: QRect containing x,y, width and height fields
	 */
	getActiveWindowBounds : function() {
		var activeWindowBounds = workspace.activeClient.frameGeometry;

		//Substract the relative screen position (Multi screen support)
	    var screenBounds = this.getActiveScreenBounds();
	    activeWindowBounds.x -= screenBounds.x;
	    activeWindowBounds.y -= screenBounds.y;

	    return activeWindowBounds;
	},

	/**
	*	Get the bounds of the screen the currently active window is on
	*
	* 	@returns: QRect containing x,y, width and height fields
 	*/
	getActiveScreenBounds : function() {
		return workspace.clientArea(KWin.PlacementArea, workspace.activeScreen, workspace.Desktop);
	},

	/**
	 *  Get the window position mode, the window is currently in.
	 *  If it is in no predefine mode the value modes.FLOATING will be returned
     *
	 *  @returns: integer One of the values in the variable modes
	 */
	getMode : function() {
        print("getMode called");
		var windowBounds = this.getActiveWindowBounds();

		//Getting possible modes due to the windows' X position

        print("Determining current mode");

		var possibleModesX = [];

		if (windowBounds.x == 0) {
			possibleModesX.push(MODES.UP_LEFT_HALF);
			possibleModesX.push(MODES.UP_LEFT_ONE_THIRD);
			possibleModesX.push(MODES.UP_LEFT_TWO_THIRD);
			possibleModesX.push(MODES.UP_CENTER_FULL);
			possibleModesX.push(MODES.LEFT_HALF);
			possibleModesX.push(MODES.LEFT_ONE_THIRD);
			possibleModesX.push(MODES.LEFT_TWO_THIRD);
			possibleModesX.push(MODES.CENTER_FULL);
			possibleModesX.push(MODES.DOWN_LEFT_HALF);
			possibleModesX.push(MODES.DOWN_LEFT_ONE_THIRD);
			possibleModesX.push(MODES.DOWN_LEFT_TWO_THIRD);
			possibleModesX.push(MODES.DOWN_CENTER_FULL);
		}
		else if (windowBounds.x == Grid.oneThirdX) {
			possibleModesX.push(MODES.UP_RIGHT_TWO_THIR);
			possibleModesX.push(MODES.UP_CENTER_CENTER);
			possibleModesX.push(MODES.RIGHT_TWO_THIRD);
			possibleModesX.push(MODES.CENTER_CENTER);
			possibleModesX.push(MODES.DOWN_RIGHT_TWO_THIRD);
			possibleModesX.push(MODES.DOWN_CENTER_CENTER);
		}
		else if (windowBounds.x == Grid.halfX) {
			possibleModesX.push(MODES.UP_RIGHT_HALF);
			possibleModesX.push(MODES.RIGHT_HALF);
			possibleModesX.push(MODES.DOWN_RIGHT_HALF);
		}
		else if (windowBounds.x == Grid.twoThirdX) {
			possibleModesX.push(MODES.UP_RIGHT_ONE_THIRD);
			possibleModesX.push(MODES.RIGHT_ONE_THIRD);
			possibleModesX.push(MODES.DOWN_RIGHT_ONE_THIRD);
		}

		if (possibleModesX.length == 0) {
			//X value is not maching any mode. Window is "floating"
			return MODES.FLOATING;
		}

		print("Possible modes found for X");


		//Getting possible modes due to the windows' Y position'

		var possibleModesY = [];

		if (windowBounds.y == 0) {
			possibleModesY.push(MODES.UP_LEFT_HALF);
			possibleModesY.push(MODES.UP_LEFT_ONE_THIRD);
			possibleModesY.push(MODES.UP_LEFT_TWO_THIRD);
			possibleModesY.push(MODES.UP_CENTER_CENTER);
			possibleModesY.push(MODES.UP_CENTER_FULL);
			possibleModesY.push(MODES.UP_RIGHT_HALF);
			possibleModesY.push(MODES.UP_RIGHT_ONE_THIRD);
			possibleModesY.push(MODES.UP_RIGHT_TWO_THIRD);
			possibleModesY.push(MODES.LEFT_HALF);
			possibleModesY.push(MODES.LEFT_ONE_THIRD);
			possibleModesY.push(MODES.LEFT_TWO_THIRD);
			possibleModesY.push(MODES.RIGHT_HALF);
			possibleModesY.push(MODES.RIGHT_ONE_THIRD);
			possibleModesY.push(MODES.RIGHT_TWO_THIRD);
			possibleModesY.push(MODES.CENTER_CENTER);
			possibleModesY.push(MODES.CENTER_FULL);
		}
		else if (windowBounds.y == Grid.halfY) {
			possibleModesY.push(MODES.DOWN_LEFT_HALF);
			possibleModesY.push(MODES.DOWN_LEFT_ONE_THIRD);
			possibleModesY.push(MODES.DOWN_LEFT_TWO_THIRD);
			possibleModesY.push(MODES.DOWN_CENTER_CENTER);
			possibleModesY.push(MODES.DOWN_CENTER_FULL);
			possibleModesY.push(MODES.DOWN_RIGHT_HALF);
			possibleModesY.push(MODES.DOWN_RIGHT_ONE_THIRD);
			possibleModesY.push(MODES.DOWN_RIGHT_TWO_THIRD);
		}

		if (possibleModesY.length == 0) {
			//Y value is not maching any mode. Window is "floating"
			return MODES.FLOATING;
		}


		//Getting possible modes due to the windows' width

		var possibleModesW = [];

		if (windowBounds.width == Grid.oneThirdW) {
			possibleModesW.push(MODES.UP_LEFT_ONE_THIRD);
			possibleModesW.push(MODES.UP_CENTER_CENTER);
			possibleModesW.push(MODES.UP_RIGHT_ONE_THIRD);
			possibleModesW.push(MODES.RIGHT_ONE_THIRD);
			possibleModesW.push(MODES.CENTER_CENTER);
			possibleModesW.push(MODES.LEFT_ONE_THIRD);
			possibleModesW.push(MODES.DOWN_LEFT_ONE_THIRD);
			possibleModesW.push(MODES.DOWN_CENTER_CENTER);
			possibleModesW.push(MODES.DOWN_RIGHT_ONE_THIRD);
		}
		else if (windowBounds.width == Grid.halfW) {
			possibleModesW.push(MODES.UP_LEFT_HALF);
			possibleModesW.push(MODES.UP_RIGHT_HALF);
			possibleModesW.push(MODES.LEFT_HALF);
			possibleModesW.push(MODES.RIGHT_HALF);
			possibleModesW.push(MODES.DOWN_LEFT_HALF);
			possibleModesW.push(MODES.DOWN_RIGHT_HALF);
		}
		else if (windowBounds.width == Grid.twoThirdW) {
			possibleModesW.push(MODES.UP_LEFT_TWO_THIRD);
			possibleModesW.push(MODES.UP_RIGHT_TWO_THIRD);
			possibleModesW.push(MODES.LEFT_TWO_THIRD);
			possibleModesW.push(MODES.RIGHT_TWO_THIRD);
			possibleModesW.push(MODES.DOWN_LEFT_TWO_THIRD);
			possibleModesW.push(MODES.DOWN_RIGHT_TWO_THIRD);
		}
		else if (windowBounds.width == Grid.fullW) {
			possibleModesW.push(MODES.UP_CENTER_FULL);
			possibleModesW.push(MODES.CENTER_FULL);
			possibleModesW.push(MODES.DOWN_CENTER_FULL);
		}

		if (possibleModesW.length == 0) {
			//Width value is not maching any mode. Window is "floating"
			return MODES.FLOATING;
		}


		//Getting possible modes due to the windows' height

		var possibleModesH = [];

		if (windowBounds.height == Grid.halfH) {
			possibleModesH.push(MODES.UP_LEFT_ONE_THIRD);
			possibleModesH.push(MODES.UP_LEFT_HALF);
			possibleModesH.push(MODES.UP_LEFT_TWO_THIRD);
			possibleModesH.push(MODES.UP_CENTER_CENTER);
			possibleModesH.push(MODES.UP_CENTER_FULLL);
			possibleModesH.push(MODES.UP_RIGHT_ONE_THIRD);
			possibleModesH.push(MODES.UP_RIGHT_HALF);
			possibleModesH.push(MODES.UP_RIGHT_TWO_THIRD);
			possibleModesH.push(MODES.DOWN_LEFT_ONE_THIRD);
			possibleModesH.push(MODES.DOWN_LEFT_HALF);
			possibleModesH.push(MODES.DOWN_LEFT_TWO_THIRD);
			possibleModesH.push(MODES.DOWN_CENTER_CENTER);
			possibleModesH.push(MODES.DOWN_CENTER_FULL);
			possibleModesH.push(MODES.DOWN_RIGHT_ONE_THIRD);
			possibleModesH.push(MODES.DOWN_RIGHT_HALF);
			possibleModesH.push(MODES.DOWN_RIGHT_TWO_THIRD);
		}
		else if (windowBounds.height == Grid.fullH) {
			possibleModesH.push(MODES.LEFT_ONE_THIRD);
			possibleModesH.push(MODES.LEFT_HALF);
			possibleModesH.push(MODES.LEFT_TWO_THIRD);
			possibleModesH.push(MODES.CENTER_CENTER);
			possibleModesH.push(MODES.CENTER_FULL);
			possibleModesH.push(MODES.RIGHT_ONE_THIRD);
			possibleModesH.push(MODES.RIGHT_HALF);
			possibleModesH.push(MODES.RIGHT_TWO_THIRD);
		}

		if (possibleModesH.length == 0) {
			//Height value is not maching any mode. Window is "floating"
			return MODES.FLOATING;
		}


		//Checking if one mode satisfies all 4 parameters. X, Y, Widht and Height
		for (var ix in possibleModesX) {
			var mode = possibleModesX[ix];

			//Check if this possible mode for the X condition also satisfy the Y, width and height condition. If yes, this is our result.
			if (possibleModesY.indexOf(mode) > -1 && possibleModesW.indexOf(mode) > -1 && possibleModesH.indexOf(mode) > -1)
				return mode;
		}

		//No valid mode found. Window is "floating"
		return MODES.FLOATING;

	},


	/**
	 * Sets the mode for the active window and by that move it to the position for this mode.
     *
     * @param mode: The mode to move the window in
	 *
	 * @returns: void
	 */
	setMode : function(mode) {
        print("Set mode: "+mode);
		var x,y,w,h;

		//Setting sizes based on the given mode.
		switch (mode) {

			case MODES.UP_LEFT_ONE_THIRD 	:	x=0;				y=0;		w=Grid.oneThirdW;	h=Grid.halfH;	break;
			case MODES.UP_LEFT_HALF 		:	x=0;				y=0;		w=Grid.halfW;		h=Grid.halfH;	break;
			case MODES.UP_LEFT_TWO_THIRD 	:	x=0;				y=0;		w=Grid.twoThirdW;	h=Grid.halfH;	break;

			case MODES.UP_CENTER_CENTER 	:	x=Grid.oneThirdX;	y=0;		w=Grid.oneThirdW;	h=Grid.halfH;	break;
			case MODES.UP_CENTER_FULL 		:	x=0;				y=0;		w=Grid.fullW;		h=Grid.halfH;	break;

			case MODES.UP_RIGHT_ONE_THIRD 	:	x=Grid.twoThirdX;	y=0;		w=Grid.oneThirdW;	h=Grid.halfH;	break;
			case MODES.UP_RIGHT_HALF 		:	x=Grid.halfX;		y=0;		w=Grid.halfW;		h=Grid.halfH;	break;
			case MODES.UP_RIGHT_TWO_THIRD 	:	x=Grid.oneThirdX;	y=0;		w=Grid.twoThirdW;	h=Grid.halfH;	break;

			case MODES.LEFT_ONE_THIRD 		:	x=0;				y=0;		w=Grid.oneThirdW;	h=Grid.fullH;	break;
			case MODES.LEFT_HALF 			:	x=0;				y=0;		w=Grid.halfW;		h=Grid.fullH;	break;
			case MODES.LEFT_TWO_THIRD 		:	x=0;				y=0;		w=Grid.twoThirdW;	h=Grid.fullH;	break;

			case MODES.CENTER_CENTER 		:	x=Grid.oneThirdX;	y=0;		w=Grid.oneThirdW;	h=Grid.fullH;	break;
			case MODES.CENTER_FULL 			:	x=0;				y=0;		w=Grid.fullW;		h=Grid.fullH;	break;

			case MODES.RIGHT_ONE_THIRD 		:	x=Grid.twoThirdX;	y=0;		w=Grid.oneThirdW;	h=Grid.fullH;	break;
			case MODES.RIGHT_HALF 			:	x=Grid.halfX;		y=0;		w=Grid.halfW;		h=Grid.fullH;	break;
			case MODES.RIGHT_TWO_THIRD 		:	x=Grid.oneThirdX;	y=0;		w=Grid.twoThirdW;	h=Grid.fullH;	break;

			case MODES.DOWN_LEFT_ONE_THIRD	:	x=0;				y=halfY;	w=Grid.oneThirdW;	h=Grid.halfH;	break;
			case MODES.DOWN_LEFT_HALF 		:	x=0;				y=halfY;	w=Grid.halfW;		h=Grid.halfH;	break;
			case MODES.DOWN_LEFT_TWO_THIRD 	:	x=0;				y=halfY;	w=Grid.twoThirdW;	h=Grid.halfH;	break;

			case MODES.DOWN_CENTER_CENTER 	:	x=Grid.oneThirdX;	y=halfY;	w=Grid.oneThirdW;	h=Grid.halfH;	break;
			case MODES.DOWN_CENTER_FULL 	:	x=0;				y=halfY;	w=Grid.fullW;		h=Grid.halfH;	break;

			case MODES.DOWN_RIGHT_ONE_THIRD :	x=Grid.twoThirdX;	y=halfY;	w=Grid.oneThirdW;	h=Grid.halfH;	break;
			case MODES.DOWN_RIGHT_HALF 		:	x=Grid.halfX;		y=halfY;	w=Grid.halfW;		h=Grid.halfH;	break;
			case MODES.DOWN_RIGHT_TWO_THIRD :	x=Grid.oneThirdX;	y=halfY;	w=Grid.twoThirdW;	h=Grid.halfH;	break;

			default:
		}

		//Calulating the new window frame geometry relative to the active screen
		var screenBounds = BQT.getActiveScreenBounds();
		var newFrameGeometry =  {
            x: x+screenBounds.x,
            y: y+screenBounds.y,
            width: w,
            height: h
        }

		//Setting the new window geomety
		workspace.activeClient.frameGeometry = newFrameGeometry;
	},


    /**
	 * Updates the window position based on the start mode and the mode mapping for repeated key presses.
     *
	 * It will get the current mode. Then see if this is one of the modes in the nextModeMap.
	 * If that is the case, the mode in the nextModeMap will be appied, if not, the startMode will be applied.
     *
     * @param startMode: The mode the window should be put in, if it is in no valid according to the nextModeMap
	 * @param nextModeMap: The mapping of which mode leads to which next mode on repeated key press.
     *
	 * @returns void
	 */
	updateWindowPosition : function(startMode, nextModeMap) {
        print("Update window position: "+startMode);
		//Update the grid parameters to the currently active screen (Multi monitor support)
		Grid.updateToCurrentScreen();

		//Get the current mode associated with the size and position of the window.
		var currentMode = this.getMode();

        print("Current mode: "+currentMode);

		//See if there is a valid followup mode available for the current mode (Repeated key presses)
		var nextMode = nextModeMap[currentMode];

		if (nextMode == undefined) {
			//No valid followup. Applying start mode
			nextMode = startMode;
		}

		//Moving window to new designated position and size
		BQT.setMode(nextMode);
	}
};


/**
 * All shortcut handlers
 */
var ShortCutFunctions =  {
	upLeft : function() {
        print("Up left pressed");
		//If the window is not in any valid up left position yet,
		//this is the first position the window will be put in
		var startMode = MODES.UP_LEFT_HALF;

		//This is mapping a previous valid position to the next valid one in case of repeated key presses
		var nextModeMap = {};
		nextModeMap[MODES.UP_LEFT_HALF] = MODES.UP_LEFT_ONE_THIRD;
		nextModeMap[MODES.UP_LEFT_ONE_THIRD] = MODES.UP_LEFT_TWO_THIRD;
		nextModeMap[MODES.UP_LEFT_TWO_THIRD] = MODES.UP_LEFT_HALF;

		//Update the window position
		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	upCenter : function() {
		var startMode = MODES.UP_CENTER_CENTER;

		var nextModeMap = {};
		nextModeMap[MODES.UP_CENTER_CENTER] = MODES.UP_CENTER_FULL;
		nextModeMap[MODES.UP_CENTER_FULL] = MODES.UP_CENTER_CENTER;

		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	upRight : function() {
		var startMode = MODES.UP_RIGHT_HALF;

		var nextModeMap = {};
		nextModeMap[MODES.UP_RIGHT_HALF] = MODES.UP_RIGHT_ONE_THIRD;
		nextModeMap[MODES.UP_RIGHT_ONE_THIRD] = MODES.UP_RIGHT_TWO_THIRD;
		nextModeMap[MODES.UP_RIGHT_TWO_THIRD] = MODES.UP_RIGHT_HALF;

		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	left : function() {
		var startMode = MODES.LEFT_HALF;

		var nextModeMap = {};
		nextModeMap[MODES.LEFT_HALF] = MODES.LEFT_ONE_THIRD;
		nextModeMap[MODES.LEFT_ONE_THIRD] = MODES.LEFT_TWO_THIRD;
		nextModeMap[MODES.LEFT_TWO_THIRD] = MODES.LEFT_HALF;

		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	center : function() {
		var startMode = MODES.CENTER_FULL;

		var nextModeMap = {};
		nextModeMap[MODES.CENTER_FULL] = MODES.CENTER_CENTER;
		nextModeMap[MODES.CENTER_CENTER] = MODES.CENTER_FULL;

		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	right : function() {
		var startMode = MODES.RIGHT_HALF;

		var nextModeMap = {};
		nextModeMap[MODES.RIGHT_HALF] = MODES.RIGHT_ONE_THIRD;
		nextModeMap[MODES.RIGHT_ONE_THIRD] = MODES.RIGHT_TWO_THIRD;
		nextModeMap[MODES.RIGHT_TWO_THIRD] = MODES.RIGHT_HALF;

		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	downLeft : function() {
		var startMode = MODES.DOWN_LEFT_HALF;

		var nextModeMap = {};
		nextModeMap[MODES.DOWN_LEFT_HALF] = MODES.DOWN_LEFT_ONE_THIRD;
		nextModeMap[MODES.DOWN_LEFT_ONE_THIRD] = MODES.DOWN_LEFT_TWO_THIRD;
		nextModeMap[MODES.DOWN_LEFT_TWO_THIRD] = MODES.DOWN_LEFT_HALF;

		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	downCenter : function() {
		var startMode = MODES.DOWN_CENTER_CENTER;

		var nextModeMap = {};
		nextModeMap[MODES.DOWN_CENTER_CENTER] = MODES.DOWN_CENTER_FULL;
		nextModeMap[MODES.DOWN_CENTER_FULL] = MODES.DOWN_CENTER_CENTER;

		BQT.updateWindowPosition(startMode, nextModeMap);
	},

	downRight : function() {
		var startMode = MODES.DOWN_RIGHT_HALF;

		var nextModeMap = {};
		nextModeMap[MODES.DOWN_RIGHT_HALF] = MODES.DOWN_RIGHT_ONE_THIRD;
		nextModeMap[MODES.DOWN_RIGHT_ONE_THIRD] = MODES.DOWN_RIGHT_TWO_THIRD;
		nextModeMap[MODES.DOWN_RIGHT_TWO_THIRD] = MODES.DOWN_RIGHT_HALF;

		BQT.updateWindowPosition(startMode, nextModeMap);
	}
};

//Starting script
BQT.init();