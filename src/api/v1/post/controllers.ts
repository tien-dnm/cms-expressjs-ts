import { Request, Response } from "express";
import { Post, default as PostSchema } from "./model";

// ==================================================================
export const countAllPosts = async (req: Request, res: Response) => {
  try {
    const count = await PostSchema.find({
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
    const removeItems = ["page", "size", "sort", "search"];
    const { search } = req.query;
    const cloneQuery = { ...req.query };

    removeItems.forEach((item) => delete cloneQuery[item]);

    const jsonStringQuery = JSON.stringify(cloneQuery).replace(
      /\b(eq|ne|gt|gte|lt|lte|regex|search)\b/g,
      (key) => `$${key}`
    );

    const actualQuery = JSON.parse(jsonStringQuery);
    if (search) {
      actualQuery["$text"] = {
        "$search": `${search}`,
      };
    }
    const count = await PostSchema.find({
      is_deleted: {
        $ne: true,
      },
      ...actualQuery,
    }).count();

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
    const post = await PostSchema.find({
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
    const removeItems = ["page", "size", "sort", "search"];

    const { page, size, sort, search } = req.query;

    const _size = +(size ?? 0);

    const _page = +(page ?? 0);

    const skip = _size >= 1 ? (_page > 1 ? (_page - 1) * _size : 0) : 0;

    const cloneQuery = { ...req.query };

    removeItems.forEach((item) => delete cloneQuery[item]);

    const jsonStringQuery = JSON.stringify(cloneQuery).replace(
      /\b(eq|ne|gt|gte|lt|lte|regex)\b/g,
      (key) => `$${key}`
    );
    const actualQuery = JSON.parse(jsonStringQuery);

    if (search) {
      actualQuery["$text"] = {
        "$search": `${search}`,
      };
    }

    const sortFields = sort ? (sort as string).split(",") : ["publish_date"]; // Default sorting field is 'name'
    const sortOrders = sortFields.map((field) =>
      field.startsWith("-") ? -1 : 1
    ); // -1 for descending, 1 for ascending
    const sortKeys = sortFields.map((field) => field.replace(/^-/, "")); // Remove '-' sign if present
    // Build the sorting object

    const sortObj = {} as { [key: string]: number };
    sortKeys.forEach((key, index) => {
      sortObj[key] = sortOrders[index];
    });
    const posts = await PostSchema.find(
      {
        is_deleted: {
          $ne: true,
        },
        ...actualQuery,
      },
      "",
      {
        skip,
        limit: _size,
        sort: sortObj,
      }
    );

    res.json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).send(error.message);
    }
  }
};
// ==================================================================
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await PostSchema.findById(id, "");

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
    const {
      title,
      description,
      content,
      author,
      publish_date,
      thumbnail_link,
      slug,
    } = req.body;
    if (!title || !description || !content) {
      res.status(400).send("Invalid Request");
    }
    const post = await PostSchema.create({
      title,
      description,
      content,
      author,
      publish_date,
      thumbnail_link,
      slug,
    });
    const queryPost = await PostSchema.findById(
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
    const post = await PostSchema.findById(id);

    if (!post) {
      res.status(400).send("Post not found");
    }

    const {
      content,
      title,
      description,
      author,
      publish_date,
      slug,
      thumbnail_link,
    } = req.body as Post;

    const updatedPost = await PostSchema.findByIdAndUpdate(
      id,
      {
        content,
        title,
        description,
        author,
        publish_date,
        modified_date: new Date(),
        // modified_by: "",
        slug,
        thumbnail_link,
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

    const post = await PostSchema.findById(id);
    console.log(post);
    if (!post) {
      res.status(400).send("Post not found");
    }

    await PostSchema.findByIdAndUpdate(
      id,
      {
        is_deleted: true,
        deleted_date: new Date(),
        // deleted_by: "",
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
