import YAML from 'yaml';

export interface EventData {
  title: string;

  description?: string;
  twitch?: string;
  challonge?: string;

  datetime: Date;
}

export interface AllEvents {
  upcoming: EventData[];
  all: EventData[];
}

interface EventWhenDTO {
  date: string;
  time: string;
}
interface EventDTO {
  title: string;

  description?: string;
  twitch?: string;
  challonge?: string;

  when: EventWhenDTO[];
}

function compare(a: string | number, b: string | number) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}
function sortArrayOfObjects<T>(arr: T[], cb: ((obj: T) => string | number)): T[] {
  arr.sort((a, b) => compare(cb(a), cb(b)));
  return arr;
}
function sortEvents(events: EventData[]): EventData[] {
  return sortArrayOfObjects(events.concat(), e => e.datetime.getTime());
}

// https://stackoverflow.com/a/57842203
function dateWithTimeZone(timeZone: string, year: number, month: number, day: number, hour: number, minute: number, second: number) {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
  const offset = utcDate.getTime() - tzDate.getTime();
  date.setTime(date.getTime() + offset);
  return date;
};
function convertEventDTO(dto: EventDTO): EventData[] {
  return dto.when.map(w => {
    const [yyyy, mm, dd] = w.date.split('/').map(s => parseFloat(s));
    const [hour, min] = w.time.split(':').map(s => parseFloat(s));
    const date = dateWithTimeZone('America/New_York', yyyy, mm, dd, hour, min, 0);
    return {
      title: dto.title,
      description: dto.description,
      twitch: dto.twitch,
      challonge: dto.challonge,
      datetime: date,
    };
  });
}

export async function fetchEvents(): Promise<AllEvents> {
  const buffer = 6 * 60 * 60 * 1000; /// 6 hours
  const cutoff = new Date(new Date().getTime() - buffer);

  const resp = await fetch('events.yaml');
  const text = await resp.text();
  const data = await YAML.parse(text);

  const dtos = data.events as EventDTO[];
  const all = sortEvents(dtos.map(convertEventDTO).flat());
  const upcoming = all.filter(e => e.datetime > cutoff);
  const ret: AllEvents = {
    upcoming,
    all,
  };

  console.log(ret);
  return ret;
}
