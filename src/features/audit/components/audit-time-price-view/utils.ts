export function getTimePriceNote(hours: number) {
  if (hours < 0.5) {
    return 'Less than half an hour of work';
  }

  if (hours < 1) {
    return 'Around half an hour of work';
  }

  if (hours < 1.5) {
    return 'About an hour of work';
  }

  if (hours < 4) {
    return 'A small chunk of your workday';
  }

  if (hours < 8) {
    return 'More than half your workday';
  }

  if (hours < 24) {
    const days = Math.round((hours / 8) * 2) / 2; // round to nearest 0.5h

    return `About ${days} workday${days > 1 ? 's' : ''}`;
  }

  const days = Math.floor(hours / 8);

  return `Over ${days} workday${days > 1 ? 's' : ''}`;
}

export function getTimePrice(hours: number) {
  const inMinutes = Math.round(hours * 60);

  if (inMinutes < 60) {
    return `${inMinutes} min`;
  }

  if (hours < 24) {
    const fullHours = Math.floor(hours);
    const minutesRemainder = Math.round((hours - fullHours) * 60);

    return `${fullHours} hour${fullHours > 1 ? 's' : ''}${minutesRemainder > 0 ? ` ${minutesRemainder} min` : ''}`;
  }

  const roundedHours = Math.round(hours * 2) / 2; // round to nearest 0.5h

  return `${roundedHours} hour${roundedHours > 1 ? 's' : ''}`;
}
