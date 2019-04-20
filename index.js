import { settings } from './settings.js';
import { Drawing } from './drawing.js';
import { draw, fitnessLevel, getColourMatrix } from './utils.js';

let looper, drawing, origColours, infoData;
let imgCanvas = document.getElementById('original');
let imgContext = imgCanvas.getContext('2d');
let gaCanvas = document.getElementById('generated');
let gaContext = gaCanvas.getContext('2d');
let fitnessCanvas = document.getElementById('fitness');
let fitnessContext = fitnessCanvas.getContext('2d');
let info = document.getElementById('data');
let resume = document.getElementById('resume');

document.getElementById('start').addEventListener('click', function() {
    if (looper) {
        stopLoop('stopped');
        resume.disabled = false;
    } else {
        infoData = {
            generation: 0,
            fitness: Number.MAX_VALUE,
            evolved: 0,
            state: 'started'
        };
        resume.disabled = true;
        load();
    }
});

resume.addEventListener('click', function() {
    infoData.state = 'started';
    looper = setInterval(evolve, settings.tickSpeed);
    this.disabled = true;
});

function load() {
    let imgOrig = new Image();
    imgOrig.onload = function () {
        imgCanvas.width = gaCanvas.width = fitnessCanvas.width = this.naturalWidth / 2;
        imgCanvas.height = gaCanvas.height = fitnessCanvas.height = this.naturalHeight / 2;
        imgContext.drawImage(imgOrig, 0, 0, imgCanvas.width, imgCanvas.height);

        origColours = getColourMatrix(imgContext);
        drawing = new Drawing(imgCanvas.width, imgCanvas.height);

        refreshData();
        infoData.generation++;
        draw(gaContext, drawing);

        looper = setInterval(evolve, settings.tickSpeed);
    };
    imgOrig.src = imgCanvas.getAttribute('data-img');
}

function evolve() {
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
    refreshData();
    infoData.generation++;
}

function refreshData() {
    info.innerHTML = `<pre>${JSON.stringify(infoData, null, 2)}</pre>`;
}

function stopLoop(reason) {
    clearInterval(looper);
    looper = null;
    infoData.state = reason;
    refreshData();
}
