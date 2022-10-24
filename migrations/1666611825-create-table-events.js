exports.up = async (sql) => {
  await sql`CREATE TABLE events(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_name varchar(30) NOT NULL,
  description varchar(100) NOT NULL,
  address varchar(100) NOT NULL,
  event_date DATE NOT NULL,
  category_id integer REFERENCES categories(id),
  user_id integer REFERENCES users (id)
  );`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE events`;
};
