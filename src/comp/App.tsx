import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchEvents, EventData, EventType, getEventColor } from '../events';
import { Event } from './Event';

const Column = styled.div`
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid black;
  border-top-width: 0;
  border-bottom-width: 0;
  box-sizing: border-box;
  background-color: white;


  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const Header = styled.div`
  margin: 1em;
`;
const HeaderTitle = styled.div`
  font-size: 3em;
  margin-bottom: 0.2em;
`;

const Body = styled.div`
`;
const BodyTitle = styled.div`
  font-size: 2em;
  margin-bottom: 0.2em;
`;

const EventKey = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const EventLabel = styled.div<{ color: string, selected: boolean, }>`
  cursor: pointer;
  margin: 0.3em;
  padding: 0.5em;
  box-sizing: border-box;
  width: 7em;
  ${props => `
    border: 0.5em solid ${props.color};
    border-radius: ${props.selected ? '0' : '1'}em;
    ${props.selected ? `
      background-color: #ffa;
    ` : ``}
  `}

`;

function FilterLabel(props: {
  filter: EventType | undefined,
  setFilter(eventType: EventType | undefined): void;
  eventType: EventType | undefined,
  label: string,
}) {
  const {
    filter,
    setFilter,
    eventType,
    label,
  } = props;
  return (
    <EventLabel
      selected={filter === eventType}
      color={eventType ? getEventColor(eventType) : 'black'}
      onClick={() => setFilter(eventType)}
    >{label}</EventLabel>
  )
}

export function App() {
  const [filter, setFilter] = useState(undefined as EventType | undefined);
  const [events, setEvents] = useState(undefined as EventData[] | undefined);

  const getEvents = useCallback(async () => {
    const { upcoming } = await fetchEvents();
    const filtered = filter ? upcoming.filter(e => e.type === filter) : upcoming;
    setEvents(filtered);
  }, [filter]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <Column>
      <Header>
        <HeaderTitle>Tough Love Arena Events</HeaderTitle>
        <div>
          Want to submit your own event? Check the <a href="https://github.com/toughlovearena/events">GitHub</a> for instructions
        </div>
      </Header>
      <Body>
        <BodyTitle>
          Upcoming Events
        </BodyTitle>
        <EventKey>
          <FilterLabel filter={filter} setFilter={setFilter} eventType={undefined} label='All'></FilterLabel>
          <FilterLabel filter={filter} setFilter={setFilter} eventType={EventType.Tournament} label='Tournament'></FilterLabel>
          <FilterLabel filter={filter} setFilter={setFilter} eventType={EventType.Stream} label='Stream'></FilterLabel>
          <FilterLabel filter={filter} setFilter={setFilter} eventType={EventType.Meetup} label='Meetup'></FilterLabel>
        </EventKey>
        {events ? (
          <div>
            {events.map((e, ei) => (
              <Event key={ei} event={e} />
            ))}
          </div>
        ) : (
          <div>
            loading...
          </div>
        )}
      </Body>
    </Column>
  );
}
