CREATE DATABASE epytodo;
use epytodo;

CREATE TABLE user (
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `email` varchar(255) UNIQUE NOT NULL,
    `password` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `firstname` varchar(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todo (
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` varchar(255) NOT NULL,
    `created_at` DATE DEFAULT CURRENT_TIMESTAMP,
    `due_time` DATETIME NOT NULL,
    `status` ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
    `user_id` BIGINT UNSIGNED NOT NULL
        REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8;
