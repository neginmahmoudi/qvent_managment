import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category, getCategories } from '../../database/categories';
import { Event, getEventByLogedInUser } from '../../database/events';
import { getUserBySessionToken, User } from '../../database/users';

const containerStyles = css`
  display: flex;
  margin: 0 auto;
  width: 500px;
  height: 600px;
  flex-direction: column;
  align-items: center;

  textarea {
    border: none;
    border-radius: 5px;
    padding: 8px;
    background-color: #f3f8e6;
    width: 300px;
    height: 100px;
  }
  input {
    border: none;
    border-radius: 5px;
    padding: 8px;
    background-color: #f3f8e6;
  }
  button {
    padding: 10px;
    width: 120px;
    border-radius: 10px;
    background-color: #42b883;
    color: #f3f8e6;
    :hover {
      cursor: pointer;
      box-shadow: 4px 4px grey;
    }
  }
  select {
    border: none;
    border-radius: 5px;
    padding: 8px;
    background-color: #f3f8e6;
  }
  a {
    color: black;
    font-size: larger;
    text-decoration: none;
    margin-left: 60px;
    :hover {
      :hover {
        cursor: pointer;
        color: red;
      }
    }
  }
`;
const eventStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 30px;
  width: 800px;
  background-color: aliceblue;
  height: 60px;
  border-radius: 25px;
  a {
    text-decoration: none;
    color: black;
    margin-right: 10px;
    :hover {
      color: burlywood;
    }
  }
  button {
    padding: 5px;
    width: 60px;
    border-radius: 10px;
    margin-right: 10px;
    background-color: #3d3d0f;
    color: #f3f8e6;
    :hover {
      cursor: pointer;
      box-shadow: 4px 4px grey;
    }
  }
  div {
    margin-left: 30px;
  }
`;

type Props = {
  categoriesList: Category[];
  eventsss: Event[];
  user: User;
};
export default function Admin(props: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventNameInput, setEventNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [priceInput, setPriceInput] = useState(false);
  const [categoryIdInput, setCategoryIdInput] = useState('');

  // const [eventNameOnEditInput, seteventNameOnEditInput] = useState('');
  // const [descriptionOnEditInput, setDescriptionOnEditInput] = useState('');
  // const [addressOnEditInput, setAddressOnEditInput] = useState('');
  // const [categoryOnEditInput, setCategoryOnEditInput] = useState('');
  // const [dateOnEditInput, setDateOnEditInput] = useState('');
  // const [priceOnEditInput, setPriceOnEditInput] = useState(false);
  // const [onEditId, setOnEditId] = useState<number | undefined>();

  async function getEventsFromApi() {
    // const response = await fetch('/api/events');
    // const eventsFromApi = await response.json();
    setEvents(props.eventsss);
    console.log('show', props.eventsss);

    // console.log(eventByUser);
  }

  async function createEventFromApi() {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        // user id is not correct
        userId: props.user.id.toString(),
        eventName: eventNameInput,
        description: descriptionInput,
        address: addressInput,
        eventDate: dateInput,
        categoryId: categoryIdInput,
        isFree: priceInput,
      }),
    });

    const eventFromApi = (await response.json()) as Event;
    const newState = [...events, eventFromApi];
    setEvents(newState);
  }

  async function deleteEventFromApiById(id: number) {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });
    const deletedEvent = (await response.json()) as Event;

    const filteredEvent = events.filter((event) => {
      return event.id !== deletedEvent.id;
    });

    // setEvents(filteredEvent);
    getEventsFromApi();
  }

  // async function updateEventFromApiById(id: number) {
  //   const response = await fetch(`/api/events/${id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'content-type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       eventName: eventNameOnEditInput,
  //       description: descriptionOnEditInput,
  //       address: addressOnEditInput,
  //       eventDate: dateOnEditInput,
  //       categoryName: props.categoriesList,
  //       isFree: priceOnEditInput,
  //     }),
  //   });
  //   const updatedEventFromApi = (await response.json()) as Event;

  //   const newState = events.map((event) => {
  //     if (event.id === updatedEventFromApi.id) {
  //       return updatedEventFromApi;
  //     } else {
  //       return event;
  //     }
  //   });

  //   setEvents(newState);
  // }

  useEffect(() => {
    getEventsFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Frontend event api</title>
        <meta name="description" content="Content of the api " />
      </Head>
      <div css={containerStyles}>
        <h1>Events Form</h1>

        <input
          placeholder="Event Name"
          value={eventNameInput}
          onChange={(event) => {
            setEventNameInput(event.currentTarget.value);
          }}
        />

        <br />

        <br />
        <textarea
          placeholder="Description"
          value={descriptionInput}
          onChange={(event) => {
            setDescriptionInput(event.currentTarget.value);
          }}
        />

        <br />

        <input
          placeholder="Location"
          value={addressInput}
          onChange={(event) => {
            setAddressInput(event.currentTarget.value);
          }}
        />

        <br />
        <div>
          {' '}
          <input
            type="date"
            value={dateInput}
            onChange={(event) => {
              setDateInput(event.currentTarget.value);
            }}
          />
          <label> Category:</label>
          <select
            required={true}
            onChange={(event) => {
              setCategoryIdInput(event.currentTarget.value);
            }}
          >
            <option>select one</option>
            {props.categoriesList?.map((category) => {
              return (
                <option
                  value={category.id}
                  key={`categoriesList-${category.id}`}
                >
                  {category.categoryName}
                </option>
              );
            })}
          </select>
        </div>

        <br />
        <label>
          free
          <input
            type="checkbox"
            value={priceInput}
            onChange={(event) => {
              setPriceInput(Boolean(event.currentTarget.value));
            }}
          />
        </label>
        <br />
        <div>
          {' '}
          <button
            onClick={async () => {
              await createEventFromApi();
            }}
          >
            submit
          </button>
          <Link href="/profile">back</Link>
        </div>

        <hr />
      </div>
      <div>
        {events?.map((event) => {
          return (
            <div css={eventStyles} key={`eventId-${event.userId}`}>
              {/* <td>{event.userId}</td> */}
              <div>EVENT: {event.eventName} </div>
              {/* <td>{event.description}</td> */}
              {/* <td>{event.address}</td>
                  <td>{event.eventDate}</td> */}
              {/* <td>{event.categoryId}</td>
                  <td>{event.isFree ? 'no' : 'yes'}</td> */}
              <div>
                <Link href="/private-profile"> more</Link>
                <button
                  onClick={async () => await deleteEventFromApiById(event.id)}
                >
                  {' '}
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* {events.map((event) => {
        const isEventOnEdit = onEditId === event.id;

        return (
          <Fragment key={event.id}>
            <input
              value={isEventOnEdit ? eventNameOnEditInput : event.eventName}
              disabled={!isEventOnEdit}
              onChange={(event) => {
                seteventNameOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              value={isEventOnEdit ? descriptionOnEditInput : event.description}
              disabled={!isEventOnEdit}
              onChange={(event) => {
                setDescriptionOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              value={isEventOnEdit ? addressOnEditInput : event.address}
              disabled={!isEventOnEdit}
              onChange={(event) => {
                setAddressOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              value={isEventOnEdit ? dateOnEditInput : event.eventDate}
              disabled={!isEventOnEdit}
              onChange={(event) => {
                setDateOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              value={isEventOnEdit ? categoryOnEditInput : event.categoryId}
              disabled={!isEventOnEdit}
              onChange={(event) => {
                setCategoryOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              value={isEventOnEdit ? priceOnEditInput : event.isFree}
              disabled={!isEventOnEdit}
              onChange={(event) => {
                setPriceOnEditInput(event.currentTarget.value);
              }}
            />

            {!isEventOnEdit ? (
              <button
                onClick={() => {
                  setOnEditId(event.id);
                  seteventNameOnEditInput(event.eventName);
                  setDescriptionOnEditInput(event.description);
                  setAddressOnEditInput(event.address);
                  setDateOnEditInput(event.eventDate);
                  setPriceOnEditInput(event.isFree);
                }}
              >
                edit
              </button>
            ) : (
              <button
                onClick={async () => {
                  setOnEditId(undefined);
                  await updateEventFromApiById(event.id);
                }}
              >
                save
              </button>
            )}
            <br />
          </Fragment>
        );
      })} */}
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const eventsBy = user && (await getEventByLogedInUser(user.id));
  const categoriesList = await getCategories();

  return {
    props: {
      categoriesList: categoriesList,
      eventsss: JSON.parse(JSON.stringify(eventsBy)),
      user: user,
    },
  };
}
