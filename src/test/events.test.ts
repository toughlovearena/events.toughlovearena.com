import fs from 'fs';
import { parseEvents } from "../events";

describe('events.ts', () => {
  test('parseEvents', () => {
    const buffer = fs.readFileSync('public/events.yaml');
    const eventsYaml = buffer.toString();
    const data = parseEvents(eventsYaml);
    expect(data.past.length).toBeGreaterThan(0);
    expect(data.all.length).toBeGreaterThan(0);
    expect(data.upcoming.length).toBe(data.all.length - data.past.length);
  });
});
