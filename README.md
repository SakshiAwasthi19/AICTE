# PointMate - AICTE Points Management Platform

PointMate is a comprehensive web application designed to help students track and manage their AICTE points while connecting them with organizations that host qualifying events. The platform facilitates the entire process from event discovery to certificate management.

## Features

### For Students
- **AICTE Points Tracking**: Monitor progress towards the required 100 points
- **Event Discovery**: Browse and register for AICTE point events
- **Proximity Notifications**: Get notified about events within 10km of your location
- **Certificate Management**: Store and organize earned certificates
- **Profile Management**: Complete student profiles with academic information
- **Real-time Updates**: Live notifications for event updates and registrations

### For Organizations
- **Event Creation**: Create and manage AICTE point events
- **Registration Management**: Track student registrations and attendance
- **Certificate Issuance**: Issue certificates to participating students
- **Analytics Dashboard**: View event performance and participation metrics
- **Profile Management**: Manage organization profiles and verification status

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time notifications
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Socket.IO Client** for real-time features
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pointmate
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pointmate
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Database Setup**
   
   Make sure MongoDB is running locally or update the `MONGODB_URI` to point to your MongoDB instance.

## Running the Application

### Development Mode

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm start
   ```

3. **Or run both simultaneously** (from root directory)
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify token

### Students
- `POST /api/students/profile` - Create/update student profile
- `GET /api/students/profile` - Get student profile
- `GET /api/students/points` - Get AICTE points
- `GET /api/students/registrations` - Get registrations
- `POST /api/students/register-event/:eventId` - Register for event
- `GET /api/students/nearby-events` - Get nearby events
- `GET /api/students/certificates` - Get certificates
- `POST /api/students/certificates` - Upload certificate

### Organizations
- `POST /api/organizations/profile` - Create/update organization profile
- `GET /api/organizations/profile` - Get organization profile
- `GET /api/organizations/events` - Get organization events
- `POST /api/organizations/events` - Create event
- `PUT /api/organizations/events/:eventId` - Update event
- `DELETE /api/organizations/events/:eventId` - Delete event
- `GET /api/organizations/events/:eventId/registrations` - Get event registrations
- `PUT /api/organizations/registrations/:registrationId` - Update registration status

### Events
- `GET /api/events` - Get all active events
- `GET /api/events/:eventId` - Get event by ID
- `GET /api/events/category/:category` - Get events by category
- `GET /api/events/search/:query` - Search events
- `GET /api/events/upcoming/limit/:limit` - Get upcoming events
- `GET /api/events/high-points/limit/:limit` - Get high points events

### Certificates
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:certificateId` - Get certificate by ID
- `PUT /api/certificates/:certificateId/verify` - Verify certificate
- `GET /api/certificates/type/:type` - Get certificates by type
- `GET /api/certificates/search/:query` - Search certificates

## Database Models

### User
- Email, password, user type (student/organization)
- Authentication and authorization

### Student
- Personal information (name, roll number, college, branch, semester)
- Location data for proximity calculations
- AICTE points tracking
- Profile picture and bio

### Organization
- Organization details (name, description, category)
- Location data
- Verification status
- Contact information

### Event
- Event details (title, description, category)
- AICTE points allocation
- Location and venue information
- Registration limits and deadlines
- Organization association

### Registration
- Student-event association
- Registration status tracking
- Attendance and completion tracking
- Points earned

### Certificate
- Certificate details and metadata
- File storage
- Verification status
- Student and event associations

## Key Features

### Proximity-Based Notifications
- Uses MongoDB geospatial queries
- Real-time notifications via Socket.IO
- 10km radius for nearby event detection

### Real-time Updates
- Live notifications for new events
- Registration confirmations
- Event updates and cancellations

### File Upload System
- Profile pictures for students
- Organization logos
- Certificate storage
- Secure file handling with Multer

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Secure password hashing
- Token verification middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 