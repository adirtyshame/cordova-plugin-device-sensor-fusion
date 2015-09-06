var FusionResult = function (x, y, z, w, yaw, pitch, roll, timestamp) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.yaw = yaw;
    this.pitch = pitch;
    this.roll = roll;
    this.quaternion = {
        x: x,
        y: y,
        z: z,
        w: w
    }
    this.euler = {
        yaw: yaw,
        pitch: pitch,
        roll: roll
    };
    this.timestamp = timestamp || new Date().getTime();
};

module.exports = FusionResult;