import {rnd, willMutate} from "../utils.js";
import {settings} from "../settings.js";
import {MutatableType} from "./MutatableType.js";

export class Colour extends MutatableType<Colour>
{
    public r:number;
    public g:number;
    public b:number;
    public a:number;

    public constructor()
    {
        super();
        this.r = rnd(settings.activeRedRangeMin, settings.activeRedRangeMax);
        this.g = rnd(settings.activeGreenRangeMin, settings.activeGreenRangeMax);
        this.b = rnd(settings.activeBlueRangeMin, settings.activeBlueRangeMax);
        this.a = rnd(settings.activeAlphaRangeMin, settings.activeAlphaRangeMax) / 100;
    }

    public clone(): Colour
    {
        let c = new Colour();
        c.r = this.r;
        c.g = this.g;
        c.b = this.b;
        c.a = this.a;
        return c;
    }

    public getRgbaString(): string
    {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    public mutate(drawing): void
    {
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
