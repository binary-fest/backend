import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamMember } from "./TeamMember";
import { TeamToken } from "./TeamToken";

enum Competition{
    iot = "IoT",
    uiux = "UIUX"
}

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

    @Column()
    competition: Competition

    @Column({
        nullable: true
    })
    proposal_url: string

    @Column()
    video_url: string

    @Column({default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

    @OneToMany(type => TeamMember, teamMember => teamMember.team)
    teamMembers: TeamMember[]

    @OneToMany(type => TeamToken, teamToken => teamToken.team)
    teamTokens: TeamToken[]

}