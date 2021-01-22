import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Comp } from "./Comp";

enum PointType {
    inovation = "inovation"
}

@Entity()
export class CompPoint {

    @PrimaryColumn({
        length: 7
    })
    id_comp_point: string

    @Column()
    point_type: PointType

    @Column()
    percentage: Number

    @ManyToOne(type => Comp, comp => comp.compPoints)
    comp: Comp

}