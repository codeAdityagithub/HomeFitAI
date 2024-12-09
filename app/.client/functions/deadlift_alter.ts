import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  type PositionFunctionUnilateral,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunctionUnilateral = (
  keypoints: Keypoint[],
  sendSuggestions
) => {
  const right_hip_angle = angle(keypoints, 6, 12, 14);
  const left_hip_angle = angle(keypoints, 5, 11, 13);

  const _posleft = left_hip_angle < 100 ? 2 : left_hip_angle > 160 ? 0 : 1;
  const _posright = right_hip_angle < 100 ? 2 : right_hip_angle > 160 ? 0 : 1;
  let _suggestion = undefined;

  if (sendSuggestions) {
    // const right_knee_angle = angle(keypoints, 12, 14, 16);
    // const left_knee_angle = angle(keypoints, 11, 13, 15);
    // if (right_knee_angle < 150 && left_knee_angle < 150)
    //   _suggestion = "Keep Your Legs Straight and Stiff!";
  }

  return { _posleft, _posright, _suggestion };
};

export default func;
