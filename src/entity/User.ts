import {Entity, Column, PrimaryColumn} from "typeorm";

enum Role{
    master = "master",
    user = "user"
}

@Entity()
export class User {

    @PrimaryColumn()
    username: string

    @Column()
    password: string

    @Column({ length: 5 })
    role: Role

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date

}
