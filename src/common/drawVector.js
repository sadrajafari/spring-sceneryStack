export default function drawVector(forceValue, ctx, canvas, color) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Tail is always at the center of the canvas (which is aligned with the box center)
  const tailX = canvas.width / 2;
  const tailY = canvas.height / 2;

  // Arrow grows/shrinks from the tail (box center) outward
  const minLength = 30;
  const maxLength = 110;
  const maxForceLimit = 80;
  const cappedForceValue = Math.min(Math.abs(forceValue), maxForceLimit)
  const normalized = cappedForceValue / maxForceLimit;
  const shaftLength = minLength + (maxLength - minLength) * normalized;
  const direction = Math.sign(forceValue || 1); // Ensure direction is 1 or -1





  const headLength = 8; // length of the arrowhead
  const headAngle = Math.PI / 4; // very sharp

  // The tip of the arrowhead
  const tipX = tailX + shaftLength * direction;
  const tipY = tailY;

  // The base of the arrowhead (where the shaft ends)
  const baseX = tipX - headLength * direction;
  const baseY = tipY;

  // Draw the shaft (ending at the base of the arrowhead)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(baseX, baseY);
  // ctx.strokeStyle = ' #6495ED  ';
  ctx.strokeStyle = `${color}`;
  ctx.lineWidth = 7;
  ctx.stroke();

  // Calculate the two base corners of the arrowhead triangle
  const leftX = baseX;
  const leftY = baseY - headLength * Math.tan(headAngle);
  const rightX = baseX;
  const rightY = baseY + headLength * Math.tan(headAngle);

  // Draw the arrowhead as a filled triangle
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  // ctx.fillStyle = 'rgb(101, 207, 14)';
  ctx.fillStyle = `${color}`;

  ctx.fill();
  ctx.restore();
}