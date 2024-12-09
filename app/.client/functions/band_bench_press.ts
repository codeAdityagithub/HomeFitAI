import { curlsSuggestions } from "@/lib/exerciseSuggestions";
import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  type PositionFunction,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_elbow_angle = angle(keypoints, 6, 8, 10);
  const left_elbow_angle = angle(keypoints, 5, 7, 9);
  const _pos =
    left_elbow_angle < 90 && right_elbow_angle < 90
      ? 2
      : left_elbow_angle > 140 && right_elbow_angle > 140
      ? 0
      : 1;
  //   console.log({ left_elbow_angle, right_elbow_angle });
  let _suggestion = undefined;
  if (sendSuggestions) {
    _suggestion = curlsSuggestions.INCOMPLETE;
  }
  return { _pos, _suggestion };
};

export default func;
