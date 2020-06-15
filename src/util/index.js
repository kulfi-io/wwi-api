import jwt from "jsonwebtoken";
import env from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import pug from "pug";
import mailer from "nodemailer";
import aws from "aws-sdk";
import mjml2html from "mjml";


env.config();
const _basePath = process.cwd();
const _templatePath = "/src/email-templates/views/templates";


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

const emailTemplate = (template) => {

    const _path = path.join(_basePath, _templatePath, `${template.name}.pug`)
    const _rendered = pug.renderFile(_path, template.data);

    return mjml2html(_rendered, {minify: true});
}

export const sendEmail = (template) => {

    const _options = {
        "accessKeyId": process.env.EMAIL_USER,
        "secretAccessKey": process.env.EMAIL_PASS,
        "region": process.env.EMAIL_REGION,
    }

    const html = emailTemplate(template).html;

    const tranporter = mailer.createTransport({
        SES: new aws.SES(_options),
        sendingRate: 1
    });

    tranporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: template.to,
        subject: template.subject,
        html: html
    }, (err, info) => {
        console.log(info.response);
    });

}
