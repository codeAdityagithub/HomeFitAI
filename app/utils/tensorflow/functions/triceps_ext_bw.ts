import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, PositionFunction } from "../functions";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_elbow_angle = angle(keypoints, 6, 8, 10);
  const left_elbow_angle = angle(keypoints, 5, 7, 9);
  const _pos =
    left_elbow_angle < 110 && right_elbow_angle < 110
      ? 2
      : left_elbow_angle > 160 && right_elbow_angle > 160
      ? 0
      : 1;
  let _suggestion = undefined;
  if (sendSuggestions) {
    // const body_angle = angle(keypoints, 8, 6, 12);
    // if (body_angle < 140) _suggestion = "Keep Your Arms Overhead";
  }
  return { _pos, _suggestion };
};

export default func;
