// const admin = require('firebase-admin');
// const path = require('path');

// let messaging = null;
// let firebaseInitialized = false;

// // Initialize Firebase Admin
// try {
//   if (!admin.apps.length) {
//     let serviceAccount;
    
//     console.log('🔍 Checking for FIREBASE_SERVICE_ACCOUNT_JSON...');
//     console.log('Env var exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    
//     // Try to get from environment variable first (for Railway)
//     if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
//       try {
//         serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
//         console.log('✅ Parsed Firebase config from environment variable');
        
//         admin.initializeApp({
//           credential: admin.credential.cert(serviceAccount),
//         });
//         console.log('✅ Firebase Admin initialized successfully');
//         messaging = admin.messaging();
//         firebaseInitialized = true;
//       } catch (parseError) {
//         console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', parseError.message);
//         console.warn('⚠️ Firebase notifications disabled - invalid JSON in env var');
//       }
//     } else {
//       // Try file path for local development only
//       console.log('⚠️ FIREBASE_SERVICE_ACCOUNT_JSON not found in environment');
//       try {
//         const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../firebase-service-account.json');
//         console.log('Trying local file path:', serviceAccountPath);
//         serviceAccount = require(serviceAccountPath);
        
//         admin.initializeApp({
//           credential: admin.credential.cert(serviceAccount),
//         });
//         console.log('✅ Firebase Admin initialized from file');
//         messaging = admin.messaging();
//         firebaseInitialized = true;
//       } catch (fileError) {
//         console.warn('⚠️ Firebase notifications disabled - no service account found');
//         console.warn('   Set FIREBASE_SERVICE_ACCOUNT_JSON environment variable for production');
//       }
//     }
//   }
// } catch (error) {
//   console.error('❌ Firebase initialization error:', error.message);
//   console.warn('⚠️ Firebase notifications will not work without proper service account configuration');
// }

// /**
//  * Send notification to specific user
//  */
// const sendNotificationToUser = async (userId, notification, tokens) => {
//   if (!firebaseInitialized || !messaging) {
//     console.warn('Firebase messaging not initialized - skipping notification');
//     return { success: false, message: 'Firebase not initialized' };
//   }
  
//   if (!tokens || tokens.length === 0) {
//     console.log(`No tokens found for user ${userId}`);
//     return { success: false, message: 'No tokens available' };
//   }

//   try {
//     const message = {
//       notification: {
//         title: notification.title,
//         body: notification.body,
//       },
//       data: {
//         type: notification.type,
//         redirectUrl: notification.redirectUrl || '',
//         notificationId: notification.id || '',
//       },
//       webpush: {
//         fcmOptions: {
//           link: notification.redirectUrl || '/',
//         },
//         notification: {
//           title: notification.title,
//           body: notification.body,
//           icon: '/Images/logo.png',
//           badge: '/Images/logo.png',
//           tag: notification.type,
//           requireInteraction: false,
//         },
//       },
//     };

//     const response = await messaging.sendMulticast({
//       ...message,
//       tokens: tokens,
//     });

//     console.log(`Notification sent to user ${userId}:`, response);
//     return { success: true, response };
//   } catch (error) {
//     console.error(`Error sending notification to user ${userId}:`, error);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send notification to all users
//  */
// const sendNotificationToAll = async (notification, tokens) => {
//   if (!firebaseInitialized || !messaging) {
//     console.warn('Firebase messaging not initialized - skipping notification');
//     return { success: false, message: 'Firebase not initialized' };
//   }
  
//   if (!tokens || tokens.length === 0) {
//     console.log('No tokens available for broadcast');
//     return { success: false, message: 'No tokens available' };
//   }

//   try {
//     const message = {
//       notification: {
//         title: notification.title,
//         body: notification.body,
//       },
//       data: {
//         type: notification.type,
//         redirectUrl: notification.redirectUrl || '',
//         notificationId: notification.id || '',
//       },
//       webpush: {
//         fcmOptions: {
//           link: notification.redirectUrl || '/',
//         },
//         notification: {
//           title: notification.title,
//           body: notification.body,
//           icon: '/Images/logo.png',
//           badge: '/Images/logo.png',
//           tag: notification.type,
//           requireInteraction: false,
//         },
//       },
//     };

//     const response = await messaging.sendMulticast({
//       ...message,
//       tokens: tokens,
//     });

//     console.log('Broadcast notification sent:', response);
//     return { success: true, response };
//   } catch (error) {
//     console.error('Error sending broadcast notification:', error);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send topic-based notification
//  */
// const sendNotificationToTopic = async (topic, notification) => {
//   if (!firebaseInitialized || !messaging) {
//     console.warn('Firebase messaging not initialized - skipping notification');
//     return { success: false, message: 'Firebase not initialized' };
//   }
  
//   try {
//     const message = {
//       notification: {
//         title: notification.title,
//         body: notification.body,
//       },
//       data: {
//         type: notification.type,
//         redirectUrl: notification.redirectUrl || '',
//         notificationId: notification.id || '',
//       },
//       webpush: {
//         fcmOptions: {
//           link: notification.redirectUrl || '/',
//         },
//         notification: {
//           title: notification.title,
//           body: notification.body,
//           icon: '/Images/logo.png',
//           badge: '/Images/logo.png',
//           tag: notification.type,
//           requireInteraction: false,
//         },
//       },
//       topic: topic,
//     };

//     const response = await messaging.send(message);
//     console.log(`Notification sent to topic ${topic}:`, response);
//     return { success: true, response };
//   } catch (error) {
//     console.error(`Error sending notification to topic ${topic}:`, error);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Subscribe token to topic
//  */
// const subscribeToTopic = async (tokens, topic) => {
//   if (!firebaseInitialized || !messaging) {
//     console.warn('Firebase messaging not initialized - skipping subscription');
//     return { success: false, message: 'Firebase not initialized' };
//   }
  
//   try {
//     const response = await messaging.subscribeToTopic(tokens, topic);
//     console.log(`Subscribed to topic ${topic}:`, response);
//     return { success: true, response };
//   } catch (error) {
//     console.error(`Error subscribing to topic ${topic}:`, error);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Unsubscribe token from topic
//  */
// const unsubscribeFromTopic = async (tokens, topic) => {
//   if (!firebaseInitialized || !messaging) {
//     console.warn('Firebase messaging not initialized - skipping unsubscription');
//     return { success: false, message: 'Firebase not initialized' };
//   }
  
//   try {
//     const response = await messaging.unsubscribeFromTopic(tokens, topic);
//     console.log(`Unsubscribed from topic ${topic}:`, response);
//     return { success: true, response };
//   } catch (error) {
//     console.error(`Error unsubscribing from topic ${topic}:`, error);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = {
//   sendNotificationToUser,
//   sendNotificationToAll,
//   sendNotificationToTopic,
//   subscribeToTopic,
//   unsubscribeFromTopic,
//   messaging,
// };


const admin = require('firebase-admin');

let messaging = null;

function initializeFirebase() {
  try {
    // Try env var first
    let serviceAccount = null;

    const envVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    console.log('🔍 FIREBASE env var exists:', !!envVar);

    if (envVar) {
      try {
        serviceAccount = JSON.parse(envVar);
        console.log('✅ Parsed Firebase credentials from env var');
      } catch (e) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e.message);
      }
    }

    // Hardcoded fallback (for Railway which ignores env vars)
    if (!serviceAccount) {
      console.log('⚠️ Using hardcoded Firebase credentials');
      serviceAccount = {
        type: "service_account",
        project_id: "game-2bfc4",
        private_key_id: "1f7455b35f4a2b14b70162f4ea12c831f6e30946",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvl8cN3g0Ul0ok\nJu2qDJaFLJcyiquT0tC6NeGLzkhFmO9hE1GcMzLoZQg7tgH/3rQ+DZ6YEtM5HzA0\n/on8piDhRhi8BmToB9+gzhg5VpaqgC6473QaZ5RPzdBEMm4AEz/FHakWEd4fT68j\n93St7ZuPGGa8C8c+rasqlPGDTybLP4PLuYiwv1XR3HMkrmYQvEYye1GgPZlW/mOG\nKVNKigak27k1JPEQ79HCFONgDx+oMHEF/OZV3NQC0uariLV3aI1dKmPStvNFqbBm\nPhGB96Rm18IDMy7O/FngyamEZkmiWZ34TmNwwcrO2x/nyowS2Ux3eXYRuGdFz28Z\nleOlV+NXAgMBAAECggEAEF7YIgTXt1m7gc9XTQlLZzMXDZE8GdYHu7SWSJB80HBH\nsQc6DpP/ZQc2U0rOuOosZ7ShWpA2vRaZSfeJKdLbMeV1HOKDudYyFS3huEbIWTEG\nKhu4+VU60I3hotoIw10IDvqK7xHPYZ/uNi415JlIbXja6yE1/DP4x0mHkrRoa35i\nuBauUpPhs1JQQyMVKkYqQJ21FwlqsM/qnUzfnAfr6/SFdhtenvLbxgRlOK58UwwL\nZ9OiCx6W00XVeHXfs/s6o537w/KXDndaG1Xh4I7w/5jdN4TyDeIHGS2W6HL/Qq5g\nkxQQqR2Vguj6VO5O65ksj6FSJ5+c5KtiVviY9O18kQKBgQDo3m2l8kkanDhz3dGE\nvF8nQyOytooVYSz7jnjvGBLoKhkmv8GA7faYxzfHhHu0wo+ShYWcPD45/jlRMZI6\nSLPfiZLL/7Q5311mWFWF0zv8R1URBDPdxBUk/lupZgYgskZX1AXwjz5icbMKzGRR\nowewOCvav4JXYY2cf/+rwFkjHQKBgQDBCOQLP8CMMN0UlZNgpOu4q3flGoifb6Ir\nKeeoyf1yne+t6uu+zwfbV4lCht6Kl4Oa4gvIhK+H7HBTGMkj3zokR7VzYBwoDR7u\nWf8euli2AsYdKXnDDkBoycO4o12TCdDwGt71jgqLyhJ+nID3PEeXBKZwy+TsxNJU\njeZU0wtCAwKBgQCq3WII7FD1hIDri2vLgEg1T88mt0d0TnwqDCzyCnD9Br6zrum1\nx2U0TqC/9ZarWELuWKhjrdReywmVaNEJkQTiVVhv9Kxx9lHa4Z/G9OpDvrdNKA9C\nfjihjz0Ee8atQQHaOckt7Hzy0Mh1eOl2+S+P/nc3J2Pk58B3f3fCtvzwhQKBgCBN\nc5PqVDdhie2C5km673NUxliBazF7BeFBPvIA8ze19EDfWhnxHTh4WpDWbvE0T6Kg\nhyZEBfex+k39jNNC7MDbeyLWh3+wSmfKiaXDu0qiBjMlGKoqfV7LvMPuGp+beepk\nJMFkxqED7LphSDeXT8eW0J95j1KL0UKzCENTmcOvAoGAOMD6ODwIkvGKFQEbOV5t\ns07d2LP9o9GLk8ZLHFwvQRpi8IGzIE8Z54VgK5Hl6bvdIpU4rXVY1RBgUcVG0bJu\n16NkH6l2FzlLE1rqq698roOfIZlU1OdusG8Wr/hvqC2A7omuOQEMwkvFM9MphiGl\nxdR9Ocku3ZfZEFep00OCzyg=\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-fbsvc@game-2bfc4.iam.gserviceaccount.com",
        client_id: "100408522684069841781",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40game-2bfc4.iam.gserviceaccount.com",
        universe_domain: "googleapis.com"
      };
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    messaging = admin.messaging();
    console.log('✅ Firebase initialized successfully!');

  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    messaging = null;
  }
}

initializeFirebase();

async function sendNotificationToToken(token, title, body, data = {}) {
  if (!messaging) {
    console.log('⚠️ Firebase not initialized, skipping notification');
    return null;
  }
  try {
    const message = { notification: { title, body }, data, token };
    const response = await messaging.send(message);
    console.log('✅ Notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return null;
  }
}

async function sendNotificationToTopic(topic, title, body, data = {}) {
  if (!messaging) {
    console.log('⚠️ Firebase not initialized, skipping notification');
    return null;
  }
  try {
    const message = { notification: { title, body }, data, topic };
    const response = await messaging.send(message);
    console.log('✅ Topic notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending topic notification:', error);
    return null;
  }
}

async function subscribeToTopic(tokens, topic) {
  if (!messaging) return null;
  try {
    const response = await messaging.subscribeToTopic(tokens, topic);
    console.log('✅ Subscribed to topic:', response);
    return response;
  } catch (error) {
    console.error('❌ Error subscribing to topic:', error);
    return null;
  }
}

async function unsubscribeFromTopic(tokens, topic) {
  if (!messaging) return null;
  try {
    const response = await messaging.unsubscribeFromTopic(tokens, topic);
    return response;
  } catch (error) {
    console.error('❌ Error unsubscribing from topic:', error);
    return null;
  }
}

/**
 * Send notification to all users (broadcast)
 */
async function sendNotificationToAll(notification, tokens) {
  if (!messaging) {
    console.log('⚠️ Firebase not initialized, skipping broadcast notification');
    return { success: false, message: 'Firebase not initialized' };
  }
  
  if (!tokens || tokens.length === 0) {
    console.log('⚠️ No tokens available for broadcast');
    return { success: false, message: 'No tokens available' };
  }

  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        type: notification.type,
        redirectUrl: notification.redirectUrl || '',
        notificationId: notification.id?.toString() || '',
      },
      webpush: {
        fcmOptions: {
          link: notification.redirectUrl || '/',
        },
        notification: {
          title: notification.title,
          body: notification.body,
          icon: '/Images/logo.png',
          badge: '/Images/logo.png',
          tag: notification.type,
          requireInteraction: false,
        },
      },
    };

    const response = await messaging.sendMulticast({
      ...message,
      tokens: tokens,
    });

    console.log(`✅ Broadcast sent to ${tokens.length} tokens:`, {
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
    
    return { success: true, response };
  } catch (error) {
    console.error('❌ Error sending broadcast notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification to specific user
 */
async function sendNotificationToUser(userId, notification, tokens) {
  if (!messaging) {
    console.log('⚠️ Firebase not initialized, skipping user notification');
    return { success: false, message: 'Firebase not initialized' };
  }
  
  if (!tokens || tokens.length === 0) {
    console.log(`⚠️ No tokens available for user ${userId}`);
    return { success: false, message: 'No tokens available' };
  }

  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        type: notification.type,
        redirectUrl: notification.redirectUrl || '',
        notificationId: notification.id?.toString() || '',
      },
      webpush: {
        fcmOptions: {
          link: notification.redirectUrl || '/',
        },
        notification: {
          title: notification.title,
          body: notification.body,
          icon: '/Images/logo.png',
          badge: '/Images/logo.png',
          tag: notification.type,
          requireInteraction: false,
        },
      },
    };

    const response = await messaging.sendMulticast({
      ...message,
      tokens: tokens,
    });

    console.log(`✅ Notification sent to user ${userId} on ${tokens.length} devices:`, {
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
    
    return { success: true, response };
  } catch (error) {
    console.error(`❌ Error sending notification to user ${userId}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  messaging,
  sendNotificationToToken,
  sendNotificationToTopic,
  sendNotificationToAll,
  sendNotificationToUser,
  subscribeToTopic,
  unsubscribeFromTopic
};