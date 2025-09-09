export const capitalizeFirstLetters = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const convertTo24HourFormat = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  const [hStr, mStr] = time.split(':');
  let hours = Number(hStr);
  const minutes = Number(mStr);

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
