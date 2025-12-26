import Point from '../Point.js';
//Detect wether or not a light beam (originating at origin), with edges defined by v1 and v2 (both have length R)
//origing: Point (he source of the light)
//v1 and v2 are vectors (also represented by the Point class) that define the bounds of the cone.
//range is the range of the light
//Canditates is a list of objects with {x,y,radius} (distance will be added as a property later)

function detectObjects(origin, v1, v2, range, candidates) {
  //First sort them by distance, exclude ones that are two far away.  
  let sortedCandidates = [];
  for (let candidate of candidates) {
    let distance = Point.distance(candidate, origin);
    if (distance < range) {
      candidate['distance'] = distance;
      sortedCandidates.push(candidate);
    }
  }
  sortedCandidates.sort((a, b) => { a.distance - b.distance });

  //Now exclude all the candidates that don't fall inside the cone..
  filteredCandidates = [];
  for (let candidate of sortedCandidates) {
    if (candidateIntersectsCone(candidate, origin, v1, v2, range)) { 
      //The light is hitting the candidate.
      //Now we need to see if any light got past either side of the candidate..
      //so there may be 0,1, to remaining light cones..
      //RESURSIVELY repeat this process with the remaining cones, if any..
      //THey may also end up being split up..
    }
  }

}
/*helpers*/
function candidateIntersectsCone(candidate, origin, v1, v2, range) {
  //1. Angular Bounds Check

  // Calculate angles for the cone boundaries
  const angle_v0 = Math.atan2(v0.y, v0.x);
  const angle_v1 = Math.atan2(v1.y, v1.x);
  const angle_Candidate = Math.atan2(candidate.y - origin.y, candidate.x - origin.x);
  // Calculate the angular extent of the circle as seen from O
  const angularRadius = Math.asin(Math.min(candidate.radius / candidate.distance, 1.0));
  // Check if the circle's angular range overlaps with cone's angular range
  if (!angularOverlap(angle_v0, angle_v1, angle_Candidate - angularRadius, angle_Candidate + angularRadius)) {
    return false;  // Circle is outside the angular bounds
  }

  // 2. Detailed geometric checks
  // At this point, we know the circle is in the right general area
  // Now check if it actually intersects the triangular cone region

  // Check if circle intersects the two edge rays
  if (distancePointToRay(candidate, origin, v0) <= candidate.radius ||
    distancePointToRay(candidate, origin, v1) <= candidate.radius) {
    return true;
  }
  // Check if the circle center is inside the cone
  if (pointInCone(candidate, origin, v0, v1)) {
    return true;
  }
  // Check if any of the cone's vertices are inside the circle
  if (candidate.distance <= candidate.radius) {  // Origin  is inside candidate <-- This should never happen because they'd collide & seperate.
    return true;
  }
  //Check for things of the furthert edge of the light cone, but some of the candidate is in the cone because its radius extends far enough
  const endPoint0 = { x: origin.x + v0.x, y: origin.y + v0.y };
  const endPoint1 = { x: origin.x + v1.x, y: origin.y + v1.y };
  if (Point.distance(candidate, endPoint0) <= candidate.radius || Point.distance(candidate, endPoint1) <= candidate.radius) {
    return true;
  }
  return false;
}

function angularOverlap(a0, a1, b0, b1) {
  // Normalize angles to handle wraparound
  // This assumes angles are in radians (-π to π)
  let na0 = normalizeAngle (a0);
  let na1 = normalizeAngle (a1);
  let nb0 = normalizeAngle (b0);
  let nb1 = normalizeAngle (b1);

  // Check if circle's angular range intersects cone's angular range
  const circleMinInCone = angleInRange(nb0, na0, na1);
  const circleMaxInCone = angleInRange(nb1, na0, na1);
  const coneMinInCircle = angleInRange(na0, nb0, nb1);
  const coneMaxInCircle = angleInRange(na1, nb0, nb1);

  return circleMinInCone || circleMaxInCone || coneMinInCircle || coneMaxInCircle;
}
function normalizeAngle (a){
    while (a < 0) a += 2 * Math.PI;
    while (a >= 2 * Math.PI) a -= 2 * Math.PI;
    return a;
}
// Check if angle is within range [a0, a1] (handling wraparound)
function angleInRange(angle, a0, a1) {
  //These angles should already have been normalized..
  if (a0 <= a1) {
    return angle >= a0 && angle <= a1;
  } else {
    // Range wraps around 0
    return angle >= a0 || angle <= a1;
  }
}


function distancePointToRay(P, O, v) {
  const OP = { x: P.x - O.x, y: P.y - O.y };
  const vNorm = Math.sqrt(v.x * v.x + v.y * v.y);
  const vUnit = { x: v.x / vNorm, y: v.y / vNorm };

  // Project OP onto v
  const projection = OP.x * vUnit.x + OP.y * vUnit.y;

  if (projection < 0) {
    // Point is "behind" the ray origin
    return distance(P, O);
  }

  // Perpendicular distance
  const perpX = OP.x - projection * vUnit.x;
  const perpY = OP.y - projection * vUnit.y;
  return Math.sqrt(perpX * perpX + perpY * perpY);
}

// Check if point P is inside the cone defined by O, v0, v1
function pointInCone(P, O, v0, v1) {
  const OP = { x: P.x - O.x, y: P.y - O.y };

  // Use cross products to check if P is on the correct side of both rays
  const cross0 = crossProduct2D(v0, OP);
  const cross1 = crossProduct2D(OP, v1);

  // Both should have the same sign (assuming cone spans < 180 degrees)
  return cross0 >= 0 && cross1 >= 0;
}

