import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase
let repository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate a user", () => {

    beforeEach(() => {
        repository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(repository);
        createUserUseCase = new CreateUserUseCase(repository);
    });

    it("Should be able to authenticate a user.", async () => {
        const user: ICreateUserDTO = {
            name: "test",
            email: "user@test",
            password: "test"
        } 

        await createUserUseCase.execute(user);

        const authenticateUserResponse = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(authenticateUserResponse).toHaveProperty("token");
    });

    it("Should be able to authenticate a non-existent user", async ()=>{
        expect(async ()=> {
            const authenticateUserResponse = await authenticateUserUseCase.execute({
                email: "user@test",
                password: "test"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("Should be able to authenticate a user with incorrect password", async ()=>{
        expect(async ()=> {
            const user: ICreateUserDTO = {
                name: "test",
                email: "user@test",
                password: "test"
            } 
            await createUserUseCase.execute(user);

            const authenticateUserResponse = await authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrect password"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});