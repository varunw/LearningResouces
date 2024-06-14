import Fastify from "fastify";
import { Client } from "node-postgres";

const fastify = Fastify({
  logger: true,
});

const client = new Client({
  user: "ocufox",
  host: "127.0.0.1",
  database: "learning",
  port: 5432,
});

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});
fastify.get("/getUsers", async function (request, reply) {
  await client.connect();

  const res = await client.query("SELECT * from users");
  console.log(res);
  await client.end();
  reply.send(res.rows);
});
fastify.post("/addUser", async function (request, reply) {
  await client.connect();
  console.log("Request", request.body);
  const { name, email, password } = request.body;
  console.log(name);
  try {
    const res = await client.query(
      `INSERT INTO users (name,email,password) VALUES ('${name}', '${email}', '${password}')`
    );
    const user = res.rows[0];
    console.log(user);
    reply.send({ message: "User created successfully" });
  } catch (error) {
    reply.send({ error: "Internal Server error" });
  }
});

fastify.get("/getLinks", async function (request, reply) {
  await client.connect();
  const res = await client.query("SELECT * FROM links");
  reply.send(res.rows);
});

fastify.post("/addLink", async function (request, reply) {
  await client.connect();
  console.log(request.body);
  const { user_id, subject, link } = request.body;
  console.log(user_id);
  try {
    const res = await client.query(
      `INSERT INTO links (user_id,subject,link) VALUES ('${user_id}','${subject}','${link}')`
    );
    const link_1 = res.rows[0];
    console.log(link_1);
    reply.send({ message: "Link Created Successfully" });
  } catch (error) {
    reply.send({ error: "Internal Server Error" });
  }
});

fastify.post("/deleteLink", async function (request, reply) {
  await client.connect();
  const { id } = request.body;
  try {
    const res = await client.query(`DELETE FROM links where id = '${id}'`);
    reply.send({ message: "Delected Successfully" });
  } catch (error) {
    reply.send({ error: "Iternal Server Error" });
  }
});
// (async () => {
//   await client.connect();

//   const res = await client.query("SELECT * from users");
//   console.log(res);
//   await client.end();
// })().catch(console.error);

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("Server started on 3000");
});
