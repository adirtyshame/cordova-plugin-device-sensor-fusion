package org.hitlabnz.sensor_fusion_demo;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.hitlabnz.sensor_fusion_demo.orientationProvider.AccelerometerCompassProvider;
import org.hitlabnz.sensor_fusion_demo.orientationProvider.CalibratedGyroscopeProvider;
import org.hitlabnz.sensor_fusion_demo.orientationProvider.GravityCompassProvider;
import org.hitlabnz.sensor_fusion_demo.orientationProvider.ImprovedOrientationSensor1Provider;
import org.hitlabnz.sensor_fusion_demo.orientationProvider.ImprovedOrientationSensor2Provider;
import org.hitlabnz.sensor_fusion_demo.orientationProvider.OrientationProvider;
import org.hitlabnz.sensor_fusion_demo.orientationProvider.RotationVectorProvider;
import org.hitlabnz.sensor_fusion_demo.representation.Quaternion;
import org.hitlabnz.sensor_fusion_demo.representation.EulerAngles;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.hardware.SensorManager;

public class SensorFusionPlugin extends CordovaPlugin {
    
    private OrientationProvider currentOrientationProvider = null;
    private SensorManager sensorManager = null;
    private int currentMode = -1;
    
	private void setOrientationProvider(OrientationProvider orientationProvider) {
        this.currentOrientationProvider = orientationProvider;
    }
	
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.sensorManager = (SensorManager) cordova.getActivity().getSystemService(Context.SENSOR_SERVICE);
        this.setMode(0);
    }
	
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("setMode".equals(action)) {
            final int mode = args.getInt(0);
            this.setMode(mode);
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, this.currentMode));
        	return true;
        } else if ("getMode".equals(action)) {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, this.currentMode));
        	return true;
        } else if ("getSensorFusion".equals(action)) {
        	callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, getSensorFusion()));
        	return true;
        }
        return false;
    }
    
    private int setMode(int mode) {
        // 0 = ImprovedOrientationSensor1Provider
        // 1 = ImprovedOrientationSensor2Provider
        // 2 = RotationVectorProvider
        // 3 = CalibratedGyroscopeProvider
        // 4 = GravityCompassProvider
        // 5 = AccelerometerCompassProvider
        if (mode == this.currentMode) {
            return mode;
        }
        this.currentMode = mode;

        if (null != this.currentOrientationProvider) {
            this.currentOrientationProvider.stop();
            this.currentOrientationProvider = null;
        }
        
        switch (mode) {
            case 0:
                this.currentOrientationProvider = new ImprovedOrientationSensor1Provider(this.sensorManager);
                break;
            case 1:
                this.currentOrientationProvider = new ImprovedOrientationSensor2Provider(this.sensorManager);
                break;
            case 2:
                this.currentOrientationProvider = new RotationVectorProvider(this.sensorManager);
                break;
            case 3:
                this.currentOrientationProvider = new CalibratedGyroscopeProvider(this.sensorManager);
                break;
            case 4:
                this.currentOrientationProvider = new GravityCompassProvider(this.sensorManager);
                break;
            case 5:
                this.currentOrientationProvider = new AccelerometerCompassProvider(this.sensorManager);
                break;
            default:
                this.currentOrientationProvider = new AccelerometerCompassProvider(this.sensorManager);
                break;
        }
        this.currentOrientationProvider.start();
        return mode;
    }
  
    public void onDestroy() {
        this.stop();
    }

    public void onReset() {
        this.stop();
    }

    private void start() {
        this.currentOrientationProvider.start();
    }  

    private void stop() {
        this.currentOrientationProvider.stop();
    }
    
    private JSONObject getSensorFusion() throws JSONException {
        final JSONObject result = new JSONObject();
        final JSONObject quaternion = new JSONObject();
        final JSONObject eulerAngles = new JSONObject();
        final Quaternion quat = this.currentOrientationProvider.getQuaternion();
        final EulerAngles euler = this.currentOrientationProvider.getEulerAngles();
        
        // DEPRECATED
        result.put("x", quat.getX());
        result.put("y", quat.getY());
        result.put("z", quat.getZ());
        result.put("w", quat.getW());
        
        quaternion.put("x", quat.getX());
        quaternion.put("y", quat.getY());
        quaternion.put("z", quat.getZ());
        quaternion.put("w", quat.getW());
        
        eulerAngles.put("yaw", euler.getYaw());
        eulerAngles.put("pitch", euler.getPitch());
        eulerAngles.put("roll", euler.getRoll());
        
        result.put("quaternion", quaternion);
        result.put("eulerAngles", eulerAngles);
        
        result.put("timestamp", System.currentTimeMillis());

        return result;
    }

}
