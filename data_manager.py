import connection_handler
from psycopg2.extras import RealDictCursor


@connection_handler.connection_handler
def get_tables(cursor: RealDictCursor):
    query = """
    SELECT *
    FROM boards
    ORDER BY id
    """
    cursor.execute(query)
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
        SELECT c.title as "card title", c.priority as "card priority"
        FROM cards c
        WHERE c.board_id = %(board_id)s and c.column_id = %(col_id)s;
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
        SELECT *
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
def add_new_card(cursor: RealDictCursor, board_id, card_title):
    cursor.execute("""
        INSERT INTO cards(title, column_id, board_id)
        VALUES (%(card_title)s, 1, %(board_id)s)
    """, {
        "card_title": f"{card_title}",
        "board_id": f"{board_id}"
    })