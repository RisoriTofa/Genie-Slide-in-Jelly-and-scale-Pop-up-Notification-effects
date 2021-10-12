/*!
 * classEditor - It contains class helper functions
 *
 * These functions include:-
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
  let hasThisClass, addsClass, removesClass;

  if ( 'classList' in document.documentElement ) {
  hasThisClass = function( element, c ) {
    return element.classList.contains( c );
  };
  addsClass = function( element, c ) {
    element.classList.add( c );
  };
  removesClass = function( element, c ) {
    element.classList.remove( c );
  };
}
else {
  hasThisClass = function( element, c ) {
    return classReg( c ).test( element.className );
  };
  addsClass = function( element, c ) {
    if ( !hasThisClass( element, c ) ) {
      element.className = element.className + ' ' + c;
    }
  };
  removesClass = function( element, c ) {
    element.className = element.className.replace( classReg( c ), ' ' );
  };
}

function togglesClass( element, c ) {
  let fn = hasThisClass( element, c ) ? removesClass : addsClass;
  fn( element, c );
}

let classEditor = {
  // full names
  hasClass: hasThisClass,
  addClass: addsClass,
  removeClass: removesClass,
  toggleClass: togglesClass,
  // short names
  has: hasThisClass,
  add: addsClass,
  remove: removesClass,
  toggle: togglesClass
};

// transport
if ( typeof define === 'function' ) {
  define( classEditor );
} else {
  // browser global
  window.classEditor = classEditor;
}

})( window );
