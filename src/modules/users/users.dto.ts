export class UserDto {
    readonly _id?: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly roles: [string];
}

export class LoginUserDto {
    readonly email: string;
    readonly password: string;
}
