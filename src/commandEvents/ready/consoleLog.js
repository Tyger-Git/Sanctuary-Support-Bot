
const consoleLog = (client) => {
    winston.info(`${client.user.tag} is online.`);
  };
export default consoleLog;