from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from models.Users import User
from bcrypt import hashpw, gensalt, checkpw
from flask_cors import CORS
from models.Users import db
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, set_access_cookies, get_jwt_identity
from datetime import timedelta
from collections import defaultdict
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)

CORS(
    app,
    origins="http://localhost:3000",
    supports_credentials=True
)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False     
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=10)
login_attempts = defaultdict(list)

MAX_ATTEMPTS = 5
BLOCK_TIME = 15 * 60  
jwt = JWTManager(app)
db.init_app(app)

@app.route("/", methods=["GET"])
def home():
    if(db):
        return jsonify({"message": "API running with DB connection"})
    
    return jsonify({"message": "API running without DB connection"})



@app.route("/SignUp", methods=["POST"])
def sign_up():
    username=request.json.get("username")
    email=request.json.get("email")
    password=request.json.get("password")

    if not username or not email or not password:
        return jsonify({"error": "missing data"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error":"User already exists"}),409

    email_extension={"gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com"}
    domain = email.split("@")[1].lower()

    if "@" not in email:
        return jsonify({"error": "Invalid email"}), 400

    if domain not in email_extension:
        return jsonify({"error":"Invalid email domain"}),400

    password_bytes = password.encode("utf-8")
    password_hash = hashpw(password_bytes,gensalt()).decode("utf-8")
    

    new_user = User(
        username=username,
        email=email,
        password_hash=password_hash
    )

    if not new_user:
        return jsonify({"error":"User could not be created"}),500

    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=email)
    response = jsonify({"message": "User created successfully"})
    set_access_cookies(response, access_token)
    return response, 201    

@app.route("/Login", methods=["POST"])
def login():
    email=request.json.get("email")
    password=request.json.get("password").encode("utf-8")
    user=User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error":"User not found or incorrect credentials"}),404

    stored_hash = user.password_hash.encode("utf-8")



    if(checkpw(password,stored_hash)):
        access_token = create_access_token(identity=email)
        response = jsonify({"message": "Login OK"})
        set_access_cookies(response, access_token)
        return response, 201   
    else:
        return jsonify({"error":"incorrect credentials"}),404
    
@app.route("/Protected", methods=["GET"])
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify(message="Access granted", user=user), 200

@app.route("/Logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout successful"})
    response.delete_cookie("access_token_cookie")
    return response, 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
