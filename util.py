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