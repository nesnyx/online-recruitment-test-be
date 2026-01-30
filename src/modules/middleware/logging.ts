import morgan from "morgan"
import { logger } from "../../utils/logger";

export const logging = morgan((tokens: any, req: any, res: any) => {
            const status = tokens.status(req, res);
            const method = tokens.method(req, res);
            const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
            const reset = '\x1b[0m';

            const logMessage = `${method} ${tokens.url(req, res)} ${statusColor}${status}${reset} ${tokens['response-time'](req, res)}ms`;

            logger.info(logMessage);
            return null;
        })


