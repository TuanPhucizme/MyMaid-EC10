/**
 * Partner Notification Service
 * Handles notifications to partners when new paid orders are available
 */

const { db } = require('../config/firebaseAdmin');

/**
 * Notify available partners about a new paid order
 * @param {string} orderId - The order ID
 * @param {Object} orderData - The order data
 */
async function notifyPartnersAboutNewOrder(orderId, orderData) {
  try {
    console.log('📢 Notifying partners about new paid order:', orderId);

    // Get all active partners
    const partnersRef = db.collection('mm_partners');
    const activePartnersQuery = partnersRef.where('operational.status', '==', 'active');
    const partnersSnapshot = await activePartnersQuery.get();

    if (partnersSnapshot.empty) {
      console.log('⚠️ No active partners found');
      return { success: true, notifiedCount: 0 };
    }

    // Create notification data
    const notificationData = {
      type: 'new_order',
      orderId: orderId,
      title: 'Đơn hàng mới đã thanh toán',
      message: `Có đơn hàng ${orderData.service.name} mới đã thanh toán, cần xác nhận`,
      orderInfo: {
        serviceName: orderData.service.name,
        serviceIcon: orderData.service.icon,
        amount: orderData.payment.amount,
        address: orderData.contact.address,
        scheduledDate: orderData.schedule.date,
        scheduledTime: orderData.schedule.time
      },
      createdAt: new Date(),
      read: false,
      actionRequired: true
    };

    // Create notifications for all active partners
    const batch = db.batch();
    let notifiedCount = 0;

    partnersSnapshot.forEach(partnerDoc => {
      const partnerId = partnerDoc.id;
      const notificationRef = db.collection('notifications').doc();
      
      batch.set(notificationRef, {
        ...notificationData,
        partnerId: partnerId,
        userId: partnerId // For compatibility with existing notification system
      });
      
      notifiedCount++;
    });

    // Commit all notifications
    await batch.commit();

    console.log(`✅ Successfully notified ${notifiedCount} partners about order ${orderId}`);
    
    return { 
      success: true, 
      notifiedCount,
      partnerIds: partnersSnapshot.docs.map(doc => doc.id)
    };

  } catch (error) {
    console.error('❌ Error notifying partners about new order:', error);
    throw error;
  }
}

/**
 * Create a notification for a specific partner
 * @param {string} partnerId - The partner ID
 * @param {Object} notificationData - The notification data
 */
async function createPartnerNotification(partnerId, notificationData) {
  try {
    const notificationRef = db.collection('notifications').doc();
    
    await notificationRef.set({
      ...notificationData,
      partnerId: partnerId,
      userId: partnerId, // For compatibility
      createdAt: new Date(),
      read: false
    });

    console.log(`✅ Created notification for partner ${partnerId}`);
    return { success: true, notificationId: notificationRef.id };

  } catch (error) {
    console.error(`❌ Error creating notification for partner ${partnerId}:`, error);
    throw error;
  }
}

/**
 * Notify a specific partner when they are assigned to an order
 * @param {string} partnerId - The partner ID
 * @param {string} orderId - The order ID
 * @param {Object} orderData - The order data
 */
async function notifyPartnerAssignment(partnerId, orderId, orderData) {
  try {
    const notificationData = {
      type: 'order_assigned',
      orderId: orderId,
      title: 'Bạn đã được giao đơn hàng',
      message: `Đơn hàng ${orderData.service.name} đã được giao cho bạn`,
      orderInfo: {
        serviceName: orderData.service.name,
        serviceIcon: orderData.service.icon,
        amount: orderData.payment.amount,
        address: orderData.contact.address,
        scheduledDate: orderData.schedule.date,
        scheduledTime: orderData.schedule.time,
        customerName: orderData.contact.name,
        customerPhone: orderData.contact.phone
      },
      actionRequired: true
    };

    await createPartnerNotification(partnerId, notificationData);
    
    console.log(`✅ Notified partner ${partnerId} about order assignment ${orderId}`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Error notifying partner assignment:`, error);
    throw error;
  }
}

/**
 * Get notification statistics for monitoring
 */
async function getNotificationStats() {
  try {
    const notificationsRef = db.collection('notifications');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayNotificationsQuery = notificationsRef
      .where('createdAt', '>=', today)
      .where('type', '==', 'new_order');
    
    const snapshot = await todayNotificationsQuery.get();
    
    return {
      todayNotifications: snapshot.size,
      timestamp: new Date()
    };

  } catch (error) {
    console.error('❌ Error getting notification stats:', error);
    return { todayNotifications: 0, error: error.message };
  }
}

module.exports = {
  notifyPartnersAboutNewOrder,
  createPartnerNotification,
  notifyPartnerAssignment,
  getNotificationStats
};
