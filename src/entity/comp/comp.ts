import { Column, Entity, PrimaryColumn } from "typeorm";

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

}