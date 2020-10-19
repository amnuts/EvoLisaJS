import {rnd, willMutate} from "../utils.js";
import {settings} from "../settings.js";
import {MutatableType} from "./MutatableType.js";

export class Blur extends MutatableType<Blur>
{
    public strength:number;

    public constructor()
    {
        super();
        this.strength = (willMutate(settings.activeBlurMutationRate)
            ? rnd(settings.activeBlurRangeMin, settings.activeBlurRangeMax)
            : 0
        );
    }

    public clone(): Blur
    {
        let c = new Blur();
        c.strength = this.strength;
        return c;
    }

    public getFilterString(): string
    {
        return `blur(${this.strength ? this.strength + `px` : 0})`;
    }

    public mutate(drawing): void
    {
        if (willMutate(settings.activeBlurMutationRate)) {
            this.strength = rnd(settings.activeBlurRangeMin, settings.activeBlurRangeMax);
            drawing.isDirty(true);
        }
    }
}
