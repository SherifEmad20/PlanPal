# PlanPal Application

This is a full stack application built using Java Spring Boot, React.js, and MySQL database. It utilizes the BertNLT library for natural language processing tasks. The application is designed to facilitate venue reservation, event planning, and managing invitations and guests.

**Features**

User Registration and Authentication: Users can create an account and securely log in to the application.
Venue Reservation: Users can browse available venues, view details, and make reservations for their desired dates and times.
Event Planning: Users can create events, specify details such as event name, date, time, and description.
Invitation Management: Users can manage guest invitations, send and track RSVPs.
Guest Management: Users can manage their guest list, view guest details, and update RSVP statuses.

**Technologies Used**

Java Spring Boot: Provides the backend framework for building robust and scalable web applications.
React.js: A JavaScript library for building user interfaces, allowing for a dynamic and interactive frontend.
MySQL Database: A popular open-source relational database management system for storing and retrieving data efficiently.
BertNLT: A library for natural language processing tasks, enabling advanced text analysis and understanding.

**Prerequisites**

Before running the application, ensure you have the following dependencies installed:

Java Development Kit (JDK) 8 or higher
Node.js and npm (Node Package Manager)
MySQL database server

**Installation**

Clone the repository:
shell
Copy code
git clone https://github.com/SherifEmad20/PlanPal.git
Backend setup:

Open the backend directory.

Configure the database connection in src/main/resources/application.properties.

Build and run the Spring Boot application:

shell
Copy code
./mvnw spring-boot:run
Frontend setup:

Open the frontend directory.

Install the required dependencies:

shell
Copy code
npm install
Start the React development server:

shell
Copy code
npm start
Access the application in your web browser at http://localhost:3000.

**Usage**

Create an account or log in to an existing account.
Browse available venues and reserve a venue for your event.
Plan events by providing event details such as name, date, time, and description.
Manage invitations by sending invites using QR Codes technology.
Manage guests by adding or removing them from your guest list.
Contributing
Contributions to this project are welcome. To contribute:

Fork the repository.
Create a new branch.
Make your enhancements or bug fixes.
Commit and push your changes.
Open a pull request.

Happy event planning!
