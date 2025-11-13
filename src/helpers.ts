export const capitalizeFirstLetters = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const convertTo24HourFormat = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  let [hours] = time.split(':').map(Number);
  const [, minutes] = time.split(':').map(Number);

  if (modifier.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  } else if (modifier.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

export const convertToISODate = (dateString: string): string => {
  if (!dateString) return '';

  // If already in YYYY-MM-DD format, convert to ISO
  const date = new Date(dateString + 'T00:00:00.000Z');
  return date.toISOString();
};

export function formatNthDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) {
    suffix = 'st';
  } else if (day === 2 || day === 22) {
    suffix = 'nd';
  } else if (day === 3 || day === 23) {
    suffix = 'rd';
  }

  return `${day}${suffix} ${month} ${year}`;
}
