import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./Team";
import { TeamToken } from "./TeamToken";

export enum SubmissionStatus{
  pending = "pending",
  approved = "approved",
  rejected = "rejected"
}

@Entity()
export class TeamSubmission {

  @PrimaryGeneratedColumn()
  id_team_submission: number

  @Column("smallint")
  submission_type: number
 
  @Column()
  url_files: string

  @Column()
  status: SubmissionStatus

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @ManyToOne(type => Team, team => team.teamSubmission)
  team: Team

  @OneToMany(type => TeamToken, teamToken => teamToken.teamSubmission)
  teamToken: TeamToken[]

}