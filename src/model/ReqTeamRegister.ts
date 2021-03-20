import { Team } from "../entity/team/Team";
import { TeamMember } from "../entity/team/TeamMember";
import { TeamSubmission } from "../entity/team/TeamSubmission";

export interface ReqTeamRegister {
    team: Team,
    submission: TeamSubmission,
    members: TeamMember[]
}