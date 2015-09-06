[![npm version](https://badge.fury.io/js/cordova-plugin-device-sensor-fusion.svg)](http://badge.fury.io/js/cordova-plugin-device-sensor-fusion)

# cordova-plugin-device-sensor-fusion

A cordova plugin using sensor fusion to offer more precise orientation data.
It is based on a work of Alexander Pacha (https://bitbucket.org/apacha/sensor-fusion-demo).

DEMO:
https://github.com/adirtyshame/threecordova

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

### navigator.fusion.setMode

Set the operation-mode for the plugin. 

    navigator.fusion.setMode(success, err, mode);

Available modes are (from '0' to '5'):

- __0__: Improved Orientation Sensor 1 (Sensor fusion of Android Rotation Vector and Calibrated Gyroscope - less stable but more accurate)
- __1__: Improved Orientation Sensor 2 (Sensor fusion of Android Rotation Vector and Calibrated Gyroscope - more stable but less accurate)
- __2__: Android Rotation Vector (Kalman filter fusion of Accelerometer + Gyroscope + Compass)
- __3__: Calibrated Gyroscope (Separate result of Kalman filter fusion of Accelerometer + Gyroscope + Compass)
- __4__: Gravity + Compass
- __5__: Accelerometer + Compass

#### Example

    function success(result) {
        alert('new Mode: ' + result);
    };

    function err(error) {
        alert('Error: ' + error);
    };
    
    // Set operation mode to 'Android Rotation Vector'
    navigator.fusion.setMode(onSuccess, onError, 2);

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

    function onSuccess(result) {
        var element = document.getElementById('result');
        element.innerHTML = 'Result.x: ' + result.x;
    };

    function onError(fusionError) {
        alert('Fusion error: ' + fusionError.code);
    };

    var options = {
        frequency: 3000
    }; // Update every 3 seconds

    var watchID = navigator.fusion.watchSensorFusion(onSuccess, onError, options);
    
## navigator.fusion.clearWatch

Stop watching the sensor fusion referenced by the watch ID parameter.

    navigator.fusion.clearWatch(watchID);

- __watchID__: The ID returned by `navigator.fusion.watchSensorFusion`.

### Example

    var watchID = navigator.fusion.watchSensorFusion(onSuccess, onError, options);

    // ... later on ...

    navigator.fusion.clearWatch(watchID);

## FusionResult

A `FusionResult` object is returned to the `fusionSuccess` callback function.

### Properties

- __FusionResult.__ (ATTENTION: will be deprecated soon)

  * __x__: The x-component of the resulting quaternion. _(Number)_
  * __y__: The y-component of the resulting quaternion. _(Number)_
  * __z__: The z-component of the resulting quaternion. _(Number)_
  * __w__: The w-component of the resulting quaternion. _(Number)_

- __FusionResult.quaternion.__

  * __x__: The x-component of the resulting quaternion. _(Number)_
  * __y__: The y-component of the resulting quaternion. _(Number)_
  * __z__: The z-component of the resulting quaternion. _(Number)_
  * __w__: The w-component of the resulting quaternion. _(Number)_

- __FusionResult.eulerAngles.__

  * __yaw__: The Euler-Angles yaw component. _(Number)_
  * __pitch__: The Euler-Angles pitch component. _(Number)_
  * __roll__: The Euler-Angles roll component. _(Number)_

- __FusionResult.timestamp__: The time at which the data was determined.  _(milliseconds)_

### Changelog

- __0.0.1__
  * initial commit
- __0.0.2__
  * README.md updated
- __0.0.3__
  * FusionResult extended (see 'Properties') !!!ATTENTION: DEPRECATION!!!