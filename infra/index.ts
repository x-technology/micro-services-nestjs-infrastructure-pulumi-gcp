import { kubeconfig, cluster } from "./cluster";
import { ingressServiceIP } from "./k8s/system";
import { mainRecord } from "./dns";
import { currencyConverter } from "./k8s/apps";

export const clusterName = cluster.name;
export const config = kubeconfig;
export const externalIp = ingressServiceIP;
// export const domain = mainRecord.name;
// export const service = currencyConverter.urn;
