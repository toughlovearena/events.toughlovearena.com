import React from 'react';
import styled from 'styled-components';
import { EventData } from '../events';

const EventContainer = styled.div`
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid black;

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

interface Link {
  name: string;
  url: string;
}

export function Event(props: { event: EventData }) {
  const { event } = props;
  const links: Link[] = [];
  if (event.challonge) {
    links.push({
      name: 'challonge',
      url: 'https://challonge.com/' + event.challonge,
    });
  }
  if (event.twitch) {
    links.push({
      name: 'twitch',
      url: 'https://twitch.tv/' + event.twitch,
    });
  }
  return (
    <EventContainer>
      <EventTitle>
        {event.title}
      </EventTitle>
      {event.description && (
        <div>
          {event.description}
        </div>
      )}
      When: {event.datetime.toLocaleString()}
      {links.length && (
        <EventLinks>
          {links.map((link, index) => (
            <span>
              {index > 0 && ' / '}
              <a key={index} href={link.url}>{link.name}</a>
            </span>
          ))}
        </EventLinks>
      )}
    </EventContainer>
  );
}
