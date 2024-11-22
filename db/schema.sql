CREATE TABLE users (
    id bigint GENERATED ALWAYS AS IDENTITY,
    type text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    password character(97) NOT NULL
);
