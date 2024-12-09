import { Keypoint } from "@tensorflow-models/pose-detection";

export type PositionFunction = (
  keypoints: Keypoint[],
  sendSuggestions: boolean
) => { _pos: 0 | 1 | 2; _suggestion?: string };
export type StaticPosFunction = (
  keypoints: Keypoint[],
  sendSuggestions: boolean
) => { _suggestion?: string };

export type PositionFunctionUnilateral = (
  keypoints: Keypoint[],
  sendSuggestions: boolean
) => { _posleft: 0 | 1 | 2; _posright: 0 | 1 | 2; _suggestion?: string };

export function dist(k1: Keypoint, k2: Keypoint) {
  const { x: x1, y: y1 } = k1;
  const { x: x2, y: y2 } = k2;
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  // Using the Pythagorean theorem to calculate Euclidean distance
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  return distance;
}

export function angle(keypoints: Keypoint[], i: number, j: number, k: number) {
  const { x: x1, y: y1 } = keypoints[i];
  const { x: x2, y: y2 } = keypoints[j];
  const { x: x3, y: y3 } = keypoints[k];

  const v1x = x1 - x2;
  const v1y = y1 - y2;
  const v2x = x3 - x2;
  const v2y = y3 - y2;

  const dotProduct = v1x * v2x + v1y * v2y;
  const magnitudeV1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const magnitudeV2 = Math.sqrt(v2x * v2x + v2y * v2y);
  let angleRadians = Math.acos(dotProduct / (magnitudeV1 * magnitudeV2));

  let angleDegrees = angleRadians * (180 / Math.PI);
  if (isNaN(angleDegrees)) {
    // If NaN, angle is 180 degrees
    return 180;
  } else {
    // console.log(angleDegrees);
    return angleDegrees;
  }
}
