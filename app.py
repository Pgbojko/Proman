from flask import Flask, render_template, request, json
from variables import tables
import util

app = Flask(__name__)

STATUS = 0
MESSAGE = 1
COLUMN_ID = 2

@app.route('/')
def index():
    return render_template('index.html')


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
        return json.dumps("An error has occured. Column not added")


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
        util.add_new_card_to_db(board_id, card_title)
        return json.dumps({"status": True, "message": "Card added successfully", "card title": card_title})
    except:
        return json.dumps({"status": False, "message": "Error has occurred. Card not added"})


if __name__ == '__main__':
    app.run()
