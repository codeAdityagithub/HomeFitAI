import { Keypoint } from "@tensorflow-models/pose-detection";
import { angle, type PositionFunctionUnilateral } from "../functions";

const func: PositionFunctionUnilateral = (
  keypoints: Keypoint[],
  sendSuggestions
) => {
  const right_hip_angle = angle(keypoints, 6, 12, 14);
  const left_hip_angle = angle(keypoints, 5, 11, 13);

  const _posleft = left_hip_angle < 110 ? 2 : left_hip_angle > 140 ? 0 : 1;
  const _posright = right_hip_angle < 110 ? 2 : right_hip_angle > 140 ? 0 : 1;
  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _posleft, _posright, _suggestion };
};

export default func;
