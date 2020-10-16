import { clamp, rnd, willMutate } from "../utils.js";
import {settings} from "../settings.js";
import {MutatableType} from "./MutatableType.js";

export class Point extends MutatableType<Point>
{
    public pointLen:number;
    public x:number;
    public y:number;
    private cpx1:number;
    private cpx2:number;
    private cpy1:number;
    private cpy2:number;

    public constructor(public maxWidth:number, public maxHeight:number)
    {
        super();
        this.pointLen = 2;
        this.x = rnd(0, this.maxWidth);
        this.y = rnd(0, this.maxHeight);
        this.cpx1 = this.cpx2 = this.cpy1 = this.cpy2 = 0;
    }

    public clone(): Point
    {
        let p = new Point(this.maxWidth, this.maxHeight);
        p.x = this.x;
        p.y = this.y;
        p.cpx1 = this.cpx1;
        p.cpy1 = this.cpy1;
        p.cpx2 = this.cpx2;
        p.cpy2 = this.cpy2;
        p.pointLen = this.pointLen;
        return p;
    }

    public getCoordinates(): number[]
    {
        if (this.pointLen == 6) {
            return [this.cpx1, this.cpy1, this.cpx2, this.cpy2, this.x, this.y];
        }
        if (this.pointLen == 4) {
            return [this.cpx1, this.cpy1, this.x, this.y];
        }
        return [this.x, this.y];
    }

    public mutate(drawing): void
    {
        if (willMutate(settings.activePointTypeMutationRate)) {
            let newLen = [2, 4, 6][rnd(0, 2)];
            if (newLen != this.pointLen) {
                this.pointLen = newLen;
                drawing.isDirty(true);
            }
        }
        if (willMutate(settings.activeMovePointMaxMutationRate)) {
            this.x = rnd(0, this.maxWidth);
            this.y = rnd(0, this.maxHeight);
            if (this.pointLen > 2) {
                this.cpx1 = rnd(0, this.maxWidth);
                this.cpy1 = rnd(0, this.maxHeight);
                if (this.pointLen > 4) {
                    this.cpx2 = rnd(0, this.maxWidth);
                    this.cpy2 = rnd(0, this.maxHeight);
                }
            }
            drawing.isDirty(true);
        }
        if (willMutate(settings.activeMovePointMidMutationRate)) {
            this.x = clamp(0, this.x + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid), this.maxWidth);
            this.y = clamp(0, this.y + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid), this.maxHeight);
            if (this.pointLen > 2) {
                this.cpx1 = clamp(0, this.cpx1 + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid), this.maxWidth);
                this.cpy1 = clamp(0, this.cpy1 + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid), this.maxHeight);
                if (this.pointLen > 4) {
                    this.cpx2 = clamp(0, this.cpx2 + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid), this.maxWidth);
                    this.cpy2 = clamp(0, this.cpy2 + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid), this.maxHeight);
                }
            }
            drawing.isDirty(true);
        }
        if (willMutate(settings.activeMovePointMinMutationRate)) {
            this.x = clamp(0, this.x + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin), this.maxWidth);
            this.y = clamp(0, this.y + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin), this.maxHeight);
            if (this.pointLen > 2) {
                this.cpx1 = clamp(0, this.cpx1 + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin), this.maxWidth);
                this.cpy1 = clamp(0, this.cpy1 + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin), this.maxHeight);
                if (this.pointLen > 4) {
                    this.cpx2 = clamp(0, this.cpx2 + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin), this.maxWidth);
                    this.cpy2 = clamp(0, this.cpy2 + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin), this.maxHeight);
                }
            }
            drawing.isDirty(true);
        }
    }
}
