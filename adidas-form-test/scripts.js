(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i]
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));

},{}],2:[function(require,module,exports){
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter'
    ], function( EvEmitter ) {
      return factory( window, EvEmitter );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EvEmitter
    );
  }

})( typeof window !== 'undefined' ? window : this,

// --------------------------  factory -------------------------- //

function factory( window, EvEmitter ) {

'use strict';

var $ = window.jQuery;
var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
function makeArray( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
}

// -------------------------- imagesLoaded -------------------------- //

/**
 * @param {Array, Element, NodeList, String} elem
 * @param {Object or Function} options - if function, use as callback
 * @param {Function} onAlways - callback function
 */
function ImagesLoaded( elem, options, onAlways ) {
  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
  if ( !( this instanceof ImagesLoaded ) ) {
    return new ImagesLoaded( elem, options, onAlways );
  }
  // use elem as selector string
  var queryElem = elem;
  if ( typeof elem == 'string' ) {
    queryElem = document.querySelectorAll( elem );
  }
  // bail if bad element
  if ( !queryElem ) {
    console.error( 'Bad element for imagesLoaded ' + ( queryElem || elem ) );
    return;
  }

  this.elements = makeArray( queryElem );
  this.options = extend( {}, this.options );
  // shift arguments if no options set
  if ( typeof options == 'function' ) {
    onAlways = options;
  } else {
    extend( this.options, options );
  }

  if ( onAlways ) {
    this.on( 'always', onAlways );
  }

  this.getImages();

  if ( $ ) {
    // add jQuery Deferred object
    this.jqDeferred = new $.Deferred();
  }

  // HACK check async to allow time to bind listeners
  setTimeout( this.check.bind( this ) );
}

ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

ImagesLoaded.prototype.options = {};

ImagesLoaded.prototype.getImages = function() {
  this.images = [];

  // filter & find items if we have an item selector
  this.elements.forEach( this.addElementImages, this );
};

/**
 * @param {Node} element
 */
ImagesLoaded.prototype.addElementImages = function( elem ) {
  // filter siblings
  if ( elem.nodeName == 'IMG' ) {
    this.addImage( elem );
  }
  // get background image on element
  if ( this.options.background === true ) {
    this.addElementBackgroundImages( elem );
  }

  // find children
  // no non-element nodes, #143
  var nodeType = elem.nodeType;
  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
    return;
  }
  var childImgs = elem.querySelectorAll('img');
  // concat childElems to filterFound array
  for ( var i=0; i < childImgs.length; i++ ) {
    var img = childImgs[i];
    this.addImage( img );
  }

  // get child background images
  if ( typeof this.options.background == 'string' ) {
    var children = elem.querySelectorAll( this.options.background );
    for ( i=0; i < children.length; i++ ) {
      var child = children[i];
      this.addElementBackgroundImages( child );
    }
  }
};

var elementNodeTypes = {
  1: true,
  9: true,
  11: true
};

ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
    return;
  }
  // get url inside url("...")
  var reURL = /url\((['"])?(.*?)\1\)/gi;
  var matches = reURL.exec( style.backgroundImage );
  while ( matches !== null ) {
    var url = matches && matches[2];
    if ( url ) {
      this.addBackground( url, elem );
    }
    matches = reURL.exec( style.backgroundImage );
  }
};

/**
 * @param {Image} img
 */
ImagesLoaded.prototype.addImage = function( img ) {
  var loadingImage = new LoadingImage( img );
  this.images.push( loadingImage );
};

ImagesLoaded.prototype.addBackground = function( url, elem ) {
  var background = new Background( url, elem );
  this.images.push( background );
};

ImagesLoaded.prototype.check = function() {
  var _this = this;
  this.progressedCount = 0;
  this.hasAnyBroken = false;
  // complete if no images
  if ( !this.images.length ) {
    this.complete();
    return;
  }

  function onProgress( image, elem, message ) {
    // HACK - Chrome triggers event before object properties have changed. #83
    setTimeout( function() {
      _this.progress( image, elem, message );
    });
  }

  this.images.forEach( function( loadingImage ) {
    loadingImage.once( 'progress', onProgress );
    loadingImage.check();
  });
};

ImagesLoaded.prototype.progress = function( image, elem, message ) {
  this.progressedCount++;
  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
  // progress event
  this.emitEvent( 'progress', [ this, image, elem ] );
  if ( this.jqDeferred && this.jqDeferred.notify ) {
    this.jqDeferred.notify( this, image );
  }
  // check if completed
  if ( this.progressedCount == this.images.length ) {
    this.complete();
  }

  if ( this.options.debug && console ) {
    console.log( 'progress: ' + message, image, elem );
  }
};

ImagesLoaded.prototype.complete = function() {
  var eventName = this.hasAnyBroken ? 'fail' : 'done';
  this.isComplete = true;
  this.emitEvent( eventName, [ this ] );
  this.emitEvent( 'always', [ this ] );
  if ( this.jqDeferred ) {
    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
    this.jqDeferred[ jqMethod ]( this );
  }
};

// --------------------------  -------------------------- //

function LoadingImage( img ) {
  this.img = img;
}

LoadingImage.prototype = Object.create( EvEmitter.prototype );

LoadingImage.prototype.check = function() {
  // If complete is true and browser supports natural sizes,
  // try to check for image status manually.
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    // report based on naturalWidth
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    return;
  }

  // If none of the checks above matched, simulate loading on detached element.
  this.proxyImage = new Image();
  this.proxyImage.addEventListener( 'load', this );
  this.proxyImage.addEventListener( 'error', this );
  // bind to image as well for Firefox. #191
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.proxyImage.src = this.img.src;
};

LoadingImage.prototype.getIsImageComplete = function() {
  // check for non-zero, non-undefined naturalWidth
  // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
  return this.img.complete && this.img.naturalWidth;
};

LoadingImage.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.img, message ] );
};

// ----- events ----- //

// trigger specified handler for event type
LoadingImage.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

LoadingImage.prototype.onload = function() {
  this.confirm( true, 'onload' );
  this.unbindEvents();
};

LoadingImage.prototype.onerror = function() {
  this.confirm( false, 'onerror' );
  this.unbindEvents();
};

LoadingImage.prototype.unbindEvents = function() {
  this.proxyImage.removeEventListener( 'load', this );
  this.proxyImage.removeEventListener( 'error', this );
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

// -------------------------- Background -------------------------- //

function Background( url, element ) {
  this.url = url;
  this.element = element;
  this.img = new Image();
}

// inherit LoadingImage prototype
Background.prototype = Object.create( LoadingImage.prototype );

Background.prototype.check = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.img.src = this.url;
  // check if image is already complete
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    this.unbindEvents();
  }
};

Background.prototype.unbindEvents = function() {
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

Background.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.element, message ] );
};

// -------------------------- jQuery -------------------------- //

ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
  jQuery = jQuery || window.jQuery;
  if ( !jQuery ) {
    return;
  }
  // set local variable
  $ = jQuery;
  // $().imagesLoaded()
  $.fn.imagesLoaded = function( options, callback ) {
    var instance = new ImagesLoaded( this, options, callback );
    return instance.jqDeferred.promise( $(this) );
  };
};
// try making plugin
ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

return ImagesLoaded;

});

},{"ev-emitter":1}],3:[function(require,module,exports){


// var ScrollMagic = require("scrollmagic");

module.exports = {
  STORY: {
    STORY : '#interactive-story',
    STORY_WRAP : '.interactive-story__wrap',
  },
  EL: {
    CONTAINER : '.isf-el',
  },
  NAV: {

  },
  COLLAGE: {
    CONTAINER : '.js--el_collage',
    TRIGGER : '.js--el_collage__trigger',
    ITEM : '.js--el_collage__item',
  },
  IMAGE: {
    CONTAINER : '.js--el_image',
    WRAPPER : '.js--el_image__wrap',
    IMG : '.js--el_image__img',
  },
  IMAGE_GROUP : {
    CONTAINER : '.js--el_image-group',
    CONTENT : '.js--el_image-group__content',
    HEADER_IMG : '.js--el_image-group__header',
    JS__HEADER_BOTTOM : 'is--header-bottom',
    JS__HEADER_FIXED : 'is--header-fixed',
    JS__TITLE_OUT : 'is--title-hidden',
  },
  GALLERY: {
    CONTAINER : '.js--el_gallery',
    ITEM : '.js--gallery__item',
  },
  GALLERY_TOUCH : {
    CONTAINER : '.js--el_gallery-touch',
    SCENE : '.js--el_gallery-touch__scene',
    INIT_SCREEN : '.js--el_gallery-touch__init__screen',
    INIT_BUTTON : '.js--el_gallery-touch__init__button',
    CLOSE_BUTTON : '.js--el_gallery-touch__close',
    VIEWER : '.js--el_gallery-touch__viewer',
  },
  GALLERY_HORIZONTAL : {
    CONTAINER : '.js--el_gallery-horizontal',
    WRAPPER : '.js--el_gallery-horizontal__wrap',
    ITEM : '.js--el_gallery-horizontal__item',
  },
  SPLIT_STICKY : {
    CONTAINER : '.js--el_split-sticky',
  },
  SCROLL : {
    CONTAINER : '.js--el_interactive-scroll',
    VIEWER : '.js--interactive-scroll__viewer',
    CONTENT_GROUP : '.js--interactive-scroll__content__group',
    BACKGROUND_GROUP : '.js--interactive-scroll__background__group',
    STEP : '.js--interactive-scroll__step',
    INDICATOR : '.js--interactive-scroll__indicator',
    JS__VIEWER__FIXED : 'js--interactive-scroll__viewer--fixed',
    JS__VIEWER__COLOR : 'in-color',
  },
  TIMELINE : {
    CONTAINER : '.js--el_timeline',
    HEADER : '.js--el_timeline__header',
    CONTENT : '.js--el_timeline__content',
    CONTENT_GROUP : '.js--el_timeline__content__group',
    JS__FIXED : 'is--fixed',
    JS__DARKENED : 'is--darkened',
    JS__BOTTOM : 'is--bottom'
  },
  CHAPTER : {
    CONTAINER : '.js--el_chapter',
    HEADER : '.js--el_chapter__header',
    CONTENT : '.js--el_chapter__content',
    CONTENT_GROUP : '.js--el_chapter__content__group',
    JS__FIXED : 'is--fixed',
    JS__DARKENED : 'is--darkened',
    JS__BOTTOM : 'is--bottom',
  },
  SCROLL_HORIZONTAL : {
    CONTAINER : '.js--el_interactive-scroll-horizontal',
    VIEWER : '.js--el_interactive-scroll-horizontal__viewer',
    CONTENT : '.js--el_interactive-scroll-horizontal__content',
    CONTENT_GROUP : '.js--el_interactive-scroll-horizontal__content__group',
    STEP : '.js--el_interactive-scroll-horizontal__step',
    TITLESEL : '.js--el_interactive-scroll-horizontal__titles',
    TITLE : '.js--el_interactive-scroll-horizontal__title',
    VIEWER__FIXED : 'js--el_interactive-scroll-horizontal__viewer--fixed',
    VIEWER__BOTTOM : 'js--el_interactive-scroll-horizontal__viewer--bottom',
    CONTAINER__COLOR : 'js--el_interactive-scroll-horizontal--color',
  },
  TRIGGER_VIDEO : {
    CONTAINER : ".js--el_trigger-video"
  }
};

},{}],4:[function(require,module,exports){

module.exports = function() {
    var content = document.querySelector('.post__content');
    // by Gregor & Avery, I think
    console.log("removed bad things");
    if (content) {
        var allParagraphs = content.querySelectorAll('p');
        allParagraphs.forEach(function (paragraph) {
            if (paragraph.classList.value === '' && paragraph.innerHTML === '') {
                paragraph.parentNode.removeChild(paragraph);
            }
        });
        var allBreakTags = content.querySelectorAll('br');
        allBreakTags.forEach(function(breakTag) {
            if (breakTag.classList.value === '') {
                breakTag.parentNode.removeChild(breakTag);
            }
        });
    }

    //small addition by Katya. Fix WP inserting <p> inside headings and ruining their style.
    if (content) {
        var allHeadings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
        allHeadings.forEach(function (heading) {
            var par = heading.querySelector("p");
            if( par ){
                var parContent = par.innerHTML;
                heading.removeChild(par);
                heading.innerHTML = parContent;
            }
        });
    }
};



},{}],5:[function(require,module,exports){

( function(window) {
  'use strict';

  /* PLUGINS */
  var imagesLoaded = require('imagesLoaded');

  /* HELPER FUNCS */
  var removeBadThings = require('helpers/removebadthings.js');
  var CLASSES = require('classes.js');

  /* STORY SPECIFIC */
  var interactiveStory;

    function InteractivePage(el) {
        this.DOM = {story: el};

        removeBadThings();
        this.init();
    }

    InteractivePage.prototype.init = function() {

        var self = this;

        var form = document.getElementById( "isf-form__adidas" );

        // test if both cb are checked
        var buttonSubmit = document.querySelector( ".adidas-form__submit" );
        var bchecked = 0; //neither is checked now
        var checkboxes = Array.from(document.querySelectorAll( ".av-checkbox" ));
        checkboxes.forEach( function(cb, ind) {
            cb.addEventListener( 'change', function() {
                if(this.checked) {
                    bchecked += 1;
                    if( bchecked === 2) {
                        buttonSubmit.classList.add( "is--active" );
                    }
                } else {
                    bchecked -= 1;
                    buttonSubmit.classList.remove( "is--active" );
                }
            });
        });

        form.addEventListener('submit', function(ev) {
            ev.preventDefault();
            var oData = new FormData(form);
            sendData(oData);
        }, false);
    };

    function sendData(formdata) {

        var XHR = new XMLHttpRequest();

        var adidasData = {};

        adidasData.source = "543459816";
        adidasData.clientId = "EA38ACE74184F2D73082761775D1C962";
        adidasData.countryOfSite = "US";

        // Display the key/value pairs
        for(var pair of formdata.entries()) {
            switch( pair[0] ){
                case 'MERGE1':
                    adidasData.firstName = pair[1];
                    break;
                case 'MERGE2':
                    adidasData.lastName = pair[1];
                    break;
                case 'MERGE0':
                    adidasData.email = pair[1];
                    break;
                case 'MERGE4':
                    adidasData.addresses = {
                        "address":
                        [
                            {
                               "action":"A",
                               "addressType":"OTHERS",
                               "addressLine1":"Address line 1"
                            }
                        ]
                    };
                    break;
                case 'group[45][1]': //at least 13
                    adidasData.minAgeConfirmation = "Y";
                    break;
                case 'group[45][2]':
                    adidasData.consents = {
                        "consent":
                        [
                            {
                                "consentType":"AMF",
                                "consentValue":"Y"
                            }
                        ]
                    };
                    break;
                default:
                    break;
            }
        }
        console.log("Endpoint: Adidas");
        XHR.open("POST", "https://srs.adidas.com/scvRESTServices/account/createSubscription", true);
        XHR.setRequestHeader('Content-Type', 'application/json');
        XHR.setRequestHeader('Accept', 'application/json');
        XHR.setRequestHeader('Access-Control-Allow-Origin', '*');
        console.log(JSON.stringify(adidasData));
        XHR.send(JSON.stringify(adidasData));
    }


  //make sure images are loaded before init of scroll scenes to avoid miscalculated heights
  imagesLoaded( document.getElementById('interactive-story'), function() {
    interactiveStory = new InteractivePage(document.getElementById('interactive-story'));
  });

})(window);



},{"classes.js":3,"helpers/removebadthings.js":4,"imagesLoaded":2}]},{},[5]);
