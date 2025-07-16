export default function drawVector(forceValue, ctx, canvas, color, type) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Tail is always at the center of the canvas (which is aligned with the box center)
  const tailX = canvas.width / 2;
  const tailY = canvas.height / 2;

  // Arrow grows/shrinks from the tail (box center) outward
  // const minLength = 30;
  const minLength = 8;
  const maxLength = 110;
  const maxForceLimit = 80;
  const cappedForceValue = Math.min(Math.abs(forceValue), maxForceLimit)
  const normalized = cappedForceValue / maxForceLimit;
  const shaftLength = minLength + (maxLength - minLength) * normalized;
  const direction = Math.sign(forceValue || 1); // Ensure direction is 1 or -1





  // const headLength = 8; // length of the arrowhead
  const headLength = 7; // length of the arrowhead
  const headAngle = Math.PI / 4; // very sharp

  // The tip of the arrowhead
  const tipX = tailX + shaftLength * direction;
  const tipY = tailY;

  // The base of the arrowhead (where the shaft ends)
  const baseX = tipX - headLength * direction;
  const baseY = tipY;







  // Mewo
  const leftX = baseX;
  const leftY = baseY - headLength * Math.tan(headAngle);
  const rightX = baseX;
  const rightY = baseY + headLength * Math.tan(headAngle);
  // 
  // Draw the shaft (ending at the base of the arrowhead)
  ctx.save();




  // ctx.beginPath();
  // ctx.moveTo(tailX, tailY);
  // ctx.lineTo(baseX, baseY);
  // // ctx.strokeStyle = ' #6495ED  ';
  // ctx.strokeStyle = `${color}`;
  // ctx.lineWidth = 7;
  // ctx.stroke();

  // // Calculate the two base corners of the arrowhead triangle
  // const leftX = baseX;
  // const leftY = baseY - headLength * Math.tan(headAngle);
  // const rightX = baseX;
  // const rightY = baseY + headLength * Math.tan(headAngle);

  // // Draw the arrowhead as a filled triangle
  // ctx.beginPath();
  // ctx.moveTo(tipX, tipY);
  // ctx.lineTo(leftX, leftY);
  // ctx.lineTo(rightX, rightY);
  // ctx.closePath();
  // ctx.fillStyle = `${color}`;

  // ctx.fill();
  // ctx.restore();






  if (type === 'solidWithBorder') {
    // // We should use this one as well
    // // Draw shaft border (black, thicker)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 9; // Border thickness
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw shaft (colored, thinner, on top)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7; // Shaft thickness
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw arrowhead border (black, thicker)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw arrowhead (colored, on top)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();


  }



  if (type === 'dotted') {
    // Dotted line
    // Draw shaft border (black, thicker, solid)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw shaft (colored, thinner, dotted)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.setLineDash([2, 8]); // [dot size, gap size]
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash for future drawing

    // Draw arrowhead border (black, thicker)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw arrowhead (colored, on top)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();

  }


  if (type === 'solid') {
    // Draw shaft border (black, thicker)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = 'black';
    // ctx.strokeStyle = `${color}`;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw shaft (colored, thinner, on top)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw horizontal dashed line in the middle of the shaft
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    // ctx.setLineDash([8, 8]); // [dash length, gap length]
    ctx.setLineDash([10, 2]); // [dash length, gap length]
    ctx.lineCap = 'butt';
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash for future drawing

    // Draw arrowhead border (black, thicker)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw arrowhead (colored, on top)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  }


  // if (type === 'hashed') {
  //   // Draw shaft border (black, thicker)
  //   ctx.beginPath();
  //   ctx.moveTo(tailX, tailY);
  //   ctx.lineTo(baseX, baseY);
  //   ctx.strokeStyle = 'black';
  //   ctx.lineWidth = 9;
  //   ctx.lineCap = 'round';
  //   ctx.stroke();

  //   // Draw shaft (colored, thinner, on top)
  //   ctx.beginPath();
  //   ctx.moveTo(tailX, tailY);
  //   ctx.lineTo(baseX, baseY);
  //   ctx.strokeStyle = "white";
  //   ctx.lineWidth = 7;
  //   ctx.lineCap = 'round';
  //   ctx.stroke();

  //   // Draw dots at fixed intervals from the tail
  //   const dotSpacing = 10; // pixels between dots
  //   const dotRadius = 2; // radius of each dot
  //   const dx = (baseX - tailX) / shaftLength;
  //   const dy = (baseY - tailY) / shaftLength;

  //   for (let d = 0; d < shaftLength - 2; d += dotSpacing) {
  //     const x = tailX + dx * d;
  //     const y = tailY + dy * d;
  //     ctx.beginPath();
  //     ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
  //     ctx.fillStyle = 'black';
  //     ctx.fill();
  //   }

  //   // Draw arrowhead border (black, thicker)
  //   ctx.beginPath();
  //   ctx.moveTo(tipX, tipY);
  //   ctx.lineTo(leftX, leftY);
  //   ctx.lineTo(rightX, rightY);
  //   ctx.closePath();
  //   ctx.fillStyle = "white";
  //   ctx.lineWidth = 2;
  //   ctx.strokeStyle = 'black';
  //   ctx.stroke();

  //   // Draw arrowhead (colored, on top)
  //   ctx.beginPath();
  //   ctx.moveTo(tipX, tipY);
  //   ctx.lineTo(leftX, leftY);
  //   ctx.lineTo(rightX, rightY);
  //   ctx.closePath();
  //   ctx.fillStyle = "white";
  //   ctx.fill();

  //   ctx.restore();
  // }


  if (type === 'hashed') {
    // Draw shaft border (black, thicker)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw shaft (colored, thinner, on top)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw dots at fixed intervals from the tail, but never closer than dotSpacing
    const dotSpacing = 10; // pixels between dots
    const dotRadius = 2; // radius of each dot

    // Always draw at least one dot at the tail
    const numDots = Math.max(1, Math.floor((shaftLength - 2) / dotSpacing));
    const dx = (baseX - tailX) / shaftLength;
    const dy = (baseY - tailY) / shaftLength;

    for (let i = 0; i <= numDots; i++) {
      const d = i * dotSpacing;
      if (d > shaftLength - 2) break;
      const x = tailX + dx * d;
      const y = tailY + dy * d;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill();
    }

    // Draw arrowhead border (black, thicker)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw arrowhead (colored, on top)
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.restore();
  }



}