import { Router } from 'express';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

export function setupBlockRoutes(blockService: BlockService): Router {
    const router = Router();
    const controller = new BlockController(blockService);

    router.get('/last', controller.getLastBlocks.bind(controller));
    router.get('/transactions', controller.getBlockTransactions.bind(controller));
    router.get('/detail', controller.getBlockDetail.bind(controller));

    return router;
}
