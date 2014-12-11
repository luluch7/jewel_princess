//DOM helper module
	jewel.dom = (function(){
		//$() is a wrapper for the querySelectorAll() function
		//it lets you use CSS selectors to select DOM elements
		function $(path, parent) {
			parent = parent || document;
			return parent.querySelectorAll(path);
		} //end of function $(path, parent)

		//examines the className attribute on a given element and returns true if the class is found
		//(^|\\s) matches either the beginning of the string or a blank space
		//(\\s|$) matches the end of a string or a blank space
		function hasClass(el, clsName) {
			var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
			return regex.test(el.className);
		} //end of hasClass()


		function addClass(el, clsName) {
			if(!hasClass(el, clsName)) {
				el.className += " " + clsName;
			} //end of if statement
		} //end of addClass()

		function removeClass(el, clsName) {
			var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
			el.className = el.className.replace(regex, " ");
		} //end of removeClass()


		function bind(element, event, handler) {
		//before attaching the event listener, dom.bind() tests the type of the element argument
		if (typeof element == "string") { //if string, it's used as a selector string
										  //(otherwise, it's assumed that element is an actual DOM element)
		element = $(element)[0];
		//console.log(element + " " + event + " " + handler);
		} //end of if statement
		element.addEventListener(event, handler, false);
		} //end of bind()

		//p.252 transform()

		function transform(element, value) {
        	if ("transform" in element.style) {
            	element.style.transform = value;
        	} else if ("webkitTransform" in element.style) {
            	element.style.webkitTransform = value;
        	} else if ("mozTransform" in element.style) {
            	element.style.mozTransform = value;
        	} else if ("msTransform" in element.style) {
            	element.style.msTransform = value;
        	}
    	}//end of transform()	 

		return {
			$ : $,
			hasClass: hasClass,
			addClass: addClass,
			removeClass: removeClass,
			bind: bind,
			transform: transform
		}; //end of return (this will make $, hasClass, addClass and removeClass public)
	})();