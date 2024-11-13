import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, PositionFunction } from "../functions";

const squat: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const left_hip_angle = angle(keypoints, 6, 12, 14);
  const right_hip_angle = angle(keypoints, 5, 11, 13);

  const _pos =
    left_hip_angle < 60 && right_hip_angle < 60
      ? 2
      : left_hip_angle > 150 && right_hip_angle > 150
      ? 0
      : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = squatsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default squat;
