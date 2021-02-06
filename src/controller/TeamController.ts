import {NextFunction, Request, Response} from "express";
import * as cloudinary from 'cloudinary'
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { ReqTeamRegister } from "../model/ReqTeamRegister";

const cloudinaryV2 = cloudinary.v2


export class TeamController{

    private teamRepository = getRepository(Team)

    private teamMemberRepository = getRepository(TeamMember)

    async register(req: Request, res: Response){
        
        const { team, members } = req.body as ReqTeamRegister

        if(team === undefined || (members === undefined)){
            res.status(400).json({
                message: "Request Not Valid"
            })

            return;
        }

        // validation
        let counter = 0
        for(let i=0; i < members.length; i++ ){
            if(members[i].isLeader){
                counter++
            }   
        }

        if(counter !== 1){
            res.status(400).json({
                message: "Leader must be 1"
            })
            return;
        }

        // let mTeam = new Team()
        // mTeam = team

        // const teamMembers = new Array<TeamMember>(members.length)

        await this.teamRepository
            .save(team)
            .then(async() => {
                this.teamRepository.save(team)
        
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

    async registerUiux(req: Request){
        

    }

    

}