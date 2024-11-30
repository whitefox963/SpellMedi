from datetime import timedelta
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.errors import HttpError
import os.path

# Paths to credentials and token files
current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(current_dir, "credentials.json")
token_path = os.path.join(current_dir, "token.json")

# Google Calendar API scopes
SCOPES = ['https://www.googleapis.com/auth/calendar']
TIME_ZONE = 'Asia/Kolkata'

# Authenticate and return credentials
def authenticate():
    creds = None
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(cred_path, SCOPES)
            creds = flow.run_local_server(port=51234)
        with open(token_path, "w") as token_file:
            token_file.write(creds.to_json())

    return creds

# Retrieve events for a specific date
def get_events(service, target_date):
    # Define start and end of the target day
    start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
    time_min = start_of_day.isoformat() + "Z"
    time_max = (start_of_day + timedelta(days=1)).isoformat() + "Z"

    try:
        # Get events from Google Calendar API
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=time_min,
                timeMax=time_max,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        events = events_result.get("items", [])
        
        occupied_slots = set()
        for event in events:
            # Extract start and end times of each event
            start = event["start"].get("dateTime", event["start"].get("date"))
            end = event["end"].get("dateTime", event["end"].get("date"))
            slot = (int(start[11:13]), int(end[11:13])) 
            occupied_slots.add(slot)
        return occupied_slots

    except HttpError as error:
        print(f"An error occurred: {error}")
        return set()

# Insert a new event into Google Calendar
def insert_event(service, date, startTime, endTime, summary, description):
    event = {
        'start': {'dateTime': f'{date.date()}T{startTime}:00:00+05:30', 'timeZone': TIME_ZONE},
        'end': {'dateTime': f'{date.date()}T{endTime}:00:00+05:30', 'timeZone': TIME_ZONE},
        'summary': summary,
        "description": description 
    }
    print(event)
    
    try:
        event = service.events().insert(calendarId="primary", body=event).execute()
        print("Inserted calendar event")
        return event
    
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None
