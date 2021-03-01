from flask import Flask, render_template, request, json, url_for, redirect
from variables import tables
import util, data_manager

app = Flask(__name__)

STATUS = 0
MESSAGE = 1
COLUMN_ID = 2

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    login_value = request.form
    user_data = data_manager.get_user(login_value.get("login"))
    if login_value.get("password") == user_data["password"]:
        return redirect(url_for('index'))
    return render_template('login.html')


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
