from genericpath import exists
from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import certifi

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient(
    'mongodb+srv://test:sparta@cluster0.l6xez.mongodb.net/Cluster0?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client.dbsparta


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        return render_template('index.html')
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    return jsonify({'result': 'success'})


@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    # 회원가입
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password2_receive = request.form['password2_give']

    password_hash = hashlib.sha256(
        password_receive.encode('utf-8')).hexdigest()
    # DB에 저장
    return jsonify({'result': 'success'})


# DB에 username 중복확인
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    print(username_receive)
    exits = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'exits': exits})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
