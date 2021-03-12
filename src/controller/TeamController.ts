import {Request, Response} from "express";
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { ReqTeamRegister } from "../model/ReqTeamRegister";
import { TeamStatus } from "../model/TeamStatusEnum";

export class TeamController{

  private teamRepository = getRepository(Team)
  private teamMemberRepository = getRepository(TeamMember)

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

    await this.teamRepository.save(getTeamFromEmail)
      .then(() => {
        res.status(200).json({
          message: "team status was updated",
          updated_data: {
            name: getTeamFromEmail.name,
            email: getTeamFromEmail.email,
            status: getTeamFromEmail.status
          }
        })
      })
      .catch(() => {
        res.status(500).json({
          message: "has an error"
        })
      })
    return;
  }

}