from flask import Flask, render_template, json
from variables import tables
import util

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route("/<board_id>/board-data")
def get_board_data(board_id):
    return json.dumps(util.get_board_dict(board_id))

if __name__ == '__main__':
    app.run()
