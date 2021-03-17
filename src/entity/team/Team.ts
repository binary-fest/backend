import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamMember } from "./TeamMember";
import { TeamToken } from "./TeamToken";
import { TeamStatus } from "../../model/TeamStatusEnum";
import { TeamSubmission } from "./TeamSubmission";

export enum Competition{
    iot = "iot",
    uiux = "uiux"
}

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id_team: number

    @Column()
    name: string

    @Column({length: 100})
    email: string

    @Column({length: 100})
    institute: string

    @Column()
    title: string

    @Column({length: 5})
    competition_type: Competition

    @Column()
    status: TeamStatus

    @Column()
    url_files: string

    @Column({default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

    @OneToMany(type => TeamMember, teamMember => teamMember.team)
    teamMembers: TeamMember[]

    @OneToMany(type => TeamSubmission, teamSubmission => teamSubmission.team)
    teamSubmission: TeamSubmission[]

}