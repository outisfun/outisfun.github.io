(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


( function(window) {
    'use strict';

    // Plugins
    var isfExperiment = document.querySelector(".isf-experiment");
    var isfConsole = document.querySelector(".isf-console");

    function radToDeg(radians)
    {
      var pi = Math.PI;
      return radians * (180/pi);
    }

    var isfLog = function(li, msg){
        isfConsole.querySelector( "." + li + " p" ).innerHTML = msg;
    };

    var simplifyQuaternion = function(q) {
        var qstring = q[0].toFixed(4) + ' ' + q[1].toFixed(4) + ' ' + q[2].toFixed(4) + ' ' + q[3].toFixed(4);
        return qstring;
    };

    var simplifyGyroscope = function(ev) {
        var gstring = ev.target.x.toFixed(4) + ' ' + ev.target.y.toFixed(4) + ' ' + ev.target.z.toFixed(4);
        return gstring;
    };

    // Absolute Orientation Sensor
    if ( 'AbsoluteOrientationSensor' in window ) {
        var absOSensor = new AbsoluteOrientationSensor();
        absOSensor.start();
        absOSensor.addEventListener( 'reading', function() {
            console.log( "abs o sensor:", absOSensor.quaternion );
            isfLog( 'abs-o', simplifyQuaternion(absOSensor.quaternion) );
        });
    }

    // Relative Orientation Sensor
    if ( 'RelativeOrientationSensor' in window ) {
        var relOSensor = new RelativeOrientationSensor();
        relOSensor.start();ß
        relOSensor.addEventListener( 'reading', function() {
            console.log( "rel o sensor:", relOSensor.quaternion );
            isfLog( 'rel-o', simplifyQuaternion(relOSensor.quaternion) );
        });

        var relOSensorScreen = new RelativeOrientationSensor({ referenceFrame: "screen" });
        relOSensorScreen.start();
        relOSensorScreen.addEventListener( 'reading', function() {
            console.log( "rel o sensor screen:", relOSensorScreen.quaternion );
            isfLog( 'rel-o-screen', simplifyQuaternion(relOSensorScreen.quaternion) );
        });
    }

    // relative to screen! :)


    // Gyroscope
    // The Gyroscope sensor measures angular velocity around device’s local X, Y, Z axes,
    // in radians per second. The sensor’s readings are stored in the x, y, z properties,
    // so we can output the data to the browser with the following code:
    if ( 'Gyroscope' in window ) {
        var gyroscope = new Gyroscope();
        gyroscope.start();
        gyroscope.addEventListener('reading', function(e) {
            console.log( "gyr:", simplifyGyroscope(e));
            isfLog( 'gyr', simplifyGyroscope(e));
            isfLog( 'gyr-deg', radToDeg(e.target.x).toFixed(1) + ' ' + radToDeg(e.target.y).toFixed(1) + ' ' + radToDeg(e.target.z).toFixed(1));
        });
    }

    // Ambient light
    // Must be manually enabled at the time being, so not a good use
    if ( 'AmbientLightSensor' in window ) {
        var ambLightSensor = new AmbientLightSensor();
        ambLightSensor.start();
        ambLightSensor.addEventListener('reading', function(e) {
          isfLog( 'amb-l', e );
        });
    }

    // Magnetometer
    // Must be manually enabled at the time being, so not a good use
    if ( 'Magnetometer' in window ) {
        var magnetometer = new Magnetometer();
        magnetometer.start();
        magnetometer.addEventListener('reading', function(e) {
          isfLog( 'mag', e );
        });
    }

    function initSensor() {
        // var options = {
        //     frequency: 60,
        //     coordinateSystem
        // };

        // sensor.onreading = function() {
        //     console.log(sensor);
        // };
        // sensor.onerror = (event) => {
        //   if (event.error.name == 'NotReadableError') {
        //     console.log("Sensor is not available.");
        //   }
        // };
        // sensor.start();
    }



})(window);

},{}]},{},[1]);
