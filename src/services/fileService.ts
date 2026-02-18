import { generateFileLink } from "../repository/filesRepository";

export const createFileLink = async (file) => {
    if (!file || !file.path || !file.originalname) {
        throw {
            response: {
                status: 404,
                message: "File or token is not valid or missing required properties"
            }
        }
    }

    const result = await generateFileLink(file);
    return result;
};