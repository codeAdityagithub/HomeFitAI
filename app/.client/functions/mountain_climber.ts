import { Keypoint } from "@tensorflow-models/pose-detection";
import { StaticPosFunction } from "../../utils/tensorflow/functions.client";

const func: StaticPosFunction = (keypoints: Keypoint[], sendSuggestions) => {
  let _suggestion = undefined;
  // if (sendSuggestions) {
  //   _suggestion = curlsSuggestions.INCOMPLETE;
  // }
  return { _suggestion };
};

export default func;
