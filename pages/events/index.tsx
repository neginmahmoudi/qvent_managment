import { Search } from '@emotion-icons/bootstrap';
import { css } from '@emotion/react';
import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { Category, getCategories } from '../../database/categories';
import { EventDTO, getEventsWithJoint } from '../../database/events';

const hStyles = css`
  margin: 0 auto;
  width: 400px;
  font-family: monospace;
  font-size: 15px;
  text-align: center;
`;
const wrapstyles = css`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-family: cursive;
`;
const containerStyles = css`
  border-radius: 10px;
  border: 1px solid #aeccc6;
  padding: 30px;
  display: flex;
  align-items: flex-start;
  background-color: #00362d;
  flex-direction: column;
  width: 300px;
  margin: 2rem;
  margin-top: 55px;
  a {
    text-decoration: none;
    color: black;
  }
  :hover {
    cursor: pointer;
    box-shadow: 4px -4px #3ab8a9;
    transform: scaleY(0.98);
  }
`;

const wStyles = css`
  background-color: #f3eada;
  margin-left: 20px;
  padding: 10px;
  display: flex;
  margin: 0 auto;
  border-radius: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  div:nth-child(4) {
    color: red;
  }
`;
const imgStyles = css`
  border-radius: 3px;
  margin-left: 10px;
  margin: 0 auto;
`;

const iconStyles = css`
  cursor: cell;
  position: relative;
  left: 90%;
  width: 17px;
  height: 17px;
  color: cadetblue;
`;
const filterStyles = css`
  width: 150px;
  padding: 5px;
  background-color: #a32495;
  color: #ebebeb;
  position: relative;
  font-family: cursive;
  border-radius: 15px;
  top: 90px;
  left: 88%;
  option {
    background-color: #f7e6bd;
    color: black;
  }
`;

type Props = {
  filteredEvents: EventDTO[];
  categoryList: Category[];
};
export default function EventFromDataBase(props: Props) {
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState(props.filteredEvents);
  return (
    <div>
      <Head>
        <title>list of events</title>
        <meta name="description" content="List of events in qvent app" />
      </Head>
      <select
        css={filterStyles}
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(Number(e.currentTarget.value));
          if (Number(e.currentTarget.value) === 0) {
            setFilteredEvents(props.filteredEvents);
          }

          if (Number(e.currentTarget.value) !== 0) {
            const filteredEvent = props.filteredEvents.filter((event) => {
              return event.categoryId === Number(e.currentTarget.value);
            });
            setFilteredEvents(filteredEvent);
          }
        }}
      >
        <option value={0}>All categories</option>
        {props.categoryList?.map((category) => {
          return (
            <option value={category.id} key={`categoriesList-${category.id}`}>
              {category.categoryName}
            </option>
          );
        })}
      </select>
      <div css={hStyles}>
        {' '}
        <h1>All Events</h1>
        <p>To find out more click on your favorite event !</p>
      </div>

      <div css={wrapstyles}>
        {filteredEvents?.map((event) => {
          return (
            <div key={`events-${event.id}`} css={containerStyles}>
              <a href={`events/${event.id}`}>
                <Image
                  src={event.image}
                  width={250}
                  height={190}
                  alt="preview"
                  css={imgStyles}
                />

                <div css={wStyles}>
                  <h3>Event: {event.eventName}</h3>
                  <div>Host: {event.username}</div>
                  <div>Location: {event.address}</div>
                  <div>{event.free ? 'free' : ''}</div>
                  <div>Date: {event.eventDate.split('T')[0]}</div>
                  <div>{event.categoryName}</div>
                  <Search css={iconStyles} />
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<Props>
> {
  const eventsList = await getEventsWithJoint();
  const categoryList = await getCategories();
  return {
    props: {
      filteredEvents: JSON.parse(JSON.stringify(eventsList)),
      categoryList: categoryList,
    },
  };
}
