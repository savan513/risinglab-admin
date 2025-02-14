import { Jewellery } from '@/data/model/jewellery.schema'
import { deleteFactory, patchFactory } from '../crud/[id]/AbstractRoute'
import { getFactory, postFactory } from '../crud/AbstractRoute'

export const GET = getFactory(Jewellery)
export const POST = postFactory(Jewellery)
export const PATCH = patchFactory(Jewellery)
export const DELETE = deleteFactory(Jewellery)
