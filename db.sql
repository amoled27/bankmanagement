CREATE TABLE customers (
    customer_ID Integer(9) PRIMARY KEY AUTO_INCREMENT,
    customer_Name varchar(20),
    customer_address varchar(100),
    ssn Integer(9),
    age INTEGER(2)
); 
alter table customers AUTO_INCREMENT = 1000;

