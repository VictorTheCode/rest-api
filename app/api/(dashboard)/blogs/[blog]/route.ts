/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/modals/blogs";

export const GET = async (req: Request, context: { params: any }) => {
  const { blog } = await context.params;
  const blogId = blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
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
        { status: 404 }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ blog }), {
      status: 200,
    });
  } catch (err: any) {
    return new NextResponse("Error in fetching a blog" + err.message, {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request, context: { params: any }) => {
  const { blog } = await context.params;
  const blogId = blog;

  try {
    const body = await req.json();
    const { title, description } = body;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: new Types.ObjectId(userId),
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Blog updated successfully",
        blog: updatedBlog,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse("Error in updating blog" + err.message, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request, context: { params: any }) => {
  const { blog } = await context.params;
  const blogId = blog;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: new Types.ObjectId(userId),
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(
      JSON.stringify({ message: "Blog deleted successfully" }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse("Error in deleting blog" + err.message, {
      status: 500,
    });
  }
};
