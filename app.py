from flask import Flask, render_template, request, json, url_for, redirect, session
from variables import tables
import util, data_manager
import bcrypt
from os import urandom


app = Flask(__name__)
app.secret_key = urandom(8)


STATUS = 0
MESSAGE = 1
COLUMN_ID = 2


@app.route('/')
def index():
    public_boards = data_manager.public_boards()
    if "user_id" in session.keys():
        private_boards = data_manager.private_boards(session["user_id"])
    else:
        private_boards = None

    return render_template('index.html', public_boards=public_boards, private_boards=private_boards)


@app.route('/register', methods=['POST'])
def register():
    login = request.form.get("login")
    password = request.form.get("password")
    confirmation = request.form.get("confirm_password")
    if confirmation != password or data_manager.get_user(login) != None:
        return redirect(url_for('index'))
    else:
        hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(8))
        data_manager.add_to_database(login, hashed_pass.decode('utf-8'))
        return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    login_value = request.form
    user_data = data_manager.get_user(login_value.get("login"))
    if bcrypt.checkpw(login_value.get("password").encode('utf-8'), user_data["password"].encode('utf-8')):
        session['user_id'] = user_data['user_id']
        return redirect(url_for('index'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user_id')
    return redirect(url_for('index'))

@app.route("/<board_id>/board-data")
def get_board_data(board_id):
    return json.dumps(util.get_board_dict(board_id))


@app.route("/add-new-column", methods=["POST"])
def add_new_column():
    try:
        board_id = request.get_json()["board_id"]
        col_name = request.get_json()["column_name"]
        result = util.add_new_col_to_db(board_id, col_name)

        data_to_send_back = {
            "status": result[STATUS],
            "message": result[MESSAGE],
            "columns": [{
                "column name": col_name,
                "column id": result[COLUMN_ID]
            }]
        }

        return json.dumps(data_to_send_back)
    except:
        return json.dumps("An error has occurred. Column not added")


@app.route("/delete-column", methods=["POST"])
def delete_column():
    try:
        column_id = int(request.get_json()["column id"])
        util.delete_col_and_col_references(column_id)
        return json.dumps({"status": True, "message": "Column deleted successfully"})
    except:
        return False, json.dumps("Unable to delete this column")


@app.route("/add-new-card", methods=["POST"])
def add_new_card():
    try:
        board_id = request.get_json()["board id"]
        card_title = request.get_json()["card name"]
        card_id = util.add_new_card_to_db(board_id, card_title)["card id"]
        return json.dumps({"status": True, "message": "Card added successfully", "card title": card_title, "card id": card_id})
    except:
        return json.dumps({"status": False, "message": "An error has occurred. Card not added"})


@app.route("/delete-card", methods=["POST"])
def delete_card():
    try:
        card_id = int(request.get_json()["card id"])
        util.delete_card_from_db(card_id)
        return json.dumps({"status": True, "message": "Card deleted successfully", "card id": card_id})
    except:
        return json.dumps({"status": False, "message": "An error has occurred. Card not deleted"})


@app.route("/update-card-status", methods=["PATCH"])
def update_card_status():
    try:
        card_id = request.get_json()["card id"]
        column_id = request.get_json()["column id"]
        util.update_cards_status(card_id, column_id)
        return json.dumps({"message": "Card's status updated successfully"})
    except:
        return json.dumps({"message": "An error has occurred. Card's status not updated"})


@app.route("/update-title", methods=["PATCH"])
def update_title():
    try:
        new_title = request.get_json()["title"]
        id = request.get_json()["id"]
        is_column = request.get_json()["is column"]
        util.update_title_in_DB(new_title, id, is_column)
        return json.dumps("Title updated successfully")
    except:
        return json.dumps("An error has occured. Title not updated")


if __name__ == '__main__':
    app.run()
