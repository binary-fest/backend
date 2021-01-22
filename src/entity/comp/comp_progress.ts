import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class CompProgress {

    @PrimaryColumn('char', {
        length: 7
    })
    id_comp_progress: string

}