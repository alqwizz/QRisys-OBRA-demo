import winston from 'winston';

const timezoned = () => {
    return new Date().toLocaleString();
};
const LoggerInstance = winston.createLogger({
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp({ format: timezoned() }),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/log-crisys.log`
        }),
        new winston.transports.Console({
            level: 'debug'
        })
    ]
})
export default LoggerInstance;