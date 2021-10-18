import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react";

const GanCanvas = observer((props) => {

    const canvasRef = useRef(null)
    const ganCanvasRef = useRef(null)

    const drawImage = (ctx) => {

        const background = new Image();
        background.src = props.input.content;

        background.onload = (() => {
            ctx.drawImage(background, 0, 0);
        })

    }

    const drawPixels = (ctx) => {

        const { input } = props;
        let layer = ctx.createImageData(
            canvasRef.current.width,
            canvasRef.current.height
        );

        if (
            input &&
                input.json &&
                input.json.body &&
                input.json.body.predictions &&
                input.json.body.predictions[0] &&
                input.json.body.predictions[0].vals &&
                input.json.body.predictions[0].vals.length > 0
        ) {
            const { vals } = input.json.body.predictions[0];

            // size of a single color layer
            const channelLength = parseInt(vals.length / 3)

            for(
                let rgbaIndex = 0, index = 0;
                index < channelLength;
                rgbaIndex += 4, index++
            ) {

                const redIndex = index
                const greenIndex = channelLength + index
                const blueIndex = channelLength * 2 + index

                const redPixelColor = parseInt((vals[redIndex] + 1) * 127.5);
                const greenPixelColor = parseInt((vals[greenIndex] + 1) * 127.5);
                const bluePixelColor = parseInt((vals[blueIndex] + 1) * 127.5);

                layer.data[rgbaIndex]  = redPixelColor;
                layer.data[rgbaIndex+1] = greenPixelColor;
                layer.data[rgbaIndex+2] = bluePixelColor;
                layer.data[rgbaIndex+3] = 255;
            }
        }

        ctx.putImageData(layer, 0, 0);

    }

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const ganCanvas = ganCanvasRef.current
        const ganContext = ganCanvas.getContext('2d')

        //Our draw came here
        const render = () => {
            drawImage(context)
            drawPixels(ganContext)
        }
        render()

        return () => {
        }

    })

    return (
        <>
          <div className="col">
            <canvas
              ref={canvasRef}
              width="360"
              height="360"
              {...props}
            />
          </div>
          <div className="col">
            <canvas
              ref={ganCanvasRef}
              width="360"
              height="360"
              {...props}
            />
          </div>
        </>
    )

});

export default GanCanvas;
