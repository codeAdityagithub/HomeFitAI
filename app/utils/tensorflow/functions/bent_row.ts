import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, PositionFunction } from "../functions";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const left_angle = angle(keypoints, 8, 6, 12);
  const right_angle = angle(keypoints, 7, 5, 11);
  const _pos =
    left_angle < 40 && right_angle < 40
      ? 0
      : left_angle > 80 && right_angle > 80
      ? 2
      : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
