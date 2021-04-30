import { Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamSubmission } from "./TeamSubmission";

@Entity()
export class SubmissionToken{

    @PrimaryGeneratedColumn()
    id_token: number

    @Column({
        unique: true,
        nullable: true,
        length: 255
    })
    token: string

    @Column({type: 'boolean'})
    used: Boolean

    @Column({type: 'date'})
    startAt: Date

    @Column({type: 'date'})
    expiredAt: Date

    @OneToOne(() => TeamSubmission, teamSubmission => teamSubmission.submissionToken)
    @JoinColumn()
    teamSubmission: TeamSubmission

}