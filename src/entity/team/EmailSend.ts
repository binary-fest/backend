import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamSubmission } from "./TeamSubmission";

@Entity()
export class EmailSend {

  @PrimaryGeneratedColumn()
  id_email: number

  @Column()
  subject: string

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  sendedAt: Date

  @OneToOne(() => TeamSubmission, teamSubmission => teamSubmission.emailsend)
  @JoinColumn()
  teamSubmission: TeamSubmission
}