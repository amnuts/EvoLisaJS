import { settings } from './settings.js';
import { Drawing } from './drawing.js';
import { draw, fitnessLevel, getColourMatrix, cloneObject } from './utils.js';


let imgCanvas = document.getElementById('original');
let imgContext = imgCanvas.getContext('2d');

let gaCanvas = document.getElementById('generated');
let gaContext = gaCanvas.getContext('2d');

let fitnessCanvas = document.getElementById('fitness');
let fitnessContext = fitnessCanvas.getContext('2d');

let info = document.getElementById('data');
let infoData = {
    generation: 0,
    fitness: Number.MAX_VALUE,
    evolved: 0
};

let imgOrig = new Image();
imgOrig.onload = function() {
    imgCanvas.width = gaCanvas.width = fitnessCanvas.width = this.naturalWidth/2;
    imgCanvas.height = gaCanvas.height = fitnessCanvas.height = this.naturalHeight/2;
    imgContext.drawImage(imgOrig, 0, 0, imgCanvas.width, imgCanvas.height);

    let origColours = getColourMatrix(imgContext);
    let drawing = new Drawing(imgCanvas.width, imgCanvas.height);

    info.innerHTML = `<pre>${JSON.stringify(infoData, null, 2)}</pre>`;
    infoData.generation++;
    draw(gaContext, drawing);

    let looper = setInterval(function(){
        let drawingClone = drawing.clone();
        drawingClone.mutate();
        draw(fitnessContext, drawingClone);
        let newFitnessLevel = fitnessLevel(fitnessContext, origColours);
        if (newFitnessLevel < infoData.fitness) {
            infoData.fitness = newFitnessLevel;
            drawing = drawingClone;
            infoData.evolved++;
            drawing.isDirty(true);
        }
        if (drawing.dirty) {
            draw(gaContext, drawing);
            drawing.isDirty(false);
        }
        info.innerHTML = `<pre>${JSON.stringify(infoData, null, 2)}</pre>`;
        infoData.generation++;

    }, settings.tickSpeed)
};
imgOrig.src = imgCanvas.getAttribute('data-img');
