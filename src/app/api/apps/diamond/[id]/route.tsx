
import { Diamond } from "@/data/model/diamond.schema";
import { deleteFactory, getFactory, patchFactory } from "../../crud/[id]/AbstractRoute";

export const GET = getFactory(Diamond);
export const PATCH = patchFactory(Diamond);
export const DELETE = deleteFactory(Diamond);
