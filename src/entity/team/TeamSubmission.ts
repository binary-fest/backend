import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./Team";
import { SubmissionToken } from "./SubmissionToken";
import { EmailSend } from "./EmailSend";

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

  @ManyToOne(type => Team, team => team.teamSubmission)
  team: Team

  @OneToOne(() => SubmissionToken, submissionToken => submissionToken.teamSubmission)
  submissionToken: SubmissionToken

  @OneToOne(() => EmailSend, emailsend => emailsend.teamSubmission)
  emailsend: EmailSend

}