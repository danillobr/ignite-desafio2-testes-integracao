import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let repository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a user", () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(repository);
  });

  it("Should be able create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "userTest",
      email: "email@test",
      password: "test",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able create a user with an existent email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user1",
        email: "email@test",
        password: "test",
      });

      const user = await createUserUseCase.execute({
        name: "user2",
        email: "email@test",
        password: "test",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
