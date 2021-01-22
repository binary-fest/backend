import { Column, Entity, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import { Team } from "./Team";
import { TeamSubmitionPoint } from "./TeamSubmitionPoint";

enum SubmitionType {
    proposal = "proposal",
    video = "video"
}

enum SubmitionStatus {
    sended = "sended",
    approved = "aproved"
}

@Entity()
export class TeamSubmition {

    @PrimaryColumn('char', {
        length: 9
    })
    id_team_submition: string

    @Column({
        length: 10
    })
    submition_type: SubmitionType

    @Column("text")
    submition_url: string

    @Column({
        length: 10
    })
    submition_status: SubmitionStatus

    @Column("date")
    submition_date: Date

    @ManyToOne(type => Team, team => team.teamSubmitions)
    team: Team

    @OneToMany(type => TeamSubmitionPoint, teamSubmition => teamSubmition.teamSubmition)
    teamSubmitionPoints: TeamSubmitionPoint[]

}