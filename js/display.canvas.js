//CANVAS DISPLAY MODULE

jewel.display = (function() {
	var canvas, ctx,
		cols, rows,
		pointer,
		jewelSize,
		hearts,
		jewelSprite,
		previousCycle,
		animations = [], //p.243
		firstRun = true,
		paused; //p.262

//semitransparent checkered pattern (background)
//the nested loops iterate over the entire board and fill semitransparent squares in every other cell
function createBackground() {
	var background = document.createElement("canvas"),
		bgctx = background.getContext("2d");

		jewel.dom.addClass(background, "background");
		background.width = cols * jewelSize;
		background.height = rows * jewelSize;

		bgctx.fillStyle = "rgba(227, 141, 182, 1)";
		for (var x=0; x<cols;x++) {
			for (var y=0; y<cols; y++) {
				if ((x+y)%2) {
					bgctx.fillRect(
						x * jewelSize, y*jewelSize,
						jewelSize, jewelSize
						);
				}
			}
		}

		return background;

}
	// setup() is called when the module is first initialized;
	// setup() creates a canvas and attaches it to the game board element
	function setup() {
		var $ = jewel.dom.$,
		boardElement = $("#game-screen .game-board")[0];

		cols = jewel.settings.cols;
		rows = jewel.settings.rows;

		//create 2D canvas
		canvas = document.createElement("canvas");
		ctx = canvas.getContext("2d");
		jewel.dom.addClass(canvas, "board");

		//the board dimensions are determined by the .game-board CSS
		//and depend on the screen resolution of the device
		//default dimensions are 300x150
		var rect = boardElement.getBoundingClientRect();
		//getBoundingClientRect() retrieves the CSS dimensions of the board
		//it also returns an object describing the position and dimensions of the element
		canvas.width = rect.width;
		canvas.height = rect.height;
		//the jewelSize is calculated by dividing the width by
		//the number of columns specified in the jewel.settings object
		jewelSize = rect.width / cols;

		boardElement.appendChild(canvas);
		/* appending the background we just created in createBackground */
		boardElement.appendChild(createBackground());
		boardElement.appendChild(canvas); // some type of error here 
		

		//p.240 Creating the Animation Cycle
		previousCycle = Date.now();
		requestAnimationFrame(cycle);
	} //end of setup()

	//function schedules another cycle:
	//the initial call in setup() starts the cycle
	//the function also keeps track of the time of the previous cycle
	//this is important because you need to know how much time has passed since the last time the animations were updated
	function cycle() {
		var now = Date.now();
		if(!paused) {
			//hide cursor while animating
			if(animations.length === 0) {
				renderCursor(now);
			}//end of IF
			renderAnimations(now, previousCycle);
		}//end of IF
		previousCycle = now;
		requestAnimationFrame(cycle);
	}//end of cycle()

	//the jewel sprite needs to be loaded when the display module is initialized and the callback function
	//can't be called before the image is ready to be drawn on the canvas (if drawImage() is called on the canvas
    //context before the image is loaded, an error occurs)
	function initialize(callback) {

		paused = false; //p.262

		//the jewel sprite is loaded only the first time the initialize() function is called
		if (firstRun) {
			setup();

			jewelSprite = new Image;
			jewelSprite.addEventListener(
				"load", callback, false);
			jewelSprite.src = 
			"img/jewels" + jewelSize + ".png"; //this spells the name of the file
			firstRun = false;
		} else {
		callback();
		}
	} //end of initialize(callback)

	/*
	//helper function (Draws Jewels) p.187
	function drawJewel(type, x, y){
		ctx.drawImage(jewelSprite,
			type * jewelSize, 0, jewelSize, jewelSize,
			x * jewelSize, y * jewelSize,
			jewelSize, jewelSize
		);
	}//end of drawJewel()
	*/

	// p.250 drawJewel() is modified (original version above)
	function drawJewel(type, x, y, scale, rot) {
		ctx.save();
		if (typeof scale !== "undefined" && scale > 0) {
			ctx.beginPath();
			ctx.translate((x + 0.5) * jewelSize, (y + 0.5) * jewelSize);
			ctx.scale(scale, scale);
			if(rot) {
				ctx.rotate(rot);
			}//end of IF
			ctx.translate(-(x + 0.5) * jewelSize, -(y + 0.5) * jewelSize);
		}//end of IF
		ctx.drawImage(jewelSprite,
			type * jewelSize, 0, jewelSize, jewelSize,
			x * jewelSize, y * jewelSize, 
			jewelSize, jewelSize
			);
		ctx.restore();
	}//end of drawJewel()

	/*redraw() gets jewel data from the caller.  p.187
	  The display module has no connection to the board module and has no conpets of
	  the game state other than what it's told to draw */
	function redraw(newJewels,callback) {
		var x,y;
		hearts = newJewels;
		ctx.clearRect(0,0,canvas.width,canvas.height); //clears entire canvas

		for (x=0; x<cols; x++) {
			for (y=0; y<cols; y++) {
				drawJewel(hearts[x][y], x, y);
			}
		}
		callback();
		renderCursor(); //p.229
	}//end of redraw()


	//////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////

	//p.241
	//add pulsating effect to glowing cursor
	function renderCursor(time) {
		
		if (!pointer) {
			return;
		}//end of IF

		var x = pointer.x,
		    y = pointer.y,
		    t1 = (Math.sin(time / 200) + 1) / 2,
		    t2 = (Math.sin(time / 400) + 1) / 2;
		    //Math.sin() provides an easy way to create values that vary over time (going smoothly from -1 to +1 and back)
		    //refer to p.242 for a visual representation of the cursor pulse
		    //NOTE: the period of the pulse can be altered by changing the argument passed to the Math.sin() calls
		clearCursor();

		if (pointer.selected) {
			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			ctx.globalAlpha = 0.8 * t1;
			drawJewel(hearts[x][y],x,y);
			ctx.restore();
		}//end of IF

		ctx.save();
		ctx.lineWidth = 0.05 * jewelSize;
		ctx.strokeStyle = "rgba(250,250,150," + (0.5 + 0.5 * t2) + ")";
		ctx.strokeRect(
		(x + 0.05) * jewelSize, (y + 0.05) * jewelSize, 0.9 * jewelSize, 0.9 * jewelSize
		);
		ctx.restore();
	} //end of renderCursor();
	//next step is to add the renderCursor() function to the animation cycle

	//p.243
	//the array animations keeps track of all currently running animations
	function addAnimation(runTime, fncs) {
		var anim = {
			runTime: runTime,
			startTime: Date.now(),
			pos: 0,
			fncs: fncs
		};//end of anim
		animations.push(anim);
	}//end of addAnimation()

	/* NOTE: each animation is added to the list as a simple object structure describing the start time,
	the time it takes to finish, and the fncs property.

	fncs property holds references to three functions:
		- fncs.before()
		- fncs.render()
		- fncs.done()

	Those functions are called at various times when the animation is rendering.
	*/

	//p.244

	function renderAnimations(time, lastTime) {
		var anims = animations.slice(0), //copy list
			n = anims.length,
			animTime,
			anim,
			i;

		for (i=0; i<n; i++) {
			anim = anims[i];
			
			if (anim.fncs.before) {
				anim.fncs.before(anim.pos);
			}//end of if

			anim.lastPos = anim.pos;
			animTime = (lastTime - anim.startTime);
			anim.pos = animTime / anim.runTime;
			anim.pos = Math.max(0, Math.min(1, anim.pos));
		}//end of FOR loop

		animations = []; //reset animation list
		//every time the animation times calls renderAnimations(), the animations
		//array is cleared and rebuilt in the rendering loop
		for (i=0; i<n; i++) {
			anim = anims[i];
			anim.fncs.render(anim.pos, anim.pos - anim.lastPos);

			//if an animation is done (its position is at least equal to 1), done() is called
			if (anim.pos ==1) {
				if(anim.fncs.done) {
					anim.fncs.done();
				}//end of if
			} else {
				animations.push(anim); //if not done, animation is added back to the list
			}
		}//end of FOR loop
	}//end of renderAnimations()
	//////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////


	// p.229
	function renderCursor() {
		if(!pointer) {
			return;
		}//end of if
		var x = pointer.x,
			y = pointer.y;

		clearCursor();

		if(pointer.selected) {
			ctx.save();
			ctx.globalCompositeOperation = "lighter"; //The globalCompositeOperation property sets or returns how a source (new) image are drawn onto a destination (existing) image.
			ctx.globalAlpha = 0.8;
			drawJewel(hearts[x][y],x,y);
			ctx.restore();
		}//end of IF

		ctx.save();
		ctx.lineWidth = 0.05 * jewelSize;
		ctx.strokeStyle = "rgba(250,250,150,0.8)";
		ctx.strokeRect(
			(x + 0.05) * jewelSize, (y + 0.05) * jewelSize,
			0.9 * jewelSize, 0.9 * jewelSize);
		ctx.restore();
	}//end of renderCursor()

	// moveJewels() was modified on chapter 9, p.248
	// the new code iterates through all the specified jewels and sets up an animation for each one
	function moveJewels(movedJewels, callback) {
		var n = movedJewels.length,
			oldCursor = pointer;

		pointer = null;

		movedJewels.forEach(function(e) {
			var x = e.fromX, y = e.fromY,
				dx = e.toX - e.fromX,
				dy = e.toY - e.fromY,
				dist = Math.abs(dx) + Math.abs(dy);

			addAnimation(200 * dist, {
				// the before method clears the area where the jewel was located in the last frame
				before: function(pos) {
					//the movement factor is calculated using Math.sin()
					//the pos value that is passed to the before and render methods is in the range [0,1], so the resulting motion eases out nicely
					pos = Math.sin(pos * Math.PI / 2);
					clearJewel(x + dx * pos, y + dy * pos);
				}, //NOTE: refer to p.248 for a visual representation of the motion factor

				//
				render: function(pos) {
					pos = Math.sin(pos * Math.PI / 2);
					drawJewel(
						e.type,
						x + dx * pos, y + dy * pos
						);
				},

				done: function() {
					if (--n == 0) {
						pointer = oldCursor;
						callback();
					}
				}
			});
		});
	}
	/*
		mover, i;

		for (i=0; i<n; i++) {
			mover = movedJewels[i];
			clearJewel(mover.fromX, mover.fromY);
		}//end of for loop

		for (i=0; i<n; i++) {
			mover = movedJewels[i];
			drawJewel(mover.type, mover.toX, mover.toY);
		}//end of for loop
	}//end of moveJewels()
	*/

	/*removeJewels() is modified on chapter 9, p.249*/
	function removeJewels(removedJewels, callback) {
		var n = removedJewels.length;

		//p.249
		removedJewels.forEach(function(e) {
			
			addAnimation(400, {
				before: function() {
					clearJewel(e.x, e.y);
				},//end of before

				render: function(pos) {
					ctx.save();
					ctx.globalAlpha = 1 - pos;
					//each "to-disappear" object passed has the properties: type, x, y
					//animations are set up so the jewel is cleared before each frame and then redrawn in a scaled-down and rotated version using the canvas transformation methods
					//drawJewel() calls render()
					drawJewel(
						e.type, e.x, e.y,
						1 - pos, pos * Math.PI * 2
					);
					ctx.restore();
				},//end of render

				done: function() {
					if (--n == 0) {
						callback();
					}//end of IF
				}//end of done
			});//end of addAnimation

			}); //end of removedJewels.forEach....
		} //end of removeJewels()

		/*for(var i=0; i<n; i++) {
			clearJewel(removedJewels[i].x, removedJewels[i].y);
		}//end of for loop
		callback();
		} */

	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////

	//p.251

	function refill(newJewels, callback) {
		var lastJewel = 0;

		addAnimation(1000, {
			render: function(pos) {
				var thisJewel = Math.floor(pos * cols * rows),
				i, x, y;

				for (i = lastJewel; i < thisJewel; i++) {
					x = i % cols;
					y = Math.floor(i / cols);
					clearJewel(x, y);
					drawJewel(newJewels[x][y], x, y);
				}//end of for loop

				lastJewel = thisJewel;
				jewel.dom.transform(canvas, "rotateX(" + (360 * pos) + "deg)");
			},//end of render

			done: function() {
				canvas.style.webkitTransform = "";
				callback();
			} //end of done
		});//end of addAnimation
	} //end of refill()


	//p.267 adding visual effects when the level changes
	function levelUp(callback) {
	addAnimation(1000, {
		//before function clears and redraws the previous jewel
		before: function(pos) {
			var j = Math.floor(pos * rows * 2),
			x, y;

			//pos goes from 0 to 1 and j starts at 0 and ends at (2*rows)
			//loop starts at y=0 and x=j, then moves down the board,
			//moving the x position one step to the left at every row
			//result: matching jewels form a diagonal row that moves
			//down or accross the board during the animation
			for (y=0, x=j; y<rows; y++, x--) {
				if(x >= 0 && x < cols) {//boundary check
					clearJewel(x, y);
					drawJewel(hearts[x][y], x, y);
				}
			}
		},

		//render function highlights currently active jewels by drawing
		//copies on top with the lighter composite operation
		render: function(pos) {
			var j = Math.floor(pos * rows * 2),
			x, y;
			ctx.save(); //remember to save state
			ctx.globalCompositeOperation = "lighter";
			for (y=0,x=j;y<rows;y++,x--) {
                    if (x>= 0 && x < cols) { // boundary check
                        drawJewel(hearts[x][y], x, y, 1.1);
                    }
                }
                ctx.restore();
            },
            done : callback
		});
	}//end of levelUp()

	//p. 228 
	//clearCursor() clears the jewel at the cursor position and redraws the jewel

	function clearCursor() {
		if(pointer) {
			var x = pointer.x,
				y = pointer.y;

				clearJewel(x,y);
				drawJewel(hearts[x][y], x,y);
		}
	}

	function setCursor(x, y, selected) {
		clearCursor();
		if(arguments.length>0) {
			pointer = {
				x: x,
				y: y,
				selected: selected
			};
		} else {
			pointer = null;
		}
		renderCursor();
	}

	//p.229 
	function clearJewel(x, y) {
		//clears a square on the canvas (at specified coordinates)
		ctx.clearRect(
			x*jewelSize, y*jewelSize, jewelSize, jewelSize);
	}

	//p.273
	function gameOver(callback) {
		addAnimation(1000, {
			//render function adjusts position of the jewel board canvas
			render: function(pos) {
				canvas.style.left = 
				0.2 * pos * (Math.random() - 0.5) + "em";
				canvas.style.top = 
				0.2 * pos * (Math.random() - 0.5) + "em";
			},

			done: function() {
				canvas.style.left = "0";
				canvas.style.top = "0";
				explode(callback);
			}
		});
	}

	//p.274
	//to make the jewels blow apart in random directions, you need a list of objects
	//representing the pieces. Each piece needs information about its current position, rotation speed and current velocity.
	function explode(callback) {
		var pieces = [],
			piece,
			x, y;

			for (x=0; x<cols; x++) {
				for (y=0; y<rows; y++) {
				piece = {
					type: hearts[x][y],
					//position
					pos: {
						x: x + 0.5,
						y: y + 0.5
					},
					//speed
					vel: {
						x: (Math.random() - 0.5) * 20,
						y: -Math.random() * 10
					},
					//random rotation
					rot: (Math.random() - 0.5) * 3
				}
					pieces.push(piece);
			}
		}

	addAnimation(2000, {
		before: function(pos) {
			ctx.clearRect(0,0,canvas.width,canvas.height);
		},
		render: function(pos, delta) {
			explodePieces(pieces,pos,delta);
		},
		done:callback
	});
	}


	//p. 275
	//explodePieces() alters position and velocity of pieces and renders each of them on the now blank canvas
	function explodePieces(pieces, pos, delta) {
		
		var piece, i;
		
		for (i=0;i<pieces.length;i++) {

			//vel changes by adding a constant * delta (gravity effect)
			piece = pieces[i];
			piece.vel.y += 50 * delta;
			piece.pos.y += piece.vel.y * delta;
			piece.pos.x += piece.vel.x * delta;

			if (piece.pos.x < 0 || piece.pos.x > cols) {
			piece.pos.x = Math.max(0, piece.pos.x);
			piece.pos.x = Math.min(cols, piece.pos.x);
			piece.vel.x *= -1;
			}//end of if

		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		ctx.translate(piece.pos.x * jewelSize, piece.pos.y * jewelSize);
		ctx.rotate(piece.rot * pos * Math.PI * 4);
		ctx.translate(-piece.pos.x * jewelSize, -piece.pos.y * jewelSize);
		drawJewel(piece.type, piece.pos.x - 0.5, piece.pos.y - 0.5);
		
		ctx.restore();
		}//end of FOR loop
	}//end of explorePieces()

	//p.262
	function pause() {
		paused=true;
	}//pause()

	//p.263
	function resume(pauseTime) {
		paused = false;
		for (var i=0; i<animations.length; i++) {
			animations[i].startTime *= pauseTime;
		}
	}//end of resume()

	return {
		initialize: initialize,
		setCursor: setCursor,
		moveJewels: moveJewels,
		removeJewels: removeJewels,
		redraw: redraw,
		refill: refill,
		levelUp: levelUp,
		gameOver: gameOver,
		pause: pause, //p. 263
		resume: resume //p.263
	}; //end of return

})(); //end of main function