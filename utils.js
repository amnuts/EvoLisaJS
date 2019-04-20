import {settings} from "./settings.js";

function rnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getColourMatrix(ctx) {
    let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
    let colourMatrix = [];
    for (let i = 0, dx = 0; dx < imgData.length; i++, dx = i << 2) {
        colourMatrix.push({
            r: imgData[dx],
            g: imgData[dx+1],
            b: imgData[dx+2],
            a: imgData[dx+3]/255
        });
    }
    return colourMatrix;
}

function willMutate(mutationRate) {
    return (rnd(0, mutationRate) == 1);
}

function fitnessLevel(ctx, origColours) {
    let error = 0;
    let matrix = getColourMatrix(ctx);
    for (let i = 0; i < matrix.length; i++) {
        let r = matrix[i].r - origColours[i].r;
        let g = matrix[i].g - origColours[i].g;
        let b = matrix[i].b - origColours[i].b;
        error += (r*r + g*g + b*b);
    }
    return error;
}

function draw(ctx, drawing) {
    ctx.fillStyle = settings.backgroundFillColour;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < drawing.polygons.length; i++) {
        ctx.fillPolygon(drawing.polygons[i].getPoints(), drawing.polygons[i].colour.getRgbaString());
    }
}

export {
    rnd, draw, getColourMatrix, willMutate, fitnessLevel
}
