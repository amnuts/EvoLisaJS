import { rnd, willMutate } from './utils.js';
import {settings} from "./settings.js";

export class Point
{
    constructor(maxWidth, maxHeight) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;

        this.x = rnd(0, this.maxWidth);
        this.y = rnd(0, this.maxHeight);
    }

    clone() {
        let p = new Point(this.maxWidth, this.maxHeight);
        p.x = this.x;
        p.y = this.y;
        return p;
    }

    mutate(drawing) {
        if (willMutate(settings.activeMovePointMaxMutationRate)) {
            this.x = rnd(0, this.maxWidth);
            this.y = rnd(0, this.maxHeight);
            drawing.isDirty(true);
        }
        if (willMutate(settings.activeMovePointMidMutationRate)) {
            this.x = Math.min(Math.max(0, this.x + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid)), this.maxWidth);
            this.y = Math.min(Math.max(0, this.y + rnd(-settings.activeMovePointRangeMid, settings.activeMovePointRangeMid)), this.maxHeight);
            drawing.isDirty(true);
        }
        if (willMutate(settings.activeMovePointMinMutationRate)) {
            this.x = Math.min(Math.max(0, this.x + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin)), this.maxWidth);
            this.y = Math.min(Math.max(0, this.y + rnd(-settings.activeMovePointRangeMin, settings.activeMovePointRangeMin)), this.maxHeight);
            drawing.isDirty(true);
        }
    }
};
