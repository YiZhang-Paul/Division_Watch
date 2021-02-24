import { TaskItemOptions } from '../../data-model/task-item/task-item-options';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const months = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
];

export class TimeUtility {

    public static isLeapYear(year: number): boolean {
        return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    }

    public static getDayOfWeek(index: number): string {
        return index < 0 || index > 6 ? '' : days[index];
    }

    public static getMonthName(index: number): string {
        return index < 0 || index > 11 ? '' : months[index];
    }

    public static getDateSuffix(date: number): string {
        const lastDigit = String(date).slice(-1)[0];

        if (lastDigit === '1') {
            return 'st';
        }
        else if (lastDigit === '2') {
            return 'nd';
        }
        else if (lastDigit === '3') {
            return 'rd';
        }

        return 'th';
    }

    public static prependZero(value: number): string {
        return `${value < 10 ? '0' : ''}${value}`;
    }

    public static toShortDateString(raw: string): string {
        const [year, month, date] = raw.split('-').map(Number);
        const result = new Date(year, month - 1, date).toDateString();

        return result.replace(/^\S*\s/, '').replace(/(\d)\s(\d)/, '$1, $2');
    }

    public static toMinutes(milliseconds: number, decimal = 0): number {
        const modifier = Math.pow(10, decimal);

        return Math.round(milliseconds / 60 / 1000 * modifier) / modifier;
    }

    public static toEstimationString(total: number, options: TaskItemOptions): string {
        const { estimates, skullDuration } = options;
        const maxSkulls = estimates.length - 1;

        if (total < skullDuration) {
            return `~1 Skull (${Math.round(this.toMinutes(estimates[0]))} minutes)`;
        }

        const skulls = Math.min(Math.round(total / skullDuration), maxSkulls);
        const totalMinutes = Math.floor(skulls * this.toMinutes(skullDuration));
        const [minutes, hours] = [totalMinutes % 60, Math.floor(totalMinutes / 60)];
        const hourText = hours ? `${hours} hour${hours > 1 ? 's' : ''} ` : '';
        const minuteText = minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';

        return `${skulls} Skull${skulls > 1 ? 's' : ''} (${hourText}${minuteText})`;
    }
}
