import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Comp } from "./Comp";

enum CompStagesName {
    tahap1 = "Seleksi Berkas",
    tahap2 = "Submit Proposal dan Video",
    tahap3 = "Prensentasi"
}

@Entity()
export class CompStage {

    @PrimaryColumn('char', {
        length: 7
    })
    id_comp_stage: string

    @Column({
        length: 30
    })
    comp_stage_name: CompStagesName

    @Column({
        default: () => "CURRENT_TIMESTAMP"
    })
    from_date: Date

    @Column({
        default: () => "CURRENT_TIMESTAMP"
    })
    until_date: Date

    @ManyToOne(type => Comp, comp => comp.compStages)
    comp: Comp

}