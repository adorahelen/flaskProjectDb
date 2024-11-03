from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import base64
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.environ.get('DB_USERNAME')}:{os.environ.get('DB_PASSWORD')}@"
    f"{os.environ.get('DB_HOST')}:{os.environ.get('DB_PORT')}/{os.environ.get('DB_NAME')}"
)

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    nickname = db.Column(db.String(100), unique=True)
    profile_image = db.Column(db.LargeBinary)
    profile_url = db.Column(db.String(255))
    role = db.Column(db.String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "nickname": self.nickname,
            "profile_url": self.profile_url,
            "role": self.role,
            "profile_image": self.get_profile_image_as_base64()
        }

    def get_profile_image_as_base64(self):
        if self.profile_image:
            return "data:image/png;base64," + base64.b64encode(self.profile_image).decode('utf-8')
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

if __name__ == '__main__':
    app.run(debug=True)