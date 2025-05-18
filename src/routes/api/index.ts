import { Router } from "express";

import embedRouter from "./embedRouter";
import unityRouter from "./unityRouter";

const router = Router();

router.use("/embed", embedRouter);
router.use("/unity-config", unityRouter);

export default router;
