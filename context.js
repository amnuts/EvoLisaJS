CanvasRenderingContext2D.prototype.fillPolygon = function(pointsArray, fillColor, strokeColor) {
    if (pointsArray.length <= 0) {
        return;
    }
    this.beginPath();
    this.moveTo(pointsArray[0][0], pointsArray[0][1]);
    for (let i = 0; i < pointsArray.length; i++) {
        this.lineTo(pointsArray[i][0], pointsArray[i][1]);
    }
    if (strokeColor !== null && strokeColor !== undefined)
        this.strokeStyle = strokeColor;

    if (fillColor != null && fillColor != undefined) {
        this.fillStyle = fillColor;
        this.fill();
    }
    this.closePath();
};
