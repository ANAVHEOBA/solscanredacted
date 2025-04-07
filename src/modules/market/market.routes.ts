import { Router } from 'express';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

export function setupMarketRoutes(marketService: MarketService): Router {
    const router = Router();
    const marketController = new MarketController(marketService);

    router.get('/list', (req, res) => marketController.getMarketList(req, res));
    router.get('/info', (req, res) => marketController.getMarketInfo(req, res));
    router.get('/volume', (req, res) => marketController.getMarketVolume(req, res));

    return router;
}
