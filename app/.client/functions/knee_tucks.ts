import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  PositionFunction,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_hip_angle = angle(keypoints, 6, 12, 14);
  const left_hip_angle = angle(keypoints, 5, 11, 13);
  const _pos =
    left_hip_angle < 70 && right_hip_angle < 70
      ? 0
      : left_hip_angle > 130 && right_hip_angle > 130
      ? 2
      : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
