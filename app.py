from flask import Flask, render_template, request, json, url_for, redirect, session
from variables import *
import util, data_manager
import bcrypt
from os import urandom


app = Flask(__name__)
app.secret_key = urandom(8)


@app.route('/')
def index():
    public_boards = data_manager.public_boards()
    if USER_ID in session.keys():
        private_boards = data_manager.private_boards(session[USER_ID])
    else:
        private_boards = None
    user_id = session[USER_ID] if USER_ID in session.keys() else None
    return render_template('index2.html', public_boards=public_boards, private_boards=private_boards, user_id=user_id)


@app.route('/register', methods=['POST'])
def register():
    login = request.form.get(LOGIN)
    password = request.form.get(PASSWORD)
    confirmation = request.form.get(CONF_PASSWORD)
    if confirmation != password or data_manager.get_user(login) != None:
        return redirect(url_for(MAIN_PAGE))
    else:
        hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(8))
        data_manager.add_to_database(login, hashed_pass.decode('utf-8'))
        return redirect(url_for(MAIN_PAGE))

@app.route('/login', methods=['POST'])
def login():
    login_value = request.form
    user_data = data_manager.get_user(login_value.get(LOGIN))
    if bcrypt.checkpw(login_value.get(PASSWORD).encode('utf-8'), user_data[PASSWORD].encode('utf-8')):
        session[USER_ID] = user_data[USER_ID]
        return redirect(url_for(MAIN_PAGE))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop(USER_ID)
    return redirect(url_for(MAIN_PAGE))


@app.route("/<board_id>/board-data")
def get_board_data(board_id):
    data = util.get_board_dict(board_id)
    return json.dumps(data)


@app.route("/add-new-column", methods=["POST"])
def add_new_column():
    try:
        board_id = request.get_json()[BOARD_ID]
        col_name = request.get_json()[COL_NAME]
        result = util.add_new_col_to_db(board_id, col_name)

        data_to_send_back = {
            f"{STATUS_KEY}": result[STATUS_INDEX],
            f"{MESSAGE_KEY}": result[MESSAGE_INDEX],
            f"{COLS}": [{
                f"{COL_NAME}": col_name,
                f"{COL_ID}": result[COLUMN_ID_INDEX]
            }]
        }

        return json.dumps(data_to_send_back)
    except:
        return json.dumps("An error has occurred. Column not added")


@app.route("/delete-column", methods=["POST"])
def delete_column():
    try:
        column_id = int(request.get_json()[COL_ID])
        util.delete_col_and_col_references(column_id)
        return json.dumps({f"{STATUS_KEY}": True, f"{MESSAGE_KEY}": "Column deleted successfully"})
    except:
        return False, json.dumps("Unable to delete this column")


@app.route("/add-new-card", methods=["POST"])
def add_new_card():
    try:
        board_id = request.get_json()[BOARD_ID]
        card_title = request.get_json()[CARD_NAME]
        column_id = request.get_json()[COL_ID]
        card_data = util.add_new_card_to_db(board_id, card_title, column_id)
        return json.dumps({f"{STATUS_KEY}": True, f"{MESSAGE_KEY}": "Card added successfully",
                           f"{CARD_TITLE}": card_title, f"{CARD_ID}": card_data[CARD_ID]})
    except:
        return json.dumps({f"{STATUS_KEY}": False, f"{MESSAGE_KEY}": "An error has occurred. Card not added"})


@app.route("/delete-card", methods=["POST"])
def delete_card():
    try:
        card_id = int(request.get_json()[CARD_ID])
        util.delete_card_from_db(card_id)
        return json.dumps({f"{STATUS_KEY}": True, f"{MESSAGE_KEY}": "Card deleted successfully", f"{CARD_ID}": card_id})
    except:
        return json.dumps({f"{STATUS_KEY}": False, f"{MESSAGE_KEY}": "An error has occurred. Card not deleted"})


@app.route("/update-card-status", methods=["PATCH"])
def update_card_status():
    try:
        card_id = request.get_json()[CARD_ID]
        column_id = request.get_json()[COL_ID]
        util.update_cards_status(card_id, column_id)
        return json.dumps({f"{MESSAGE_KEY}": "Card's status updated successfully"})
    except:
        return json.dumps({f"{MESSAGE_KEY}": "An error has occurred. Card's status not updated"})


@app.route("/update-title", methods=["PATCH"])
def update_title():
    try:
        new_title = request.get_json()["title"]
        id = request.get_json()["id"]
        is_column = request.get_json()["is column"]
        util.update_title_in_DB(new_title, id, is_column)
        return json.dumps("Title updated successfully")
    except:
        return json.dumps("An error has occurred. Title not updated")


@app.route("/new-public-board", methods=["POST"])
def new_public_board():
    board_title = request.get_json()[BOARD_TITLE]
    board_id = util.add_new_board_to_db(board_title)
    return json.dumps({f"{BOARD_TITLE}": board_title, f"{BOARD_ID}": board_id})


@app.route("/new-private-board", methods=["POST"])
def new_private_board():
    board_title = request.get_json()[BOARD_TITLE]
    user_id = request.get_json()[USER_ID]
    board_id = util.add_new_board_to_db(board_title, user_id)
    return json.dumps({f"{BOARD_TITLE}": board_title, f"{BOARD_ID}": board_id})


@app.route("/<board_id>/delete", methods=["POST"])
def del_board(board_id):
    data_manager.del_board(board_id)
    return json.dumps({f"{BOARD_ID}" : board_id})


@app.route("/<board_id>/edit-title", methods=["PATCH"])
def edit_board_title(board_id):
    new_title = request.get_json()[BOARD_TITLE]
    data_manager.edit_board_title(board_id, new_title)
    return json.dumps({f"{BOARD_TITLE}": new_title})


if __name__ == '__main__':
    app.run()
