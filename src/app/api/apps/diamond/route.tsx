import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'

import { Diamond } from "@/data/model/diamond.schema";
import { deleteFactory, patchFactory } from "../crud/[id]/AbstractRoute";
import { getFactory, postFactory } from "../crud/AbstractRoute";

export const GET = getFactory(Diamond);
export const POST = postFactory(Diamond);
export const PATCH = patchFactory(Diamond);
export const DELETE = deleteFactory(Diamond);
