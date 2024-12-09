import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  PositionFunction,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const body_angle = angle(keypoints, 6, 12, 14);

  const _pos = body_angle < 130 ? 2 : body_angle > 160 ? 0 : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
