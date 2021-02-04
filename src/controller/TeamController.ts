import {NextFunction, Request, Response} from "express";
import * as cloudinary from 'cloudinary'
import { getRepository } from "typeorm";
import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";

const cloudinaryV2 = cloudinary.v2


export class TeamController{

    private teamRepository = getRepository(Team)

    private teamMemberRepository = getRepository(TeamMember)

    async registerIot(req: Request, res: Response){
        
        const { team, members, proposal_base64 } = req.body

        if(team === undefined || (members === undefined) || proposal_base64 == undefined){
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

        const mTeam = new Team()
        mTeam.name = team.name
        mTeam.instansi = team.instansi
        mTeam.judul = team.judul
        mTeam.competition = team.competition
        mTeam.proposal_url = "pre_upload"
        mTeam.video_url = ""

        const teamMembers = new Array<TeamMember>(members.length)

        await this.teamRepository
            .save(mTeam)
            .then(async(res_team) => {
                await cloudinaryV2.uploader.upload(Buffer.from(proposal_base64, 'base64').toString(), {
                    folder: `web/iot/team_${res_team.id_team}`
                })
                .then(async(res_proposal) => {
                    mTeam.proposal_url = res_proposal.url

                    this.teamRepository.save(mTeam)
        
                    for(let i=0; i < members.length; i++){
                        teamMembers[i] = new TeamMember()
                        teamMembers[i].name = members[i].name
                        teamMembers[i].gender = members[i].gender
                        teamMembers[i].isLeader = members[i].isLeader
                        teamMembers[i].phone = members[i].phone

                        await cloudinaryV2.uploader.upload(Buffer.from(members[i].ktm_base64, 'base64').toString(), {
                            folder: `web/iot/team_${res_team.id_team}`
                        })
                        .then((res_ktm) => {
                            teamMembers[i].ktm_url = res_ktm.url
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: `failure upload ktm (${i})`,
                                error
                            })
                        })

                        await cloudinaryV2.uploader.upload(Buffer.from(members[i].picture_base64, 'base64').toString(), {
                            folder: `web/iot/team_${res_team.id_team}`
                        })
                        .then((res_pic) => {
                            teamMembers[i].picture_url = res_pic.url
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: `failure upload picture (${i})`,
                                error
                            })
                        })

                        await cloudinaryV2.uploader.upload(Buffer.from(members[i].screenshot_base64, 'base64').toString(), {
                            folder: `web/iot/team_${res_team.id_team}`
                        })
                        .then((res_ss) => {
                            teamMembers[i].screenshot_url = res_ss.url
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: `failure upload screenshot (${i})`,
                                error
                            })
                        })

                        teamMembers[i].team = mTeam

                        await this.teamMemberRepository
                            .save(teamMembers[i])
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
        
                }).catch((error) => {
                    res.status(500).json({
                        message: "failure upload proposal",
                        error
                    })
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