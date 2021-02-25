import data_manager

BOARD_TITLE = "board title"
COL_NAME = "column name"
COLS = "columns"
CARDS = "cards"


def get_board_dict(board_id):
    board = {}
    board[BOARD_TITLE] = data_manager.get_board_title(board_id)[BOARD_TITLE]
    board[COLS] = [get_cards_for_col(board_id, col[COL_NAME]) for col in data_manager.get_col_list(board_id)]
    return board


def get_cards_for_col(board_id, col_name):
    return {
        COL_NAME: col_name,
        CARDS: [card for card in data_manager.get_all_column_cards(board_id, col_name)]
    }


def add_new_col_to_db(board_id, col_name):
    if existing_col_names(col_name) is None:
        data_manager.add_new_column(col_name)
    col_id = data_manager.get_col_id_by_name(col_name)["id"]

    if not existing_board_col_connection(board_id, col_id):
        data_manager.link_col_to_board(board_id, col_id)
        return f"Column \"{col_name}\" has been added successfully"
    else:
        return f"Column \"{col_name}\" already exists"


def existing_col_names(col_name):
    return data_manager.get_col_id_by_name(col_name)


def existing_board_col_connection(board_id, col_id):
    for el in data_manager.get_col_ids_by_board_id(board_id):
        if el["column_id"] == col_id:
            return True
    return False
