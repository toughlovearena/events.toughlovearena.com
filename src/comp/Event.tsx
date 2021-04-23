import React from 'react';
import styled from 'styled-components';
import * as calendarLink from "calendar-link";
import { EventData, EventType, getEventColor } from '../events';

const EventContainer = styled.div<{ type: EventType }>`
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  ${props => `
    border: 0.5em solid ${getEventColor(props.type)};
  `}

  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  & > * {
    margin: 0.5rem 0;
  }
`;

const EventTitle = styled.div`
  font-size: 1.5em;
  text-decoration: underline;
`;

const EventLinks = styled.div`
`;

const EventStart = styled.div`
  font-size: 1.3em;
`;

interface Link {
  name: string;
  url: string;
}

export function Event(props: { event: EventData }) {
  const { event } = props;

  const links: Link[] = [];
  let calEventDescription = event.description ? event.description + '\n\n' : '';
  if (event.challonge) {
    const url = 'https://challonge.com/' + event.challonge;
    links.push({
      name: 'challonge',
      url,
    });
    calEventDescription += `challonge: ${url} \n`;
  }
  if (event.twitch) {
    const url = 'https://twitch.tv/' + event.twitch;
    links.push({
      name: 'twitch',
      url,
    });
    calEventDescription += `twitch: ${url} \n`;
  }

  const calEvent: calendarLink.CalendarEvent = {
    title: event.title,
    description: calEventDescription,
    start: event.start,
    end: event.end,
  };
  return (
    <EventContainer type={event.type}>
      <EventTitle>
        {event.title}
      </EventTitle>
      {event.description && (
        <div>
          {event.description}
        </div>
      )}
      {links.length && (
        <EventLinks>
          links:&nbsp;
          {links.map((link, index) => (
            <span key={index} >
              {index > 0 && ' / '}
              <a href={link.url}>{link.name}</a>
            </span>
          ))}
        </EventLinks>
      )}
      <div>
        <EventStart>
          {event.start.toLocaleString()}
        </EventStart>
        <div>
          add to:&nbsp;
          <a rel="noreferrer" target="_blank" href={calendarLink.google(calEvent)}>gcal</a>
          &nbsp;/&nbsp;
          <a rel="noreferrer" target="_blank" href={calendarLink.ics(calEvent)}>ics</a>
          &nbsp;/&nbsp;
          <a rel="noreferrer" target="_blank" href={calendarLink.outlook(calEvent)}>outlook</a>
        </div>
      </div>
    </EventContainer>
  );
}
