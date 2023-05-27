import { Request, Response } from "express";
import Post from "./model";

// ==================================================================
export const countAllPosts = async (req: Request, res: Response) => {
  try {
    const count = await Post.find({
      is_deleted: {
        $ne: true,
      },
    }).count();

    res.json({ count });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
export const filterThenCountPosts = async (req: Request, res: Response) => {
  try {
    const removeItems = ["page", "size"];

    const cloneQuery = { ...req.query };

    removeItems.forEach((item) => delete cloneQuery[item]);

    const jsonStringQuery = JSON.stringify(cloneQuery).replace(
      /\b(eq|ne|gt|gte|lt|lte|regex)\b/g,
      (key) => `$${key}`
    );
    const actualQuery = JSON.parse(jsonStringQuery);

    const count = await Post.find(actualQuery, "").count();

    res.json({ count });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const post = await Post.find({
      is_deleted: {
        $ne: true,
      },
    });

    res.json(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const filterPosts = async (req: Request, res: Response) => {
  try {
    const removeItems = ["page", "size"];

    const { page, size } = req.query;

    const _size = +(size ?? 0);

    const _page = +(page ?? 0);

    const skip = _size >= 1 ? (_page > 1 ? (_page - 1) * _size : 0) : 0;
    console.log(skip);
    const cloneQuery = { ...req.query };

    removeItems.forEach((item) => delete cloneQuery[item]);

    const jsonStringQuery = JSON.stringify(cloneQuery).replace(
      /\b(eq|ne|gt|gte|lt|lte|regex)\b/g,
      (key) => `$${key}`
    );
    const actualQuery = JSON.parse(jsonStringQuery);

    const posts = await Post.find(actualQuery, "", {
      skip,
      limit: _size,
    });

    res.json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id, "");

    if (post) {
      res.json(post);
    } else {
      res.status(400).send("Post not found");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, sub_title, content, author, publish_date } = req.body;
    if (!title || !sub_title || !content) {
      res.status(400).send("Invalid Request");
    }

    const post = await Post.create({
      title,
      sub_title,
      content,
      author,
      publish_date,
    });
    const queryPost = await Post.findById(
      // eslint-disable-next-line no-underscore-dangle
      post._id
    );
    return res.status(201).json(queryPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id, "");

    if (!post) {
      res.status(400).send("Post not found");
    }

    const { content, title, sub_title, author, publish_date } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
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

    return res.status(200).json(updatedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id, "");

    if (!post) {
      res.status(400).send("Post not found");
    }

    await Post.findByIdAndUpdate(
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
