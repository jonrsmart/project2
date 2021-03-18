# app.py
from flask import Flask, json, url_for
from flask import render_template
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from geojson import Point, MultiPoint
import jinja2
import json
from pprint import pprint
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///schools.sqlite3'
db = SQLAlchemy(app)

db.Model.metadata.reflect(db.engine)

class School(db.Model):
    __tablename__ = 'schools-geocoded'
    __table_args__ = { 'extend_existing': True }
    LOC_CODE = db.Column(db.Text, primary_key=True)    

@app.route('/schools/<slug>')
def detail(slug):
    school = School.query.filter_by(LOC_CODE=slug).first()
    return render_template("detail.html", school=school)

@app.route('/zip/<zipcode>')
def zip(zipcode):
    schools = School.query.filter_by(ZIP=zipcode).all()
    return render_template("list.html", schools=schools, count=len(schools), location=zipcode)

@app.route('/city/<cityname>')
def city(cityname):
    cityname = cityname.replace("-", " ")
    schools = School.query.filter_by(city=cityname.upper()).all()
    zipped=[]
    for school in schools:
        zipped.append([float(school.longitude),float(school.latitude),school.SCHOOLNAME])
    return render_template("list.html", schools=schools, count=len(schools), location=cityname, zipped=zipped)

@app.route("/")
def index():
    
    return render_template("index.html")

@app.route('/city')
def city_list():
    # Get the unique city values from the database
    cities = School.query.with_entities(School.city).distinct().all()
    # ...more notes I'm hiding...
    # Convert to titlecase while we're pulling out of the weird list thing
    cities = [city[0].title() for city in cities]
    # Now that they're both "New York," we can now dedupe and sort
    cities = sorted(list(set(cities)))
    return render_template("cities.html", cities=cities)

@app.route('/zipcode')
def zip_list():
    # Get the unique city values from the database
    zipcodes = School.query.with_entities(School.zipcode).distinct().all()
    # They're in a weird list of one-element lists, though, like
    # [['Yonkers'],['Brooklyn'],['Manhattan']]
    # so we'll take them out of that
    zipcodes = [zip[0] for zip in zipcodes]
    return render_template("zipcodes.html", zipcodes=zipcodes)

if __name__ == '__main__':
    app.run(debug=True)