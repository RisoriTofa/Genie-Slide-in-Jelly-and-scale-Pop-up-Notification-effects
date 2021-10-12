/*!
 * classEditor - class helper functions
 * 
 * classEditor.has( element, 'my-class' ) -> true/false
 * classEditor.add( element, 'my-new-class' )
 * classEditor.remove( element, 'my-unwanted-class' )
 * classEditor.toggle( element, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// although to be fair, the api sucks because it won't accept multiple classes at once
  let hasClass, addClass, removeClass;

  if ( 'classList' in document.documentElement ) {
  hasClass = function( element, c ) {
    return element.classList.contains( c );
  };
  addClass = function( element, c ) {
    element.classList.add( c );
  };
  removeClass = function( element, c ) {
    element.classList.remove( c );
  };
}
else {
  hasClass = function( element, c ) {
    return classReg( c ).test( element.className );
  };
  addClass = function( element, c ) {
    if ( !hasClass( element, c ) ) {
      element.className = element.className + ' ' + c;
    }
  };
  removeClass = function( element, c ) {
    element.className = element.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( element, c ) {
  let fn = hasClass( element, c ) ? removeClass : addClass;
  fn( element, c );
}

let classEditor = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' ) {
  define( classEditor );
} else {
  // browser global
  window.classEditor = classEditor;
}

})( window );
