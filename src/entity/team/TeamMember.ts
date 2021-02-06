import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./Team";

enum Gender{
    man = "man",
    wowan = "woman"
}

@Entity()
export class TeamMember {

    @PrimaryGeneratedColumn()
    id_team_member: number

    @Column()
    name: string

    @Column({length: 20})
    student_id: string

    @Column()
    gender: Gender

    @Column()
    isLeader: boolean

    @Column({length: 20})
    phone: string

    @ManyToOne(type => Team, team => team.teamMembers)
    team: Team

}