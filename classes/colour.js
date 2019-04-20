import { rnd, willMutate } from '../utils.js';
import {settings} from "../settings.js";

export class Colour
{
    constructor() {
        this.r = rnd(settings.activeRedRangeMin, settings.activeRedRangeMax);
        this.g = rnd(settings.activeGreenRangeMin, settings.activeGreenRangeMax);
        this.b = rnd(settings.activeBlueRangeMin, settings.activeBlueRangeMax);
        this.a = rnd(settings.activeAlphaRangeMin, settings.activeAlphaRangeMax) / 100;
    }

    clone() {
        let c = new Colour();
        c.r = this.r;
        c.g = this.g;
        c.b = this.b;
        c.a = this.a;
        return c;
    }

    getRgbaString() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    mutate(drawing) {
        if (willMutate(settings.activeRedMutationRate)) {
            this.r = rnd(settings.activeRedRangeMin, settings.activeRedRangeMax);
            drawing.isDirty(true);
        }
        if (willMutate(settings.activeGreenMutationRate)) {
            this.g = rnd(settings.activeGreenRangeMin, settings.activeGreenRangeMax);
            drawing.isDirty(true);
        }
        if (willMutate(settings.activeBlueMutationRate)) {
            this.b = rnd(settings.activeBlueRangeMin, settings.activeBlueRangeMax);
            drawing.isDirty(true);
        }
        if (willMutate(settings.activeAlphaMutationRate)) {
            this.a = rnd(settings.activeAlphaRangeMin, settings.activeAlphaRangeMax) / 100;
            drawing.isDirty(true);
        }
    }
}
