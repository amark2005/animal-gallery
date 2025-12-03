from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dog')
def dog():
    return render_template('dog.html')

@app.route('/cat')
def cat():
    return render_template('cat.html')

if __name__ == '__main__':
    app.run(debug=True)
