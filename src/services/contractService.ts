import { ContractType } from "../interfaces";
import { findUser } from "../repository/studentRepository";
import { changeContractInDb, createContractInDb, deleteContractInDb, getContractInDb, getContractsInDb } from "../repository/contractRepository";

export const makeContract = async (email: string, data) => {
    const user = email && await findUser(email);

    if (user?.role === "Teacher") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    const result = await createContractInDb(data);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível criar o contrato no momento."
            }
        }
    }
};

export const getAllContracts = async (email: string) => {
    const user = email && await findUser(email);

    if (user?.role !== "Admin") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    const result = await getContractsInDb();

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível pegar os contratos no momento."
            }
        }
    }

    return result;
};

export const findContract = async (email: string, id: string) => {
    const user = email && await findUser(email);
    const contractId = parseInt(id);

    if (user?.role !== "Admin") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    const result = await getContractInDb(contractId);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível pegar o contrato no momento."
            }
        }
    }

    return result;
};

export const changeContract = async (email: string, dataContract: ContractType) => {
    const user = email && await findUser(email);

    if (user?.role !== "Admin") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    if (dataContract.signed === true) {
        throw {
            response: {
                status: 409,
                message: "Usuário já assinou o contrato. Não é possível mudá-lo."
            }
        }
    }

    const result = await changeContractInDb(dataContract);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível mudar o contrato no momento!."
            }
        }
    }

    return result;
};

export const finishContract = async (email: string, id: string) => {
    const user = email && await findUser(email);
    const contractId = parseInt(id);
    const contract: ContractType = await getContractInDb(contractId);

    if (user?.role !== "Admin") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    if (contract.signed === true) {
        throw {
            response: {
                status: 409,
                message: "Usuário já assinou o contrato. Não é possível deletá-lo."
            }
        }
    }

    const result = await deleteContractInDb(contractId);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível mudar o contrato no momento!."
            }
        }
    }

    return result;
};