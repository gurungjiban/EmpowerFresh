/*
CONNECTION MADE USING POSTGRESQL 
port 5433
username: localhost
password: 1111
 */


-- Customer Table

create table Customers (
    id serial PRIMARY KEY, 
    name VARCHAR(255) not null,
    email VARCHAR(255) UNIQUE not null,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT current_timestamp 
);


-- Store Table
create table Stores (
    id serial PRIMARY KEY,
    name VARCHAR(255) not null,
    location TEXT,
    customer_id INTEGER ,
    created_at TIMESTAMP DEFAULT current_timestamp,
    Foreign Key (customer_id) REFERENCES customers(id) on delete set NULL
);

---- Product Table

create table Products (
    id serial PRIMARY KEY, 
    name VARCHAR(255) not null,
    description TEXT,
    price float not NULL,
    store_id INTEGER not NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    Foreign Key (store_id) REFERENCES stores(id) on delete set NULL
);

--DROP TABLE IF EXISTS products;
--DROP TABLE IF EXISTS stores;
--DROP TABLE IF EXISTS customers;