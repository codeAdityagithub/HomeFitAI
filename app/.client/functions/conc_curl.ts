import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  type PositionFunctionUnilateral,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunctionUnilateral = (
  keypoints: Keypoint[],
  sendSuggestions
) => {
  const right_elbow_angle = angle(keypoints, 6, 8, 10);
  const left_elbow_angle = angle(keypoints, 5, 7, 9);
  const _posleft = left_elbow_angle < 60 ? 0 : left_elbow_angle > 150 ? 2 : 1;
  const _posright =
    right_elbow_angle < 60 ? 0 : right_elbow_angle > 150 ? 2 : 1;
  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _posleft, _posright, _suggestion };
};

export default func;
