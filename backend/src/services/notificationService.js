const EventNotificationsV1 = require('@ibm-cloud/event-notifications-node-admin-sdk/event-notifications/v1');
const { IamAuthenticator } = require('@ibm-cloud/event-notifications-node-admin-sdk/auth');
require('dotenv').config();

let eventNotificationsService;

// Initialize Event Notifications service
function initializeEventNotifications() {
  try {
    // Force IPv4 to avoid connection issues
    const dns = require('dns');
    dns.setDefaultResultOrder('ipv4first');
    
    const authenticator = new IamAuthenticator({
      apikey: process.env.EVENT_NOTIFICATIONS_APIKEY,
    });

    eventNotificationsService = new EventNotificationsV1({
      authenticator: authenticator,
      serviceUrl: `https://${process.env.EVENT_NOTIFICATIONS_REGION}.event-notifications.cloud.ibm.com/event-notifications`,
    });

    console.log('✅ Event Notifications service initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Event Notifications:', error.message);
    return false;
  }
}

// Send a notification event
async function sendNotification(eventType, eventData) {
  if (!eventNotificationsService) {
    console.warn('⚠️ Event Notifications not initialized, skipping notification');
    return null;
  }

  try {
    const notificationBody = {
      ibmenseverity: 'MEDIUM',
      id: `${eventType}-${Date.now()}`,
      source: process.env.EVENT_NOTIFICATIONS_SOURCE_ID,
      ibmensourceid: process.env.EVENT_NOTIFICATIONS_SOURCE_ID,
      type: eventType,
      time: new Date().toISOString(),
      ibmendefaultshort: eventData.message || 'Dashboard notification',
      ibmendefaultlong: JSON.stringify(eventData),
      specversion: '1.0',
      data: eventData,
      datacontenttype: 'application/json',
    };

    const params = {
      instanceId: process.env.EVENT_NOTIFICATIONS_GUID,
      body: notificationBody,
    };

    console.log('📤 Sending notification with params:', JSON.stringify(params, null, 2));
    const response = await eventNotificationsService.sendNotifications(params);
    console.log(`✅ Notification sent: ${eventType}`);
    console.log('Response:', JSON.stringify(response.result, null, 2));
    return response.result;
  } catch (error) {
    console.error(`❌ Failed to send notification (${eventType}):`, error.message);
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
    if (error.status) {
      console.error('HTTP status:', error.status);
    }
    console.error('Full error:', error);
    return null;
  }
}

// Specific notification functions
async function notifyUserRegistered(user) {
  return sendNotification('user.registered', {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    timestamp: new Date().toISOString(),
    message: `New user registered: ${user.firstName} ${user.lastName} (${user.email})`,
  });
}

async function notifyUserLogin(user) {
  return sendNotification('user.login', {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    timestamp: new Date().toISOString(),
    message: `User logged in: ${user.firstName} ${user.lastName} (${user.email})`,
  });
}

async function notifyPostCreated(post, user) {
  return sendNotification('post.created', {
    postId: post.id,
    userId: user.id,
    userEmail: user.email,
    userName: `${user.firstName} ${user.lastName}`,
    postContent: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
    timestamp: new Date().toISOString(),
    message: `New post created by ${user.firstName} ${user.lastName}`,
  });
}

module.exports = {
  initializeEventNotifications,
  sendNotification,
  notifyUserRegistered,
  notifyUserLogin,
  notifyPostCreated,
};
