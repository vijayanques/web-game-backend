let io;

module.exports = {
  init: (socketIoInstance) => {
    io = socketIoInstance;
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('join', (userId) => {
        if (userId) {
          socket.join(`user_${userId}`);
          console.log(`Socket ${socket.id} joined room user_${userId}`);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  emitNotification: (notification, sendToAll, userId) => {
    if (!io) {
      console.log('Socket.io not initialized, cannot emit notification');
      return;
    }
    
    const payload = {
      notification: {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        createdAt: notification.createdAt,
      },
      data: {
        type: notification.type,
        redirectUrl: notification.redirectUrl || '',
        notificationId: notification.id || '',
        imageUrl: notification.imageUrl || '',
      }
    };

    console.log('Emitting notification:', payload);

    if (sendToAll) {
      io.emit('new_notification', payload);
    } else if (userId) {
      io.to(`user_${userId}`).emit('new_notification', payload);
    }
  }
};
