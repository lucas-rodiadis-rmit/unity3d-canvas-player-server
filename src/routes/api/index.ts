import { Router } from "express";

import requiresInstructor from "../../auth/requiresInstructor";
import embedRouter from "./embedRouter";
import unityRouter from "./unityRouter";

const router = Router();

router.use("/embed", requiresInstructor, embedRouter);
router.use("/unity-config", unityRouter);

export default router;
