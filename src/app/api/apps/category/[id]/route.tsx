
import { Category } from "@/data/model/category.schema";
import { deleteFactory, getFactory, patchFactory } from "../../crud/[id]/AbstractRoute";

export const GET = getFactory(Category);
export const PATCH = patchFactory(Category);
export const DELETE = deleteFactory(Category);
