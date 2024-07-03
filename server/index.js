const { client } = require("./db");
const app = express();
app.use(express.json());

const {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorite,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  deleteFavorite,
} = require("./db");

app.get('/api/user', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});

app.get('/api/product', async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(error);
  }
});

app.get('/api/user/:id/favorite', async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.post('/api/user/:id/favorite', async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        userId: req.params.id,
        productId: req.body.productId,
      })
    );
  } catch (error) {
    next(error);
  }
});

app.delete('/api/user/:id/favorite/:id', async (req, res, next) => {
  try {
    await deleteFavorite({
      id: req.params.id,
      userId: req.params.userId,
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});


const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");

  const users = await Promise.all([
    createUser({ username: "Moe", password: "s3cr3t" }),
    createUser({ username: "Lucy", password: "s3cr3t!!" }),
    createUser({ username: "Ethyl", password: "shhh" }),
  ]);

  const products = await Promise.all([
    createProduct({ name: "bicycle" }),
    createProduct({ name: "jumprope" }),
    createProduct({ name: "kettlebells" }),
  ]);

  console.log("data seeded");
  console.log("Users -->", await fetchUsers());
  console.log("Products -->", await fetchProducts());

  const [fav1, fav2, fav3] = await Promise.all([
    createFavorite({ user_id: moe.id, product_id: bicycle.id }),
    createFavorite({ user_id: ethyl.id, product_id: jumprope.id }),
    createFavorite({ user_id: lucy.id, product_id: kettlebells.id }),
  ]);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(`curl localhost:${port}/api/user`);
    console.log(`curl localhost:${port}/api/product`);
    console.log(`curl localhost:${port}/api/user/${users[0].id}/favorite`);
  });
  };

init();
