from flask import Flask, render_template, request, json
from variables import tables
import util

app = Flask(__name__)

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
        message = util.add_new_col_to_db(board_id, col_name)

        data_to_send_back = {
            "message": message,
            "columns": [{"column name": col_name}]

        }

        return json.dumps(data_to_send_back)
    except:
        return json.dumps("An error has occured. Column not added")

if __name__ == '__main__':
    app.run()
