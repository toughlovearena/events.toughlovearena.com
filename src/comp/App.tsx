import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchEvents, EventData } from '../events';
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

export function App() {
  const [events, setEvents] = useState(undefined as EventData[] | undefined);

  const getEvents = useCallback(async () => {
    const { upcoming } = await fetchEvents();
    setEvents(upcoming);
  }, []);

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
