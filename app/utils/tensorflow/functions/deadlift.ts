import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, type PositionFunction } from "../functions";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_hip_angle = angle(keypoints, 6, 12, 14);
  const left_hip_angle = angle(keypoints, 5, 11, 13);
  const _pos =
    left_hip_angle < 120 && right_hip_angle < 120
      ? 2
      : left_hip_angle > 150 && right_hip_angle > 150
      ? 0
      : 1;
  let _suggestion = undefined;
  if (sendSuggestions) {
    const right_knee_angle = angle(keypoints, 12, 14, 16);
    const left_knee_angle = angle(keypoints, 11, 13, 15);
    if (right_knee_angle < 150 && left_knee_angle < 150)
      _suggestion = "Keep Your Legs Straight and Stiff!";
  }
  return { _pos, _suggestion };
};

export default func;
