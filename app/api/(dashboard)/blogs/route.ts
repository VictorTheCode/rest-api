/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/modals/blogs";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i" },
        },
        {
          description: {
            $regex: searchKeywords,
            $options: "i",
          },
        },
      ];
    }

    // TODO: Add some blog posts

    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blogs }), {
      status: 200,
    });
  } catch (err: any) {
    return new NextResponse("Error in fetching blogs" + err.message, {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await req.json();
    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    if (!title || !description) {
      return new NextResponse(
        JSON.stringify({ message: "Title and description are required" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();
    return new NextResponse(
      JSON.stringify({ message: "Blog created", blog: newBlog }),
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return new NextResponse("Error in creating blog" + err.message, {
      status: 500,
    });
  }
};
