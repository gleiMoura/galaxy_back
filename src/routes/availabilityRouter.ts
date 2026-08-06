import { Router } from "express";
import {
    submitInitialAvailability,
    getMyAvailabilities,
    updateFullAvailability,
    updateSingleAvailability,
    deleteSingleAvailability,
    getTeacherAvailabilities,
} from "../controllers/avalaibilityController";
import schemaValidator from "../middlewares/schemaValidator";
import tokenValidator from "../middlewares/tokenValidator";
import {
    availabilitySchema,
    singleAvailabilitySchema,
} from "../schemas/availabilitySchema";

const availabilityRouter = Router();

availabilityRouter.post(
    "/availability",
    tokenValidator,
    schemaValidator(availabilitySchema),
    submitInitialAvailability
);

availabilityRouter.get(
    "/availability/me",
    tokenValidator,
    getMyAvailabilities
);

availabilityRouter.put(
    "/availability/teacher/:teacherId",
    tokenValidator,
    schemaValidator(availabilitySchema),
    updateFullAvailability
);

availabilityRouter.put(
    "/availability/:id",
    tokenValidator,
    schemaValidator(singleAvailabilitySchema),
    updateSingleAvailability
);

availabilityRouter.delete(
    "/availability/:id",
    tokenValidator,
    deleteSingleAvailability
);

availabilityRouter.get(
    "/availability/teacher/:teacherId",
    tokenValidator,
    getTeacherAvailabilities
);

export default availabilityRouter;