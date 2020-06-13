import jwt from "jsonwebtoken";
import env from "dotenv";
import bcrypt from "bcrypt";

env.config();

export const validateAndGenerateToken = (args, result) => {
    const _model = {
        fullname: undefined,
        token: undefined,
        error: undefined,
    };

    if (!result) return _model;

    if (!result.verified) {
        _model.error = "Please verify your registration";
        return _model;
    }

    const same = bcrypt.compareSync(args.password, result.password);

    if (!same) {
        _model.error = "Username password mistmatch";
        return _model;
    }

    const _items = result.items;
    const _email = result.email;
    const _id = result.id;
    const _isAdmin = result.display.indexOf('Admin') > 0;

    const token = jwt.sign({ _id, _email, _items, _isAdmin }, process.env.SECRET, {
        expiresIn: "1d",
    });

    _model.fullname = result.fullname;
    _model.token = token;

    return _model;
};

export const generateSeederToken = () => {
    const _id = -1;
    const _email= "seeder@test.com";
    const _isAdmin = true;
    const token = jwt.sign({ _id, _email, _isAdmin }, process.env.SECRET, {
        expiresIn: "1d",
    });

    return token;
}

export const decryptToken = (token) => {
    const decrypted = jwt.verify(token, process.env.SECRET);
    return decrypted;
}

export const isAuthentic = (user) => {
    return user.id;
}

export const isAuthenticAdmin = (user) => {
    return user.id && user.isAdmin;
}

export const getUser = (header) => {
    const _user = {
        id: null,
        email: null,
        isAdmin: false
    };

    const token = header.authorization;

    if (token) {
        const decriptedToken = jwt.verify(token, process.env.SECRET);

        _user.id = decriptedToken._id;
        _user.email = decriptedToken._email;
        _user.isAdmin = decriptedToken._isAdmin;
    }

    return _user;
};
