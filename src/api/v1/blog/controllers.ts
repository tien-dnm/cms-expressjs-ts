import { Request, Response } from "express";
import Blog from "./model";

// ==================================================================
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.find({
      is_deleted: {
        $ne: true,
      },
    });

    res.json(blog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const filterBlogs = async (req: Request, res: Response) => {
  try {
    const removeItems = ["page", "size"];

    const { page, size } = req.query;

    const _size = +(size ?? 0);

    const _page = +(page ?? 0);

    const skip = _size >= 1 ? (_page > 1 ? _page - 1 : 0 * _size) : 0;

    const cloneQuery = { ...req.query };

    removeItems.forEach((item) => delete cloneQuery[item]);

    const jsonStringQuery = JSON.stringify(cloneQuery).replace(
      /\b(eq|ne|gt|gte|lt|lte|regex)\b/g,
      (key) => `$${key}`
    );
    const actualQuery = JSON.parse(jsonStringQuery);

    const blogs = await Blog.find(actualQuery, "", {
      skip,
      _size,
    });

    res.json(blogs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id, "");

    if (blog) {
      res.json(blog);
    } else {
      res.status(400).send("Blog not found");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, sub_title, content, author, publish_date } = req.body;
    if (!title || !sub_title || !content) {
      res.status(400).send("Invalid Request");
    }

    const blog = await Blog.create({
      title,
      sub_title,
      content,
      author,
      publish_date,
    });
    const queryBlog = await Blog.findById(
      // eslint-disable-next-line no-underscore-dangle
      blog._id
    );
    return res.status(201).json(queryBlog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id, "");

    if (!blog) {
      res.status(400).send("Blog not found");
    }

    const { content, title, sub_title, author, publish_date } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        content,
        title,
        sub_title,
        author,
        publish_date,
        modified_date: new Date(),
        modified_by: "",
      },
      {
        new: true,
        upsert: false,
      }
    );

    return res.status(200).json(updatedBlog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id, "");

    if (!blog) {
      res.status(400).send("Blog not found");
    }

    await Blog.findByIdAndUpdate(
      id,
      {
        is_deleted: true,
        deleted_date: new Date(),
        deleted_by: "",
      },
      {
        new: true,
        upsert: false,
        select: "",
      }
    );

    return res.status(204).json("Deleted");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
