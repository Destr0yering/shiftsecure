import {z} from "zod";
import {evaluatePolicy} from "@/lib/domain";
const schema=z.object({costCents:z.number().int().positive(),provider:z.string().max(80),confidence:z.number().min(0).max(1)});
export async function POST(request:Request){const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return Response.json({type:"validation_error",title:"Invalid demo command",errors:parsed.error.flatten()},{status:400});return Response.json({correlationId:crypto.randomUUID(),policy:evaluatePolicy({...parsed.data,approvalThresholdCents:3000,maximumCents:4500,allowedProviders:["Uber Guest Rides","Lyft Concierge"],lateMinutes:0})})}
