export default class SensorResponse {
  time = undefined;               //Timestamp of signal
  sensor = undefined;             //Sensor that MADE the signal
  actor = undefined;              //Actor that owns the sensor
  distance = Number.MAX_SAFE_INTEGER;//Distance between actor and closest part of "detectedActor"'s polygon
  locationOfOrigin = undefined;   //Where owner was when signal was generated.
  locationOfResponse = undefined; //Where the sensor pinged back from.
  detectedActor = undefined;      //Who the sensor pinged back from.
  worldAngle = undefined;         //Angle (in world space) the sensor was looking.
  
  constructor(time, sensor, actor, locationOfOrigin, worldAngle) {
    this.time = time;
    this.sensor = sensor;
    this.actor = actor;
    this.locationOfOrigin = locationOfOrigin;
    this.worldAngle = worldAngle;
  }
  setResponse (locationOfResponse, distance, detectedActor){
    this.locationOfResponse = locationOfResponse;
    this.distance = distance;
    this.detectedActor = detectedActor;
  }
}