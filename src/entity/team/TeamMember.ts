import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Team } from "./Team";

@Entity()
export class TeamMember {

    @PrimaryColumn("char", {
        length: 9
    })
    id_team_member: string

    @Column('json')
    member_team_biodata: string

    @ManyToOne(type => Team, team => team.teamMembers)
    team: Team

}