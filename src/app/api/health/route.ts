export function GET(){return Response.json({status:"ok",service:"shiftsecure",mode:process.env.DEMO_MODE==="false"?"configured":"demo",timestamp:new Date().toISOString()})}
