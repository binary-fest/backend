import {query, Request, Response} from "express";
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { TeamSubmission, SubmissionStatus } from "../entity/team/TeamSubmission";
import { SubmissionToken } from "../entity/team/SubmissionToken";
import { ReqTeamRegister } from "../model/ReqTeamRegister";
import { TeamStatus } from "../model/TeamStatusEnum";
import MailTxtTemplate from "../templates/EmailTextTemplate";
import { SingleMailService } from "../services/SingleMailService";
import { generateToken, decryptToken } from "../config/CryptoToken";
import { EmailSend } from "../entity/team/EmailSend";

export class TeamController{

  private teamRepository = getRepository(Team)
  private teamMemberRepository = getRepository(TeamMember)
  private teamSubmissionRepository = getRepository(TeamSubmission)
  private subTokenRepository = getRepository(SubmissionToken)
  private emailSendRepository = getRepository(EmailSend)
  private closeSubmissionDate = new Date("May 7, 2021 23:59:00").getTime()

  async register(req: Request, res: Response){
    if (Date.now() > this.closeSubmissionDate) {
      res.status(400).json({
        message: "Registration was closed."
      })
      return;
    }

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
    const { to, submission_type, status, token, competition_type } = req.body
    const statusLower = <string> status.toLowerCase()
    // Perubahan status harus manjadi approved atau rejected
    const definedAllowStatus = ["approved", "rejected"]

    let getTeam: Team
    let getSubmission: TeamSubmission

    try{
      getTeam = await this.teamRepository.findOneOrFail({
        relations: ["teamSubmission"],
        where: { email: to }
      })
    }catch(err){
      res.status(400).json({
        message: "Email not found!"
      })
      return;
    }

    try {
      getSubmission = await this.teamSubmissionRepository.findOneOrFail({ 
        submission_type: submission_type,
        team: getTeam 
      })
    } catch (error) {
      res.status(400).json({
        message: "Submission not found!"
      })
      return;
    }

    if ((TeamStatus[statusLower] === getSubmission.status) || !definedAllowStatus.includes(statusLower)) {
      res.status(400).json({
        message: "Status invalid, please check!"
      })
      return;
    }

    getSubmission.status = TeamStatus[statusLower] as any

    await this.teamSubmissionRepository.save(getSubmission)
      .then(async () => {
        const dateCount = new Date(Date.now())
        const getTxtMail = MailTxtTemplate(competition_type, statusLower)

        if (statusLower === "approved") {
          await this.subTokenRepository.save({
              token: token,
              startAt: `${dateCount.getFullYear()}-${dateCount.getMonth()}-${dateCount.getDate()}`,
              expiredAt: `2021-05-30`,
              used: false,
              teamSubmission: getSubmission
            })
            .then(() => {})
            .catch((error) => {
              res.status(400).json({
                message: "Error set team status",
                error
              })
              return;
            })
        }

        await SingleMailService({
          subject: getTxtMail.subject,
          receiver: to, 
          maildata: {
            message: getTxtMail.message,
            token: statusLower == 'approved' ? token : '',
            link: getTxtMail.link
          }
        })
        .then(async () => {
          const emailsend = new EmailSend()
          emailsend.subject = getTxtMail.subject;
          emailsend.teamSubmission = getSubmission
          await this.emailSendRepository.save(emailsend)
            .then(result => {
              res.status(200).json({
                message: "Status was changed and mail was sent"
              })
            })
        })
        .catch(err => {
          res.status(400).json({
            message: "There is an error",
            err
          })
        })

      })
      .catch(err => {
        res.status(400).json({
          message: "error saving data!",
          err
        })
      })
    
  }

  async checkToken(req: Request, res: Response) {
    const { token } = req.body as { token: string } 
    
    await this.subTokenRepository.findOneOrFail({
      relations: ["teamSubmission"],
      where: {token: token.trim()}
    })
    .then(async (result) => {
      await this.teamSubmissionRepository.findOneOrFail({
        relations: ["team"],
        where: {id_team_submission: result.teamSubmission.id_team_submission}
      })
      .then((resSub) => {
        if (result.used === true) {
          res.status(400).json({
            message: "Token has been used"
          })
          return;
        }

        res.status(200).json({
          message: {
            name: resSub.team.name,
            institute: resSub.team.institute,
            email: resSub.team.email,
            competition_type: resSub.team.competition_type
          }
        })
      })
    })
    .catch((err) => {
      res.status(400).json({
        message: "Token not found!",
        err
      })
    })
  }

  async nextSubmission(req: Request, res: Response) {
    if (Date.now() > this.closeSubmissionDate) {
      res.status(400).json({
        message: "Registration was closed."
      })
      return;
    }
    
    const { token, file_url } = req.body as { token: string, file_url: string}

    let getSubFromToken: SubmissionToken

    if (token === "" || token === undefined || !token.trim()) {
      res.status(200).json({
        message: "Token undefined"
      })
      return;
    }

    try {
      getSubFromToken = await this.subTokenRepository.findOneOrFail({
        relations: ['teamSubmission'],
        where:{token: token}
      })
    } catch (error) {
      res.status(400).json({
        message: "Token not valid!"
      })
    }

    await this.teamSubmissionRepository.findOneOrFail({
      relations: ['team'],
      where: { id_team_submission: getSubFromToken.teamSubmission.id_team_submission }
    })
    .then(async (result) => {
      if (getSubFromToken.used === true) {
        res.status(400).json({
          message: "2nd submission has been submited"
        })
        return;
      }
    
      const saveSubmission2 = new TeamSubmission()
      saveSubmission2.status = SubmissionStatus.pending
      saveSubmission2.submission_type = 2
      saveSubmission2.team = result.team
      saveSubmission2.url_files = file_url

      await this.teamSubmissionRepository.save(saveSubmission2)
        .then(async () => {
          getSubFromToken.used = true
          await this.subTokenRepository.save(getSubFromToken)

          res.status(200).json({
            message: '2nd submission was submited'
          })
        })
        .catch((err) => {
          res.status(400).json({
            message: "Error when saving data 2nd submission"
          })
        })
    })
    .catch((err) => {
      res.status(400).json({
        message: err
      })
    })
    
  }

}