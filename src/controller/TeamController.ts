import {Request, Response} from "express";
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { TeamSubmission, SubmissionStatus } from "../entity/team/TeamSubmission";
import { ReqTeamRegister } from "../model/ReqTeamRegister";
import { TeamStatus } from "../model/TeamStatusEnum";
import { AdminAccount } from "../entity/AdminAccount";
import { SingleMailService } from "../services/SingleMailService";
import { generateToken, decryptToken } from "../config/CryptoToken";

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

  async getTeams(req: Request, res: Response){
    await this.teamRepository.find({
        relations: ["teamMembers","teamSubmission"],
        where: {
          competition_type: res.locals.userRole as any
        }
      })
      .then(result => {
        res.status(200).json({
          message: result
        })
      })
      .catch(err => {
        res.status(400).json({
          message: "No teams registered"
        })
      })
  }

  async getTeamId(req: Request, res: Response){
    const { teamId } = req.params
    
    await this.teamRepository.find({
        relations: ["teamMembers", "teamSubmission"],
        where: {
          id_team: teamId,
          competition_type: res.locals.userRole as any
        }
      })
      .then(result => {
        res.status(200).json({
          message: result
        })
      })
      .catch(err => {
        res.status(400).json({
          message: "Team not registered"
        })
      })
  }

  async status(req: Request, res: Response){
    const { email, status } = req.body

    // Perubahan status harus manjadi approved atau rejected
    const definedAllowStatus = ["approved", "rejected"]

    let getTeamFromEmail: Team

    try {
      getTeamFromEmail = await this.teamRepository.findOneOrFail({email: email})
    } catch (err) {
      res.status(400).json({
        message: "Email is not registered"
      })
      return;
    }

    const [ token, start, expired ] = generateToken(email, Date.now());
    
    res.status(200).json({
      token,
      start,
      expired
    })
  }

  // async status(req: Request, res: Response){
  //   const { email, status } = req.body
  //   // perubahan status harus menjadi approved atau rejected
  //   const defineAllowStatus = ["approved", "rejected"]

  //   let getTeamFromEmail: Team

  //   try{
  //     getTeamFromEmail= await this.teamRepository.findOneOrFail({email: email})
  //   }catch(err){
  //     res.status(400).json({
  //       message: "email is not registered"
  //     })
  //     return;
  //   }

  //   // Status must be change to approved or rejected
  //   if (!defineAllowStatus.includes(status)) {
  //     res.status(400).json({
  //       message: "Status method not available"
  //     })
  //     return;
  //   }

  //   // every admin must change the status of their members 
  //   if (res.locals.userRole !== getTeamFromEmail.competition_type) {
  //     res.status(400).json({
  //       message: "role does not match to change this team status"
  //     })
  //     return;
  //   }

  //   getTeamFromEmail.status = status as TeamStatus

  //   const mailData = {
  //     mailtype: `reg_${status}`,
  //     subject: 'Registration Information',
  //     receiver: getTeamFromEmail.email,
  //     maildata: {
  //       name: getTeamFromEmail.name
  //     }
  //   }

  //   SingleMailService(mailData.mailtype, mailData.subject, mailData.receiver, mailData.maildata)
  //     .then(async () => {  
  //       // save changes to database
  //       await this.teamRepository.save(getTeamFromEmail)
  //         .then(() => {
  //           res.status(200).json({
  //             message: "team status was updated",
  //             email_msg: "Email sent to team email",
  //             team_data: {
  //               name: getTeamFromEmail.name,
  //               email: getTeamFromEmail.email,
  //               status: getTeamFromEmail.status
  //             }
  //           })
  //         })
  //         .catch(() => {
  //           res.status(500).json({
  //             message: "has an error when saving data"
  //           })
  //         })
  //     })
  //     .catch((err) => {
  //       res.status(400).json({
  //         message: 'Set status failed because email not sent',
  //         err
  //       })
  //     })
      
  // }

}