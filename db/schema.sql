CREATE TABLE users (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    password character(97) NOT NULL
);

CREATE TABLE google (
    id bigint PRIMARY KEY REFERENCES users ON DELETE CASCADE,
    sub character(21) NOT NULL UNIQUE
);

CREATE TABLE authors (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name text NOT NULL,
    last_name text NOT NULL
);

CREATE TABLE publishers (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL
);

CREATE TABLE books (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    author bigint NOT NULL REFERENCES authors ON DELETE CASCADE,
    publisher bigint NOT NULL REFERENCES publishers ON DELETE CASCADE,
    year smallint NOT NULL,
    pages smallint NOT NULL,
    summary text NOT NULL
);

INSERT INTO users VALUES (
    DEFAULT,
    'admin',
    'Admin',
    'Account',
    'admin@simpleils.tech',
    '$argon2id$v=19$m=65536,t=3,p=4$PGsdJSTf73FtFGD6tHk4Zw$2erSbSEr7qxTvvPR46Ye/PzDxd7efC46kRgY7gFByFo'
);
