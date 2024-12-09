import { Keypoint } from "@tensorflow-models/pose-detection";
import { StaticPosFunction } from "../../utils/tensorflow/functions.client";

let prevY = 0;

const curl: StaticPosFunction = (keypoints: Keypoint[], sendSuggestions) => {
  return { _suggestion: undefined };
};

export default curl;
