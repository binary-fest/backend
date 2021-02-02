import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamMember } from "./TeamMember";
import { TeamToken } from "./TeamToken";

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id_team: number

    @Column()
    name: String

    @Column()
    judul: string

    @Column()
    instansi: string

    @Column({
        nullable: true
    })
    proposal_url: string

    @Column()
    video_url: string

    @OneToMany(type => TeamMember, teamMember => teamMember.team)
    teamMembers: TeamMember[]

    @OneToMany(type => TeamToken, teamToken => teamToken.team)
    teamTokens: TeamToken[]

}