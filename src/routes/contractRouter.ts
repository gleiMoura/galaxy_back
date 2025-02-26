import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import schemas from "schemas/index.js";
import { createContract, getContracts, updateContract } from "controllers/contractController.js";
import tokenValidator from "middlewares/tokenValidator.js";

const contractRouter = Router();

contractRouter.post('/contract', schemaValidator(schemas.contractSchema), tokenValidator, createContract);
contractRouter.get('/contract', tokenValidator, getContracts)
contractRouter.put('/contract', schemaValidator(schemas.contractSchema), tokenValidator, updateContract);
//contractRouter.delete('/contract', deleteContract);

export default contractRouter;