import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamMember } from "./TeamMember";
import { TeamToken } from "./TeamToken";

enum Competition{
    iot = "iot",
    uiux = "uiux"
}

enum TeamStatus{
    pending = "pending",
    approved = "approved",
    rejected = "rejected" 
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

    @OneToMany(type => TeamToken, teamToken => teamToken.team)
    teamTokens: TeamToken[]

}