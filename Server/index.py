

from flask import Flask, request, jsonify, g, session
from flask_bcrypt import Bcrypt
import sqlite3
import os


def create_app(test_config=None):
  # create and configure the app
  app = Flask(__name__, instance_relative_config=True)
  app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'hathor.sqlite'),
  )

  bcrypt = Bcrypt(app)

  if test_config is None:
    # load the instance config, if it exists, when not testing
    app.config.from_pyfile('config.py', silent=True)
  else:
    # load the test config if passed in
    app.config.from_mapping(test_config)

  # ensure the instance folder exists
  os.makedirs(app.instance_path, exist_ok=True)

  import db
  db.init_app(app)


  @app.before_request
  def load_user():
    user_id = session.get('user_id')
    if user_id:
      g.user = db.get_db().execute(
        'SELECT * FROM user WHERE id = ?', (user_id,)
      ).fetchone()
    else:
        g.user = None
    
  # Get all User
  @app.route('/api/users', methods=['GET'])
  def getUsers():
    try:
      database = db.get_db()
      cursor = database.cursor()

      cursor.execute("SELECT username FROM user")
      rows = cursor.fetchall()

      usernames = [row['username'] for row in rows]   
      
      
      return jsonify(usernames), 200
    except sqlite3.IntegrityError:
      return jsonify({'message': ' User already exists'})

      
  # Create User
  @app.route('/api/createUser', methods=['POST'])
  def createUser():
    try:
      database = db.get_db()
      cursor = database.cursor()

      # Getting create user form Data
      username = request.json['username']
      password = request.json['password']

      pw_hash = bcrypt.generate_password_hash(password)

      cursor.execute("INSERT INTO user (username, password) VALUES (?, ?)", (username, pw_hash))
      database.commit()

      return jsonify({'message': 'User Created!'}), 200
    except sqlite3.IntegrityError:
      return jsonify({'message': ' User already exists'})
      
    
  # Login the user
  @app.route('/api/loginUser', methods=["POST"])
  def login():
    try:
      database = db.get_db()
      cursor = database.cursor()
      username = request.json['username']
      password = request.json['password']
      
      cursor.execute("SELECT id, username, password FROM user WHERE username = ?", (username,))
      row = cursor.fetchone()
      
      if row is None:
        return jsonify({'message': 'Invalid Credentials'}), 401

      # Checking password and matching it with the hashed password
      passCheck = bcrypt.check_password_hash(row['password'], password)

      if passCheck is not True:
        return jsonify({'message': "Invalid Credentials"}), 401
      else: 
        session['user_id'] = row['id']
        return jsonify({'message': "Login Successful!"}), 200
      
    except:
      return jsonify({'message': "invalid User"})
    
    
  # Creating task
  @app.route('/api/createTask', methods=["POST"])
  def get_tasks():
    try:
      database = db.get_db()
      cursor = database.cursor()
      
      taskTitle = request.json['title']
      taskDescription = request.json['description']
      
      cursor.execute("INSERT INTO task (name, author_id, description) VALUES (?, ?, ?)", (taskTitle, session['user_id'], taskDescription))
      database.commit()
      return jsonify({"message": "added task successfully"})
      
    except sqlite3.IntegrityError:
      return jsonify({'message': "Couldnt create task"})
  
  return app


