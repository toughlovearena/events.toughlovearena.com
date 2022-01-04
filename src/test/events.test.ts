import fs from 'fs';
import { EventManager } from "../events";

describe('events.ts', () => {
  const sut = new EventManager();

  test('parseYaml > organizeEvents', () => {
    const buffer = fs.readFileSync('public/data2021.yaml');
    const eventsYaml = buffer.toString();
    const data = sut._organizeEvents(sut._parseYaml(eventsYaml));
    expect(data.past.length).toBeGreaterThan(0);
    expect(data.all.length).toBeGreaterThan(0);
    expect(data.upcoming.length).toBe(data.all.length - data.past.length);
  });
});
