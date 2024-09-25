import { curlsSuggestions } from "@/lib/exerciseSuggestions";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, type PositionFunction } from "../functions";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const right_elbow_angle = angle(keypoints, 8, 6, 12);
  const left_elbow_angle = angle(keypoints, 7, 5, 11);
  const _pos =
    left_elbow_angle < 40 && right_elbow_angle < 40
      ? 0
      : left_elbow_angle > 150 && right_elbow_angle > 150
      ? 2
      : 1;
  //   console.log({ left_elbow_angle, right_elbow_angle });
  let _suggestion = undefined;
  if (sendSuggestions) {
    _suggestion = curlsSuggestions.INCOMPLETE;
  }
  return { _pos, _suggestion };
};

export default func;
