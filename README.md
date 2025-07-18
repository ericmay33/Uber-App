﻿# Uber App Project

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)

---

## Project Overview
This Uber-like app enables users to book rides by selecting their start and destination locations, view available drivers nearby, and choose the best option based on estimated cost and route. The app features real-time location tracking, interactive maps displaying drivers and routes, secure payment integration via Stripe, and a comprehensive ride history with ratings. Overall, a booking service for users similar to Uber.

---

## Features
- Onboarding screens to introduce app functionality to new users
- User registration and authentication with secure login/logout
- Live location of the user
- Ride booking: Users can select a start and destination location, view a list of available drivers with preset profiles, see calculated costs for each driver based on route distance and time, then select a driver and confirm the ride
- Payment integration using Stripe for secure and seamless transactions
- Ride history and ratings to review past trips and rate drivers
- Interactive map integration that displays driver locations, user and destination pins, and dynamically draws the optimal route for the ride in real-time

---

## Tech Stack
The languages, technologies, frameworks, and tools used in this project:  
- **Frontend:** React, Tailwind CSS, TypeScript, Vite  
- **Backend:** Node.js, Express, TypeScript, Sequelize ORM  
- **Database:** PostgreSQL  
- **APIs & Services:**  
  - Google Maps API (for maps rendering and location pins)  
  - Google Places API (for location search and autocomplete)  
  - Google Directions API (for route calculation and drawing)  
  - Geolocation API (for user location tracking)  
  - Stripe API (for payment processing)

---

## Installation & Setup

### Prerequisites
- Node.js v20 or higher  
- npm or yarn package manager  
- PostgreSQL database installed and running  
- API keys for:  
  - Google Cloud Console (Maps, Places, Directions, Geolocation APIs)  
  - Stripe (for payment processing) 


### Database Setup
1. **Create the PostgreSQL database**  
   Connect to your PostgreSQL server (using `psql`, pgAdmin, or another client) and create a new database for the project:  
   ```sql
   CREATE DATABASE uber_app;
   ```

2. **Configure environment variables**
    Create a .env file in the root of your project and add your database connection details:

    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=uber_app
    ```

3. **Create the necessary tables**
    Execute the below SQL commands and create the tables in the uber_app database.

    -- Users table
    ```
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL
    );
    ```

    -- Drivers table
    ```
    CREATE TABLE drivers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        profile_image_url TEXT,
        car_image_url TEXT,
        car_seats INTEGER NOT NULL CHECK (car_seats > 0),
        rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5)
    );
    ```

    -- Rides table
    ```
    CREATE TABLE rides (
        ride_id SERIAL PRIMARY KEY,
        origin_address VARCHAR(255) NOT NULL,
        destination_address VARCHAR(255) NOT NULL,
        origin_latitude DECIMAL(9, 6) NOT NULL,
        origin_longitude DECIMAL(9, 6) NOT NULL,
        destination_latitude DECIMAL(9, 6) NOT NULL,
        destination_longitude DECIMAL(9, 6) NOT NULL,
        ride_time INTEGER NOT NULL,
        fare_price DECIMAL(10, 2) NOT NULL CHECK (fare_price >= 0),
        payment_status VARCHAR(20) NOT NULL,
        driver_id INTEGER REFERENCES drivers(id),
        user_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```
    
    -- Populate Drivers table
    ```
    INSERT INTO drivers (id, first_name, last_name, profile_image_url, car_image_url, car_seats, rating)
    VALUES 
    ('1', 'James', 'Wilson', 'https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/', 'https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/', 4, '4.80'),
    ('2', 'David', 'Brown', 'https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/', 'https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/', 5, '4.60'),
    ('3', 'Michael', 'Johnson', 'https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/', 'https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/', 4, '4.70'),
    ('4', 'Robert', 'Green', 'https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/', 'https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/', 4, '4.90');
    ```


### Steps
1. **Clone the repository**
    - git clone https://github.com/ericmay33/Uber-App.git
    - cd uber-app

2. **Install dependencies**
    - Frontend:
    ```
    cd Client
    npm install
    ```

    - Backend: 
    ```
    cd Server
    npm install
    ```

3. **Set up environment variables**
    - First create .env file in both the Client and Server folders
    - Make sure you have a Stripe Project, will have a secret and publishable api key
    - Make sure you have a Google Cloud Console Project with proper Google APIs enabled

    - Frontend (Client/.env):
    ```
    VITE_GEOAPIFY_API_KEY=your_geoapify_api_key

    VITE_GOOGLE_API_KEY=your_google_api_key

    VITE_STRIPE_PUBLISHABLE_API_KEY=your_publishable_stripe_api_key
    ```

    - Backend (Server/.env):
    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=uber_app

    JWT_KEY=your_jwt_secret_key_here
    STRIPE_SECRET_KEY=your_secret_stripe_key_here
    GOOGLE_API_KEY=your_google_api_key
    ```

    - Replace placeholder values/keys with your actual credentials!

4. **Start the application**
    - Make sure your PostgreSQL database server is runnings
    - Start Backend Server:
        ```
        cd Server
        npm run start
        ```
    - Start Frontend:
        ```
        cd Client
        npm run start
        ```
