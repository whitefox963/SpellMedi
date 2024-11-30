from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import db
from models import Doctor, Patient

engine = create_engine("sqlite:///medicalDB.sqlite3")

Session = sessionmaker(bind=engine)
session = Session()

db.metadata.create_all(engine)

# Add patient data
patient_data = {
    "user_id": "vamshi",
    "name": "Vamshi",
    "father_name": "David",
    "gender": "Male",
    "age": 22,
    "height": 175.5,
    "weight": 70.2,
    "bp": "120/80",
    "mobile": "8838748737",
    "email": "moahan@example.com",
    "address": "123 Main Street, Cbe",
    "med_report": "report link"
}

new_patient = Patient(**patient_data)
session.add(new_patient)

# Add doctor data
doctors_data = [
    # General Practitioner, Internist
    {"name": "Dr. R. Venkatesh", "gender": "Male", "clinic_place": "Lotus Eye Hospital", "clinic_address": "SF No.770/12, Avinashi Road, Peelamedu, Dharwad, Karnataka, 580009", "specialist": "General Practitioner", "rating": 4.8, "experience": 15},
    {"name": "Dr. T. S. Ravikumar", "gender": "Male", "clinic_place": "KMCH City Center", "clinic_address": "770/12, Avinashi Road, Peelamedu, Dharwad, Karnataka, 580009", "specialist": "Internist", "rating": 4.7, "experience": 17},

    # Otolaryngologist, Immunologist, Allergist, Pulmonologist for cold, flu, and asthma
    {"name": "Dr. P. Senthilkumar", "gender": "Male", "clinic_place": "Kovai Medical Center and Hospital", "clinic_address": "No. 3209, Avinashi Road, Dharwad, Karnataka, 641014", "specialist": "Pulmonologist", "rating": 4.9, "experience": 18},
    {"name": "Dr. G. Prakash", "gender": "Male", "clinic_place": "KMCH City Center", "clinic_address": "770/12, Avinashi Road, Peelamedu, Dharwad, Karnataka, 580009", "specialist": "Allergist", "rating": 4.9, "experience": 20},
    {"name": "Dr. R. Manimaran", "gender": "Male", "clinic_place": "PSG Hospitals", "clinic_address": "Peelamedu, Avinashi Road, Dharwad, Karnataka, 580009", "specialist": "Otolaryngologist", "rating": 4.6, "experience": 10},

    # Endocrinologist for diabetes
    {"name": "Dr. N. Vignesh", "gender": "Male", "clinic_place": "Kovai Diabetes Speciality Centre", "clinic_address": "1031, Avinashi Road, Pappanaickenpalayam, Dharwad, Karnataka, 580009", "specialist": "Endocrinologist", "rating": 4.6, "experience": 8},

    # Cardiologist for hypertension
    {"name": "Dr. A. Vanitha", "gender": "Female", "clinic_place": "Sri Ramakrishna Hospital", "clinic_address": "395, Sarojini Naidu Road, Sidhapudur, Dharwad, Karnataka, 580009", "specialist": "Cardiologist", "rating": 4.8, "experience": 14},

    # Psychiatrists, Psychologists, and Therapists for depression
    {"name": "Dr. S. Rajkumar", "gender": "Male", "clinic_place": "Dharwad Bone & Joint Clinic", "clinic_address": "18, Thirugnanasambandar Street, R.S. Puram, Dharwad, Karnataka, 580009", "specialist": "Psychiatrist", "rating": 4.7, "experience": 13},
    {"name": "Dr. M. Prema", "gender": "Female", "clinic_place": "Gem Hospital", "clinic_address": "45, Pankaja Mills Road, Ramanathapuram, Dharwad, Karnataka, 580009", "specialist": "Psychologist", "rating": 4.7, "experience": 12}
]

for data in doctors_data:
    data["image_url"] = f"./DoctorImages/image1.jpeg" if data['gender'] == 'Male' else f"./DoctorImages/image2.jpeg"
    doctor = Doctor(**data)
    session.add(doctor)

session.commit()