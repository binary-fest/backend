import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./Team";

@Entity()
export class TeamMember {

    @PrimaryGeneratedColumn()
    id_team_member: number

    @Column()
    name: string

    @Column()
    gender: string

    @Column()
    isLeader: boolean

    @Column()
    phone: string

    @Column("text")
    ktm_url: string

    @Column("text")
    picture_url: string

    @Column("text")
    screenshot_url: string

    @ManyToOne(type => Team, team => team.teamMembers)
    team: Team

}