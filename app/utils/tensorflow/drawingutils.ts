import { Keypoint } from "@tensorflow-models/pose-detection";
// import * as tf from "@tensorflow/tfjs-core";
function toTuple({ y, x }: { y: number; x: number }) {
  return [y, x];
}
const color = "aqua";
const lineWidth = 2;

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  y: number,
  x: number,
  r = 3,
  color: string
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment(
  [ay, ax]: [ay: number, ax: number],
  [by, bx]: [by: number, bx: number],
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

const adjacentKeyPoints = [
  [5, 7], // Connect keypoints 5 and 7
  [7, 9], // Connect keypoints 7 and 9
  [5, 11], // Connect keypoints 5 and 11
  [6, 8], // Connect keypoints 6 and 8
  [8, 10], // Connect keypoints 8 and 10
  [6, 12], // Connect keypoints 6 and 12
  [11, 12], // Connect keypoints 11 and 12
  [12, 14], // Connect keypoints 12 and 14
  [14, 16], // Connect keypoints 14 and 16
  [11, 13], // Connect keypoints 11 and 13
  [13, 15], // Connect keypoints 13 and 15
  [5, 6], // Connect keypoints 5 and 6
  // Add more connections based on your requirements
];
export function drawSkeleton(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  console.log(minConfidence);
  adjacentKeyPoints.forEach((indices) => {
    const [i, j] = indices;
    // if (keypoints[i].score < 0.4 || keypoints[j].score < 0.4) return; //

    drawSegment(
      //@ts-expect-error
      toTuple(keypoints[i]),
      toTuple(keypoints[j]),
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (!keypoint.score || keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}
