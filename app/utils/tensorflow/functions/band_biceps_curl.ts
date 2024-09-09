import { curlsSuggestions } from "@/lib/exerciseSuggestions";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, PositionFunction } from "../functions";

export const band_biceps_curl: PositionFunction = (
  keypoints: Keypoint[],
  sendSuggestions
) => {
  const elbow_angle = angle(keypoints, 6, 8, 10);
  const _pos = elbow_angle < 40 ? 0 : elbow_angle > 150 ? 2 : 1;
  let _suggestion = undefined;
  if (sendSuggestions) {
    _suggestion = curlsSuggestions.INCOMPLETE;
  }
  return { _pos, _suggestion };
};
