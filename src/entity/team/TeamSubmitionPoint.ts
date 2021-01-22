import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { TeamSubmition } from "./TeamSubmition";

@Entity()
export class TeamSubmitionPoint {

    @PrimaryColumn('char', {
        length: 11
    })
    id_team_submition_point: string

    @Column({
        length: 100
    })
    point_name: string

    @Column('int')
    percentage: Number

    @ManyToOne(type => TeamSubmition, teamSubmition => teamSubmition.teamSubmitionPoints)
    teamSubmition: TeamSubmition

}