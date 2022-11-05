/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "currencyConverter";

export interface ConvertRequest {
  sellCurrency: string;
  buyCurrency: string;
  sellAmount: number;
}

export interface ConvertResponse {
  sellAmount: number;
  sellCurrency: string;
  buyAmount: number;
  buyCurrency: string;
  conversionRate: number;
}

function createBaseConvertRequest(): ConvertRequest {
  return { sellCurrency: "", buyCurrency: "", sellAmount: 0 };
}

export const ConvertRequest = {
  encode(message: ConvertRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellCurrency !== "") {
      writer.uint32(10).string(message.sellCurrency);
    }
    if (message.buyCurrency !== "") {
      writer.uint32(18).string(message.buyCurrency);
    }
    if (message.sellAmount !== 0) {
      writer.uint32(25).double(message.sellAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConvertRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConvertRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellCurrency = reader.string();
          break;
        case 2:
          message.buyCurrency = reader.string();
          break;
        case 3:
          message.sellAmount = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConvertRequest {
    return {
      sellCurrency: isSet(object.sellCurrency) ? String(object.sellCurrency) : "",
      buyCurrency: isSet(object.buyCurrency) ? String(object.buyCurrency) : "",
      sellAmount: isSet(object.sellAmount) ? Number(object.sellAmount) : 0,
    };
  },

  toJSON(message: ConvertRequest): unknown {
    const obj: any = {};
    message.sellCurrency !== undefined && (obj.sellCurrency = message.sellCurrency);
    message.buyCurrency !== undefined && (obj.buyCurrency = message.buyCurrency);
    message.sellAmount !== undefined && (obj.sellAmount = message.sellAmount);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConvertRequest>, I>>(object: I): ConvertRequest {
    const message = createBaseConvertRequest();
    message.sellCurrency = object.sellCurrency ?? "";
    message.buyCurrency = object.buyCurrency ?? "";
    message.sellAmount = object.sellAmount ?? 0;
    return message;
  },
};

function createBaseConvertResponse(): ConvertResponse {
  return { sellAmount: 0, sellCurrency: "", buyAmount: 0, buyCurrency: "", conversionRate: 0 };
}

export const ConvertResponse = {
  encode(message: ConvertResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellAmount !== 0) {
      writer.uint32(9).double(message.sellAmount);
    }
    if (message.sellCurrency !== "") {
      writer.uint32(18).string(message.sellCurrency);
    }
    if (message.buyAmount !== 0) {
      writer.uint32(25).double(message.buyAmount);
    }
    if (message.buyCurrency !== "") {
      writer.uint32(34).string(message.buyCurrency);
    }
    if (message.conversionRate !== 0) {
      writer.uint32(41).double(message.conversionRate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConvertResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConvertResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellAmount = reader.double();
          break;
        case 2:
          message.sellCurrency = reader.string();
          break;
        case 3:
          message.buyAmount = reader.double();
          break;
        case 4:
          message.buyCurrency = reader.string();
          break;
        case 5:
          message.conversionRate = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConvertResponse {
    return {
      sellAmount: isSet(object.sellAmount) ? Number(object.sellAmount) : 0,
      sellCurrency: isSet(object.sellCurrency) ? String(object.sellCurrency) : "",
      buyAmount: isSet(object.buyAmount) ? Number(object.buyAmount) : 0,
      buyCurrency: isSet(object.buyCurrency) ? String(object.buyCurrency) : "",
      conversionRate: isSet(object.conversionRate) ? Number(object.conversionRate) : 0,
    };
  },

  toJSON(message: ConvertResponse): unknown {
    const obj: any = {};
    message.sellAmount !== undefined && (obj.sellAmount = message.sellAmount);
    message.sellCurrency !== undefined && (obj.sellCurrency = message.sellCurrency);
    message.buyAmount !== undefined && (obj.buyAmount = message.buyAmount);
    message.buyCurrency !== undefined && (obj.buyCurrency = message.buyCurrency);
    message.conversionRate !== undefined && (obj.conversionRate = message.conversionRate);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConvertResponse>, I>>(object: I): ConvertResponse {
    const message = createBaseConvertResponse();
    message.sellAmount = object.sellAmount ?? 0;
    message.sellCurrency = object.sellCurrency ?? "";
    message.buyAmount = object.buyAmount ?? 0;
    message.buyCurrency = object.buyCurrency ?? "";
    message.conversionRate = object.conversionRate ?? 0;
    return message;
  },
};

export interface CurrencyConverter {
  Convert(request: ConvertRequest): Promise<ConvertResponse>;
}

export class CurrencyConverterClientImpl implements CurrencyConverter {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "currencyConverter.CurrencyConverter";
    this.rpc = rpc;
    this.Convert = this.Convert.bind(this);
  }
  Convert(request: ConvertRequest): Promise<ConvertResponse> {
    const data = ConvertRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Convert", data);
    return promise.then((data) => ConvertResponse.decode(new _m0.Reader(data)));
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
