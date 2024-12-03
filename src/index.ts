import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle shutdown signals
const gracefulShutdown = async () => {
    logger.error('Received shutdown signal, shutting down gracefully...');
    await server.close(() => {
        logger.error('Node server closed');
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Force shutdown due to long running processes...');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
