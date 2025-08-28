import { NextResponse } from "next/server";

export const ResponseData = (data: object) => NextResponse.json(data);
export const ResponseOK = () => NextResponse.json("ok");
export const ResponseError = (error: unknown, status = 500) => NextResponse.json(error, { status });
