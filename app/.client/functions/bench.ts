import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  angle,
  PositionFunction,
} from "../../utils/tensorflow/functions.client";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_elbow_angle = angle(keypoints, 6, 8, 10);
  const left_elbow_angle = angle(keypoints, 5, 7, 9);
  const elbow_y =
    (keypoints[8].score ?? 0) > (keypoints[7].score ?? 0)
      ? keypoints[8].y
      : keypoints[7].y;
  const diff = keypoints[0].y - elbow_y + 10;

  //   console.log(diff);
  const _pos =
    left_elbow_angle < 100 && right_elbow_angle < 100 && diff > 0
      ? 2
      : left_elbow_angle > 150 && right_elbow_angle > 150 && diff <= 0
      ? 0
      : 1;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = funcsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
