# Temple Management System

A comprehensive full-stack web application for managing temple operations, including room bookings, marriage hall reservations, donations (E-Hundi), gallery management, and administrative functions.

## Features

### Public Features

#### 🏠 Room Booking System
- Browse available rooms with detailed information (AC/Non-AC, floor, occupancy, commode type)
- Real-time availability tracking
- Online booking with guest details and special requests
- Multiple room types: Dheerendra Vasathi Gruha, Panchamuki Darshan
- Pricing based on room type and amenities

#### 💒 Marriage Hall Booking
- Book marriage halls for events and ceremonies
- Two hall options: Main Hall (500 guests) and Mini Hall (200 guests)
- Amenities information (AC, Stage, Dining Area, Parking)
- Event type selection and capacity management

#### 💰 E-Hundi (Online Donations)
- Secure online donation system
- Multiple donation categories
- Donation history tracking
- Receipt generation

#### 🖼️ Gallery
- Browse temple photos organized by categories
- Categories: Temple, Events, Facilities
- Image management with titles and descriptions

#### 📱 Additional Services
- **Live Status**: Real-time temple activity updates
- **Panchanga**: Daily Hindu calendar and auspicious timings
- **Latest News**: Temple announcements and updates
- **My History**: User booking and donation history
- **Contact**: Get in touch with temple administration

#### 🎵 Audio Jukebox
- **Stotras**: Sacred hymns and verses (50+ tracks)
- **Bhajans**: Devotional songs (100+ tracks)
- **Mantras**: Sacred chants (75+ tracks)

#### 🏛️ Projects
- **Goshala**: Cow protection and care facility (100+ cows, 5 acres)
- **Vidyapeetha**: Traditional Vedic education center (200+ students, 15+ courses)
- **Dasasahitya Museum**: Heritage preservation (500+ artifacts, 1000+ recordings)

### Admin Features

#### 📊 Admin Dashboard
- Real-time statistics and analytics
- Total bookings, pending approvals, donations overview
- Recent activity feed
- Quick access to all management sections

#### 🛏️ Room Management
- Add, edit, and delete rooms
- Update room availability and pricing
- Manage room amenities and details
- Track room occupancy

#### 🏛️ Marriage Hall Management
- Manage hall availability
- Update pricing and amenities
- Track bookings and schedules

#### 📋 Booking Management
- View all bookings (rooms, halls, sevas)
- Approve or reject booking requests
- Update booking status
- Search and filter bookings

#### 💵 Donation Management
- View all donations
- Track donation categories
- Generate reports
- Manage E-Hundi transactions

#### 🖼️ Gallery Management
- Upload and organize images
- Categorize photos
- Edit image details
- Delete images

#### 🏛️ Temple Management
- Add and manage multiple temples
- Update temple information
- Manage contact details and timings

#### 📝 Content Management
- Update About page content
- Manage Services information
- Edit Contact details
- Site-wide content updates

#### 👥 User Management
- Manage admin users
- User roles and permissions
- Account settings

## Technology Stack

### Frontend
- **React 18.2.0**: Modern UI library
- **React Router DOM 6.20.0**: Client-side routing
- **React Icons 5.5.0**: Icon library
- **CSS3**: Custom styling with responsive design

### Backend
- **Node.js**: JavaScript runtime
- **Express 4.18.2**: Web application framework
- **MySQL2 3.6.5**: MySQL database driver with promise support
- **CORS 2.8.5**: Cross-origin resource sharing
- **dotenv 16.3.1**: Environment variable management

### Database
- **MySQL**: Relational database management system
- Tables: rooms, marriage_halls, bookings, donations, gallery_images, site_content, admin_users, temples

## Project Structure

```
temple-management-system/
├── backend/
│   ├── server.js                 # Express server and API endpoints
│   ├── mysql-schema.sql          # Database schema
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── Receipt.js
│   │   ├── context/
│   │   │   └── DataContext.js    # Global state management
│   │   ├── pages/                # Page components
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Services.js
│   │   │   ├── Booking.js
│   │   │   ├── Gallery.js
│   │   │   ├── Contact.js
│   │   │   └── admin/            # Admin pages
│   │   │       ├── AdminDashboard.js
│   │   │       ├── ManageBookings.js
│   │   │       ├── ManageRooms.js
│   │   │       ├── ManageHalls.js
│   │   │       ├── ManageDonations.js
│   │   │       ├── ManageGallery.js
│   │   │       ├── ManageContent.js
│   │   │       ├── ManageUsers.js
│   │   │       └── ManageTemples.js
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   └── package.json              # Frontend dependencies
└── package.json                  # Root package.json with scripts

```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd temple-management-system
```

### Step 2: Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately
npm run install:frontend
npm run install:backend
```

### Step 3: Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE temple_management;
```

2. Import the schema:
```bash
mysql -u root -p temple_management < backend/mysql-schema.sql
```

Or use phpMyAdmin to import `backend/mysql-schema.sql`

### Step 4: Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=temple_management
API_PORT=3001
```

### Step 5: Start the Application

#### Development Mode
```bash
# Start both frontend and backend
# On Windows:
start-dev.bat

# On Linux/Mac:
./start-dev.sh

# Or start separately:
npm run start:backend    # Backend on http://localhost:3001
npm run start:frontend   # Frontend on http://localhost:3000
```

#### Production Mode
```bash
# Build frontend
npm run build:frontend

# Start backend
cd backend
npm start
```

## API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

### Marriage Halls
- `GET /api/marriage-halls` - Get all marriage halls
- `POST /api/marriage-halls` - Create a new hall
- `PUT /api/marriage-halls/:id` - Update a hall
- `DELETE /api/marriage-halls/:id` - Delete a hall

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create a new donation
- `PUT /api/donations/:id` - Update a donation
- `DELETE /api/donations/:id` - Delete a donation

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Add a new image
- `PUT /api/gallery/:id` - Update an image
- `DELETE /api/gallery/:id` - Delete an image

### Temples
- `GET /api/temples` - Get all temples
- `POST /api/temples` - Create a new temple
- `PUT /api/temples/:id` - Update a temple
- `DELETE /api/temples/:id` - Delete a temple

### Site Content
- `GET /api/site-content` - Get all site content
- `POST /api/site-content` - Upsert site content

### Admin
- `POST /api/admin/login` - Admin login

## Database Schema

### Tables

#### rooms
- Room information with pricing, amenities, and availability
- Fields: id, name, type, price, image, lift, floor, occupancy, commode_type, ac, available, total

#### marriage_halls
- Marriage hall details and booking information
- Fields: id, name, image, capacity, amenities, price, available

#### bookings
- All types of bookings (rooms, halls, sevas)
- Fields: id, name, email, phone, guests, special_requests, type, date, status, amount, room details, seva details, hall details

#### donations
- Donation records and E-Hundi transactions
- Fields: id, donor, category, amount, date, status

#### gallery_images
- Gallery image management
- Fields: id, title, category, url

#### temples
- Temple information
- Fields: id, name, location, description, image, contact, timings

#### site_content
- Dynamic site content (About, Services, Contact)
- Fields: id, key, value

#### admin_users
- Admin authentication
- Fields: id, username, password_hash, email

## Default Admin Credentials
```
Username: admin
Password: admin123
```

**⚠️ Important**: Change the default admin password after first login!

## Features in Detail

### Booking System
- Multi-step booking process
- Form validation
- Date selection
- Guest information collection
- Special requests handling
- Booking confirmation with receipt

### Admin Panel
- Secure authentication
- Role-based access control
- Real-time data updates
- Responsive dashboard
- CRUD operations for all entities
- Search and filter functionality

### Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop layout
- Cross-browser compatibility

## Development Scripts

```bash
# Install dependencies
npm run install:all
npm run install:frontend
npm run install:backend

# Start development servers
npm run start:frontend    # React dev server (port 3000)
npm run start:backend     # Express server (port 3001)

# Build for production
npm run build:frontend    # Creates optimized production build
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build:frontend`
2. Deploy the `frontend/build` directory
3. Configure environment variables

### Backend (Heroku/DigitalOcean)
1. Set up MySQL database
2. Configure environment variables
3. Deploy backend code
4. Run database migrations

### Database
- Use managed MySQL service (AWS RDS, DigitalOcean Managed Database)
- Import schema from `backend/mysql-schema.sql`
- Configure connection in `.env`

## Security Considerations

- ⚠️ Current admin authentication uses plain text passwords (for development only)
- 🔒 Implement proper password hashing (bcrypt) for production
- 🔐 Add JWT token-based authentication
- 🛡️ Implement rate limiting
- 🔒 Use HTTPS in production
- 🔐 Sanitize user inputs
- 🛡️ Implement CSRF protection

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Multi-language support
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Calendar integration
- [ ] QR code for bookings
- [ ] Online seva booking
- [ ] Live streaming integration
- [ ] Chatbot support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and queries:
- Email: info@example.org
- Phone: +91 XXXXXXXXXX
- Website: [Your Temple Website]

## Acknowledgments

- React team for the amazing framework
- Express.js community
- MySQL team
- All contributors and devotees

---

Made with ❤️ for spiritual service
