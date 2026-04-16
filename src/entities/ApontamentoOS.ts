import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import { OrdemServico } from "./OrdemServico.js";
import { Usuario } from "./Usuario.js";

@Entity("apontamento_os")

export class ApontamentoOS {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "os_id", type: "uuid" })
  osId!: string;

  @Column({ name: "tecnico_id", type: "uuid" })
  tecnicoId!: string;

  @Column({ name: "inicio_em", type: "timestamptz" })
  inicioEm!: Date;

  @Column({ name: "fim_em", type: "timestamptz", nullable: true })
  fimEm!: Date | null;

  @Column({ type: "text", nullable: true })
  observacao!: string | null;

  @CreateDateColumn({ name: "criado_em", type: "timestamptz" })
  criadoEm!: Date;

  @ManyToOne(() => OrdemServico, (ordemServico) => ordemServico.apontamentos, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "os_id" })
  ordemServico!: Relation<OrdemServico>;

  @ManyToOne(() => Usuario, (usuario) => usuario.apontamentosOS, {
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "tecnico_id" })
  tecnico!: Relation<Usuario>;
}
