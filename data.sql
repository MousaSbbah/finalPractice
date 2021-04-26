DROP TABLE IF EXISTS quotes ;

CREATE TABLE quotes (
    id SERIAL PRIMARY  KEY,
    character VARCHAR(255),
    image VARCHAR(255),
    quote VARCHAR(255),
    direction VARCHAR(255)
);