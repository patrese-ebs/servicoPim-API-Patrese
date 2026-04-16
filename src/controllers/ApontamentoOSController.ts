import { AppError } from "../errors/AppError.js";
import type { Request, Response } from "express";
import { appDataSource } from "../database/appDataSource.js";
import { ApontamentoOSService } from "../services/ApontamentoOSService.js";

const apontamentoOSService = new ApontamentoOSService(appDataSource);

export class ApontamentoOSController {
  async listByOs(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const apontamentos = await apontamentoOSService.listByOs(id as string);
    return res.status(200).json(apontamentos);
  }

  async iniciar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.auth) {
      throw new AppError("Usuário não autenticado");
    }

    const apontamentos = await apontamentoOSService.iniciar(
      id as string,
      req.auth.sub,
      req.auth.perfil,
      req.body
    );

    return res.status(200).json(apontamentos);
  }

  async finalizar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.auth) {
      throw new AppError("Usuário não autenticado");
    }

    const apontamentos = await apontamentoOSService.finalizar(
      id as string,
      req.auth.sub,
      req.auth.perfil,
      req.body
    );

    return res.status(200).json(apontamentos);
  }
}
