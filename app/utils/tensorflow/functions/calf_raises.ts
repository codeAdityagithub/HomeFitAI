import { Keypoint } from "@tensorflow-models/pose-detection";
import { PositionFunction, StaticPosFunction } from "../functions";

let prevY = 0;

const curl: StaticPosFunction = (keypoints: Keypoint[], sendSuggestions) => {
  return { _suggestion: undefined };
};

export default curl;
