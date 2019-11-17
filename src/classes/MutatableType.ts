import {Drawing} from "./drawing.js";

export abstract class MutatableType<T>
{
    public abstract clone(): T;
    public abstract mutate(drawing: Drawing): void;
}
