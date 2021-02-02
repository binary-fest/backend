import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./Team";

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

    @ManyToOne(type => Team, team => team.teamTokens)
    team: Team

}