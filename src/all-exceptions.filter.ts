import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message:
        exception instanceof HttpException ? exception.message : undefined,
    };

    if (exception instanceof AxiosError) {
      return httpAdapter.reply(
        ctx.getResponse(),
        {
          ...responseBody,
          statusCode: exception.response.status,
          message: exception.response.statusText,
        },
        exception.response.status,
      );
    }

    if (exception instanceof ZodError) {
      return httpAdapter.reply(
        ctx.getResponse(),
        {
          ...responseBody,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error.',
          issues: exception.format(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    httpAdapter.reply(
      ctx.getResponse(),
      { ...responseBody, statusCode: httpStatus },
      httpStatus,
    );
  }
}
