const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const months = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
];

export class TimeUtility {

    public static getDayOfWeek(index: number): string {
        return index < 0 || index > 6 ? '' : days[index];
    }

    public static getMonthName(index: number): string {
        return index < 0 || index > 11 ? '' : months[index];
    }

    public static prependZero(value: number): string {
        return `${value < 10 ? '0' : ''}${value}`;
    }
}
