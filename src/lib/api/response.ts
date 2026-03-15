import { NextResponse } from "next/server";

interface SuccessMeta {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: unknown;
}

export function success<T>(data: T, meta?: SuccessMeta, status = 200) {
  return NextResponse.json(
    { data, ...(meta ? { meta } : {}) },
    { status }
  );
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function created<T>(data: T) {
  return success(data, undefined, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}
