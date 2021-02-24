DROP TABLE IF EXISTS board_columns;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS columns;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS Users;


CREATE TABLE Users
(
    user_id SERIAL PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    password VARCHAR
);

CREATE TABLE Boards
(
    Id SERIAL PRIMARY KEY NOT NULL,
    Title TEXT NOT NULL,
    "User" INTEGER,
    CONSTRAINT fk_board_user
        FOREIGN KEY ("User")
            REFERENCES Users(user_id)
            ON DELETE CASCADE
);

CREATE TABLE Columns
(
    Id SERIAL PRIMARY KEY NOT NULL,
    Column_name VARCHAR NOT NULL
);

CREATE TABLE Cards
(
    Id SERIAL PRIMARY KEY NOT NULL,
    Title VARCHAR NOT NULL,
    Column_id INTEGER NOT NULL,
    Priority INTEGER DEFAULT 1,
    Board_id INTEGER,
    CONSTRAINT fk_card_board
        FOREIGN KEY (Board_id)
            REFERENCES Boards(Id)
            ON DELETE CASCADE,
    CONSTRAINT fk_card_columns
        FOREIGN KEY (Column_id)
            REFERENCES Columns(Id)
);

CREATE TABLE board_columns
(
    Board_id INTEGER,
    Column_id INTEGER,
    CONSTRAINT fk_column_board
        FOREIGN KEY (Board_id)
            REFERENCES Boards(Id)
            ON DELETE CASCADE,
    CONSTRAINT fk_columns_card
        FOREIGN KEY (Column_id)
            REFERENCES Columns(Id)
            ON DELETE NO ACTION
);

INSERT INTO columns (column_name)
VALUES ('New');
INSERT INTO columns (column_name)
VALUES ('In Progress');
INSERT INTO columns (column_name)
VALUES ('Testing');
INSERT INTO columns (column_name)
VALUES ('Done');