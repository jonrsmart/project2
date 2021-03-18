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

class Salary(db.Model):
    __tablename__ = 'salary_info'
    __table_args__ = { 'extend_existing': True }
    CBSAFP = db.Column(db.Text, primary_key=True)  

@app.route('/county/<slug>')
def detail(slug):
    slug = slug.replace("-", " ")
    slug = slug.title()
    print(slug)
    county2 = Disasters.query.filter_by(Name=slug).first()
    fips = Disasters.query.filter_by(Name=slug).first().fips_total
    print(fips)
    disasters = Disasters.query.filter_by(Name=slug).first().numDisasters
    result = Salary.query.filter_by(CBSAFP=fips).with_entities(func.sum(Salary.tot_emp).label("TotalEmployed")).first()
    total = result.TotalEmployed
    print(county2)
    return render_template("detail.html", county=slug, disasters=disasters, total=total)

@app.route("/")
def index():
    counties = Disasters.query.with_entities(Disasters.Name).distinct().all()
    counties = [county[0].title() for county in counties]
    counties = sorted(list(set(counties)))
    result = Salary.query.with_entities(func.sum(Salary.tot_emp).label("TotalEmployed")).first()
    total = int(result.TotalEmployed)
    return render_template("index.html", counties=counties, total=total)

@app.route('/county')
def county_list():
    counties = Disasters.query.with_entities(Disasters.Name).distinct().all()
    counties = [county[0].title() for county in counties]
    counties = sorted(list(set(counties)))
    return render_template("cities.html", counties=counties)

if __name__ == '__main__':
    app.run(debug=True)