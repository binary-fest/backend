import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { User } from '../User'
import { TeamMember } from "./TeamMember";
import { TeamSubmition } from "./TeamSubmition";

@Entity()
export class Team {

    @PrimaryColumn("char", {
        length: 7
    })
    id_team: string

    @Column()
    team_name: String

    @Column("text")
    title_idea: string

    @Column('json')
    leader_biodata: JSON

    @Column()
    agency_name: string

    @OneToOne(type => User)
    @JoinColumn()
    user: User

    @OneToMany(type => TeamMember, teamMember => teamMember.team)
    teamMembers: TeamMember[]

    @OneToMany(type => TeamSubmition, teamSubmition => teamSubmition.team)
    teamSubmitions: TeamSubmition[]

}