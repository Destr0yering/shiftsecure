export type ProviderMode="MOCK"|"SANDBOX"|"LIVE";
export type ProviderResult<T>={status:"success";data:T;mode:ProviderMode}|{status:"declined"|"retryable_error"|"uncertain";reason:string;mode:ProviderMode};
export interface PaymentProvider{createAuthorization(input:{amountCents:number;idempotencyKey:string}):Promise<ProviderResult<{id:string;maskedReference:string;expiresAt:string}>>}
export interface TransportationProvider{getEstimates():Promise<ProviderResult<{id:string;provider:string;service:string;costCents:number;arrival:string}[]>>;createBooking(input:{optionId:string;idempotencyKey:string}):Promise<ProviderResult<{id:string;eta:string}>>}
export class MockPravaProvider implements PaymentProvider{
  private seen=new Map<string,{id:string;maskedReference:string;expiresAt:string}>();
  async createAuthorization(i:{amountCents:number;idempotencyKey:string}){const existing=this.seen.get(i.idempotencyKey);const data=existing??{id:`auth-${i.idempotencyKey}`,maskedReference:"PRV-••••-4012",expiresAt:"2026-07-30T12:00:00Z"};this.seen.set(i.idempotencyKey,data);return {status:"success" as const,data,mode:"MOCK" as const}}
}
export class MockTransportationProvider implements TransportationProvider{
  private seen=new Map<string,{id:string;eta:string}>();
  async getEstimates(){return {status:"success" as const,mode:"MOCK" as const,data:[{id:"uber-x",provider:"Uber Guest Rides",service:"UberX",costCents:3600,arrival:"6:42 AM"},{id:"lyft-standard",provider:"Lyft Concierge",service:"Standard",costCents:3100,arrival:"6:58 AM"},{id:"local-taxi",provider:"Metro Taxi",service:"Standard",costCents:4100,arrival:"6:47 AM"}]}}
  async createBooking(i:{optionId:string;idempotencyKey:string}){const data=this.seen.get(i.idempotencyKey)??{id:`ride-${i.idempotencyKey}`,eta:"6:42 AM"};this.seen.set(i.idempotencyKey,data);return {status:"success" as const,data,mode:"MOCK" as const}}
}
export class PravaPaymentProvider implements PaymentProvider{async createAuthorization(_input:{amountCents:number;idempotencyKey:string}){return {status:"uncertain" as const,reason:"Live Prava contract and credentials are not verified; mock provider required.",mode:"LIVE" as const}}}
export class UberGuestRidesProvider extends MockTransportationProvider{}
export class LyftConciergeProvider extends MockTransportationProvider{}
