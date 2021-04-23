import YAML from 'yaml';


export enum EventType {
  Stream = 'stream',
  Tournament = 'tournament',
  Meetup = 'meetup',
};
const EventColor = {
  [EventType.Stream]: '#9747ff',
  [EventType.Tournament]: '#ff870f',
  [EventType.Meetup]: '#ed1c40',
};
export function getEventColor(type: EventType | undefined) {
  return (type && EventColor[type]) ?? '#707070';
}

export interface EventData {
  title: string;
  description: string;
  type: EventType;

  image?: string;
  twitch?: string;
  challonge?: string;

  start: Date;
  end: Date;
}

export interface AllEvents {
  upcoming: EventData[];
  all: EventData[];
}

interface EventWhenDTO {
  date: string;
  time: string;
  hours: number;
}
interface EventDTO {
  title: string;
  description: string;
  type: EventType;

  image?: string;
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
  return sortArrayOfObjects(events.concat(), e => e.start.getTime());
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
    const start = dateWithTimeZone('America/New_York', yyyy, mm, dd, hour, min, 0);
    const end = new Date(start.getTime() + (w.hours * 60 * 60 * 1000));
    return {
      title: dto.title,
      type: dto.type,
      description: dto.description,

      image: dto.image,
      twitch: dto.twitch,
      challonge: dto.challonge,

      start,
      end,
    };
  });
}

export async function fetchEvents(): Promise<AllEvents> {

  const resp = await fetch('events.yaml');
  const text = await resp.text();
  const data = await YAML.parse(text);

  const dtos = data.events as EventDTO[];
  const all = sortEvents(dtos.map(convertEventDTO).flat());

  const now = new Date();
  const upcoming = all.filter(e => e.end > now);

  const ret: AllEvents = {
    upcoming,
    all,
  };
  console.log(ret);
  return ret;
}
