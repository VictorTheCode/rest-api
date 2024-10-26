/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, context: { params: any }) => {
  try {
    const body = await req.json();
    const { title } = body;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
  } catch (err: any) {
    return new NextResponse("Error in updating category" + err.message, {
      status: 500,
      statusText: "Your code no run Ejeh!!!",
    });
  }
};
