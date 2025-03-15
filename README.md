<<<<<<< HEAD
# Filemate
FileMate is a mobile application that provides file management tools such as downloading, compressing files, and tracking download history. It includes a personal profile system where users can view their download history, manage their files, and interact with the system via an intuitive UI.
=======
FileMate

FileMate is a mobile application that provides file management tools such as downloading, compressing files, and tracking download history. It includes a personal profile system where users can view their download history, manage their files, and interact with the system via an intuitive UI.

Main Features
	•	React Native Frontend: The mobile app is built using React Native, providing a smooth cross-platform experience. The user interface is designed with UI-Kitten to ensure a modern and responsive design.
	•	Django Backend API: The backend is powered by Django, offering a robust API for managing users, file operations, and authentication. The API is designed to handle tasks like file downloading, compression, and history management.
	•	JWT Authentication: A secure authentication system using JSON Web Tokens (JWT) ensures that only authenticated users can access the app’s features and manage their files.
	•	PostgreSQL Database: All user data and file records are stored in a PostgreSQL database, ensuring reliable and scalable storage.
	•	Cloudinary Integration: Cloudinary is used for media storage and manipulation, allowing efficient management of file uploads and retrieval.
	•	Docker Implementation: The entire backend is containerized using Docker, ensuring a consistent development and deployment environment across different systems.

    Usage
	1.	Sign up / Log in: Create an account or log in with your existing credentials. The JWT system ensures that your session is maintained securely.
	2.	Download Files: Browse the available files and download them directly through the app.
	3.	Compress Files: Use the app to compress files and save space on your device.
	4.	View History: Track your downloaded files and their statuses through the personal profile section.
	5.	Upload Files: Users can upload their files for processing and storage.

Technologies Used
	•	Frontend: React Native, UI-Kitten
	•	Backend: Django, PostgreSQL, JWT Authentication, Cloudinary
	•	Docker: Backend containerization for consistent environments
>>>>>>> 72538f3 (initial commit)
