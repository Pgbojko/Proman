import connection_handler
from psycopg2.extras import RealDictCursor


@connection_handler.connection_handler
def public_boards(cursor: RealDictCursor):
    query = """
    SELECT b.id as "board id", b.title as "board title", b."User" as "user id"
    FROM boards b
    WHERE "User" is null 
    ORDER BY id
    """
    cursor.execute(query)
    return cursor.fetchall()


@connection_handler.connection_handler
def private_boards(cursor: RealDictCursor, user_id):
    query = """
    SELECT b.id as "board id", b.title as "board title", b."User" as "user id"
    FROM boards b
    WHERE "User" = %(user_id)s
    ORDER BY id
    """
    param = {'user_id' : f"{user_id}"}
    cursor.execute(query, param)
    return cursor.fetchall()


@connection_handler.connection_handler
def get_board_title(cursor: RealDictCursor, board_id):
    cursor.execute("""
        SELECT title as "board title"
        FROM boards
        WHERE id = %(board_id)s;
    """, {"board_id": f"{board_id}"})
    return cursor.fetchone()


@connection_handler.connection_handler
def get_col_list(cursor: RealDictCursor, board_id):
    cursor.execute("""
        SELECT c.column_name as "column name", c.id as "column id"
        FROM board_columns bc
        LEFT JOIN columns c
        ON bc.column_id = c.id
        WHERE bc.board_id = %(board_id)s
    """, {"board_id": board_id})
    return cursor.fetchall()


@connection_handler.connection_handler
def get_all_column_cards(cursor: RealDictCursor, board_id, col_id):
    cursor.execute("""
        SELECT c.id as "card id", c.title as "card title", c.priority as "card priority"
        FROM cards c
        WHERE c.board_id = %(board_id)s and c.column_id = %(col_id)s
        ORDER BY priority;
    """, {
       "board_id": f"{board_id}",
       "col_id": f"{col_id}"
   })
    return cursor.fetchall()


@connection_handler.connection_handler
def add_new_column(cursor: RealDictCursor, column_name):
    cursor.execute("""
        INSERT INTO columns(column_name)
        VALUES(%(column_name)s);
    """, {"column_name": f"{column_name}"})


@connection_handler.connection_handler
def get_col_ids_by_board_id(cursor: RealDictCursor, board_id):
    cursor.execute("""
        SELECT board_id as "board id", column_id as "column id"
        FROM board_columns bc
        WHERE bc.board_id = %(board_id)s;
    """, {"board_id": f"{board_id}"})
    return cursor.fetchall()


@connection_handler.connection_handler
def get_col_id_by_name(cursor: RealDictCursor, col_name):
    cursor.execute("""
        SELECT c.id
        FROM columns c
        WHERE c.column_name = %(col_name)s
    """, {"col_name": f"{col_name}"})
    return cursor.fetchone()


@connection_handler.connection_handler
def link_col_to_board(cursor: RealDictCursor, board_id, col_id):
    cursor.execute("""
        INSERT INTO board_columns(board_id, column_id)
        VALUES (%(board_id)s, %(col_id)s)
    """, {
       "board_id": f"{board_id}",
       "col_id": f"{col_id}"
   })


@connection_handler.connection_handler
def del_bord_col_link(cursor: RealDictCursor, col_id):
    cursor.execute("""
        DELETE
        FROM board_columns bd
        WHERE bd.column_id = %(column_id)s
    """, {"column_id": f"{col_id}"})


@connection_handler.connection_handler
def delete_column(cursor: RealDictCursor, col_id):
    cursor.execute("""
            DELETE
            FROM columns c
            WHERE c.id = %(column_id)s
    """, {"column_id": f"{col_id}"})

@connection_handler.connection_handler
def add_new_card(cursor: RealDictCursor, board_id, card_title, column_id):
    cursor.execute("""
        INSERT INTO cards(title, column_id, board_id)
        VALUES (%(card_title)s, %(column_id)s, %(board_id)s);
        SELECT c.id as "card id"
        FROM cards c
        WHERE c.title = %(card_title)s
        ORDER BY c.id DESC
        LIMIT 1;
    """, {
        "card_title": f"{card_title}",
        "board_id": f"{board_id}",
        "column_id": f"{column_id}"
    })
    return cursor.fetchone()


@connection_handler.connection_handler
def delete_card_by_card_id(cursor: RealDictCursor, card_id):
    cursor.execute("""
        DELETE
        FROM cards c
        WHERE c.id = %(card_id)s
    """, {"card_id": f"{card_id}"})


@connection_handler.connection_handler
def delete_card_by_col_id(cursor: RealDictCursor, col_id):
    cursor.execute("""
        DELETE
        FROM cards c
        WHERE c.column_id = %(col_id)s
    """, {"col_id": f"{col_id}"})


@connection_handler.connection_handler
def update_card_status(cursor: RealDictCursor, card_id, col_id):
    cursor.execute("""
        UPDATE cards
        SET column_id = %(col_id)s
        WHERE id = %(card_id)s
    """, {
        "card_id": f"{card_id}",
        "col_id": f"{col_id}"
    })


@connection_handler.connection_handler
def update_col_name(cursor: RealDictCursor, col_id, col_title):
    cursor.execute("""
        UPDATE columns
        SET column_name = %(col_title)s
        WHERE id = %(col_id)s
    """, {
        "col_id": f"{col_id}",
        "col_title": f"{col_title}"
    })


@connection_handler.connection_handler
def get_user(cursor: RealDictCursor, login):
    cursor.execute("""
        SELECT user_id as "user id", username, password
        FROM "users" u
        WHERE username = %(login)s
        """, {
        "login": f"{login}"
    })

    return cursor.fetchone()


@connection_handler.connection_handler
def add_to_database(cursor: RealDictCursor, login, hashed_password):
    cursor.execute("""
        INSERT INTO users(username, password)
        values(%(login)s, %(password)s)      
    """, {
        "login" : f"{login}",
        "password" : f"{hashed_password}"
    })


@connection_handler.connection_handler
def update_card_name(cursor: RealDictCursor, card_id, card_title):
    cursor.execute("""
        UPDATE cards
        SET title = %(card_title)s
        WHERE id = %(card_id)s
    """, {
        "card_id": f"{card_id}",
        "card_title": f"{card_title}"
    })


@connection_handler.connection_handler
def add_new_public_board(cursor: RealDictCursor, board_title):
    cursor.execute("""
        INSERT INTO boards (title, "User") 
        VALUES (%(title)s, null);
        SELECT b.id as "board id"
        FROM boards b
        ORDER BY b.id DESC
        LIMIT 1;
    """, {"title": f"{board_title}"})
    return cursor.fetchone()


@connection_handler.connection_handler
def add_new_private_board(cursor: RealDictCursor, board_title, user_id):
    cursor.execute("""
        INSERT INTO boards (title, "User") 
        VALUES (%(title)s, %(user_id)s);
        SELECT b.id as "board id"
        FROM boards b
        ORDER BY b.id DESC
        LIMIT 1;
    """, {
        "title": f"{board_title}",
        "user_id": f"{user_id}"
    })
    return cursor.fetchone()


@connection_handler.connection_handler
def del_board(cursor: RealDictCursor, board_id):
    cursor.execute("""
        DELETE
        FROM boards
        WHERE boards.id = %(board_id)s
    """, {"board_id" : f"{board_id}"})


@connection_handler.connection_handler
def edit_board_title(cursor: RealDictCursor, board_id, board_title):
    cursor.execute("""
        UPDATE boards
        SET title = %(new_title)s
        WHERE id = %(board_id)s
    """, {
        "new_title": f"{board_title}",
        "board_id": f"{board_id}"
    })
