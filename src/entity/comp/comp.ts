import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { CompPoint } from "./CompPoint";
import { CompStage } from "./CompStage";

enum CompName {
    iot = "IoT Development",
    uiux = "UI / UX Designer"
}

@Entity()
export class Comp {

    @PrimaryColumn('char', {
        length: 4
    })
    id_comp: string

    @Column({
        length: 30
    })
    comp_name: CompName

    @OneToMany(type => CompStage, compStage => compStage.comp)
    compStages: CompStage[]

    @OneToMany(type => CompPoint, compPoint => compPoint.comp)
    compPoints: CompPoint[]

}