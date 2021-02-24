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
    """,
    {"board_id": f"{board_id}"})
    return cursor.fetchone()


@connection_handler.connection_handler
def get_col_list(cursor: RealDictCursor, board_id):
    cursor.execute("""
        SELECT c.column_name as "column name"
        FROM board_columns bc
        LEFT JOIN columns c
        ON bc.column_id = c.id
        WHERE bc.board_id = %(board_id)s
    """,
    {"board_id": board_id})
    return cursor.fetchall()


@connection_handler.connection_handler
def get_all_column_cards(cursor: RealDictCursor, board_id, col_name):
    cursor.execute("""
        SELECT c.title as "card title", c.priority as "card priority"
        FROM cards c
        LEFT JOIN columns clms
        ON c.column_id = clms.id
        WHERE c.board_id = %(board_id)s and clms.column_name = %(col_name)s;
    """,
    {
        "board_id": f"{board_id}",
        "col_name": f"{col_name}"
    })
    return cursor.fetchall()