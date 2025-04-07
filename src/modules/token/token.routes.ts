import { Router } from 'express';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

export function setupTokenRoutes(tokenService: TokenService): Router {
    const router = Router();
    const controller = new TokenController(tokenService);

    router.get('/meta', controller.getTokenMeta.bind(controller));
    router.get('/price', controller.getTokenPrice.bind(controller));
    router.get('/markets', controller.getTokenMarkets.bind(controller));
    router.get('/holders', controller.getTokenHolders.bind(controller));
    router.get('/transfers', controller.getTokenTransfers.bind(controller));
    router.get('/defi-activities', controller.getTokenDefiActivities.bind(controller));

    return router;
} 