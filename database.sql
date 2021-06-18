CREATE DATABASE gr1_test;

-- CREATE TABLE Account (
-- 	ID serial NOT NULL,
-- 	UserName varchar(255) NOT NULL,
-- 	Email varchar(255) NOT NULL UNIQUE,
-- 	Password varchar(255) NOT NULL,
-- 	Role integer NOT NULL,
-- 	CONSTRAINT Account_pk PRIMARY KEY (ID)
-- ) WITH (
--   OIDS=FALSE
-- );

-- ALTER account role SET DEFAULT 0;

CREATE TYPE authType AS ENUM ('local', 'google');

CREATE TABLE Account (
	ID serial NOT NULL,
	UserName varchar NOT NULL,
	Email varchar NOT NULL UNIQUE,
	Password varchar,
	authGoogleID varchar,
	Role integer NOT NULL DEFAULT 0,
	authType authType DEFAULT 'local', 
	CONSTRAINT Account_pk PRIMARY KEY (ID)
) WITH (
  OIDS=FALSE
);
