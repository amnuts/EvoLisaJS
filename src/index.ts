import { settings } from './settings.js';
import { Drawing } from './classes/drawing.js';
import { draw, fitnessLevel, getColourMatrix } from './utils.js';

let loop, drawing, origColours, infoData;
let imgCanvas = document.getElementById('original');
let imgContext = imgCanvas.getContext('2d');
let gaCanvas = document.getElementById('generated');
let gaContext = gaCanvas.getContext('2d');
let fitnessCanvas = document.getElementById('fitness');
let fitnessContext = fitnessCanvas.getContext('2d');
let info = document.getElementById('data');
let resume = document.getElementById('resume');

document.getElementById('start').addEventListener('click', function() {
    if (loop) {
        stopLoop('stopped');
        resume.disabled = false;
    } else {
        infoData = {
            generation: 0,
            fitness: Number.MAX_VALUE,
            evolved: 0,
            state: 'started',
            polygons: 0,
            points: 0
        };
        resume.disabled = true;
        load();
    }
});

resume.addEventListener('click', function() {
    infoData.state = 'started';
    loop = setInterval(evolve, settings.tickSpeed);
    resume.disabled = true;
});

function load() {
    let imgOrig = new Image();
    imgOrig.onload = function () {
        imgCanvas.width = gaCanvas.width = fitnessCanvas.width = this.naturalWidth / 2;
        imgCanvas.height = gaCanvas.height = fitnessCanvas.height = this.naturalHeight / 2;
        imgContext.drawImage(imgOrig, 0, 0, imgCanvas.width, imgCanvas.height);

        origColours = getColourMatrix(imgContext);
        drawing = new Drawing(imgCanvas.width, imgCanvas.height);
        infoData.polygons = drawing.polygons.length;
        infoData.points = drawing.pointCount();

        refreshData();
        infoData.generation++;
        draw(gaContext, drawing);

        loop = setInterval(evolve, settings.tickSpeed);
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
        infoData.polygons = drawing.polygons.length;
        infoData.points = drawing.pointCount();
        drawing.isDirty(false);
    }
    refreshData();
    infoData.generation++;
}

function refreshData() {
    info.innerHTML = `<pre>${JSON.stringify(infoData, null, 2)}</pre>`;
}

function stopLoop(reason) {
    clearInterval(loop);
    loop = null;
    infoData.state = reason;
    refreshData();
}
