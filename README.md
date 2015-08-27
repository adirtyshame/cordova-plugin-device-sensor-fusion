# cordova-plugin-device-sensor-fusion

A cordova plugin using sensor fusion to offer more precise orientation data.
It is based on a work of Alexander Pacha (https://bitbucket.org/apacha/sensor-fusion-demo).

Access is via a global `navigator.fusion` object.

Although the object is attached to the global scoped `navigator`, it is not available until after the `deviceready` event.

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(navigator.fusion);
    }

## Installation

Install via cordova CLI:

    cordova plugin add https://github.com/adirtyshame/cordova-plugin-device-sensor-fusion.git

## Supported Platforms

- Android

## Methods

- navigator.fusion.setMode
- navigator.fusion.getCurrentSensorFusion
- navigator.fusion.watchSensorFusion
- navigator.fusion.clearWatch

### navigator.fusion.getCurrentSensorFusion

Get the current sensor fusion. The result is returned via a `FusionResult`
object using the `fusionSuccess` callback function.

    navigator.fusion.getCurrentSensorFusion(fusionSuccess, fusionError);

#### Example

    function onSuccess(result) {
        alert('x: ' + result.x);
    };

    function onError(error) {
        alert('FusionError: ' + error.code);
    };

    navigator.fusion.getCurrentSensorFusion(onSuccess, onError);
    
### navigator.fusion.watchSensorFusion

Gets the device's current sensor fusion data at a regular interval. Each time the data
is retrieved, the `fusionSuccess` callback function is executed.

The returned watch ID references the sensor fusion watch interval. The watch
ID can be used with `navigator.fusion.clearWatch` to stop watching the navigator.fusion.

    var watchID = navigator.fusion.watchSensorFusion(fusionSuccess, fusionError, [fusionOptions]);

`fusionOptions` may contain the following keys:

- __frequency__: How often to retrieve the sensor fusion data in milliseconds. _(Number)_ (Default: 100)

#### Example

    function onSuccess(heading) {
        var element = document.getElementById('heading');
        element.innerHTML = 'Heading: ' + heading.magneticHeading;
    };

    function onError(compassError) {
        alert('Compass error: ' + compassError.code);
    };

    var options = {
        frequency: 3000
    }; // Update every 3 seconds

    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    
## navigator.compass.clearWatch

Stop watching the compass referenced by the watch ID parameter.

    navigator.compass.clearWatch(watchID);

- __watchID__: The ID returned by `navigator.compass.watchHeading`.

### Example

    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);

    // ... later on ...

    navigator.compass.clearWatch(watchID);

## CompassHeading

A `CompassHeading` object is returned to the `compassSuccess` callback function.

### Properties

- __magneticHeading__: The heading in degrees from 0-359.99 at a single moment in time. _(Number)_

- __trueHeading__: The heading relative to the geographic North Pole in degrees 0-359.99 at a single moment in time. A negative value indicates that the true heading can't be determined.  _(Number)_

- __headingAccuracy__: The deviation in degrees between the reported heading and the true heading. _(Number)_

- __timestamp__: The time at which this heading was determined.  _(milliseconds)_

## CompassError

A `CompassError` object is returned to the `compassError` callback function when an error occurs.

### Properties

- __code__: One of the predefined error codes listed below.

### Constants

- `CompassError.COMPASS_INTERNAL_ERR`
- `CompassError.COMPASS_NOT_SUPPORTED`