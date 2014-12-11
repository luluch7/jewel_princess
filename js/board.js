// Chapter 4 was really complex to me and,
// because there are so many similar names and functions, I'm still really quite confused about what is
// happening. The overall game logic, though, makes sense - what is difficult is understanding exactly
// HOW things are working.  

//to test: jewel.board.initialize()
//         jewel.board.print()

jewel.kingdom = (function() {

	var settings,
		jewels,
		cols,
		rows,
		baseScore,
		numJewelTypes;

		function initialize(callback) {
			settings = jewel.settings; //imports settings module
			numJewelTypes = settings.numJewelTypes; //array of arrays (2D) representing current state of board
			//2D array makes it easier to access the individual jewels by their coordinates
			baseScore = settings.baseScore; 
			cols = settings.cols;
			rows = settings.rows;
			fillBoard(); //function to be called

			if(callback) {
				callback();
			}

		} //end of initialize

		function fillBoard() {
			var x, y,
				type;

			jewels = [];
			for (x=0; x<cols; x++) {
				jewels[x] = [];
				for (y=0; y<rows; y++) {
					type = randomJewel();

					// jewel type is picked using the helper function random Jewel()
					// which simply returns an integer value between 0 and (numJewelTypes -1)
					while ((type === getJewel(x-1, y) &&
						    type === getJewel(x-2, y)) ||
							(type === getJewel(x, y-1) &&
							type === getJewel(x, y-2))) {
					  type =  randomJewel();
				    } //end of while loop

				   jewels[x][y] = type;
				
			     }//end of for loop
			 } //end of for loop

	 		// try again if new board has no moves
	 		if (!hasMoves()) {
	 			fillBOard();
	 		}
 		} //end of fillBoard()

		function randomJewel() {
			return Math.floor(Math.random() * numJewelTypes);
		}//end of randomJewel

		//the function getJewel() returns -1 if either of the coordinates is out of bounds
		//this function is used so the jewels won't get outside of the board
		function getJewel(x,y) {
				if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
	            return -1;
	        } else {
	            return jewels[x][y];
	        } //end of else
		}

		//returns the number jewels in the longest chain
		//that includes (x,y)
		function checkChain(x, y) {
			var type = getJewel(x, y),
			    left = 0, right = 0,
			    down = 0, up = 0;

			// NOTE: I understand what the while loops are doing, but I only somewhat understand HOW they're doing it
			//look right
			while (type === getJewel(x+ right +1, y)) {
				right++;
			}
			//look left
			while (type === getJewel(x - left - 1, y)) {
				left++;
			}
			//look up
			while (type === getJewel(x, y + up +1)) {
				up++;
			}
			//look down
			while (type === getJewel(x, y - down - 1)) {
				down++;
			}

			//returns the number of jewels found in the largest chain
			//this will help later when the score is calculated
			return Math.max(left + 1 + right, up + 1 + down);
		}

		//returns true if (x1, y1) can be swapped with (x2, y2)
		//to form a new match
		function canSwap(x1,y1,x2,y2) {
			var type1 = getJewel(x1,y1),
			    type2 = getJewel(x2,y2),
			chain;


			if(!isAdjacent(x1, y1, x2, y2)) {
				return false;
			}

			// temporarily swap jewels
			jewels[x1][y1] = type2;
			jewels[x2][y2] = type1;

			chain = (checkChain(x2, y2) > 2 ||
				     checkChain(x1, y1) > 2);

			//swap back
			jewels[x1][y1] = type1;
			jewels[x2][y2] = type2;

			return chain;
		}//end of canSwap()

		//isAdjacent is a helper function that returns true if the
		//two sets of coordinates are neighbors and false if they aren't
		//the function determines whether they are neighbors by looking
		//at the distance between the positions along both axes
		//the sum of both distances must be exactly 1 (positions adjacent)
		//NOTE: test on console by entering jewel.board.canSwap(4,3,3,2)
		function isAdjacent(x1, y1, x2, y2) {
			//The abs() method returns the absolute value of a number.
			var dx = Math.abs(x1 - x2),
				dy = Math.abs(y1 - y2);

			return(dx + dy === 1);
		}

		//returns a 2D map of chain lenghts
		function getChains() {
			var x, y,
			    chains = []; //array

			//loop goes through board
			//each position on board is checked by calling checkChain()
			//the corresponding position in the chains map is assigned
			//to the return value    
			for (x=0; x<cols; x++) {
				chains[x] = [];
				for (y=0; y<rows; y++) {
					chains[x][y] = checkChain(x, y);
				} //end of for loop
			} //end of for loop

			//"chains" is a 2d map of the board
			//instead of jewel types, the map holds information
			//about the chains in which the jewels take part
			return chains;
		} //end of getChains()


		//check() removes jewels from the board + brings in new ones where necessary
		//the function modifies the board and collects information about all the removed
		//and repositioned jewels in 2 arrays (removed and moved)

		function check(events) {
			var chains = getChains(),
			    hadChains = false, score = 0,
			    removed = [], moved = [],
			    gaps = [],
			    x, y;

			    //using nested loops, check() visits every position on the board
			    for (x=0; x < cols; x++) {
			    	gaps[x] = 0; //gaps array contains a counter for each column checked
			    				 //whenever a jewel stays, the gap counter determines whether the jewel should be moved down
			    	for (y = rows-1; y>=0; y--) {
					    //IF the position is marked in a chains map with a value > 2, info about the position
					    //and jewel type is recorded in the array REMOVED using a simple object literal		
			    		if (chains[x][y] > 2) {
			    			hadChains = true;
			    			gaps[x]++; 
			    			removed.push({
			    				x: x, y:y,
			    				type: getJewel(x,y)
			    			});

			    			//add points to score
			    			//The pow() method returns the value of x to the power of y (xy). 
			    			score += baseScore *
			    					 Math.pow(2, (chains[x][y] - 3));
			    		} else if (gaps[x] >0) {
			    			moved.push({
			    				toX: x, toY: y + gaps[x],
			    				fromX: x, fromY: y,
			    				type: getJewel(x,y)
			    			});

			    			jewels[x][y + gaps[x]] = getJewel(x, y);

			    	}//end of for loop
			    }//end of for loop
		}//end of check(events)

		//ADDING NEW JEWELS
		//BY MOVING JEWELS, you fill gaps below (but create gaps above)
		//# of new jewels = # of gaps found in the respective column
		//the new jewels don't have a starting position
		//(so an imaginary position outside the board is invented)
		for (x=0; x<cols; x++) { //loop evaluates the board again
			//fill from top
			for (y = 0; y < gaps[x]; y++) {
                jewels[x][y] = randomJewel();

                //this adds jewels to the array
                moved.push({
                    toX : x, toY : y,
                    fromX : x, fromY : y - gaps[x],
                    type : jewels[x][y]
                });
            }
        }

        //this is an optional event that is used only in the recursive calls
        //(check() will be called many times until there are no "automatic" chains on the board)
        events = events || [];

        //the recursive calls add data to their respective arrays
        if (hadChains) {
            events.push({
                type : "remove",
                data : removed
            }, {
                type : "score", //automatic "chains" will be added to the score
                data : score
            }, {
                type : "move",
                data : moved
            });

            // refill if player runs out of moves
            //in addition to calling fillBoard(), this adds a refill event to the events array
            if (!hasMoves()) {
                fillBoard();
                events.push({ 
                    type : "refill",
                    data : getBoard()
                });
            }

            //by returning the events array, the caller gets a complete list of
            //every change that happened between the last swap and final board
            return check(events);
        } else {
            return events;
        }
    }
/////////////////////////
	
     // if possible, swaps (x1,y1) and (x2,y2) and
    // calls the callback function with list of board events

    /* on p.246, swap() is modified to add a move event to the initial events array so the jewels switch places.
       if canSwap() fails, a second event is added to move the jewels back*/

    function swap(x1, y1, x2, y2, callback) {
        var tmp, swap1, swap2, //modified on p.246
            events = []; //modified on p.246

        //p.246
        swap1 = {
        	type : "move",
        	data : [{
        		type: getJewel(x1, y1),
        		fromX : x1, fromY : y1, toX : x2, toY : y2 
        	}, {
        		type: getJewel(x2, y2),
        		fromX: x2, fromY: y2, toX: x1, toY: y1 
        	}]
        };//end of swap1

        swap2 = {
        	type: "move",
        	data: [{
        		type: getJewel(x2,y2),
        		fromX: x1, fromY:y1, toX: x2, toY: y2
        	}, {
        		type: getJewel(x1,y1),
        		fromX: x2, fromY: y2, toX: x1, toY: y1 
        	}]
        };

        if (isAdjacent(x1, y1, x2, y2)) {
        	events.push(swap1);

        	if (canSwap(x1, y1, x2, y2)) {

            // swap the jewels
            tmp = getJewel(x1, y1);
            jewels[x1][y1] = getJewel(x2, y2);
            jewels[x2][y2] = tmp;

            events = events.concat(check());
        } else {
        	events.push(swap2, {type: "badswap"});
        }
        /*
            // check the board and get list of events
            events = check();
		*/
            callback(events);
        /*} else {
            callback(false);
        */
        }
    }

    // CHECKING FOR AVAILABLE MOVES
    // returns true if at least one match can be made
    function hasMoves() {
        for (var x = 0; x < cols; x++) { //searches board (x)
            for (var y = 0; y < rows; y++) { //searches board(y)
                if (canJewelMove(x, y)) { //canJewelMove() is shown below
                    return true; 
                }
            }
        }
        return false;
    }

    // CHECKING WHETHER A JEWEL CAN MOVE
    // returns true if (x,y) is a valid position and if 
    // the jewel at (x,y) can be swapped with a neighbor
    function canJewelMove(x, y) {
        return ((x > 0 && canSwap(x, y, x-1 , y)) || //canJewelMove() uses canSwap() to test if the jewel can be swapped
                //each canSwap() call is performed only if the neighbor is within the bounds of the board
                //canSwap() tries to swap the jewel with its left neighbor only if the jewel's X coordinate
                //is at least 1 and less than (cols-1)
                (x < cols-1 && canSwap(x, y, x+1 , y)) ||
                (y > 0 && canSwap(x, y, x , y-1)) ||
                (y < rows-1 && canSwap(x, y, x , y+1)));
    } //THE BOARD IS AUTOMATICALLY REFILLED IF THERE ARE NO MOVES LEFT >>> hasMoves() returns false <<<


    // getBoard() creates a copy of the board
    // when fillBoard() is called, a refill event is added to the events array
    // this event carries with it a copy of the jewel board
    function getBoard() {
        var copy = [],
            x;
        for (x = 0; x < cols; x++) {
        //The slice() method returns the selected elements in an array, as a new array object.
            copy[x] = jewels[x].slice(0);
        }
        return copy;
    }

/////////////////////////

		function print() { 
		//this function outputs the board data to the JS console (debugging)
			var str = " ";
			for(var y = 0; y < rows; y++) {

				for (var x = 0;  x< cols; x++) {
					str += getJewel(x,y) + " ";
				} //end of for loop
				
				str += "\r\n";

			}//end of for loop
			console.log(str);
		} //end of print()

	return {
		/* exposed functions go here */
		initialize: initialize,
		swap: swap,
		canSwap: canSwap,
		getBoard: getBoard,
		print: print
	}; //end of return

}) (); //end of jewel.board