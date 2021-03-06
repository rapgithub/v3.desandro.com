/**
 * init - start when doc ready
**/

( function( window, document, DD, undefined ) {

'use strict';

// -------------------------- email link -------------------------- //

var emailLink;
var emailUsername = 'contact';
var emailDomain = 'desandro.com';
var emailAddress = emailUsername + '@' + emailDomain;

function onEmailClick( event ) {
  emailLink.textContent = emailAddress;
  emailLink.href = 'mailto:' + emailAddress;
  // get chars for sparkle-shine
  var charElems = DD.parseForParticles( emailLink );
  // add new char particle
  var charParticles = DD.addCharParticles( charElems );
  // give the new particles a jolt!
  var charParticle, angle, force, dx, dy;
  for ( var i=0, len = charParticles.length; i < len; i++ ) {
    charParticle = charParticles[i];
    dx = event.pageX - charParticle.originX;
    dy = event.pageY - charParticle.originY;
    angle = Math.atan2( dy, dx );
    force = Math.max( 0, 1 - Math.sqrt(dx*dx + dy*dy) / 300 );
    force *= force * 20;
    charParticle.velocityX = Math.cos( angle ) * -force;
    charParticle.velocityY = Math.sin( angle ) * -force;
    charParticle.x = dx;
    charParticle.y = dy;
    charParticle.wasSettled = false;
    charParticle.isSettled = false;
  }

  DD.areAllCharParticlesSettled = false;

  emailLink.removeEventListener( 'click', onEmailClick, false );
  event.preventDefault();
}


// -------------------------- init -------------------------- //

var isInited = false;

DD.initialParticleElems = [];

function init() {
  // console.log('init');
  if ( isInited ) {
    return;
  }

  // setup char elems
  var splitables = document.querySelectorAll('.split');
  // split each string into words and then characters
  var charElems;
  for ( var i=0, len = splitables.length; i < len; i++ ) {
    charElems = DD.parseForParticles( splitables[i] );
    // add these char Elems to initial particle elems, to be set up as charParticles
    DD.initialParticleElems = DD.initialParticleElems.concat( charElems );
  }

  // mouse over for sparkleShine
  if ( !DD.isTouch ) {
    document.addEventListener( 'mouseover', DD.onMouseover, false );
  }

  emailLink = document.getElementById('email');
  emailLink.addEventListener( 'click', onEmailClick, false );


  isInited = true;
}


window.addEventListener( 'DOMContentLoaded', init, false );


if ( !DD.isTouch ) {
  // this gives iOS pain
  window.onload = init;
}



})( window, document, window.DD );