import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  PositionFunctionUnilateral,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunctionUnilateral = (
  keypoints: Keypoint[],
  sendSuggestions
) => {
  const left_sh_angle = angle(keypoints, 7, 5, 11);
  const right_sh_angle = angle(keypoints, 8, 6, 12);

  const _posleft = left_sh_angle < 35 ? 2 : left_sh_angle > 90 ? 0 : 1;
  const _posright = right_sh_angle < 35 ? 2 : right_sh_angle > 90 ? 0 : 1;
  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _posleft, _posright, _suggestion };
};

export default func;