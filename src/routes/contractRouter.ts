import { Router } from "express";
import tokenValidator from "../middlewares/tokenValidator.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import { 
  createContract, 
  getContract, 
  getContracts, 
  updateContract, 
  deleteContract 
} from "../controllers/contractController.js";
import { 
  createContractSchema, 
  updateContractSchema 
} from "../schemas/contractSchema.js";

const contractRouter = Router();

// Criação de contrato (com validação de schema)
contractRouter.post(
  "/contract", 
  tokenValidator, 
  schemaValidator(createContractSchema), 
  createContract
);

// Buscas
contractRouter.get("/contract/:id", tokenValidator, getContract);
contractRouter.get("/contracts", tokenValidator, getContracts);

// Atualização de contrato (com validação de schema mínimo de 1 campo)
contractRouter.put(
  "/contract/:id", 
  tokenValidator, 
  schemaValidator(updateContractSchema), 
  updateContract
);

// Deleção/Encerramento
contractRouter.delete("/contract/:id", tokenValidator, deleteContract);

export default contractRouter;