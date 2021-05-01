const supertest = require("supertest");
const mongoose = require("mongoose");

const Post = require("../src/models/post");
const config = require("../src/config");
const createServer = require("../src/server");

describe("Posts - /api/posts", () => {
  beforeEach((done) => {
    const mongoUri = config.mongo.host_test;
    mongoose.connect(
      mongoUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) throw new Error(`unable to connect to database: ${mongoUri}`);
        done();
      }
    );
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  const app = createServer();

  test("POST - /api/posts - empty body", async () => {
    await supertest(app).post("/api/posts").send({}).expect(400);
  });

  test("POST - /api/posts - valid data", async () => {
    const post = {
      title: "Post 1",
      content: "Lorem ipsum",
    };

    await supertest(app)
      .post("/api/posts")
      .send(post)
      .expect(201)
      .then((response) => {
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
        expect(response.body).toHaveProperty("_id");
      });
  });

  test("GET /api/posts/:id", async () => {
    const post = await Post.create({
      title: "Post 1",
      content: "Lorem ipsum",
    });

    const data = {
      title: "New title",
      content: "dolor sit amet",
    };

    await supertest(app)
      .patch("/api/posts/" + post.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBe(post.id);
        expect(response.body.title).toBe(data.title);
        expect(response.body.content).toBe(data.content);

        // Check the data in the database
        const newPost = await Post.findOne({ _id: response.body._id });
        expect(newPost).toBeTruthy();
        expect(newPost.title).toBe(data.title);
        expect(newPost.content).toBe(data.content);
      });
  });

  test("PATCH /api/posts/:id", async () => {
    const post = await Post.create({
      title: "Post 1",
      content: "Lorem ipsum",
    });

    const data = {
      title: "New title",
      content: "dolor sit amet",
    };

    await supertest(app)
      .patch("/api/posts/" + post.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBe(post.id);
        expect(response.body.title).toBe(data.title);
        expect(response.body.content).toBe(data.content);

        // Check the data in the database
        const newPost = await Post.findOne({ _id: response.body._id });
        expect(newPost).toBeTruthy();
        expect(newPost.title).toBe(data.title);
        expect(newPost.content).toBe(data.content);
      });
  });

  test("DELETE /api/posts/:id", async () => {
    const post = await Post.create({
      title: "Post 1",
      content: "Lorem ipsum",
    });

    await supertest(app)
      .delete("/api/posts/" + post.id)
      .expect(204)
      .then(async () => {
        expect(await Post.findOne({ _id: post.id })).toBeFalsy();
      });
  });
});
