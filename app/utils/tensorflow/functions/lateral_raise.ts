import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, PositionFunction } from "../functions";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const left_sh_angle = angle(keypoints, 7, 5, 11);
  const right_sh_angle = angle(keypoints, 8, 6, 12);
  const _pos =
    left_sh_angle < 50 && right_sh_angle < 50
      ? 2
      : left_sh_angle > 90 && right_sh_angle > 90
      ? 0
      : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
