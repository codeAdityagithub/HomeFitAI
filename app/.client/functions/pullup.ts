import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  PositionFunction,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const left_sh_angle = angle(keypoints, 7, 5, 11);
  const right_sh_angle = angle(keypoints, 8, 6, 12);
  const _pos =
    left_sh_angle < 50 && right_sh_angle < 50
      ? 0
      : left_sh_angle > 160 && right_sh_angle > 160
      ? 2
      : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
