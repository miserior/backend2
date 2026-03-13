import UserDTO from "../dto/user.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao; 
    }

    getUserByEmail = async (email) => {
        return await this.dao.findOne({ email });
    }

    createUser = async (user) => {
        return await this.dao.create(user);
    }

    // El método que necesita el reset-password
    updateUserPassword = async (id, newHashedPassword) => {
        return await this.dao.findByIdAndUpdate(id, { password: newHashedPassword });
    }

    getUserDTO = (user) => {
        return new UserDTO(user);
    }
}