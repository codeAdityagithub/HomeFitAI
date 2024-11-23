import { Keypoint } from "@tensorflow-models/pose-detection";
import { PositionFunction } from "../functions";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_hipY = keypoints[12].y,
    midY_left = keypoints[11].y,
    left_hand_y = keypoints[10].y,
    right_hand_y = keypoints[9].y;

  const _pos =
    left_hand_y < midY_left - 15 && right_hand_y < right_hipY - 15
      ? 0
      : left_hand_y > midY_left + 30 && right_hand_y > right_hipY + 30
      ? 2
      : 1;
  // console.log(_pos);
  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
