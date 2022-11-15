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
  background-color: #37303e;
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
    box-shadow: 4px -4px #aba3b4;
    transform: scaleY(0.98);
  }
  h3 {
    text-align: center;
    margin-bottom: 15px;
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
  :hover {
    visibility: hidden;
  }
  div:nth-child(3) {
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
  background-color: #c34a36;
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
      <video width="100" height="100" controls>
        <source src="/flag.mp4" />
      </video>
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
                <div
                  css={css`
                    background-color: #f3eada;
                    border-radius: 5px;
                    height: 55px;
                    border: 1px solid #aeccc6;
                    margin-bottom: 3px;
                  `}
                >
                  <h3>Event: {event.eventName}</h3>
                </div>

                <Image
                  src={event.image}
                  width={240}
                  height={170}
                  alt="preview"
                  css={imgStyles}
                />

                <div css={wStyles}>
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
