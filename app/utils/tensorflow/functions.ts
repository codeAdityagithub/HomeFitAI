import { Keypoint } from "@tensorflow-models/pose-detection";
import { curlsSuggestions } from "@/lib/exerciseSuggestions";

export type PositionFunction = (
  keypoints: Keypoint[],
  sendSuggestions: boolean
) => { _pos: 0 | 1 | 2; _suggestion?: string };
// function dist(x1: number, y1: number, x2: number, y2: number) {
//   const deltaX = x2 - x1;
//   const deltaY = y2 - y1;

//   // Using the Pythagorean theorem to calculate Euclidean distance
//   const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

//   return distance;
// }

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

export const band_biceps_curl: PositionFunction = (
  keypoints: Keypoint[],
  sendSuggestions
) => {
  const elbow_angle = angle(keypoints, 6, 8, 10);
  const _pos = elbow_angle < 40 ? 0 : elbow_angle > 150 ? 2 : 1;
  let _suggestion = undefined;
  if (sendSuggestions) {
    _suggestion = curlsSuggestions.INCOMPLETE;
  }
  return { _pos, _suggestion };
};
export const squating: PositionFunction = (
  keypoints: Keypoint[]
  // sendSuggestions
) => {
  const left_hip_angle = angle(keypoints, 6, 12, 14); // for squats
  const right_hip_angle = angle(keypoints, 5, 11, 13);
  if (left_hip_angle > 160 && right_hip_angle > 160) return { _pos: 0 };
  else if (left_hip_angle < 60 && right_hip_angle < 60) return { _pos: 2 };
  return { _pos: 1 };
};
export function push_position(keypoints: Keypoint[], sendSuggestions: boolean) {
  // const left_elbow_angle = angle(keypoints, 6, 8, 10);
  // const right_elbow_angle = angle(keypoints, 5, 7, 9);
  const left_elbow_angle = angle(keypoints, 8, 6, 12); // for pullups
  const right_elbow_angle = angle(keypoints, 7, 5, 11);
  let suggestion = "";
  if (sendSuggestions) {
    const body_angle = angle(keypoints, 5, 11, 13);
    suggestion = body_angle < 165 ? "keep your body straight" : "";
  }
  if (left_elbow_angle < 50 && right_elbow_angle < 50)
    return {
      pos: "down",
      suggestion: suggestion,
    };
  else if (left_elbow_angle > 150 && right_elbow_angle > 150)
    return {
      pos: "up",
      suggestion: suggestion,
    };
  return {
    pos: "neutral",
    suggestion: suggestion,
  };
}
