from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.ryfyy.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta


@app.route('/')
def main1():
    return render_template('main1.html')

@app.route('/main2')
def main2():
    return render_template('main2.html')

@app.route('/main3')
def main3():
    return render_template('main3.html')

@app.route("/content", methods=["POST"])
def homework_post():
    content_receive = request.form['content_send']

    doc = {
    'content': content_receive
    }

    db.diary_content.insert_one(doc)

    return jsonify({'msg':'저장 완료!'})

@app.route("/content", methods=["GET"])
def homework_get():
    content_list = list(db.diary_content.find({}, {'_id': False}))
    return jsonify({'diary_content':content_list })

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)