import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import schemas from "schemas/index.js";
import { createContract } from "controllers/contractController.js";
import tokenValidator from "middlewares/tokenValidator.js";

const contractRouter = Router();

contractRouter.post('/contract', schemaValidator(schemas.contractSchema), tokenValidator, createContract);
//studentRouter.get('/student/contract', getContracts)
//studentRouter.put('/student/contract', schemaValidator(contractSchema), updateContract);
//studentRouter.delete('/student/contract', deleteContract);

export default contractRouter;