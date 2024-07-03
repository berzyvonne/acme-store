const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const createTables = async () => {
  const SQL = `
      DROP TABLE IF EXISTS user;
      DROP TABLE IF EXISTS product;
      DROP TABLE IF EXISTS favorite;
      CREATE TABLE user(
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255)
      );
      CREATE TABLE product(
        id UUID PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
      CREATE TABLE favorite(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES product(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
      );
    `;
  return client.query(SQL);
};

const createUser = async ({ username, password }) => {
  const SQL = `
      INSERT INTO user(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return response.rows[0];
};

const createProduct = async ({ name }) => {
  const SQL = `
      INSERT INTO product (id, name) VALUES($1, $2) RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
      SELECT * FROM user;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
      SELECT * FROM product;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const createFavorite = async ({ productId, userId }) => {
  const SQL = ` INSERT INTO favorite (id, product_id, user_id) VALUES($1, $2, $3) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), productId, userId]);
  return response.rows[0];
};

const fetchFavorites = async (userId) => {
  const SQL = `
  INSERT INTO favorite WHERE user_id = $1`;
  const response = await client.query(SQL, [userId]);
  return response.rows;
};

const deleteFavorite = async ({ id, userId }) => {
  const SQL = `
  DELETE FROM favorte WHERE id = $1 AND user_id = $2`;
  await client.query(SQL, [id, userId]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorite,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  deleteFavorite,
};
