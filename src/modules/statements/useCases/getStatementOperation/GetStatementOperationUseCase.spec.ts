import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get a statement operation", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get statement operation", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "email@test",
      password: "test123",
    };

    await createUserUseCase.execute(user);

    const token = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: token.user.id as string,
      type: OperationType.DEPOSIT,
      description: "Depositing 1000 R$",
      amount: 1000,
    });

    const statementOperationResult = await getStatementOperationUseCase.execute(
      {
        user_id: token.user.id as string,
        statement_id: statementOperation.id as string,
      }
    );

    expect(statementOperationResult).toHaveProperty("id");
    expect(statementOperationResult.amount).toEqual(1000);
    expect(statementOperationResult.type).toEqual("deposit");
  });

  // it("Should not be able to get a statement operation for an inexistent user.", async () => {
  //   expect(async () => {
  //     const user: ICreateUserDTO = {
  //       name: "Test",
  //       email: "email@test",
  //       password: "test123",
  //     };

  //     await createUserUseCase.execute(user);

  //     const token = await authenticateUserUseCase.execute({
  //       email: user.email,
  //       password: user.password,
  //     });

  //     const statementOperation = await createStatementUseCase.execute({
  //       user_id: token.user.id as string,
  //       type: OperationType.DEPOSIT,
  //       description: "Depositing 1000 R$",
  //       amount: 1000,
  //     });

  //     await getStatementOperationUseCase.execute({
  //       user_id: "id incorrect",
  //       statement_id: statementOperation.id as string,
  //     });
  //   }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  // });

  it("Should not be able to get an inexistent statement operation", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      password: "test1234",
      email: "email@test123",
    };

    await createUserUseCase.execute(user);

    const token = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: token.user.id as string,
        statement_id: "NotExistsStatement",
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
