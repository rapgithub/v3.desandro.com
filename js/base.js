/**
 * desandro.com v3 scripts
 *
 * Oh, hey! Thanks for taking a look :)
 * This code is all unminified,
 * but the original scripts are all up
 *
 * Happy dev times!
 *
 * - Dave
**/

/**
 * base, get things going with utils
**/

( function( window, undefined ) {

'use strict';

// global namespace
var DD = window.DD = {};
// check iOS touch
DD.isTouch = 'createTouch' in document;

// -------------------------- utils -------------------------- //

/**
 * Checks if elem matches a tag
 * @param elem Element
 * @param tag String - 'a', 'span'
**/
DD.getTaggedElem = function ( elem, tag ) {
  // walk up DOM, see if elem is <a>
  while ( elem.nodeType !== 9 ) {
    if ( elem.nodeName.toLowerCase() === tag ) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return false;
};


DD.charCount = 0;
DD.charElems = [];

// parse text into words, then into characters
DD.parseForParticles = function( elem ) {
  var words, word, wordElem, chars, charElem;
  var wordElems = [];
  var charElems = [];
  words = elem.textContent.split(' ');
  // clear out original HTML
  while ( elem.firstChild ) {
    elem.removeChild( elem.firstChild );
  }

  var fragment = document.createDocumentFragment();

  // split word into characters
  for ( var j=0, wordsLen = words.length; j < wordsLen; j++ ) {
    word = words[j];
    wordElem = document.createElement('span');
    wordElem.className = 'word';
    wordElems.push( wordElem );
    // wrap each character in a span
    chars = word.split('');
    for ( var k=0, charsLen = chars.length; k < charsLen; k++ ) {
      charElem = document.createElement('span');
      charElem.className = 'char';
      charElem.textContent = chars[k];
      charElems.push( charElem );
      wordElem.appendChild( charElem );
      DD.charCount++;
    }
    fragment.appendChild( wordElem );
    // add space
    fragment.appendChild( document.createTextNode(' ') );
  }

  // add splitted content
  elem.appendChild( fragment );

  // return word elem for touch
  return DD.isTouch ? wordElems : charElems;

};



})( window );
