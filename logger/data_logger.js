
import winston from "winston";
const { createLogger, format, transports } = winston
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${level}  ${timestamp} : ${message}`;
  });

export const dataLogger = () =>{
    return winston.createLogger({
        level: 'info',
        format: myFormat,   
        transports: [
          new winston.transports.File({ filename: 'error.log', level: 'error' }),
          new winston.transports.File({ filename: 'combined.log' }),
        ],
      });
}