import {Request, Response} from "express";
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { TeamSubmission, SubmissionStatus } from "../entity/team/TeamSubmission";
import { SubmissionToken } from "../entity/team/SubmissionToken";
import { ReqTeamRegister } from "../model/ReqTeamRegister";
import { TeamStatus } from "../model/TeamStatusEnum";
import { AdminAccount } from "../entity/AdminAccount";
import { SingleMailService } from "../services/SingleMailService";
import { generateToken, decryptToken } from "../config/CryptoToken";
import { EmailSend } from "../entity/team/EmailSend";

export class TeamController{

  private teamRepository = getRepository(Team)
  private teamMemberRepository = getRepository(TeamMember)
  private teamSubmissionRepository = getRepository(TeamSubmission)
  private subTokenRepository = getRepository(SubmissionToken)
  private emailSendRepository = getRepository(EmailSend)

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
        // submission1
      })
      .then(result => {
        const resFilter = []

        for (let i = 0; i < result.length; i++) {
          
          let data: any = {
            ...result[i],
          }

          Object.assign(data,...result[i].teamSubmission.map((x, i) => ({ [`teamSubmission${x.submission_type}`]: x })));
          
          if (!data.teamSubmission2) {
            Object.assign(data, {teamSubmission2: null})
          }
          if (!data.teamSubmission1) {
            Object.assign(data, { teamSubmission1: null })
          }
          delete data.teamSubmission
          resFilter.push(data)
          data = null
        }
        
        res.status(200).json({
          message: resFilter
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
    
    await this.teamRepository.findOneOrFail({
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
          message: "Team not registered or role not allowed",
        })
      })
  }

  async getTeamBySubmission(req: Request, res: Response){
    const { type }: any = req.params

    await this.teamRepository.find({
        relations: ["teamMembers", "teamSubmission"],
        where: {
          competition_type: res.locals.userRole as any
        }
      })
    .then(result => {
      const resFilter = [];

      for (const val of result) {
        for (const _val of val.teamSubmission) {
          if (_val.submission_type == type) {
            resFilter.push(val)
          }
        }
      }

      res.status(200).json({
        message: resFilter
      })
    })
  }

  async putStatus(req: Request, res: Response){
    const { to, subject, status, message, type } = req.body
    // Perubahan status harus manjadi approved atau rejected
    const definedAllowStatus = ["approved", "rejected"]

    let getTeam: Team
    let getSubmission: TeamSubmission

    try{
      getTeam = await this.teamRepository.findOneOrFail({
        relations: ["teamSubmission"],
        where: { email: to, competition_type: res.locals.userRole}
      })
    }catch(err){
      res.status(400).json({
        message: "Email not found!"
      })
      return;
    }

    try {
      getSubmission = await this.teamSubmissionRepository.findOneOrFail({ 
        submission_type: type, 
        team: getTeam 
      })
    } catch (error) {
      res.status(400).json({
        message: "Submission not found!"
      })
      return;
    }

    if ((TeamStatus[status] === getSubmission.status) || !definedAllowStatus.includes(status)) {
      res.status(400).json({
        message: "Status invalid, please check!"
      })
      return;
    }

    // getSubmission.status = TeamStatus[status] as any

    await this.teamSubmissionRepository.save(getSubmission)
      .then(async () => {
        if (status === "approved") {
          const [token, start, expired] = generateToken(to);

          const getRecentToken = await this.subTokenRepository.findOne({ teamSubmission: getSubmission }) || this.subTokenRepository.create()

          await this.subTokenRepository.save({
              ...getRecentToken,
              token: token,
              startAt: start,
              expiredAt: expired,
              teamSubmission: getTeam
            })
            .then(async () => {})
            .catch(err => res.status(400).json({message: "Error when save token"}))
        }

      })
      .catch(err => {
        res.status(400).json({
          message: "error saving data!",
          err
        })
      })

    res.status(200).json({
      message: "Success",
      getSubmission
    })
    
  }

  // async status(req: Request, res: Response){
  //   const { email, status } = req.body

  //   // Perubahan status harus manjadi approved atau rejected
  //   const definedAllowStatus = ["approved", "rejected"]

  //   let getTeamFromEmail: Team
  //   let getTeamSubmission: TeamSubmission

  //   try {
  //     getTeamFromEmail = await this.teamRepository.findOneOrFail({email: email})
  //   } catch (err) {
  //     res.status(400).json({
  //       message: "Email is not registered"
  //     })
  //     return;
  //   }

  //   if (!definedAllowStatus.includes(status)) {
  //     res.status(400).json({
  //       message: "Status not available"
  //     })
  //     return;
  //   }

  //   if (res.locals.userRole !== getTeamFromEmail.competition_type) {
  //     res.status(400).json({
  //       message: "Role does not allow to change this team status"
  //     })
  //     return;
  //   }

  //   // Get submission with teamId
  //   try {
  //     getTeamSubmission = await this.teamSubmissionRepository.findOneOrFail({team: getTeamFromEmail});
  //   } catch (error) {
  //     res.status(400).json({
  //       message: "Error get submission",
  //       error
  //     })
  //     return;
  //   }

  //   if (getTeamSubmission.status === TeamStatus[status]) {
  //     res.status(400).json({
  //       message: `Status in a ${status} approved right now`
  //     })
  //     return;
  //   }

  //   getTeamSubmission.status = TeamStatus[status] as any;
    
  //   await this.teamSubmissionRepository.save(getTeamSubmission)
  //     .then(async () => {
  //       // Jika status approved, maka akan generate token dan save token ke database
  //       if (status === TeamStatus.approved) {
  //         // Generate token for submission 
  //         const [token, start, expired] = generateToken(email);

  //         const getRecentToken = await this.subTokenRepository.findOne({ teamSubmission: getTeamSubmission }) || this.subTokenRepository.create()

  //         await this.subTokenRepository.save({
  //             ...getRecentToken,
  //             token: token,
  //             startAt: start,
  //             expiredAt: expired,
  //             teamSubmission: getTeamSubmission
  //           })
  //           .then(() => {})
  //           .catch((error) => {
  //             res.status(400).json({
  //               message: "Error set team status",
  //               error
  //             })
  //             return;
  //           })
  //       }
  //       // Send email 
  //       await SingleMailService({
  //           mailtype: `reg_${status}`,
  //           subject: "Informasi Pendaftaran",
  //           receiver: email,
  //           maildata: {name: getTeamFromEmail.name}
  //         })
  //         .then(() => {
  //           res.status(200).json({
  //             message: "Email sended; Set status success"
  //           })
  //         })
  //         .catch(error => {
  //           res.status(400).json({
  //             message: "Email not sended",
  //             error
  //           })
  //         })
  //     })
  //     .catch(err => {
  //       res.status(400).json({
  //         message: "There is an error",
  //         err
  //       })
  //     })
  // }

  async checkToken(req: Request, res: Response) {
    let getToken: string

    try{
      getToken = await decryptToken(req.query.token)
    } catch(err){
      res.status(400).json({
        message: "Token unvalid",
        reason: err.message
      })
      return;
    }

    const [email] = getToken.split("/")

    await this.teamRepository.findOneOrFail({email: email})
      .then(async team => {
        await this.teamSubmissionRepository.findOneOrFail({
            relations: ["submissionToken","team"],
            where: { team: team }
          })
          .then(({submissionToken: { expiredAt }, team}) => {
            const expiredDate = new Date(expiredAt)
            const nowDate = new Date()
            
            if(!(expiredDate.getTime() < nowDate.getTime())){
              res.status(200).json({
                message: "Token found",
                team: {
                  name: team.name,
                  email: team.email,
                  institute: team.institute
                }
              })
              return;
            }
            res.status(400).json({
              message: "Token expired",
            })
          })
          .catch(err => {
            res.status(400).json({
              message: "An error",
              err
            })
          })
      })  
      .catch(err => {
        res.status(400).json({
          message: "email not found",
          err
        })
      })
  }

}