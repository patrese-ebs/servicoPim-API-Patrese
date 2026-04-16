import type { Request, Response } from "express";
import { appDataSource } from "../database/appDataSource.js";
import { OrdemServicoService } from "../services/OrdemServicoService.js";

const ordemServicoService = new OrdemServicoService(appDataSource);

export class DashboardController {
  async getIndicadores(req: Request, res: Response): Promise<Response> {
    const indicadores = await ordemServicoService.getDashboard(
      req.auth!.sub,
      req.auth!.perfil
    );

    return res.status(200).json(indicadores);
  }
}
