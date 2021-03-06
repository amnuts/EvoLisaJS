import {rnd, willMutate} from "../utils.js";
import {settings} from "../settings.js";
import {Polygon} from "./polygon.js";

export class Drawing
{
    public polygons:Polygon[];
    public dirty:boolean;

    public constructor(public maxWidth:number, public maxHeight:number)
    {
        this.polygons = [];
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.isDirty(false);

        for (let i = 0; i < settings.activePolygonsMin; i++) {
            this.polygons.splice(rnd(0, this.polygons.length - 1), 0, new Polygon(this.maxWidth, this.maxHeight));
            this.isDirty(true);
        }
    }

    public isDirty(which:boolean): void
    {
        this.dirty = which;
    }

    public clone(): Drawing
    {
        let d = new Drawing(this.maxWidth, this.maxHeight);
        d.polygons = [];
        for (let i = 0; i < this.polygons.length; i++) {
            d.polygons.push(this.polygons[i].clone());
        }
        return d;
    }

    public pointCount(): number
    {
        let total = 0;
        for (let i = 0; i < this.polygons.length; i++) {
            total += this.polygons[i].points.length;
        }
        return total;
    }

    public mutate(): void
    {
        if (willMutate(settings.activeAddPolygonMutationRate)) {
            if (this.polygons.length < settings.activePolygonsMax) {
                this.polygons.splice(rnd(0, this.polygons.length - 1), 0, new Polygon(this.maxWidth, this.maxHeight));
                this.isDirty(true);
            }
        }
        if (willMutate(settings.activeRemovePolygonMutationRate)) {
            if (this.polygons.length > settings.activePolygonsMin){
                this.polygons.splice(rnd(0, this.polygons.length - 1), 1);
                this.isDirty(true);
            }
        }
        if (willMutate(settings.activeMovePolygonMutationRate)) {
            if (this.polygons.length >= 1) {
                let idx = rnd(0, this.polygons.length - 1);
                let poly = this.polygons[idx];
                this.polygons.splice(idx, 1);
                this.polygons.splice(rnd(0, this.polygons.length - 1), 0, poly);
                this.isDirty(true);
            }
        }

        for (let i = 0; i < this.polygons.length; i++) {
            this.polygons[i].mutate(this);
        }
    }
}
