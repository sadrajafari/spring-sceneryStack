import { DOM } from "scenerystack/scenery";
import drawVector from "./drawVector.js";

export default function VectorLegend(): DOM {
  const legendDiv = document.createElement('div');
  legendDiv.style.display = 'flex';
  legendDiv.style.flexDirection = 'row'; // items placed horizontally
  legendDiv.style.alignItems = 'center';
  
  legendDiv.style.gap = '24px';

  const CANVAS_WIDTH = 100;
  const CANVAS_HEIGHT = 40;

  function createLegendItem(color: string, label: string, type: string, arrowLength = 25) {
    const item = document.createElement('div');
    // Stack arrow above text, centered
    item.style.display = 'flex';
    item.style.flexDirection = 'column';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'center';

    // Arrow
    const arrowCanvas = document.createElement('canvas');
    arrowCanvas.width = CANVAS_WIDTH;
    arrowCanvas.height = CANVAS_HEIGHT;
    const ctx = arrowCanvas.getContext('2d')!;
    drawVector(arrowLength, ctx, arrowCanvas, color, type);
    item.appendChild(arrowCanvas);

    // Label
    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    labelSpan.style.fontSize = '16px';
    labelSpan.style.marginLeft = '30px';

    item.appendChild(labelSpan);

    return item;
  }

  // legendDiv.appendChild(createLegendItem('rgb(231, 77, 239)', 'Spring Force', "dotted"));
  legendDiv.appendChild(createLegendItem('yellow', 'Spring Force', "dotted"));
  legendDiv.appendChild(createLegendItem('#40bde8', 'Driving Force', "solidWithBorder"));
  // legendDiv.appendChild(createLegendItem('#16960b', 'Drag Force', "solid"));
  // legendDiv.appendChild(createLegendItem('rgb(79, 204, 67)', 'Drag Force', "solid"));
  legendDiv.appendChild(createLegendItem('rgb(79, 204, 67)', 'Drag Force', "hashed"));

  return new DOM(legendDiv);
}