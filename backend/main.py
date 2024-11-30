from flask_cors import CORS
from flask import Flask, jsonify, request
from llm.medBot import med_gpt
from models import Doctor, Patient
from utils import book_appointment, find_specialists  
from database import db 

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///medicalDB.sqlite3"
db.init_app(app)  
app.app_context().push() 

# Endpoint to receive data from the user
@app.route('/data', methods=['POST'])
def receive_data():
    global doctors_spec 

    # Extract incoming request data
    data = request.json or {}
    message = data.get("message", "")
    is_returning_user = data.get("isReturningUser", False)
    medical_data = data.get("medicalData", "")
    doctor_name = data.get("doctorName", "")
    date_str = data.get("date", "")
    patient_name = data.get("patientName", "")
    phone_number = data.get("phoneNumber", "")
    mail_id = data.get("mailId", "")
    time = data.get("startTime", "")

    # If medical data is provided, generate treatment recommendations using the chatbot
    if medical_data:
        return jsonify(response=med_gpt(user_data=medical_data, treatment=True), isShow=True)

    # If doctor name is provided, proceed with appointment booking
    if doctor_name:
        return book_appointment(message, data, doctor_name, date_str, time, patient_name, phone_number, mail_id, is_returning_user)

    # General medical advice
    answer = med_gpt(query=message)
    doctors_spec = find_specialists(answer)  # Identify specialists based on chatbot's response
    return jsonify(response=answer, isShow=True)

# Endpoint to get a list of doctors based on the identified specialization
@app.route('/doctors', methods=['GET'])
def get_doctors():
    global doctors_spec 
    
    if not doctors_spec:
        return jsonify([])

    doctor_list = []
    # For each identified specialization, query the doctors in the database
    for specialty in doctors_spec:
        doctors = Doctor.query.filter(Doctor.specialist.ilike(f'%{specialty}%')).all()

        for doctor in doctors:
            doctor_data = {
                'id': doctor.id,
                'name': doctor.name,
                'gender': doctor.gender,
                'clinic_place': doctor.clinic_place,
                'clinic_address': doctor.clinic_address,
                'specialist': doctor.specialist,
                'rating': doctor.rating,
                'experience': doctor.experience,
                'image_url': doctor.image_url,
            }
            doctor_list.append(doctor_data)

    return jsonify(doctor_list)

# Endpoint to get patient details based on user ID
@app.route('/patients', methods=['GET'])
def get_patient():
    userid = request.args.get('userid') 

    # Query the database for patient details associated with the user ID
    patients = Patient.query.filter(Patient.user_id.ilike(f'%{userid}%')).all()
    
    for patient in patients:
        patient_data = {
            "id": patient.id,
            "name": patient.name,
            "father_name": patient.father_name,
            "gender": patient.gender,
            "age": patient.age,
            "height": patient.height,
            "weight": patient.weight,
            "bp": patient.bp,
            "mobile": patient.mobile,
            "email": patient.email,
            "address": patient.address,
            "med_report": patient.med_report
        }
        return patient_data
    
if __name__ == "__main__":
    # Explicitly set the port (e.g., 5000 or 51190)
    app.run(debug=True, host="127.0.0.1", port=5000)  # Or use port=51190, if desired
