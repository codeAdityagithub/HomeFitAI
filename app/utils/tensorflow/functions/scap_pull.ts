import { Keypoint } from "@tensorflow-models/pose-detection";
import { StaticPosFunction } from "../functions";

const func: StaticPosFunction = (keypoints: Keypoint[], sendSuggestions) => {
  //   const ang = angle(keypoints, 6, 0, 5);

  //   const _pos = ang > 100 ? 2 : ang < 80 ? 0 : 1;
  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _suggestion };
};

export default func;
