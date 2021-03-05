import data_manager
from flask import render_template

BOARD_TITLE = "board title"
COL_NAME = "column name"
COLS = "columns"
CARDS = "cards"
COL_ID = "column id"
BOARD_ID = "board id"
CARD_ID = "card id"


def get_board_dict(board_id):
    board = {}
    board[BOARD_TITLE] = data_manager.get_board_title(board_id)[BOARD_TITLE]
    board[COLS] = [get_cards_for_col(board_id, col) for col in data_manager.get_col_list(board_id)]
    return board


def get_cards_for_col(board_id, col_dict):
    return {
        COL_NAME: col_dict[COL_NAME],
        COL_ID: col_dict[COL_ID],
        CARDS: [card for card in data_manager.get_all_column_cards(board_id, col_dict[COL_ID])]
    }


def add_new_col_to_db(board_id, col_name):
    if existing_col_names(col_name) is None:
        data_manager.add_new_column(col_name)
    col_id = data_manager.get_col_id_by_name(col_name)["id"]

    if not existing_board_col_connection(board_id, col_id):
        data_manager.link_col_to_board(board_id, col_id)
        return True, f"Column \"{col_name}\" has been added successfully", col_id
    else:
        return False, f"Column \"{col_name}\" already exists"


def existing_col_names(col_name):
    return data_manager.get_col_id_by_name(col_name)


def existing_board_col_connection(board_id, col_id):
    for el in data_manager.get_col_ids_by_board_id(board_id):
        if el["column_id"] == col_id:
            return True
    return False


def delete_col_and_col_references(col_id):
    data_manager.del_bord_col_link(col_id)
    if col_id > 4:
        data_manager.delete_column(col_id)
    else:
        data_manager.delete_card_by_col_id(col_id)


def add_new_card_to_db(board_id, card_title, column_id):
    data = data_manager.add_new_card(board_id, card_title, column_id)
    return data


def delete_card_from_db(card_id):
    data_manager.delete_card_by_card_id(card_id)


def update_cards_status(card_id, col_id):
    data_manager.update_card_status(card_id, col_id)


def update_title_in_DB(title, id, is_column):
    if is_column:
        data_manager.update_col_name(id, title)
    else:
        data_manager.update_card_name(id, title)


def add_new_board_to_db(board_title, user_id=None):
    if user_id is None:
        new_board_id = data_manager.add_new_public_board(board_title)["board id"]
    else:
        new_board_id = data_manager.add_new_private_board(board_title, user_id)["board id"]

    for col_id in range(1, 5):
        data_manager.link_col_to_board(new_board_id, col_id)

    return new_board_id