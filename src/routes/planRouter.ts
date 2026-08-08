import { Router } from "express";
import tokenValidator from "../middlewares/tokenValidator.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import { 
    createPlan, 
    getPlan, 
    getPlans, 
    updatePlan, 
    deletePlan 
} from "../controllers/planController.js";
import { 
    createPlanSchema, 
    updatePlanSchema 
} from "../schemas/planSchema.js";

const planRouter = Router();

planRouter.post("/plan", tokenValidator, schemaValidator(createPlanSchema), createPlan);
planRouter.get("/plan/:id", tokenValidator, getPlan);
planRouter.get("/plans", tokenValidator, getPlans);
planRouter.put("/plan/:id", tokenValidator, schemaValidator(updatePlanSchema), updatePlan);
planRouter.delete("/plan/:id", tokenValidator, deletePlan);

export default planRouter;