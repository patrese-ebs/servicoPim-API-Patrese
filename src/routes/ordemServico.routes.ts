import { Router } from "express";
import { OrdemServicoController } from "../controllers/OrdemServicoController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validarBody } from "../middleware/validarBody.js";
import { ensureRole } from "../middleware/ensureRole.js";
import {
  createOrdemServicoSchemaDTO,
  atribuirTecnicoSchemaDTO,
  atualizarStatusSchemaDTO,
  concluirOrdemServicoSchemaDTO,
  apontamentoObservacaoSchemaDTO,
} from "../dtos/OrdemServicoSchemaDTO.js";
import { Perfil } from "../types/usr_perfil.js";
import { ApontamentoOSController } from "../controllers/ApontamentoOSController.js";

const ordemServicoRoutes = Router();
const ordemServicoController = new OrdemServicoController();
const apontamentoOSController = new ApontamentoOSController();

ordemServicoRoutes.post(
  "/",
  ensureAuth,
  ensureRole(Perfil.SOLICITANTE, Perfil.SUPERVISOR),
  validarBody(createOrdemServicoSchemaDTO),
  asyncHandler(ordemServicoController.create.bind(ordemServicoController))
);

ordemServicoRoutes.get(
  "/",
  ensureAuth,
  asyncHandler(ordemServicoController.getAll.bind(ordemServicoController))
);

ordemServicoRoutes.get(
  "/:id",
  ensureAuth,
  asyncHandler(ordemServicoController.getById.bind(ordemServicoController))
);

ordemServicoRoutes.patch(
  "/:id/atribuir-tecnico",
  ensureAuth,
  ensureRole(Perfil.SUPERVISOR),
  validarBody(atribuirTecnicoSchemaDTO),
  asyncHandler(
    ordemServicoController.atribuirTecnico.bind(ordemServicoController)
  )
);

ordemServicoRoutes.patch(
  "/:id/assumir",
  ensureAuth,
  ensureRole(Perfil.TECNICO),
  asyncHandler(ordemServicoController.autoAtribuir.bind(ordemServicoController))
);

ordemServicoRoutes.patch(
  "/:id/iniciar",
  ensureAuth,
  ensureRole(Perfil.TECNICO, Perfil.SUPERVISOR),
  asyncHandler(ordemServicoController.iniciar.bind(ordemServicoController))
);

ordemServicoRoutes.patch(
  "/:id/status",
  ensureAuth,
  ensureRole(Perfil.TECNICO, Perfil.SUPERVISOR),
  validarBody(atualizarStatusSchemaDTO),
  asyncHandler(
    ordemServicoController.atualizarStatus.bind(ordemServicoController)
  )
);

ordemServicoRoutes.patch(
  "/:id/concluir",
  ensureAuth,
  ensureRole(Perfil.TECNICO, Perfil.SUPERVISOR),
  validarBody(concluirOrdemServicoSchemaDTO),
  asyncHandler(ordemServicoController.concluir.bind(ordemServicoController))
);

ordemServicoRoutes.get(
  "/:id/apontamentos",
  ensureAuth,
  asyncHandler(apontamentoOSController.listByOs.bind(apontamentoOSController))
);

ordemServicoRoutes.post(
  "/:id/apontamentos/iniciar",
  ensureAuth,
  ensureRole(Perfil.TECNICO),
  validarBody(apontamentoObservacaoSchemaDTO),
  asyncHandler(apontamentoOSController.iniciar.bind(apontamentoOSController))
);

ordemServicoRoutes.patch(
  "/:id/apontamentos/finalizar",
  ensureAuth,
  ensureRole(Perfil.TECNICO),
  validarBody(apontamentoObservacaoSchemaDTO),
  asyncHandler(apontamentoOSController.finalizar.bind(apontamentoOSController))
);

export { ordemServicoRoutes };
