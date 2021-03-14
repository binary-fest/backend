import {Request, Response} from "express";
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { ReqTeamRegister } from "../model/ReqTeamRegister";
import { TeamStatus } from "../model/TeamStatusEnum";
import { Auth } from "../entity/Auth";
import { SingleMailService } from "../services/SingleMailService";

export class TeamController{

  private teamRepository = getRepository(Team)
  private teamMemberRepository = getRepository(TeamMember)
  private authRepository = getRepository(Auth)

  async register(req: Request, res: Response){
      
    const { team, members } = req.body as ReqTeamRegister
    const checkExistEmail: Team = await this.teamRepository.findOne({ email: team.email })

    if(team === undefined || (members === undefined)){
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
    team.status = TeamStatus.pending;
    team.competition_type = team.competition_type.toLocaleLowerCase() as any;
    
    await this.teamRepository
      .save(team)
      .then(async() => {

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

  async all(req: Request, res: Response){
    const { username } = res.locals.jwtPayload

    let getAuthData: Auth;

    try {
      getAuthData = await this.authRepository.findOneOrFail({
        select: ["username","role"], 
        where: {username: username}
      })

    } catch (error) {
      res.status(400).json({
        message: "User not vailable",
        error
      })
      return;
    }

    // await this.teamRepository.findOneOrFail({competition_type: })
    //   .then(result => {

    //   })
  }

  async status(req: Request, res: Response){
    const { email, status } = req.body;

    let getTeamFromEmail: Team

    try{
      getTeamFromEmail= await this.teamRepository.findOneOrFail({email: email});
    }catch(err){
      res.status(400).json({
        message: "email is not registered"
      })
      return;
    }

    getTeamFromEmail.status = status as TeamStatus;

    const mailData = {
      mailtype: `reg_${status}`,
      subject: 'Registration Information',
      receiver: getTeamFromEmail.email,
      maildata: {
        name: getTeamFromEmail.name
      }
    }

    SingleMailService(mailData.mailtype, mailData.subject, mailData.receiver, mailData.maildata)
      .then(async () => {  
        // save changes to database
        await this.teamRepository.save(getTeamFromEmail)
          .then(() => {
            res.status(200).json({
              message: "team status was updated",
              email_msg: "Email sent to team email",
              team_data: {
                name: getTeamFromEmail.name,
                email: getTeamFromEmail.email,
                status: getTeamFromEmail.status
              }
            })
          })
          .catch(() => {
            res.status(500).json({
              message: "has an error when saving data"
            })
          })
      })
      .catch((err) => {
        res.status(400).json({
          message: 'Set status failed because email not sent',
          err
        })
      })
      
  }

}