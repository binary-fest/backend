import { Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamSubmission } from "./TeamSubmission";

@Entity()
export class SubmissionToken{

    @PrimaryGeneratedColumn()
    id_token: number

    @Column({
        unique: true,
        nullable: true
    })
    token: string

    @Column('date')
    startAt: Date

    @Column('date')
    expiredAt: Date

    @OneToOne(() => TeamSubmission, teamSubmission => teamSubmission.submissionToken)
    @JoinColumn()
    teamSubmission: TeamSubmission

}