# flask + springboot(MySQL)
- 개요 : 스프링 부트에서 사용하던 DB, 플라스크 연결 후 데이터 조회 

## 시현 및 비교
<img width="655" alt="image" src="https://github.com/user-attachments/assets/c120bd81-391a-4325-ab6f-12f186dac32b">
<img width="655" alt="image" src="https://github.com/user-attachments/assets/d308e4d9-6585-4b8d-a506-2a4c9f8bbc5f">
<img width="655" alt="image" src="https://github.com/user-attachments/assets/40044081-59f6-4165-bfbd-5e5717b34354">


## 디렉토리 구조 & DB환경설정
<img width="655" alt="image" src="https://github.com/user-attachments/assets/48e61970-c6e0-49ea-954d-d03aea0ba6dc">


# Flask 애플리케이션 코드 설명



```python

## 1. 기본 설정 및 라이브러리 임포트
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import base64

	•	Flask: 웹 애플리케이션 프레임워크입니다.
	•	SQLAlchemy: SQL 데이터베이스와의 ORM(Object Relational Mapping) 인터페이스를 제공합니다.
	•	Flask-Migrate: 데이터베이스 마이그레이션을 관리하는 도구입니다.
	•	os: 환경 변수를 통해 데이터베이스 연결 정보 등을 가져오기 위해 사용합니다.
	•	base64: 이진 데이터를 Base64 문자열로 인코딩하는 데 사용됩니다.


## 2. Flask 애플리케이션 및 데이터베이스 설정
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.environ.get('DB_USERNAME')}:{os.environ.get('DB_PASSWORD')}@"
    f"{os.environ.get('DB_HOST')}:{os.environ.get('DB_PORT')}/{os.environ.get('DB_NAME')}"
)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

	•	Flask 인스턴스 생성: 애플리케이션의 진입점입니다.
	•	SQLAlchemy 데이터베이스 URI 설정: 데이터베이스 연결 정보를 환경 변수에서 가져와 설정합니다.
	•	SQLAlchemy 및 Migrate 인스턴스 생성: 데이터베이스 ORM 및 마이그레이션 기능을 제공하는 인스턴스를 생성합니다.


## 3. 모델 정의
class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    files = db.relationship('InsertedFile', back_populates='article', cascade="all, delete-orphan", lazy='dynamic')
    comments = db.relationship('Comment', back_populates='article', cascade="all, delete-orphan", lazy='dynamic')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "author": self.author,
            "files": [file.to_dict() for file in self.files],
            "comments": [comment.to_dict() for comment in self.comments]
        }

	•	속성: id, title, content, author 필드 및 다른 모델과의 관계를 정의합니다.
	•	to_dict() 메서드: 객체를 JSON 직렬화 가능한 형식으로 변환합니다.


## 4. 라우트 설정
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/users', methods=['GET'])
def user_home():
    return render_template('user.html')

	•	홈 페이지: 기본 URL에서 index.html 템플릿을 렌더링합니다.
	•	사용자 페이지: /users 경로에서 user.html 템플릿을 렌더링합니다.


## 5. API 엔드포인트
@app.route('/api/articles', methods=['GET'])
def get_articles():
    try:
        articles = Article.query.all()
        return jsonify([article.to_dict() for article in articles]), 200
    except Exception as e:
        print("Error fetching articles:", e)
        return jsonify({"error": str(e)}), 500

	•	기사 조회: 데이터베이스에서 모든 기사를 조회하고 JSON 형식으로 반환합니다.

## 6. 애플리케이션 실행
if __name__ == '__main__':
    app.run(debug=True)
