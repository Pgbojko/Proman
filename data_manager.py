import connection_handler
from psycopg2.extras import RealDictCursor

@connection_handler.connection_handler
def get_tables(cursor: RealDictCursor):
    query = """
    SELECT *
    FROM "Boards"
    ORDER BY "Id"
    """
    cursor.execute(query)
    return cursor.fetchall()


# @connection_handler.connection_handler
# def get_tables(cursor: RealDictCursor):
#     query = """
#     SELECT *
#     FROM "Boards"
#     ORDER BY "Title"
#     """
#     cursor.execute(query)
#     return cursor.fetchall()
#
#
# @connection_handler.connection_handler
# def get_tables(cursor: RealDictCursor):
#     query = """
#     SELECT *
#     FROM "Board"
#     ORDER BY "User"
#     """
#     cursor.execute(query)
#     return cursor.fetchall()