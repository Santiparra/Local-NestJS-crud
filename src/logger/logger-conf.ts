import { CORRELATION_ID_HEADER } from "src/middlewares/correlation-id/correlation-id.middleware";

export const loggerConfig = {
  pinoHttp: {
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              messageKey: 'message',
            },
          }
        : undefined,
    messageKey: 'message',
    autoLogging: false,
    serializers: {
      req() {
        return undefined;
      },
      res() {
        return undefined;
      },
    },
    customProps: function (req) {
      return {
        correlationId: req.headers[CORRELATION_ID_HEADER],
      };
    },
  },
};