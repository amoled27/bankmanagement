CREATE TABLE customers (
    customer_ID Integer(9) PRIMARY KEY AUTO_INCREMENT,
    customer_Name varchar(20),
    customer_address varchar(100),
    ssn Integer(9) unique,
    age INTEGER(2)
)ENGINE= InnoDB; 
alter table customers AUTO_INCREMENT = 1000;

CREATE TABLE customer_status(
    SSNID INTEGER(9) PRIMARY KEY,
    c_status VARCHAR(50),
    c_message VARCHAR(50),
    lastupdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SSNID) REFERENCES customers(ssn) 
    on DELETE CASCADE
    )ENGINE= InnoDB;

CREATE TABLE accounts (
    account_ID Integer(9) PRIMARY KEY AUTO_INCREMENT,
    customer_ID Integer(9),
    FOREIGN key(customer_ID) REFERENCES customers(customer_ID),
    acctype VARCHAR(1) CHECK ('S' or 'C'),
    balance DOUBLE(10,2),
    cr_date TIMESTAMP,
    lastupdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    

alter table accounts AUTO_INCREMENT = 1000000000;

CREATE TABLE account_status(
account_ID Integer(9),
FOREIGN KEY (account_ID) REFERENCES accounts(account_ID), 
customer_ID Integer(9),
FOREIGN KEY (customer_ID) REFERENCES customers(customer_ID),
acctype VARCHAR(1) CHECK('S' or 'C'),
a_status VARCHAR(50),
a_message VARCHAR(50),
lastupdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP


);