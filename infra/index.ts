import { kubeconfig } from "./cluster";
import { ingressServiceIP } from "./k8s/system";
import { currencyConverter } from "./k8s/apps";
import { mainRecord } from "./dns";

export const config = kubeconfig;
export const externalIp = ingressServiceIP;
export const domain = mainRecord;
export const service = currencyConverter;
