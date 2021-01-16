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

    public static toShortDateString(raw: string): string {
        const [year, month, date] = raw.split('-').map(Number);
        const result = new Date(year, month - 1, date).toDateString();

        return result.replace(/^\S*\s/, '').replace(/(\d)\s(\d)/, '$1, $2');
    }

    public static toEstimationString(total: number, sessionDuration: number): string {
        const skulls = Math.floor(total / sessionDuration);
        const minutes = Math.ceil(total / 1000 / 60);
        const minuteText = `(${minutes} minute${minutes > 1 ? 's' : ''})`;

        if (skulls < 1) {
            return `~1 Skull ${minuteText}`;
        }

        return `${skulls} Skull${skulls > 1 ? 's' : ''} ${minuteText}`;
    }
}
