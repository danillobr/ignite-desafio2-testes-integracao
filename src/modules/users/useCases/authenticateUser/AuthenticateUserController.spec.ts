import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("test123", 8);

    await connection.query(`
      INSERT INTO users
        (id, name, email, password, created_at, updated_at)
      VALUES
        ('${id}', 'test', 'test@email.com', '${password}', 'now()', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate a user.", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@email.com",
      password: "test123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate an inexistent user.", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "userNotExists@email.com",
      password: "test123",
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able to authenticate a user with incorrect password.", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@email.com",
      password: "4321",
    });

    expect(response.status).toBe(401);
  });
});
