
import { Jewellery } from "@/data/model/jewellery.schema";
import { deleteFactory, getFactory, patchFactory } from "../../crud/[id]/AbstractRoute";

export const GET = getFactory(Jewellery);
export const PATCH = patchFactory(Jewellery);
export const DELETE = deleteFactory(Jewellery);
