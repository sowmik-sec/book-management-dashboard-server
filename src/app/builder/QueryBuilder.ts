import { FilterQuery, Query } from "mongoose";
import { BookFilterQuery } from "../modules/Book/book.constant";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: BookFilterQuery;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query as BookFilterQuery;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj: BookFilterQuery = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Price range filter
    if (queryObj.minPrice || queryObj.maxPrice) {
      queryObj.price = {};
      if (queryObj.minPrice) {
        const minPrice = Number(queryObj.minPrice);
        if (!isNaN(minPrice)) queryObj.price.$gte = minPrice;
      }
      if (queryObj.maxPrice) {
        const maxPrice = Number(queryObj.maxPrice);
        if (!isNaN(maxPrice)) queryObj.price.$lte = maxPrice;
      }
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    // Release date range filter
    if (queryObj.startDate || queryObj.endDate) {
      queryObj.releaseDate = {};
      if (queryObj.startDate) {
        const startDate = new Date(queryObj.startDate as string);
        if (!isNaN(startDate.getTime())) queryObj.releaseDate.$gte = startDate;
      }
      if (queryObj.endDate) {
        const endDate = new Date(queryObj.endDate as string);
        if (!isNaN(endDate.getTime())) queryObj.releaseDate.$lte = endDate;
      }
      delete queryObj.startDate;
      delete queryObj.endDate;
    }

    // Author real-time search
    if (queryObj.author) {
      queryObj.author = { $regex: queryObj.author as string, $options: "i" };
    }

    // ISBN exact match
    if (queryObj.isbn) {
      queryObj.isbn = queryObj.isbn;
    }

    // Genre filter
    if (queryObj.genre) {
      queryObj["genres.genre"] = {
        $regex: new RegExp(`^${queryObj.genre}$`, "i"),
      }; // Case-insensitive exact match
      delete queryObj.genre;
    }

    // Publisher filter
    if (queryObj.publisher) {
      queryObj.publisher = {
        $regex: queryObj.publisher as string,
        $options: "i",
      };
    }

    // Series filter
    if (queryObj.series) {
      queryObj.series = { $regex: queryObj.series as string, $options: "i" };
    }

    // Language filter
    if (queryObj.language) {
      queryObj.language = {
        $regex: queryObj.language as string,
        $options: "i",
      };
    }

    // Format filter
    if (queryObj.format) {
      queryObj.format = queryObj.format;
    }

    // Page count range filter
    if (queryObj.minPageCount || queryObj.maxPageCount) {
      queryObj.pageCount = {};
      if (queryObj.minPageCount) {
        const minPageCount = Number(queryObj.minPageCount);
        if (!isNaN(minPageCount)) queryObj.pageCount.$gte = minPageCount;
      }
      if (queryObj.maxPageCount) {
        const maxPageCount = Number(queryObj.maxPageCount);
        if (!isNaN(maxPageCount)) queryObj.pageCount.$lte = maxPageCount;
      }
      delete queryObj.minPageCount;
      delete queryObj.maxPageCount;
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort =
      (this.query.sort as string)?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this.query.fields as string)?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);
    return { page, limit, total, totalPage };
  }
}

export default QueryBuilder;
