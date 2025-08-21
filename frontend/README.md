# MiniMart

MiniMart is a modern e-commerce web application that allows users to browse products, manage a shopping cart, and perform secure authentication using JWT. The project uses a **React** frontend, **Spring Boot** backend, and **PostgreSQL** database.

## Table of Contents
- Tech Stack
- Features
- Project Structure
- Setup Instructions
- Running the Project
- API Documentation
- Screenshots
- License

## Tech Stack
**Frontend:** React 18, React Router DOM, Material-UI (MUI), Emotion (CSS-in-JS), React Query, Axios, JWT Decode, Recharts, Vite  
**Backend:** Java 17+, Spring Boot, Spring Security (JWT authentication), PostgreSQL, Maven  
**Authentication:** JWT (JSON Web Token)

## Features
- User registration and login with role-based access control (RBAC)
- Product listing with search and filter
- Shopping cart management
- Dashboard with charts and analytics
- Secure JWT-based authentication
- Responsive frontend design using Material-UI

## Project Structure
**Frontend (React)**


## Setup Instructions
**Backend (Spring Boot + PostgreSQL)**
1. Make sure Java 17+ and PostgreSQL are installed.
2. Create PostgreSQL database:
```sql
CREATE DATABASE minimart;

spring.datasource.url=jdbc:postgresql://localhost:5432/minimart
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

cd minimart-backend
mvn clean install
mvn spring-boot:run

Backend runs at http://localhost:8080.

Frontend (React + Vite)

cd minimart-frontend
npm install
npm run dev

Frontend runs at http://localhost:5173.