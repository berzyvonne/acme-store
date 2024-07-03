const { client } = require("./db");

const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
} = require("./db");

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [moe, lucy, ethyl, singing, dancing, juggling, plateSpinning] =
    await Promise.all([
      createUser({ username: "moe", password: "s3cr3t" }),
      createUser({ username: "lucy", password: "s3cr3t!!" }),
      createUser({ username: "ethyl", password: "shhh" }),
      createProduct({ name: "bicycle" }),
      createProduct({ name: "jumprope" }),
      createProduct({ name: "kettlebells" }),
    ]);
  const users = await fetchUsers();
  console.log(users);

  const products = await fetchProducts();
  console.log(skills);

  const favorites = await Promise.all([
    createFavorite({ user_id: moe.id, product_id: bicycle.id}),
    createFavorite({ user_id: ethyl.id, product_id: jumprope.id}),
    createFavorite({ user_id: lucy.id, product_id: kettlebells.id}),
  ]);

  console.log(await fetchUserSkills(moe.id));
};

init();
