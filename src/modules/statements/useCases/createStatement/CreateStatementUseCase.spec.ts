import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Create a statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to create a deposit", async () => {
    const user: ICreateUserDTO = {
      email: "email@test",
      name: "test",
      password: "test1234",
    };

    await createUserUseCase.execute(user);

    const token = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: token.user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: " Depositing 1000 R$",
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toEqual(1000);
  });

  it("Should not be able to create a deposit with incorrect id", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "Id incorrect",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: " Depositing 1000 R$",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should be able to create a withdraw", async () => {
    const user: ICreateUserDTO = {
      email: "email@test",
      name: "test",
      password: "test1234",
    };

    await createUserUseCase.execute(user);

    const token = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    await createStatementUseCase.execute({
      user_id: token.user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: " Depositing 1000 R$",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: token.user.id as string,
      type: OperationType.WITHDRAW,
      amount: 1000,
      description: " Withdrawing 1000 R$",
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toEqual(1000);
  });

  it("Should not be able to create a withdraw with incorrect id", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "Id incorrect",
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: " Withdrawing 1000 R$",
      });
    }).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("Should not be able to create a withdraw when user has insufficient funds", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@test",
        name: "test",
        password: "test1234",
      };

      await createUserUseCase.execute(user);

      const token = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });

      await createStatementUseCase.execute({
        user_id: token.user.id as string,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: " Depositing 1000 R$",
      });

      await createStatementUseCase.execute({
        user_id: token.user.id as string,
        type: OperationType.WITHDRAW,
        amount: 1001,
        description: " Withdrawing 1001 R$",
      });
    }).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
