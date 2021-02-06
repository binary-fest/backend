import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";

export interface ReqTeamRegister {
    team: Team,
    members: TeamMember[]
}