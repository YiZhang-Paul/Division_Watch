import { icons } from './icons-map';

export class GenericUtility {

    public static replaceAt<T>(elements: T[], element: T, index: number): T[] {
        if (index < 0 || index > elements.length - 1) {
            throw new Error('Index out of bounds.');
        }

        return [...elements.slice(0, index), element, ...elements.slice(index + 1)];
    }

    public static getIconNames(): string[] {
        return Array.from(icons).map(_ => _[0]);
    }

    public static getIcon(name: string): any {
        return icons.get(name) ?? null;
    }
}
