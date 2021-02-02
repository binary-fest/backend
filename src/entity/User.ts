import {Entity, Column, PrimaryColumn} from "typeorm";
import * as bcrypt from 'bcryptjs'

enum Role{
    admin = "ADMIN",
    user = "USER"
}

@Entity()
export class User {

    @PrimaryColumn({
        length: 20,
        unique: true
    })
    username: string

    @Column()
    password: string

    @Column({ length: 5 })
    role: Role

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date

    hashPassword(){
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): Boolean {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}
