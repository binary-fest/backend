import {Request, Response} from "express";
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { TeamSubmission, SubmissionStatus } from "../entity/team/TeamSubmission";
import { ReqTeamRegister } from "../model/ReqTeamRegister";
import { TeamStatus } from "../model/TeamStatusEnum";
import { AdminAccount } from "../entity/AdminAccount";
import { SingleMailService } from "../services/SingleMailService";

export class TeamController{

  private teamRepository = getRepository(Team)
  private teamMemberRepository = getRepository(TeamMember)
  private teamSubmissionRepository = getRepository(TeamSubmission)
  private adminRepository = getRepository(AdminAccount)

  async register(req: Request, res: Response){
      
    const { team, submission, members } = req.body as ReqTeamRegister;
    const checkExistEmail: Team = await this.teamRepository.findOne({ email: team.email })

    if((team === undefined) || (members === undefined) || (submission === undefined)){
      res.status(400).json({
        message: "Request Not Valid"
      })
      return;
    }

    // count leader
    let counter = 0
    for(let i=0; i < members.length; i++ ){
      if(members[i].isLeader){
        counter++
      }   
    }

    // validation: leader must be 1
    if(counter !== 1){
      res.status(400).json({
          message: "Leader must be 1"
      })
      return;
    }

    // validation: each team must use a different email
    if(checkExistEmail){
      res.status(400).json({
        message: "Email has been registered by another team"
      })
      return;
    }

    // Add status to team database
    team.competition_type = team.competition_type.toLocaleLowerCase() as any;
    
    // input team to database
    await this.teamRepository
      .save(team)
      .then(async() => {
        // input submission to database
        submission.team = team;
        submission.status = SubmissionStatus.pending;

        await this.teamSubmissionRepository.save(submission)
          .then(() => {})
          .catch((err) => {
            res.status(400).json({
              message: "Failed when enter the submission",
              err
            })
            return;
          })
        
        // input member to TeamMember table
        for(let i=0; i < members.length; i++){
          members[i].team = team

          await this.teamMemberRepository
            .save(members[i])
            .then(() => {})
            .catch((error) => {
              res.status(500).json({
                  message: error.message,
                  error
              })
            })
        }

        // success
        res.status(200).json({
            message: "success add new team"
        })
      })
      .catch((error) => {
        res.status(500).json({
            message: error.message,
            error
        })
      })
  }
}