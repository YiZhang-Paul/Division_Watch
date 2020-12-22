import { ShadowOption } from "../../data-model/shadow-option";

export class CanvasService {

    public getRenderingContext2D(id: string): CanvasRenderingContext2D {
        const canvas = document.getElementById(id) as HTMLCanvasElement;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        return canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public setShadowOptions(context: CanvasRenderingContext2D, option: ShadowOption | null): CanvasRenderingContext2D {
        context.shadowColor = option?.color ?? 'rgba(0, 0, 0, 0)';
        context.shadowOffsetX = option?.offsetX ?? 0;
        context.shadowOffsetY = option?.offsetY ?? 0;
        context.shadowBlur = option?.blur ?? 0;

        return context;
    }

    public rotate(context: CanvasRenderingContext2D, x: number, y: number, angle: number): CanvasRenderingContext2D {
        context.translate(x, y);
        context.rotate(angle * Math.PI / 180);
        context.translate(-x, -y);

        return context;
    }
}
