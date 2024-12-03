#!/bin/sh

# Change permissions of logs directory
chmod -R 777 /usr/src/app/logs

# Start the application
exec "$@"
