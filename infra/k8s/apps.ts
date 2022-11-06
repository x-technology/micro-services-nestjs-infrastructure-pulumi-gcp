import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as cluster from "../cluster";
import * as dns from "../dns";

export const appNamespace = new k8s.core.v1.Namespace("apps", undefined, { provider: cluster.k8sProvider });

const config = new pulumi.Config('docker');
export const dockerRegistry = config.get("registry");

export const currencyConverter = new k8s.helm.v3.Chart("currency-converter", {
  path: "./charts/grpc",
  namespace: appNamespace.metadata.name,
  values: {
    image: {
      repository: dockerRegistry,
      tag: 'latest',
    },
    ingress: {
      baseDomain: dns.mainRecord.hostname,
      basePath: "/"
    },
  },
}, {
  provider: cluster.k8sProvider,
});
