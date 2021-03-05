import { icons } from './icons-map';

export class GenericUtility {

    public static replaceAt<T>(elements: T[], element: T, index: number): T[] {
        if (index < 0 || index > elements.length - 1) {
            throw new Error('Index out of bounds.');
        }

        return [...elements.slice(0, index), element, ...elements.slice(index + 1)];
    }

    public static removeAt<T>(elements: T[], index: number): T[] {
        if (index < 0 || index > elements.length - 1) {
            throw new Error('Index out of bounds.');
        }

        return [...elements.slice(0, index), ...elements.slice(index + 1)];
    }

    public static getLeadingZeros(value: number, maxDigits = 3): string {
        const digits = String(value).length;

        return '0'.repeat(Math.max(0, maxDigits - digits));
    }

    public static getIconNames(includeReserved = true): string[] {
        return Array.from(icons).filter(_ => includeReserved || !_[1].isReserved).map(_ => _[0]);
    }

    public static getIcon(name: string): any {
        return icons.get(name)?.icon ?? null;
    }

    public static getPriorityColor(priority: number, alpha = 1): string {
        if (!priority) {
            return `rgba(40, 212, 57, ${alpha})`;
        }

        return `rgba(${priority === 1 ? '238, 171, 70' : '231, 72, 72'}, ${alpha})`;
    }
}
