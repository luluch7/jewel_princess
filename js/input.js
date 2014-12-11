/* input.js */

jewel.input = (function() {

	var inputHandlers,
	    gpStates,
	    gpPoller;

	//p.217
	var keys = {
		/* to create control bindings between input events and game actions, you give each input a keyword;
		  i.e. Mouse clicks have the input keyword CLICK, a press of the Enter Key has the keyword KEY_ENTER, etc
		  THE CONTROLS STRUCTURE IS STORED IN THE GAME SETTINGS jewel.js*/
		37: "KEY_LEFT",
		38: "KEY_UP",
		39: "KEY_RIGHT",
		40: "KEY_DOWN",
		13: "KEY_ENTER",
		32: "KEY_SPACE",
		65: "KEY_A",
		66: "KEY_B",
		67: "KEY_C",
		/** alpha keys 68 - 87 **/
		88: "KEY_X",
		89: "KEY_Y",
		90: "KEY_Z"

	}; //end of var keys

	//p. 214
	function initialize() {

		var dom = jewel.dom,
		$ = dom.$,
		controls = jewel.settings.controls,
		board = $("#game-screen .game-board")[0];

		//the DOM event object is passed on to a 2nd function handleClick()
		//along with the name of the game action
		// handleClick() calculates the relative coordinates of the click and, from those, the jewel coordinates
		//the action is, then, triggered, sending the jewel coordinates as parameters
		
		//mouse input
		inputHandlers = {};
		dom.bind(board, "mousedown", function(event) {
			handleClick(event, "CLICK", event);
		}); 

		//p.216 touch input
		dom.bind(board, "touchstart", function(event) {
			handleClick(event, "TOUCH", event.targetTouches[0]);
		});

		//p.217 keyboard input
		dom.bind(document, "keydown", function(event) {
			var keyName = keys[event.keyCode];
			if(keyName && controls[keyName]) {
				event.preventDefault();
				trigger(controls[keyName]);
			} //end of if statement
		});

		//detects if browser supports gamepads
		if(hasGamepads()) {
			//gpStates stores the states of the curretly known gamepads
			//pollGamepads() grabs the current gamepad list from the getGamepads() and
			//checks whether a famepad with that index already exists in the gpStates list or not
			gpStates = [];
			if(!gpPoller) {
				gpPoller = setInterval(pollGamepads, 1000/60);
				//workaround to make firefox register gamepads
				window.addEventListener("gamepadconnected", function(){}, false);
			}//end of IF
		}//end of IF

		/* initialize() uses the getGamepads() function for feature detection p.219*/

	} //end of initialize


	//p.215

	function handleClick(event, control, click) {

		var settings = jewel.settings,
			action = settings.controls[control];
		if(!action) {
			return;
		}//end of IF

		var board = jewel.dom.$("#game-screen .game-board")[0],
			rect  = board.getBoundingClientRect(),
			relX, relY,
			jewelX, jewelY;


	//click position relative to board
	//W3C schools: The clientX property returns the horizontal coordinate (according to the client area) of the mouse pointer when a mouse event was triggered.
	//W3C schools: The clientY property returns the vertical coordinate (according to the client area) of the mouse pointer when a mouse event was triggered.
	//client area = current window
	relX = click.clientX - rect.left;
	relY = click.clientY - rect.top;

	//jewel coordinates
	jewelX = Math.floor(relX / rect.width * settings.cols);
	jewelY = Math.floor(relY / rect.height * settings.rows);

	//trigger functions bound to action
	trigger(action, jewelX, jewelY);

	//prevent default click behavior
	event.preventDefault();

	}//end of handleClick()

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//GAMEPAD FUNCTIONS

	function hasGamepads() {
        return !!getGamepads();
    } // end of hasGamepads

	//p.218
	//NOTE: The navigator object contains information about the browser
	//IF getGamepads() returns anything, it can be assumed that the browser supports gamepad
	function getGamepads() {
		if(navigator.gamepads) {
			return navigator.gamepads;
		} else if(navigator.getGamepads) {
			return navigator.getGamepads();
		} else if(navigator.webkitGetGamepads) {
			return navigator.webkitGetGamepads();
		}
	}//end of getGamepads

	//////////

	function pollGamepads() {
        var gamepads = getGamepads(),
            i, gamepad, idx;
        for (i=0;i<gamepads.length;i++) {
            if (gamepads[i]) {
                gamepad = gamepads[i];
                idx = gamepad.index;
                if (gpStates[idx]) {
                    if (gpStates[idx].gamepad != gamepad) {
                        gamepadDisconnected(gpStates[idx]);
                        gamepadConnected(gamepad);
                    }
                } else {
                    gamepadConnected(gamepad);
                }
                updateGamepadState(gamepad);
            }
        }
    } // end of pollGamepads

	//p.219
	function gamepadConnected(gamepad) {
		gpStates[gamepad.index] = {
			gamepad: gamepad,
			buttons: gamepad.buttons,
			axes: gamepad.axes
		};
		console.log("Gamepad[" + gamepad.index + "] connected");
	} //end of gamepadConnected()

	function gamepadDisconnected(gamepad){
		console.log("Gamepad[" + gamepad.index + "] disconnected");
		delete gpStates[gamepad.index];
	} //end of gamepadConnected()


	////////////////////////////////////////////////
	
	function updateGamepadState(gamepad) {
        var state = gpStates[gamepad.index],
            i;

        for (i=0;i<gamepad.buttons.length;i++) {

            if (gamepad.buttons[i] != state.buttons[i]) {
                state.buttons[i] = gamepad.buttons[i];
                if (state.buttons[i]) {
                    gamepadButtonDown(gamepad, i);
                }
            }

        }
        for (i=0;i<gamepad.axes.length;i++){
            if (gamepad.axes[i] != state.axes[i]) {
                state.axes[i] = gamepad.axes[i];
                gamepadAxisChange(gamepad, i, state.axes[i]);
            }
        }
    } //end of updateGamepadState()

    ////////////////////////////////////////////////

    //p.219
    //gamepadButtonDown() indicates if a buttom was pressed (value changed from 1 to 0)
        function gamepadButtonDown(gamepad, buttonIndex) {
        var gpButtons = {
                0:  "BUTTON_A"
            },
            controls = jewel.settings.controls,
            button = gpButtons[buttonIndex];
        if (button && controls[button]) {
            trigger(controls[button]);
        }
    }
    //gamepadAxisChange() is called for all axes that have changed in any way
    //p.220
    function gamepadAxisChange(gamepad, axisIndex, axisValue) {
        
        var controls = jewel.settings.controls,
            controlName;

        if (axisIndex === 0 && axisValue === -1) {
            controlName = "LEFT_STICK_LEFT";
        } else if (axisIndex === 0 && axisValue === 1) {
            controlName = "LEFT_STICK_RIGHT";
        } else if (axisIndex === 1 && axisValue === -1) {
            controlName = "LEFT_STICK_UP";
        } else if (axisIndex === 1 && axisValue === 1) {
            controlName = "LEFT_STICK_DOWN";
        }

        if (controlName && controls[controlName]) {
            trigger(controls[controlName]);
                    //triggers actions bound to the stick direction

        }
    }
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//p226

	//bind() takes two parameters, the name of a game action and a function that should be attached to that action
	function bind(action, handler) {
		//bind a handler function to a game action
		if(!inputHandlers[action]) {
			inputHandlers[action] = [];
		}
		inputHandlers[action].push(handler);
	}//end of bind()

	//trigger() takes a single argument and calls all handler functions that were bound to that action
	function trigger(action) {
		//trigger a game action
		var handlers = inputHandlers[action],
		//The slice() method returns a shallow copy of a portion of an array into a new array object.


			args = Array.prototype.slice.call(arguments, 1);
			console.log("Game action: " + action);

			if(handlers) {
				for(var i=0; i<handlers.length; i++){
					handlers[i].apply(null, args);
				}
			}
	} //end of trigger(action)

	return {
		initialize: initialize,
		bind: bind
	}; //end of return

})(); //end of jewel.input