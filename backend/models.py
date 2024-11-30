from database import db

# Define Doctor model for the database
class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    gender = db.Column(db.String)
    clinic_place = db.Column(db.String)
    clinic_address = db.Column(db.String)
    specialist = db.Column(db.String)
    rating = db.Column(db.Float)
    experience = db.Column(db.Integer)
    image_url = db.Column(db.String)

# Define Patient model for the database
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    father_name = db.Column(db.String, nullable=False)
    gender = db.Column(db.String)
    age = db.Column(db.Integer)
    height = db.Column(db.Float)
    weight = db.Column(db.Float)
    bp = db.Column(db.String)
    mobile = db.Column(db.String)
    email = db.Column(db.String)
    address = db.Column(db.String)
    med_report = db.Column(db.String)
