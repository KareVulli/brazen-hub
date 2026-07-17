export function useFormatDuration() {
  const dayjs = useDayjs();

  return function formatDuration(millis: number) {
    if (millis >= 60 * 1000) {
      return `${Math.floor(dayjs.duration(millis).asMinutes())} minutes ${Math.floor(dayjs.duration(millis).seconds())} seconds`;
    } else {
      return `${Math.floor(dayjs.duration(millis).asSeconds())} seconds`;
    }
  };
}
