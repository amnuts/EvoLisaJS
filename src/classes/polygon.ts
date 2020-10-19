import {clamp, rnd, willMutate} from "../utils.js";
import {settings} from "../settings.js";
import {Point} from "./point.js";
import {Colour} from "./colour.js";
import {Blur} from "./blur.js";
import {MutatableType} from "./MutatableType.js";
import {Drawing} from "./drawing.js";

export class Polygon extends MutatableType<Polygon>
{
    public blur:Blur;
    public colour:Colour;
    public points:Point[];

    constructor(protected maxWidth:number, protected maxHeight:number)
    {
        super();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.colour = new Colour();
        this.blur = new Blur();
        this.points = [];

        let limitPointDistance = willMutate(settings.activePolygonPointDistanceMutationRate);

        for (let i = 0; i < settings.activePointsPerPolygonMin; i++) {
            let p = new Point(this.maxWidth, this.maxHeight);
            if (!limitPointDistance || i === 0) {
                p.x = clamp(0, rnd(0, this.maxWidth) + rnd(-3, 3), this.maxWidth);
                p.y = clamp(0, rnd(0, this.maxHeight) + rnd(-3, 3), this.maxHeight);
            } else {
                let lastX = this.points[i - 1].x;
                let lastY = this.points[i - 1].y;
                let xRandOffset = rnd(settings.activePolygonPointDistanceMin, settings.activePolygonPointDistanceMax);
                let yRandOffset = rnd(settings.activePolygonPointDistanceMin, settings.activePolygonPointDistanceMax);
                p.x = clamp(0, lastX + rnd(-xRandOffset, xRandOffset), this.maxWidth);
                p.y = clamp(0, lastY + rnd(-yRandOffset, yRandOffset), this.maxHeight);
            }
            this.points.push(p);
        }
    }

    public clone(): Polygon
    {
        let p = new Polygon(this.maxWidth, this.maxHeight);
        p.points = [];
        for (let i = 0; i < this.points.length; i++) {
            p.points.push(this.points[i].clone());
        }
        p.colour = this.colour.clone();
        return p;
    }

    public mutate(drawing): void
    {
        if (willMutate(settings.activeAddPointMutationRate)) {
            this.addPoint(drawing);
        }
        if (willMutate(settings.activeRemovePointMutationRate)) {
            this.removePoint(drawing);
        }

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].mutate(drawing);
        }

        this.colour.mutate(drawing);
        this.blur.mutate(drawing);
    }

    public getPoints(): number[][]
    {
        let points = [];
        for (let i = 0; i < this.points.length; i++) {
            points.push(this.points[i].getCoordinates());
        }
        return points;
    }

    public addPoint(drawing:Drawing): void
    {
        if (this.points.length < settings.activePointsPerPolygonMax) {
            if (drawing.pointCount() < settings.activePointsMax) {
                let p = new Point(this.maxWidth, this.maxHeight);
                let index = rnd(1, this.points.length - 1);
                p.x = (this.points[index - 1].x + this.points[index].x)/2;
                p.y = (this.points[index - 1].y + this.points[index].y)/2;
                this.points.splice(index, 0, p);
                drawing.isDirty(true);
            }
        }
    }

    public removePoint(drawing:Drawing): void
    {
        if (this.points.length > settings.activePointsPerPolygonMin) {
            if (drawing.pointCount() > settings.activePointsMin) {
                this.points.slice(rnd(0, this.points.length - 1), 1);
                drawing.isDirty(true);
            }
        }
    }
}
