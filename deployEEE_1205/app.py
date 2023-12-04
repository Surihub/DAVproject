from flask import Flask, render_template
import sys

app = Flask(__name__)

@app.route('/')
def eee():
    return render_template("/templates/eee.html")

if __name__ == "__main__":
    app.run(host = '0.0.0.0', port = 5001, debug = True)