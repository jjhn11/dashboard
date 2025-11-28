"""
Test IBM Event Notifications using Python SDK
"""
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_eventnotifications.event_notifications_v1 import EventNotificationsV1
import json
from datetime import datetime

# Configuration
APIKEY = "prthuaK2QPZ6NfD_L94YkG335xC23mns8WUN3YN_wF60"
INSTANCE_GUID = "e325c9c2-9c97-4a85-ab4e-086ea4a85c0b"
SOURCE_ID = "3c8a0859-74c7-4db2-8cee-a701db223b54:api"
REGION = "us-south"

# Initialize Event Notifications
authenticator = IAMAuthenticator(APIKEY)
event_notifications_service = EventNotificationsV1(authenticator=authenticator)
event_notifications_service.set_service_url(
    f'https://{REGION}.event-notifications.cloud.ibm.com/event-notifications'
)

# Create notification
notification_body = {
    'ibmenseverity': 'MEDIUM',
    'id': f'test-notification-{int(datetime.now().timestamp() * 1000)}',
    'source': SOURCE_ID,
    'ibmensourceid': SOURCE_ID,
    'type': 'test.notification',
    'time': datetime.utcnow().isoformat() + 'Z',
    'ibmendefaultshort': 'Test notification from Python',
    'ibmendefaultlong': 'This is a test notification sent from Python to verify Event Notifications works',
    'specversion': '1.0',
    'data': {
        'message': 'Test from Python',
        'timestamp': datetime.utcnow().isoformat()
    },
    'datacontenttype': 'application/json'
}

try:
    print("🔔 Sending test notification...")
    print(f"📤 Params: {json.dumps(notification_body, indent=2)}")
    
    response = event_notifications_service.send_notifications(
        instance_id=INSTANCE_GUID,
        body=notification_body
    )
    
    print("✅ Notification sent successfully!")
    print(f"Response: {json.dumps(response.get_result(), indent=2)}")
    
except Exception as e:
    print(f"❌ Failed to send notification: {str(e)}")
    if hasattr(e, 'message'):
        print(f"Error message: {e.message}")
