import { angle, StaticPosFunction } from "../functions";

const func: StaticPosFunction = (keypoints, sendSuggestions) => {
  let _suggestion = undefined;

  if (sendSuggestions) {
    const hip_angle = angle(keypoints, 5, 11, 13);
    const knee_angle = angle(keypoints, 11, 13, 15);
    console.log(hip_angle);
    if (hip_angle < 160) _suggestion = "Keep Your Torso Straight!";
    else _suggestion = undefined;
    if (knee_angle < 150) _suggestion = "Keep Your Legs Straight!";
    else if (!_suggestion) _suggestion = undefined;
  }

  return { _suggestion };
};
export default func;
