import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  PositionFunction,
} from "../../utils/tensorflow/functions.client";

const curl: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_elbow_angle = angle(keypoints, 6, 8, 10);
  const left_elbow_angle = angle(keypoints, 5, 7, 9);
  const _pos =
    left_elbow_angle < 40 && right_elbow_angle < 40
      ? 0
      : left_elbow_angle > 150 && right_elbow_angle > 150
      ? 2
      : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default curl;
