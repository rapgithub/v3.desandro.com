/**
 * desandro.com v3 script
**/


/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

( function( window, document, undefined ) {

'use strict';

var charElems = [];
var charParticles = [];
var mouseX, mouseY;
var isMouseDown = false;
var TWO_PI = Math.PI * 2;
var maxDistance = 270;

// -------------------------- CharParticle -------------------------- //

function CharParticle( elem, index ) {
  this.index = index;
  this.element = elem;
  this.width = elem.offsetWidth;
  this.height = elem.offsetHeight;
  this.originX = elem.offsetLeft + this.width / 2;
  this.originY = elem.offsetTop + this.height / 2;
  this.x = 0;
  this.y = 0;
  this.deltaX = 0;
  this.deltaY = 0;
  this.angle = 0;

  this.velocityX = 0;
  this.velocityY = 0;
  this.velocityR = 0; // rotational velocity

}

CharParticle.prototype.update = function() {

  // Attracted to mouse
  var dx = mouseX - this.x;
  var dy = mouseY - this.y;
  var d = Math.sqrt( dx*dx + dy*dy );

  var angle = 0;
  var targetAngle = 0;

  if ( isMouseDown && d < maxDistance ) {
    // dx = mouseX - p.x;
    // dy = mouseY - p.y;
    var force = (1 - d / maxDistance);

    angle = Math.atan2( dy, dx );

    targetAngle = angle - Math.PI / 2;
    targetAngle *= Math.min( force * 3, 1 );

    force *= force * 10;
    this.velocityX += Math.cos( angle ) * -force;
    this.velocityY += Math.sin( angle ) * -force;

  }

  // Attracted to start position
  this.velocityX += ( 0 - this.deltaX ) * 0.015;
  this.velocityY += ( 0 - this.deltaY ) * 0.015;

  var angleDelta1 = targetAngle - this.angle;
  var angleDelta2 = ( targetAngle - TWO_PI ) - ( this.angle );
  var angleDelta = Math.abs( angleDelta1 ) < Math.abs( angleDelta2 ) ?
    angleDelta1 : angleDelta2;

  this.velocityR += angleDelta;

  // Integrate velocity
  this.deltaX += this.velocityX;
  this.deltaY += this.velocityY;
  this.angle += this.velocityR * 0.07;

  // Apply friction
  this.velocityX *= 0.92;
  this.velocityY *= 0.92;
  this.velocityR *= 0.92;

  this.x = this.originX + this.deltaX;
  this.y = this.originY + this.deltaY;

  var deltaD = Math.sqrt( this.deltaX * this.deltaX + this.deltaY * this.deltaY );
  var scale = (deltaD / maxDistance) * 2 + 1;

  this.element.style.WebkitTransform =
    'translate(' + this.deltaX + 'px, ' + this.deltaY + 'px) ' +
    'scale(' + scale + ') ' +
    'rotate(' + this.angle + 'rad)';

};


// -------------------------- setupCharElems -------------------------- //

function setupCharElems() {
  var splitables = document.querySelectorAll('.split');
  var charCount = 0;
  // split each string into words and then characters
  var splitable, words, chars, word, wordContent, fragment, wordElem, charElem;

  for ( var i=0, len = splitables.length; i < len; i++ ) {
    // get words
    splitable = splitables[i];
    words = splitable.textContent.split(' ');
    // clear out original HTML
    while ( splitable.firstChild ) {
      splitable.removeChild( splitable.firstChild );
    }

    fragment = document.createDocumentFragment();

    // split word into characters
    for ( var j=0, wordsLen = words.length; j < wordsLen; j++ ) {
      word = words[j];
      wordElem = document.createElement('span');
      wordElem.className = 'word';
      // wrap each character in a span
      chars = word.split('');
      for ( var k=0, charsLen = chars.length; k < charsLen; k++ ) {
        charElem = document.createElement('span');
        charElem.className = 'char';
        charElem.textContent = chars[k];
        charElems.push( charElem );
        wordElem.appendChild( charElem );
        charCount++;
      }
      fragment.appendChild( wordElem );
      // add space
      fragment.appendChild( document.createTextNode(' ') );
    }

    // add splitted content
    splitable.appendChild( fragment );
  }
  // console.log( charCount );
}


// -------------------------- animation -------------------------- //

function animate() {
  // console.log('animate');
  // console.log( charParticles );
  for ( var i=0, len = charParticles.length; i < len; i++ ) {
    charParticles[i].update();
  }
  setTimeout( animate, 20 );
}

// -------------------------- events -------------------------- //

function onMousedown( event ) {
  isMouseDown = true;
  mouseX = event.pageX;
  mouseY = event.pageY;
  // console.log( mouseX, mouseY );
  event.preventDefault();
  window.addEventListener( 'mousemove', onMousemove, false );
  window.addEventListener( 'mouseup', onMouseup, false );
}

function onMousemove( event ) {
  mouseX = event.pageX;
  mouseY = event.pageY;
  // console.log( mouseX, mouseY );
}

function onMouseup( event ) {
  isMouseDown = false;
  window.removeEventListener( 'mousemove', onMousemove, false );
  window.removeEventListener( 'mouseup', onMouseup, false );
}

// -------------------------- init -------------------------- //

function init() {
  setupCharElems();
  // setup char particles
  var charParticle;
  for ( var i=0, len = charElems.length; i < len; i++ ) {
    charParticle = new CharParticle( charElems[i], i );
    charParticles.push( charParticle );
  }

  document.addEventListener( 'mousedown', onMousedown, false );

  animate();

}


window.addEventListener( 'DOMContentLoaded', init, false );


})( window, document );
