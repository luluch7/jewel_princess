Author: Luciana Flora
Description: This is a puzzle style game created based on the book HTML5 GAMES by Jacob Seidelin. Below, I wrote a summary of each chapter and my overall process while creating this game.

I also wrote down sections of the book in order to better understand them.

Languages: HTML5, CSS3, JavaScript

////////////////////////////////////////////////////////////////////////

Modified Names:

var jewels (display.canvas.js)  ---->  hearts
var cursor (display.canvas.js)  ----> pointer

function selectJewel(screen.game.js)  ---->  getHeart
function jewel.board (board.js) ----> jewel.kingdom
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CHAPTER 1  (10/22/2014)
This is an introduction to the overall book, what is being created and a few techniques that will be used throughout the process. The explanations are very clear and straight to the point.

CHAPTER 2 (10/22/2014)
This chapter sets the game's basic HTML and CSS and explains the game's functionality and wireframes. It also adds a loading script to the game.

	2.1) Explain game funcionality and wireframes
	
	2.2) Set game's basic HTML and CSS
	
	2.3) Start adding scripts (loading) 
		
		a) the load() function is responsible for loading extra script files
		b) load() should load the file specified in the src parameter
		c) the scripts are loaded in parallel (no guarantee they finish loading in order)
		d) load() adds the script to the scriptQueue array:
			-name of the file
			- callback function
			- Boolean flag indicating if script is loaded
		e) file loads as image (not script): browser loads script without executing it (error message)
		f) when file is loaded, onerror/onload handler changes to the loaded flag and calls the executeScriptQueue()

	2.4) Create a helper module to ease the dask of working with the DOM

	2.5) Create the Splash Screen

	Overall, most of this chapter made sense to me. I ran into an error towards the end and it took me a while to figure out what the problem was (I put a comma instead of a semi-colon in one of my functions) but everything seems to be working fine up to this point.


CHAPTER 3 (10/24/2014)
This chapter talks about designing for mobile devices, supporting different screen resolutions, creating the main menu and making web apps for iOS.

	3.1) CSS: adding em measurements
	3.2) Viewport information (good explanation) + add viewport meta tag to HTML document
	3.3) Create the main menu
	3.4) Adding screen modules

		 a) the splash screen module should listen for CLICK events and, on click, switch to the main menu screen
		 b) two new js files were created: screen.splash.js and screen.main-menu.js
		 c) on screen.splash.js, the function run() was created and, when the screen runs for the first time, setup() will be activated. setup() attaches a click event handler to the game (so, on click, the screen changes)
		 d) screen.main-menu.js determines that, the first time the main menu is displayed, the event handling is set up.
		 	That way, when the users click, they'll be taken to the appropriate screen (buttons were added to the HTML file
		 	and each of them has a name that'll be used to direct the user to the right screen)
		 e) time to load script files to the index.html
		 f) adding media queries + styles and making sure the game fits nicely on screen. I'm used to the media query process, but I had never been so specific about it. In the book, the author adds very specific media queries that cover different kinds of devices and orientations. Until now, I didn't know that you could actually add two media queries to the same style:
		 @media (min-device-width: 768px ) and (orientation: portrait),
		 @media (min-device-width: 1024px) and (orientation: landscape) {
	     		#game {
					font-size: 64px;
				}
		  }
		 g) add iOS touch icons (princess crown!)	 
		 h)

	This chapter was more complicated than the previous one and I got quite lost here and there (especially because it was such a long chapter). I understand how event handlers work, but I was a bit confused as to how one JS file connects to the other. The overall theory in this chapter makes sense, but the process was long and a bit painful!

	
	CHAPTER 4 (10/28/2014)
	In this chapter, we'll be creating a module for the game board, encapsulating the game state, setting up the jewel board, implementing game rules and reacting to jewel swaps. (This chapter won't change the visuals of the game, so the console will be even more important when it comes to debugging)

	- The board module is just a representation of the jewel board (it exposes to the outside world a query function for accessing the jewels on the board and a function for swapping them)

		4.1) Create board.js module, define settings and initialize it
			 - to inspect board data, enter jewel.board.print() into console
		4.2) Fill the initial board: fillBoard(), randomJewel()
			 - since the jewels that will initially fill the board are randomly chosen, it is possible that there will already be formed chains even before the game starts (in this case, the user would get points for no reason). To prevent that from happening, a while loop is added to board.js and that loop will keep on
			 happening until there are no chains on the screen (until conditions are met)
		4.3) Validating swaps by using checkChain(), canSwap() and isAdjacent() 
			 - swap is only valid if it results on a chain of three or more jewels
			 - checkChain() tests whether a jewel at a specified position is part of a chain
			 - checkChain() determines a chain by noting the jewel type at the position, looking to the left and right and
			 counting the number of jewels of the same type found in those directions
			 - if the sum of identical jewels in either the horizontal or vertical search is greater than two, there is a chain
		4.4) Detecting chains + deleting jewels
			 - after performing a swap, the game must search the board
			 for chains of jewels to remove (when a chain is removed, other jewels fall down and more jewels enter the board)
			 >>> THIS MEANS THE BOARD NEEDS TO BE CHECKED AGAIN <<<
			 - by using the function check(), the board is checked again
			 and information about the chains is collected inside of
			 removed[] and moved[] (gaps[] is used to determine if a jewel should be moved down when a chain is removed or not... But I'm still confused as to how it works)

		4.5) Creating new jewels and awarding points
			 >> NOTE: page 99 (listing 4-16) contains the expression "y&#x2013" inside of a for loop. On the original, it says y-- instead (not sure if this will affect anything later)

			 - check() needs to call itself again and again until no
			 chains are left at all (since new jewels might fall together and form a chain)
		4.6) Refilling the grid/board, checking for available moves and copying the board data

		
			 /////////////////////////////////////////////////////////////
			 NOTE: The overall game logic on chapter 4 makes sense to me but, since there is so much going on all the time, I get a bit confused as to what is happening at each given moment. I'm not sure when certain functions will run and because many of them are, in a way, quite similar, the overall board.js file feels really quite confusing. 
			 /////////////////////////////////////////////////////////////

CHAPTER 6 (11/10/2014)
This chapter deals with creating graphics with HTML5 canvas.

	The components that make up the canvas state are:

	- transformation matrix
	- clipping path
	- strokeStyle, fillStyle
	- lineWidth, lineCap, lineJoin, miterLimit
	- globalAlpha, globalCompositeOperation
	- shadowOffsetX, shadowOffsetY, shadowColor, shadowBlur
	- font, textAlign, textBaseline

	In this chapter, the author goes through different canvas drawing techniques and plays around with them. After we are introduced to a few canvas concepts, we draw a logo and place it randomly, several times, on the screen. I'm familiar with creating and manipulating shapes on canvas, but the author makes things a little bit more complicated (in order to explore different drawing options).

	I found the several points established in the beginning of the logo creation rather confusing and I think things could be simplified. Using for loops on a few occasions was very interesting, though, as I had never done that while using canvas.

	ctx.save() and ctx.restore() are still a bit confusing to me and I'm not sure which benefits they bring to the process.

CHAPTER 7 (11/11/14)
In this chapter, we'll be creating the game display module by using canvas. We'll also be adding a progress bar to the splash screen.

	7.1) Tracking load progress and adding a progress bar. 
		 After customizing the bar through CSaS, console test:
		 jewel.dom.$(".progress .indicator")[0].style.width = "25%";
	7.2) Creating game screen module and drawing the board with 	 canvas (display.canvas.js)
	7.3) The game has 7 different types of jewels that are displayed in sprites of different resolutions.
	     A single sprite can be used (the browser would resize it 
		 automatically) but that can affect the image quality,
		 so it's best to have different sprite options.

		 >> the jewel sprite needs to be loaded when the display module is initialized and the callback function can't be called before the image is ready to be drawn on the canvas (if drawImage() is called on the canvas context before the image is loaded, an error occurs) <<
	7.4) Creating background pattern and filling the board with jewels. (see display.canvas.js module)
	7.5) startGame(), pauseGame(), resumeGame(), exitGame()
	7.6) on page 192, we bind the click event on the pause button to the pauseGame() function and the click event on the pause overlay to the resumeGame() function so the user can resume the game.

	startGame(), pauseGame() and resumeGame() are also modified so they show and hide the pause overlay




CHAPTER 8 (11/20/14)

In this chapter, we are going to start capturing the user's input and reacting to it (since, right now, nothing happens when you click on the game).

	8.1) Brief explanation on browser inputs (mobile and desktop) and on how to toggle the virtual keyboard on a mobile device
	>> www.w3.org/TR/touch-events (good touch events reference)
	>> touchstart, touchmove, touchend (important events)
	>> touches property is a list of all the currently active touches on the screen [they are added to an array]
	>>multitouch, multitouch drag, multitouch pinch-zoom
	>> in addition to the touch events, iOS devices also support GESTURE events
		>> gesturestart (fires only when 2nd finger touches screen)
		>> gesturechange
		>> gestureend
		(gesture events carry information that might be useful when acting on multitouch events, and they do not react to single-touch input)

		NOTE: A canvas element behaves like a bitmap image and the structure of the painted content isn't retained, so you can only attach event handlers to the canvas element itself(and nothing else)

	>> hit regions, gamepads and controllers

	8.2) BUILDING THE INPUT MODULE p.211
		 The input module captures the user input in the form of keyboard, mouse and touch events and translates there events into a set of game events

		 input.js

		 >> screen.game.js (controls) and index.html were updated; input.js was created
		 >> the game supports 4 types of input: mouse, keyboard, touch and gamepad 

		 TOUCH INPUT:
		 touch event functionality is almost identical to the mouse event handling, except that you now listen for the touchstart event and use the input keyword TOUCH
		 (instead of passing the event object as the third argument to handleClick(), you must now pass the relevant touch object event.targetTouches[0])

		 P.218
		 NOTE: The navigator object contains information about the browser

		gpStates stores the states of the curretly known gamepads
		pollGamepads() grabs the current gamepad list from the getGamepads() and
		checks whether a famepad with that index already exists in the gpStates list or not --> if not, pollGamepads() calls the gamepadConnected() function (which adds the gamepad to the list)
			>> if the gamepad exists, pollGamepads() removes the old one before adding the new one

	8.3) Implementing game actions
		 
		 >>screen.game.js
		 start implementing action handlers for the input events

		 When the user clicks on the board, the jewel at that location is activated. A simple object can hold the information about where the cursor is and whether the jewel at the position is active.

		 p.223
		 selectJewel(x, y):
		 this function determines that if another jewel was already selected, you acn use the distance between the two jewels to determine the appropriate action
		 	1 = adjacent positions
		 	0 = same jewel is selected again
		 		any other distance means that a new jewel was selected (deselect current jewel and select new)

		 >>if player selects same jewel twice, jewel is deselected by calling setCursor() with false
		 
		 >>if jewel is a neighbor of the position already selected, the game tries to swap them by calling board.swap()
		 
		 >>if a very different jewel is selected, you simply move the cursor to that position and enable the selected parameter

		 >> playBoardEvents() passed to board.swap() is called whenever the board module finishes moving jewels and updating the board data
		 	>> swap() calls its callback function with a single argument which is an array of all the events that take place between the board's old and new state

	8.4) Binding Inputs to Game functions
	8.5) Rendering the cursor (display.canvas.js) p.228
		 the display module also needs to indicate which jewels are selected, so it needs to keep track of the cursor position (just like the game screen module)
		 	>>in order to do that, you access the cursor via setCursor()

		>> IN THE NEXT CHAPTER... we'll add animation and effects to the game actions that were just implemented


CHAPTER 9 (11/29/14)
	
	In this chapter, we'll be creating animation cycles, making animations for game actions, adding score and level UI elements and animating the game timer.

	>> REFER TO p.239 for requestAnimationFrame() examples!!!

	9.1) Creating the animation cycle p.240
		 REFER TO display.canvas.js

	9.2) Animating the Cursor p.241 
		 display.canvas.js

		 NOTE: on p.242, cycle() is updated and the first var is called "time"
		 	   the original file has the var "now" instead (which I'm using as well). Refer to that in case anything goes wrong.

	9.3) Animating Game Actions
		 - moving jewels  p.248
		 - removing jewels  p.249
		 - refilling the board  p.251
		 - advancing to the next level
		 - ending the game 

		 p.246
		 board.js: generating move events for invalid swaps

		 p.250 
		 adding scaling and rotation to drawJewel()
		 on display.canvas.js

		 > canvas transformation methods 

		 p. 251
		 Refilling the Board
		 When the board module detects that no valid moves are left, it sends a refill event. The argument sent along with the event contains the jewels that make up the new board.

		 refill() sets up an animation using addAnimation(), just like moveJewels() and removeJewels()

		 render() replaces the old jewels with hte new ones, and rotates the board around the x-axis

	9.4) To make the jewels rotate around their axes, we use 3D CSS transformations. The CSS rotateX(), rotateY() and rotateZ() can be used for that purpose. 
		>> p.252	transform() - added to dom.js
		>> p.252	perspective added to #game-screen and #game-board (main.css)

		NOTE: to test refill() without having to play, type on console:

		jewel.display.refill(jewel.board.getBoard(), function() {})

	9.5) Adding points and Time p.253
		 add gameState to screen.game.js

		 create UI elements
		 p.241 (modifies index.html)
		 p.256 (modifies main.css)
		 p.257 (modifies mobile.css, so the game UI changes can be better viewed on landscape mode)

		 update game info p.258  screen.game.js

		 p.259 creating game timer (jewel.js)

		 p.259 screen.game.js
		 	   checking and updating game timer

         p.261 pausing the game timer  screen.game.js

         p.262 pausing animations in the display module
         	  display.canvas.js

         p.263 awarding points 
         	   add case to playBoardEvents() - screen.game.js

         p.268 adding announcement container + styles


    9.6) Debugging


CHAPTER 10 (12/04/14)

	- introducing html5 audio, audio formats, web audio API, audio module, adding sound effects to game

	10.1) Create audio.js
			- test for audio types p.300
			- create audio elements p.301

	10.2) Update index.html p.305

	10.3) Adding sound effects to the game
		  screen.game.js - audio added to the functions:
			
			advanceLevel()
			gameOver()
			playBoardEvents()





