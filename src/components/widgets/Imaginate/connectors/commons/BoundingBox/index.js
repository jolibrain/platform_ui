import React from "react";
import { observer } from "mobx-react";
import Boundingbox from "react-bounding-box";
import seedrandom from "seedrandom";

@observer
export default class BoundingBox extends React.Component {
  constructor(props) {
    super(props);

    this.drawLabel = this.drawLabel.bind(this);

    this.drawBoxSimple = this.drawBoxSimple.bind(this);
    this.drawBoxColor = this.drawBoxColor.bind(this);

    this.findChainService = this.findChainService.bind(this);
  }

  findChainService(category) {
    let i;

    for (i = 0; i < Object.keys(category).length; i += 1) {
      const key = Object.keys(category)[i];
      const child = category[key];

      if (typeof child.classes !== "undefined") {
        return {
          serviceName: key,
          classes: child.classes
        };
      }
    }
  }

  drawLabel(canvas, box) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let x = 0,
      y = 0;
    if (coord.xmin && coord.ymax) {
      x = coord.xmin;
      y = coord.ymax;
    } else if (coord.x && coord.y) {
      x = coord.x;
      y = coord.y;
    }

    const fontSize = parseInt(canvas.width, 10) * 0.02;

    ctx.fillStyle = "#fff";
    ctx.miterLimit = 2;
    ctx.lineJoin = "circle";
    ctx.font = fontSize + "px sans-serif";

    ctx.strokeText(box.label, x + 5, y + fontSize * 0.8);
    ctx.fillText(box.label, x + 5, y + fontSize * 0.8);
  }

  drawBoxSimple(canvas, box, color, lineWidth) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];
    if (coord.xmin && coord.xmax && coord.ymin && coord.ymax) {
      [x, y, width, height] = [
        coord.xmin,
        coord.ymax,
        coord.xmax - coord.xmin,
        coord.ymin - coord.ymax
      ];
    } else if (coord.x && coord.y && coord.width && coord.height) {
      [x, y, width, height] = coord;
    }

    if (x < lineWidth / 2) {
      x = lineWidth / 2;
    }
    if (y < lineWidth / 2) {
      y = lineWidth / 2;
    }

    if (x + width > canvas.width) {
      width = canvas.width - lineWidth - x;
    }
    if (y + height > canvas.height) {
      height = canvas.height - lineWidth - y;
    }

    // Left segment
    const tenPercent = width / 10;
    const ninetyPercent = 9 * tenPercent;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x + tenPercent, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + tenPercent, y + height);
    ctx.stroke();

    // Right segment
    ctx.beginPath();
    ctx.moveTo(x + ninetyPercent, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + ninetyPercent, y + height);
    ctx.stroke();
  }

  drawBoxColor(canvas, box, color, lineWidth) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];
    if (coord.xmin && coord.xmax && coord.ymin && coord.ymax) {
      [x, y, width, height] = [
        coord.xmin,
        coord.ymax,
        coord.xmax - coord.xmin,
        coord.ymin - coord.ymax
      ];
    } else if (coord.x && coord.y && coord.width && coord.height) {
      [x, y, width, height] = coord;
    }

    if (x < lineWidth / 2) {
      x = lineWidth / 2;
    }
    if (y < lineWidth / 2) {
      y = lineWidth / 2;
    }

    if (x + width > canvas.width) {
      width = canvas.width - lineWidth - x;
    }
    if (y + height > canvas.height) {
      height = canvas.height - lineWidth - y;
    }

    var c = "0x" + box.color.substring(1);
    var rgba =
      "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",0.8)";
    ctx.strokeStyle = rgba;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  generateColor(categoryName) {
    const random = seedrandom(categoryName);
    const r = Math.floor(random() * 255);
    const g = Math.floor(random() * 255);
    const b = Math.floor(random() * 255);

    var rgb = b | (g << 8) | (r << 16);
    return "#" + (0x1000000 + rgb).toString(16).slice(1);
  }

  render() {
    const input = this.props.input;

    if (!input) return null;

    let prediction = null;

    if (
      input &&
      input.json &&
      input.json.body &&
      input.json.body.predictions &&
      input.json.body.predictions.length > 0
    ) {
      prediction = input.json.body.predictions[0];
    }

    let drawLabel = () => {},
      drawBox = this.drawBoxSimple,
      boxes = [];

    if (this.props.boxFormat === "simple") {
      boxes = input.boxes;
    } else if (prediction && prediction.classes) {
      if (this.props.showLabels) {
        drawLabel = this.drawLabel;
      }
      drawBox = this.drawBoxColor;

      boxes = prediction.classes.map(pred => {
        let box = pred.bbox ? pred.bbox : {};
        box.label = pred.cat ? pred.cat : "";

        let chainService = this.findChainService(pred);

        if (
          chainService &&
          chainService.serviceName &&
          chainService.classes &&
          chainService.classes[0] &&
          chainService.classes[0].cat &&
          chainService.classes[0].prob
        ) {
          box.label = chainService.classes[0].cat;
        }

        box.prob = pred.prob;
        box.color = this.generateColor(pred.cat);
        return box;
      });
    }

    let segmentationColors = this.props.displaySettings.segmentationColors;
    let pixelSegmentation = prediction ? prediction.vals : null;

    if (
      prediction &&
      prediction.confidences &&
      prediction.confidences.best &&
      prediction.confidences.best.length > 0
    ) {
      segmentationColors = [
        "#67001f",
        "#b2182b",
        "#d6604d",
        "#f4a582",
        "#fddbc7",
        "#d1e5f0",
        "#92c5de",
        "#4393c3",
        "#2166ac",
        "#053061"
      ];
      pixelSegmentation = prediction.confidences.best.map(p => {
        return parseInt(p * 10, 10);
      });
    }

    let segmentationMasks = [];

    if (
      prediction &&
      prediction.classes &&
      prediction.classes.some(c => c.mask !== null && c.mask !== undefined)
    ) {
      segmentationMasks = prediction.classes.map(c => c.mask);

      boxes.forEach((b, index) => {
        let label = null;
        if (input.json.body.predictions[0].classes[index]) {
          label = input.json.body.predictions[0].classes[index].cat;
        }
        if (b !== null && typeof b !== "undefined") b.label = label;
      });
    }

    const separateSegmentation =
      (pixelSegmentation && pixelSegmentation.length > 0) ||
      segmentationMasks.length > 0;

    return (
      <Boundingbox
        className="boundingboxdisplay"
        image={input.content}
        boxes={boxes}
        selectedIndex={
          input.boxes && input.boxes.length > this.props.selectedBoxIndex
            ? this.props.selectedBoxIndex
            : -1
        }
        onSelected={this.props.onOver}
        pixelSegmentation={
          this.props.showSegmentation && pixelSegmentation
            ? pixelSegmentation
            : null
        }
        separateSegmentation={separateSegmentation}
        segmentationColors={segmentationColors}
        segmentationMasks={segmentationMasks}
        drawLabel={drawLabel}
        drawBox={drawBox}
      />
    );
  }
}