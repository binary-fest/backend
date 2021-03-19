import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamSubmission } from "./TeamSubmission";

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

    @ManyToOne(type => TeamSubmission, TeamSubmission => TeamSubmission.teamToken)
    teamSubmission: TeamSubmission

}