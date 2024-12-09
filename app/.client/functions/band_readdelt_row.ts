import { Keypoint } from "@tensorflow-models/pose-detection";
import { PositionFunction } from "../../utils/tensorflow/functions.client";

const func: PositionFunction = (keypoints: Keypoint[], sendSuggestions) => {
  const l_elbow_x = keypoints[7].x,
    r_elbow_x = keypoints[8].x,
    l_sh_x = keypoints[5].x,
    r_sh_x = keypoints[6].x;
  const _pos = 0;

  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _pos, _suggestion };
};

export default func;
