require('dotenv').config();

const { app, PORT } = require('./app');
const { initializeEventNotifications } = require('./services/notificationService');

// Initialize Event Notifications service
initializeEventNotifications();

app.listen(PORT, () => {
	console.info(`🚀 Backend ready on http://localhost:${PORT}`);
});
