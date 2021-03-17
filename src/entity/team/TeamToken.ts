import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TeamToken{

    @PrimaryGeneratedColumn()
    id_token: number

    @Column({
        unique: true,
        nullable: true
    })
    token: string

    @Column('date')
    startAt: Date

    @Column('date')
    expiredAt: Date

}