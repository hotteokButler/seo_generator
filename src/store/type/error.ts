import { ZodError } from 'zod';

export function isZodError(err: unknown): err is ZodError {
	return err instanceof ZodError;
}

export function isError(err: unknown): err is Error {
	return err instanceof Error;
}
