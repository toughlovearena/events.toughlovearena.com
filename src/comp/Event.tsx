import React from 'react';
import styled from 'styled-components';
import * as calendarLink from "calendar-link";
import { EventData, EventType, getEventColor } from '../events';

const EventContainer = styled.div<{ type: EventType }>`
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-radius: 1rem 0 1rem 1rem;
  ${props => `
    border: 0.5em solid ${getEventColor(props.type)};
  `}

  /* image */
  position: relative;
  background: none;
  z-index: 2;

  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const EventTitle = styled.div`
  font-size: 1.5em;
  text-decoration: underline;
  margin: 0.5rem 0;
`;

const EventImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: auto;
  height: 3.5rem;
  z-index: 1;
`;

const EventDescription = styled.div`
`;

const EventLinks = styled.div`
`;

const EventTime = styled.div`
  text-align: right;
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
    const url = event.challonge.includes('challonge.com') ? event.challonge : ('https://challonge.com/' + event.challonge);
    links.push({
      name: 'challonge',
      url,
    });
    calEventDescription += `${url}\n`;
  }
  if (event.matcherino) {
    const url = 'https://matcherino.com/tournaments/' + event.matcherino;
    links.push({
      name: 'matcherino',
      url,
    });
    calEventDescription += `${url}\n`;
  }
  if (event.twitch) {
    const url = 'https://twitch.tv/' + event.twitch;
    links.push({
      name: 'twitch',
      url,
    });
    calEventDescription += `${url}\n`;
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
      <EventDescription>
        {event.description}
      </EventDescription>
      {links.length && (
        <EventLinks>
          {links.map((link, index) => (
            <span key={index} >
              {index > 0 && ' / '}
              <a rel="noreferrer" target="_blank" href={link.url}>{link.name}</a>
            </span>
          ))}
        </EventLinks>
      )}
      <EventTime>
        <EventStart>
          {event.start.toLocaleString()}
        </EventStart>
        <div>
          <a rel="noreferrer" target="_blank" href={calendarLink.google(calEvent)}>gcal</a>
          &nbsp;/&nbsp;
          <a rel="noreferrer" target="_blank" href={calendarLink.ics(calEvent)}>ics</a>
          &nbsp;/&nbsp;
          <a rel="noreferrer" target="_blank" href={calendarLink.outlook(calEvent)}>outlook</a>
        </div>
      </EventTime>
      {event.image && (
        <EventImage src={'images/' + event.image} />
      )}
    </EventContainer>
  );
}
