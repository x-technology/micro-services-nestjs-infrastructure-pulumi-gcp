/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { GetRatesRequest, GetRatesResponse } from "./currency-provider";

export const protobufPackage = "ecbProvider";

export interface EcbProvider {
  GetRates(request: GetRatesRequest): Promise<GetRatesResponse>;
}

export class EcbProviderClientImpl implements EcbProvider {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "ecbProvider.EcbProvider";
    this.rpc = rpc;
    this.GetRates = this.GetRates.bind(this);
  }
  GetRates(request: GetRatesRequest): Promise<GetRatesResponse> {
    const data = GetRatesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetRates", data);
    return promise.then((data) => GetRatesResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
