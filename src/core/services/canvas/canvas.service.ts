import { ShadowOption } from "../../data-model/shadow-option";

export class CanvasService {

    public getRenderingContext2D(id: string): CanvasRenderingContext2D {
        const canvas = document.getElementById(id) as HTMLCanvasElement;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        return canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public setShadowOptions(context: CanvasRenderingContext2D, option: ShadowOption | null): CanvasRenderingContext2D {
        context.shadowColor = option?.color ?? context.shadowColor;
        context.shadowOffsetX = option?.offsetX ?? context.shadowOffsetX;
        context.shadowOffsetY = option?.offsetY ?? context.shadowOffsetY;
        context.shadowBlur = option?.blur ?? context.shadowBlur;

        return context;
    }
}
