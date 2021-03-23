# app.py
from flask import Flask, json, url_for
from flask import render_template
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from geojson import Point, MultiPoint
import jinja2
import json
from pprint import pprint
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///static/data/data_analysts.db'
db = SQLAlchemy(app)

db.Model.metadata.reflect(db.engine)

class Disasters(db.Model):
    __tablename__ = 'disastersgeo'
    __table_args__ = { 'extend_existing': True }
    Name = db.Column(db.Text, primary_key=True)    

class States(db.Model):
    __tablename__ = 'center-states'
    __table_args__ = { 'extend_existing': True }
    FIPS = db.Column(db.Float, primary_key=True)  

class Salary(db.Model):
    __tablename__ = 'salary_info'
    __table_args__ = { 'extend_existing': True }
    CBSAFP = db.Column(db.Text, primary_key=True)  

@app.route('/states/<slug>')
def detail(slug):
    state_names = States.query.all()
    state = States.query.filter_by(FIPS=slug).first()
    return render_template("detail.html", state=state, states=state_names)

@app.route("/")
def index():
    state_names = States.query.all()
    print(state_names)
    result = Salary.query.with_entities(func.sum(Salary.tot_emp).label("TotalEmployed")).first()
    total = int(result.TotalEmployed)
    return render_template("index.html", states=state_names, total=total)

@app.route("/about")
def about():
    state_names = States.query.all()
    print(state_names)
    result = Salary.query.with_entities(func.sum(Salary.tot_emp).label("TotalEmployed")).first()
    total = int(result.TotalEmployed)
    return render_template("about.html", states=state_names, total=total)

@app.route('/states')
def county_list():
    state_names = States.query.all()    
    return render_template("states.html", states=state_names)

if __name__ == '__main__':
    app.run(debug=True)