import Point from './points.js';

export default class Sensor {
    //Direction is a component vector
    //returns "false" or an object with "position" and "distance".
    static canSee(originPoint, direction, barrierPoint1, barrierPoint2) {
        const x1 = barrierPoint1.x;
        const y1 = barrierPoint1.y;
        const x2 = barrierPoint2.x;
        const y2 = barrierPoint2.y;

        const x3 = originPoint.x;
        const y3 = originPoint.y;
        const x4 = x3 + direction.x;
        const y4 = y3 + direction.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) return false;  //They are parallel 
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (t > 0 && t < 1 && u > 0) {
            const p = new Point(x1 + t * (x2 - x1),y1 + t * (y2 - y1));
            const d = Point.distance (originPoint, p);
            return {
                position: p,
                distance: d
            };
        };
        return false; //They don't ever hit.
    }
    draw() { 

    }
}