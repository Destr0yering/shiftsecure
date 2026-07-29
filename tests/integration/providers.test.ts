import {describe,expect,it} from "vitest";
import {MockPravaProvider,MockTransportationProvider,PravaPaymentProvider} from "@/lib/providers";
describe("provider contracts",()=>{
 it("makes payment authorization idempotent",async()=>{const p=new MockPravaProvider();const a=await p.createAuthorization({amountCents:4000,idempotencyKey:"one"});const b=await p.createAuthorization({amountCents:4000,idempotencyKey:"one"});expect(a).toEqual(b)});
 it("makes ride booking idempotent",async()=>{const p=new MockTransportationProvider();const a=await p.createBooking({optionId:"uber-x",idempotencyKey:"one"});const b=await p.createBooking({optionId:"uber-x",idempotencyKey:"one"});expect(a).toEqual(b)});
 it("never fabricates an unconfigured live result",async()=>expect((await new PravaPaymentProvider().createAuthorization({amountCents:1,idempotencyKey:"x"})).status).toBe("uncertain"));
});
