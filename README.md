#  CampusMart Platform

CampusMart is a full-stack, modern e-commerce web application built to deliver a seamless online shopping experience. It is designed using **Spring Boot 3.x with Java 17** on the backend and **React 18 + Vite** on the frontend.

---

##  Tech Stack

### Backend (Java Spring Boot):
- **Java 17** + **Spring Boot 3.x**
- **JWT Authentication** and **Role-Based Access Control**
- **Spring Security**, **JPA (Hibernate)**, **PostgreSQL**
- **RESTful APIs** with well-structured endpoints
- **Maven** for dependency management

### Frontend (React + Vite):
- **React 18**, **Vite**, **Tailwind CSS**
- **Redux Toolkit** for state management
- **Material UI** for UI components
- **Axios** for HTTP communication
- **React Router** for routing
- **React Hot Toast** for notifications

---

##  Features

###  User Functionality:
- Product catalog with category-based filtering and pagination
- Real-time shopping cart with quantity adjustments
- Secure login & signup using JWT
- Manage profile and multiple addresses
- Place orders with cash-on-delivery option
- Order history & tracking
- Add/update/delete products and categories
- View and manage all orders
- Dashboard for analytics (basic)

###  Additional Features:
- Secure image uploads (Multer/Cloudinary or local storage)
- Responsive design across devices
- Input validation & error messages
- CORS configuration and password hashing


###  Requirements:
- Java 17+
- PostgreSQL 12+
- Node.js 16+
- Maven 3.6+

###  Steps:
1. **Clone the repo**:
    ```bash
    git clone https://github.com/your-username/campusmart.git
    ```

2. **Backend Setup**:
    - Navigate to `sb-ecom2/`
    - Set your DB credentials in `application.properties`
    - Run:
      ```bash
      mvn clean install
      mvn spring-boot:run
      ```

3. **Frontend Setup**:
    - Navigate to `ecomfront/`
    - Install dependencies and start dev server:
      ```bash
      npm install
      npm run dev
      ```

    > The frontend runs at `http://localhost:5173`, backend at `http://localhost:8080`

---

##  Security Measures

- Passwords are hashed using BCrypt
- JWT token generation & validation
- Role-based access restrictions
- CORS and CSRF configuration for secure API calls

---

##  Future Improvements

- Payment gateway integration (Razorpay/Stripe)
- Product review and ratings
- ElasticSearch integration for advanced search
- Analytics dashboard with graphs
- Email notifications
