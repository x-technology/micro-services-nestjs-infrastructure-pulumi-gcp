/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "currencyProvider";

export interface GetRatesRequest {
}

export interface GetRatesResponse {
  /**
   * The cost of 1 unit of baseCurrency in rate currency. E.g:
   * baseCurrency = EUR
   * currency = USD
   * rate = 1.1138 - the cost of 1 EUR in USD
   */
  baseCurrency: string;
  rates: GetRatesResponse_ExchangeRate[];
}

export interface GetRatesResponse_ExchangeRate {
  currency: string;
  rate: number;
}

function createBaseGetRatesRequest(): GetRatesRequest {
  return {};
}

export const GetRatesRequest = {
  encode(_: GetRatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRatesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetRatesRequest {
    return {};
  },

  toJSON(_: GetRatesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetRatesRequest>, I>>(_: I): GetRatesRequest {
    const message = createBaseGetRatesRequest();
    return message;
  },
};

function createBaseGetRatesResponse(): GetRatesResponse {
  return { baseCurrency: "", rates: [] };
}

export const GetRatesResponse = {
  encode(message: GetRatesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.baseCurrency !== "") {
      writer.uint32(10).string(message.baseCurrency);
    }
    for (const v of message.rates) {
      GetRatesResponse_ExchangeRate.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRatesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRatesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.baseCurrency = reader.string();
          break;
        case 3:
          message.rates.push(GetRatesResponse_ExchangeRate.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRatesResponse {
    return {
      baseCurrency: isSet(object.baseCurrency) ? String(object.baseCurrency) : "",
      rates: Array.isArray(object?.rates)
        ? object.rates.map((e: any) => GetRatesResponse_ExchangeRate.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetRatesResponse): unknown {
    const obj: any = {};
    message.baseCurrency !== undefined && (obj.baseCurrency = message.baseCurrency);
    if (message.rates) {
      obj.rates = message.rates.map((e) => e ? GetRatesResponse_ExchangeRate.toJSON(e) : undefined);
    } else {
      obj.rates = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetRatesResponse>, I>>(object: I): GetRatesResponse {
    const message = createBaseGetRatesResponse();
    message.baseCurrency = object.baseCurrency ?? "";
    message.rates = object.rates?.map((e) => GetRatesResponse_ExchangeRate.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetRatesResponse_ExchangeRate(): GetRatesResponse_ExchangeRate {
  return { currency: "", rate: 0 };
}

export const GetRatesResponse_ExchangeRate = {
  encode(message: GetRatesResponse_ExchangeRate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.currency !== "") {
      writer.uint32(10).string(message.currency);
    }
    if (message.rate !== 0) {
      writer.uint32(17).double(message.rate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRatesResponse_ExchangeRate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRatesResponse_ExchangeRate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.currency = reader.string();
          break;
        case 2:
          message.rate = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRatesResponse_ExchangeRate {
    return {
      currency: isSet(object.currency) ? String(object.currency) : "",
      rate: isSet(object.rate) ? Number(object.rate) : 0,
    };
  },

  toJSON(message: GetRatesResponse_ExchangeRate): unknown {
    const obj: any = {};
    message.currency !== undefined && (obj.currency = message.currency);
    message.rate !== undefined && (obj.rate = message.rate);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetRatesResponse_ExchangeRate>, I>>(
    object: I,
  ): GetRatesResponse_ExchangeRate {
    const message = createBaseGetRatesResponse_ExchangeRate();
    message.currency = object.currency ?? "";
    message.rate = object.rate ?? 0;
    return message;
  },
};

export interface CurrencyProvider {
  GetRates(request: GetRatesRequest): Promise<GetRatesResponse>;
}

export class CurrencyProviderClientImpl implements CurrencyProvider {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "currencyProvider.CurrencyProvider";
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

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
