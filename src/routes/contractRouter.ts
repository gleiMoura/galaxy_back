import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import schemas from "schemas/index.js";
import { createContract, getContracts } from "controllers/contractController.js";
import tokenValidator from "middlewares/tokenValidator.js";

const contractRouter = Router();

contractRouter.post('/contract', schemaValidator(schemas.contractSchema), tokenValidator, createContract);
contractRouter.get('/contract', tokenValidator, getContracts)
//contractRouter.put('contract', schemaValidator(contractSchema), updateContract);
//contractRouter.delete('/contract', deleteContract);

export default contractRouter;