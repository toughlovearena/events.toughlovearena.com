import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { EventData, EventType, getEventColor, EventManager } from '../events';
import { Event } from './Event';

const Column = styled.div`
  max-width: 620px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1em 2em;
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
const HeaderLogo = styled.img`
  width: 95%;
  height: auto;
`;
const HeaderTitle = styled.div`
  font-size: 1.5em;
  margin-bottom: 0.2em;
`;

const EventKey = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const EventLabel = styled.div<{ color: string, selected: boolean, stretch?: boolean, }>`
  cursor: pointer;
  margin: 0.3em;
  padding: 0.5em;
  box-sizing: border-box;
  border-radius: 1em;
  ${props => `
    width: ${props.stretch ? '20em' : '7em'};
    border: 0.2em solid ${props.color};
    ${props.selected ? `
      border-width: 0.4em;
    ` : ``}
  `}
`;
const NoEvents = styled.h2`
  font-style: italic;
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
      color={getEventColor(eventType)}
      onClick={() => setFilter(eventType)}
    >{label}</EventLabel>
  )
}

export function App() {
  const [showPast, setShowPast] = useState(false);
  const [filter, setFilter] = useState(undefined as EventType | undefined);
  const [events, setEvents] = useState(undefined as EventData[] | undefined);

  const getEvents = useCallback(async () => {
    const { past, upcoming } = await new EventManager().fetchEvents();
    const toFilter = showPast ? past : upcoming;
    const filtered = filter ? toFilter.filter(e => e.type === filter) : toFilter;
    setEvents(filtered);
  }, [showPast, filter]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <Column>
      <Header>
        <HeaderLogo src='logo.png' />
        <HeaderTitle>Upcoming Tough Love Arena Events</HeaderTitle>
        <div>
          All dates and times are displayed in your local timezone.
        </div>
        <div>
          Want to submit your own event? Check the <a href="https://github.com/toughlovearena/events.toughlovearena.com">GitHub</a> for instructions.
        </div>
      </Header>
      <EventKey>
        <FilterLabel filter={filter} setFilter={setFilter} eventType={undefined} label='All'></FilterLabel>
        <FilterLabel filter={filter} setFilter={setFilter} eventType={EventType.Tournament} label='Tournament'></FilterLabel>
        <FilterLabel filter={filter} setFilter={setFilter} eventType={EventType.Stream} label='Stream'></FilterLabel>
        <FilterLabel filter={filter} setFilter={setFilter} eventType={EventType.Meetup} label='Offline'></FilterLabel>
      </EventKey>
      <EventKey>
        <EventLabel
          stretch={true}
          selected={false}
          color={'seagreen'}
          onClick={() => setShowPast(!showPast)}>
          Switch to {showPast ? 'Upcoming' : 'Past'} Events
        </EventLabel>
      </EventKey>
      {events ? (
        events.length ? (
          <div>
            {events.map((e, ei) => (
              <Event key={ei} event={e} />
            ))}
          </div>
        ) : (
          <div>
            <NoEvents>
              no events found
            </NoEvents>
          </div>
        )
      ) : (
        <div>
          <NoEvents>
            loading...
          </NoEvents>
        </div>
      )}
    </Column>
  );
}
