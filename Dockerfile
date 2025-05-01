# Use lightweight Nginx image
FROM nginx:alpine

# Copy website files to Nginx serving directory
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/

# Expose port 80
EXPOSE 80

# Command to run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]