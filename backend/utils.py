from datetime import datetime
from flask import jsonify
from googleapiclient.discovery import build
import re
from models import Patient
from database import db 

# Import functions from calendar API
from calendarAPI.calendar import authenticate
from calendarAPI.calendar import get_events
from calendarAPI.calendar import insert_event

# Define specialists based on medical issues
SPECIALISTS_MAPPING = {
    "cold": ["General Practitioner", "Internist", "Otolaryngologist", "Immunologist", "Allergist", "Pulmonologist"],
    "flu": ["General Practitioner", "Internist", "Infectious Disease Specialist", "Pulmonologist"],
    "influenza": ["General Practitioner", "Internist", "Infectious Disease Specialist", "Pulmonologist"],
    "diabetes": ["Endocrinologist", "General Practitioner", "Internist"],
    "hypertension": ["Cardiologist", "General Practitioner", "Internist"],
    "asthma": ["Pulmonologist", "Allergist", "General Practitioner", "Internist"],
    "depression": ["Psychiatrist", "Psychologist", "Therapist", "General Practitioner", "Internist"],
}

# Define available time slots for appointments
SLOTS = [(9, 10), (10, 11), (11, 12), (13, 14), (14, 15), (15, 16), (16, 17)]

def find_specialists(medical_issue):
    # Remove punctuation and convert to lowercase
    sanitized_issue = re.sub(r'[^\w\s]', '', medical_issue.lower())
    words = set(sanitized_issue.split())
    
    found_specialists = {specialty for word in words if word in SPECIALISTS_MAPPING 
                         for specialty in SPECIALISTS_MAPPING[word]}
    
    return list(found_specialists)

def format_available_slots(available_slots):
    return [f"{slot[0]}:00 - {slot[1]}:00" for slot in available_slots]

# Booking appointment logic separated for clarity
def book_appointment(message, data, doctor_name, date_str, time, patient_name, phone_number, mail_id, is_returning_user):
    creds = authenticate()
    service = build("calendar", "v3", credentials=creds)
    target_date = datetime.strptime((date_str or message) + ' 2024', '%d %m %Y')

    if time:
        return handle_event_creation(service, target_date, time, patient_name, phone_number, mail_id, doctor_name, is_returning_user, data)
    
    # Get available slots if time is not provided
    occupied_slots = get_events(service, target_date)
    available_slots = [slot for slot in SLOTS if slot not in occupied_slots]
    response_str = "Available appointments:\n" + "\n".join(format_available_slots(available_slots))
    return jsonify(response=response_str, isShow=False, cancel=True)

# Handle event creation and save patient
def handle_event_creation(service, target_date, time, patient_name, phone_number, mail_id, doctor_name, is_returning_user, data):
    start_datetime = int(time)
    end_datetime = start_datetime + 1
    summary = f"Appointment with {patient_name}"
    description = f"Patient's name: {patient_name}\nPhone: {phone_number}\nEmail: {mail_id}"
    
    event = insert_event(service, target_date, start_datetime, end_datetime, summary, description)
    
    if event and not is_returning_user:
        create_new_patient(data)
        
    return jsonify(response=f"Appointment booked with {doctor_name} on {target_date.date()} from {time}:00 to {end_datetime}:00.", isShow=True)


def create_new_patient(patient_data):
    # Generate a unique user ID by counting existing patients and appending it to the patient's name
    user_count = Patient.query.count() + 1
    user_name = re.sub(r'\s+', '_', patient_data.get('patientName', '').lower())
    user_id = f"{user_name}_{user_count:02d}"

    # Create a new patient object
    new_patient = Patient(
        user_id=user_id,
        name=patient_data.get('patientName', ''),  
        father_name=patient_data.get('fatherName', ''),
        gender=patient_data.get('gender', ''),
        age=patient_data.get('age', 0),
        height=patient_data.get('height', 0.0),
        weight=patient_data.get('weight', 0.0),
        bp=patient_data.get('bp', ''),
        mobile=patient_data.get('phoneNumber', ''),
        email=patient_data.get('mailId', ''),
        address=patient_data.get('address', ''),
        med_report=patient_data.get('medReport', '')
    )

    db.session.add(new_patient)
    db.session.commit()
