require("dotenv").config()

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const OAuth2_client = new OAuth2(clientId, clientSecret);
OAuth2_client.setCredentials({ refresh_token: refreshToken });

function send_mail_registration(Email,name) {
    const accessToken = OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type:"OAuth2",
            user:"groupprojectbrl@gmail.com",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    const mail_options = {
        from: `Team Management App<${"groupprojectbrl@gmail.com"}`,
        to: Email,
        subject: "Registration",
        html: get_html_message(name),
    }
    transport.sendMail(mail_options, function (error, result) {
        if (error) {
            console.log("error:", error);
        } else {
            console.log("Success:", result);
        }

        transport.close();
    });
}

function get_html_message(name) {
    return `
    <h3>${name}!You have successfully accessed your account!</h3>`
};

function send_team_code(Email,teamCode,domainName) {
    const accessToken = OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type:"OAuth2",
            user:"groupprojectbrl@gmail.com",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    const mail_options = {
        from: `Team Management App<${"groupprojectbrl@gmail.com"}`,
        to: Email,
        subject: "Team Invitation",
        html: get_html_message_teamCode(teamCode,domainName),
    }
    transport.sendMail(mail_options, function (error, result) {
        if (error) {
            console.log("error:", error);
        } else {
            console.log("Success:", result);
        }

        transport.close();
    });
}

function get_html_message_teamCode(teamCode,domainName) {
    return `
    <h3>You have been invited to join the team.\n\nTeam Code:${teamCode}\nDomain:${domainName}</h3>`
};

function send_mail_OTP(Email,OTP) {
    const accessToken = OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type:"OAuth2",
            user:"groupprojectbrl@gmail.com",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    const mail_options = {
        from: `Team Management App<${"groupprojectbrl@gmail.com"}`,
        to: Email,
        subject: "Reset Password",
        html: get_html_message_OTP(OTP),
    }
    transport.sendMail(mail_options, function (error, result) {
        if (error) {
            console.log("error:", error);
        } else {
            console.log("Success:", result);
        }

        transport.close();
    });
}

function get_html_message_OTP(OTP) {
    return `
    <h3>Your OTP is:${OTP}</h3>`
};

function send_mail_message(Email,sender_email,message) {
    const accessToken = OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type:"OAuth2",
            user:"groupprojectbrl@gmail.com",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    const mail_options = {
        from: `Team Management App<${"groupprojectbrl@gmail.com"}`,
        to: Email,
        subject: "Message",
        html: get_html_message_team(sender_email,message),
    }
    transport.sendMail(mail_options, function (error, result) {
        if (error) {
            console.log("error:", error);
        } else {
            console.log("Success:", result);
        }

        transport.close();
    });
}

function get_html_message_team(sender_email,message) {
    return `
    <h2>Your teammate ${sender_email} wants to send you a message!:</h2><br>${message}`
};



module.exports={send_mail_registration,send_team_code,send_mail_OTP,send_mail_message};



