-- PeerCollab Database Schema
-- Run this in your MySQL console

CREATE DATABASE IF NOT EXISTS peer_collab;
USE peer_collab;

-- Students and Admins table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student'
);
