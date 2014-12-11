//GAME SCREEN MODULE

jewel.screens["game-screen"] = (function() {
	var firstRun = true,
		paused,
		pauseStart, //p.261
		cursor, //p.221
		gameState = {
			//game state variables
		}; //p.254 

	//triggering the initial redraw (call initialize() function then call the first redraw() function)
	function startGame() {
		var board   = jewel.kingdom, //go to jewel.board (inside of board.js)
			display = jewel.display; //go to jewel.display (inside of display.canvas.js)
			
			//p.254
			//adding points and time
			gameState = {
				level: 0,
				score: 0,
				timer: 0, // setTimeout reference
				startTime: 0, //time at beginning of level
				endTime: 0 //time to game over
			};
			
			updateGameInfo(); //p.258

			jewel.audio.initialize(); //p.305
			/* ERROR CODE (From book)
			var dom = jewel.dom,
			    overlay = dom.$("#game-screen .pause-overlay")[0];
			overlay.style.display = "none"; */

			board.initialize(function() {
				display.initialize(function() {

					//p.221
					//cursor has 3 properties
					cursor = {
						x: 0, //jewel coordinates
						y: 0, //jewel coordinates
						selected: false //Boolean (if true, game tries to swap with the next activated jewel)
					};//end of cursor
					////////////////////////////////


					//start the game
					display.redraw(board.getBoard(), function() {

						advanceLevel();
					
					}); //end of display.redraw
				}); //end of display.initialize

				});//end of board.initialize 
			
						paused = false; //p.191 LISTING 7-19

						//december 4, class
						var overlay = jewel.dom.$("#game-screen .pause-overlay")[0];
       					overlay.style.display = "none";

						console.log(paused);

	}//end of startGame()

	/////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////

	//p.258 updating game info
	//updateGameInfo() resets display to initial values when a new game starts
	function updateGameInfo() {
		var $ = jewel.dom.$;
		$("#game-screen .score span")[0].innerHTML = gameState.score;
		$("#game-screen .level span")[0].innerHTML = gameState.level;
	}

	//p.259
	function setLevelTimer(reset) {
		var $ = jewel.dom.$;

		if (gameState.timer) {
			clearTimeout(gameState.timer);
			gameState.timer = 0;
		}//end of if

		if(reset) {
			gameState.startTime = Date.now();
			//startTime = current time
			//endTime = how much time player is given at a particular level
			gameState.endTime = 
				jewel.settings.baseLevelTimer *
				//The pow() method returns the value of x to the power of y (xy).
				Math.pow(gameState.level,
					//because of the negative exponent, the value
					//of Math.pow() decreases as the level increases
						 -0.05 * gameState.level);
		}//end of if

		var delta = gameState.startTime +
					gameState.endTime - Date.now(),

			percent = (delta/gameState.endTime) * 100,
			progress= $("#game-screen .time .indicator")[0];

			if(delta<0) {
				gameOver();
			} else {
				progress.style.width = percent + "%";
				gameState.timer = setTimeout(setLevelTimer,30);
			}
	//NOTE: setTimeout is being used because the browser may not
	//update the animations if requestAnimationFrame() is needed somewhere else
	//(Timer is more critical)
	}//end of setLevelTimer()

	/////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////


	//p.221
	function setCursor(x,y,select) {
		//sets cursor values and tells game display to update the rendering of the cursor
		cursor.x = x;
		cursor.y = y;
		cursor.selected = select;
		jewel.display.setCursor(x, y, select);
	}

	//p.222 SELECTING JEWELS
	// REFER TO README.txt for selectJewel() explanation (8.3)
	function getHeart(x, y) {
		
		//p.261
		if(paused) {
			return;
		}

		if(arguments.length ===0) {
			getHeart(cursor.x, cursor.y);
			return;
		}//end of if

		if(cursor.selected) {
			var dx = Math.abs(x-cursor.x),
			    dy = Math.abs(y-cursor.y),
			    dist = dx+dy;
			
			if(dist===0) {
				//deselect the selected jewel
				setCursor(x,y,false);
			} else if(dist===1) {
				//select an adjacent jewel
				jewel.kingdom.swap(cursor.x, cursor.y,
					x,y,playBoardEvents);
				setCursor(x,y,false);
				} else {
					//selected different jewel
					setCursor(x,y,true);
				}
			} else {
				setCursor(x,y,true);
			}//end of else
		}//end of selectJewel()

		//p.223
		function playBoardEvents(events) {
			
			var display = jewel.display;

			if (events.length > 0) {
				var boardEvent = events.shift(),

				//next() is a helper that calls playBoardEvents() recursively on the rest of the events
				next = function() {
					playBoardEvents(events);
				}; //end of next

				//each type of event triggers a different function on the display module
				switch(boardEvent.type) {
					case "move":
					display.moveJewels(boardEvent.data, next);
					break;

					case "remove":
					jewel.audio.play("match"); //p.306
					display.removeJewels(boardEvent.data, next);
					break;

					case "refill":
					announce("No moves!");
					display.refill(boardEvent.data, next);
					break;

					case "score": //new score event
					addScore(boardEvent.data);
					next();
					break;

					case "badswap":
					jewel.audio.play("badswap");
					next();
					break;

					default:
					next();
					break;
				}//end of switch

			} else {
				display.redraw(jewel.kingdom.getBoard(), function() {

					//good to go again

				});
			}
		}//end of playBoardEvents()

		//p.272
		function gameOver() {
			jewel.audio.play("gameover"); //p.306

			jewel.display.gameOver(function() {
				announce("Game Over!");
				//game over animation on display.canvas.js
			});
		} //end of gameOver()

		//p.264 & p. 265
		function addScore(points) {
			var settings = jewel.settings,
				nextLevelAt = Math.pow(
				settings.baseLevelScore,
				Math.pow(settings.baseLevelExp, gameState.level-1)
				);

			gameState.score += points;
			if (gameState.score >= nextLevelAt) {
				advanceLevel();
				//increments level value + sets up new game timer
			}
			updateGameInfo();
		}//end of addScore()

		//p.266
		//advanceLevel() increments level value + updates UI elements
		//visual feedback can be found on display.canvas.js (levelUp function)
		function advanceLevel(){

			jewel.audio.play("levelUp"); //p.306

			gameState.level++;
			announce("Level " + gameState.level);
			updateGameInfo();
			//level value on gameInfo obj is 0 at beginning of game
			gameState.startTime = Date.now();
			gameState.endTime = jewel.settings.baseLevelTimer *
				Math.pow(gameState.level, -0.05 * gameState.level);
			setLevelTimer(true);
			jewel.display.levelUp();
		} //end of advanceLevel()

		//p.270
		function announce(str) {
			var dom = jewel.dom,
			$ = dom.$,
			element = $("#game-screen .announcement")[0];
			element.innerHTML = str;
			dom.removeClass(element, "zoomfade");
			setTimeout(function() { //mistake fixed on Dec 4 (previously said "setTimeOut")
				dom.addClass(element, "zoomfade");
			},1);
		}//end of announce()


		////////////////////////////////////////
		//p.224
		function moveCursor(x,y) {
			//p.262
			if(paused) {
				return;
			}

			var settings = jewel.settings;
			if(cursor.selected) {
				x+=cursor.x;
				y+=cursor.y;
				if(x>=0 && x<settings.cols &&
				   y>=0 && y<settings.rows) {
					getHeart(x, y);
				}//end of IF
			} else {
				x = (cursor.x + x + settings.cols) % settings.cols;
				y = (cursor.y + y + settings.rows) % settings.rows;
				setCursor(x, y, false);
			}
				console.log("Cursor position: " + x + ", " + y);
		}

		//directional move functions

		function moveUp() {
			moveCursor(0, -1);
		} //end of moveUp

		function moveDown() {
			moveCursor(0, 1);
		} //end of moveDown()

		function moveLeft() {
			moveCursor(-1, 0);
		}//end of moveLeft()

		function moveRight() {
			moveCursor(1, 0);
		}//end of moveRight()

		////////////////////////////////////////

	function pauseGame() {
		if(paused) {
			return; //do nothing if already paused
		} //end of IF statement

		var dom = jewel.dom,
			overlay = dom.$("#game-screen .pause-overlay")[0];
		    overlay.style.display = "block";
		    paused = true;

		//p.261
		pauseStart = Date.now();
		clearTimeout(gameState.timer);
		jewel.display.pause();
	}//end of pauseGame()

	function resumeGame() {
		var dom = jewel.dom,
		    overlay = dom.$("#game-screen .pause-overlay")[0];
		overlay.style.display = "none";
		paused = false;

		//p.261
		var pauseTime = Date.now() - pauseStart;
		gameState.startTime += pauseTime;
		setLevelTimer();
		jewel.display.resume(pauseTime);
	}

	//if player decides to leave the game, he returns to the main menu
	function exitGame() {
		pauseGame();
		var confirmed = window.confirm(
			"Do you want to return to the main menu?");	
		resumeGame();
		if(confirmed) {
			jewel.showScreen("main-menu"); //returns to main menu
		} else {
			resumeGame();
		}
		}//end of exitGame

	function setup() {
		var dom = jewel.dom;
		dom.bind("footer button.exit", "click", exitGame); //on click, player exits game (confirmation window pops up)
		dom.bind("footer button.pause", "click", pauseGame); //on click, game is paused
		dom.bind(".pause-overlay", "click", resumeGame); //on click, game resumes
		/* CSS styles are applied to the events above */

		//p.227
		//jewel.input.initialize(); //p. 212
		console.log('pre input.initialize failure');
		var input = jewel.input;
		input.initialize();
		input.bind("getHeart", getHeart);
		input.bind("moveUp", moveUp);
		input.bind("moveDown", moveDown);
		input.bind("moveLeft", moveLeft);
		input.bind("moveRight", moveRight);
	}

	function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		} //end of if statement
		startGame();
	} //end of run()

	return {
		run: run
	}; //end of return

})(); //end of main function