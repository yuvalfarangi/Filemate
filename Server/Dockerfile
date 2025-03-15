# Use official Python image
FROM python:3.11

# Set working directory inside the container
WORKDIR /server

# Copy requirements first to leverage Docker caching
COPY requirements.txt /server/

# Ensure yt-dlp installs properly
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the Django project files into the container
COPY filemate_django_server /server/filemate_django_server
COPY filemate_django_app /server/filemate_django_app
COPY manage.py /server/manage.py

# Ensure manage.py is executable
RUN chmod +x /server/manage.py

# Expose the port Django runs on
EXPOSE 8000

# Start Django server
CMD ["python", "/server/manage.py", "runserver", "0.0.0.0:8000"]