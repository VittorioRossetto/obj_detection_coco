export const drawRect = (prediction, ctx) =>{
    //detections.forEach(prediction => {
    const [x, y, width, height] = prediction['bbox'];
    const text = prediction['class'];

    const color = 'green'
    ctx.strokeStyle = color
    ctx.font = '18px Arial'
    ctx.fillStyle = color

    ctx.beginPath()
    ctx.fillText(text, x, y)
    ctx.rect(x, y, width, height)
    ctx.stroke()
    //});
}

export const drawArea = (x, y, width, height, ctx) => {
    const color = 'yellow'
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.rect(x, y, width, height)
    ctx.stroke()

}