import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as cluster from "../cluster";

const ingressNamespace = new k8s.core.v1.Namespace("ingress", undefined, {
  provider: cluster.k8sProvider
});

const ingress = new k8s.helm.v3.Release("nginx", {
  chart: "ingress-nginx",
  version: "4.2.5",
  repositoryOpts: {
    repo: "https://kubernetes.github.io/ingress-nginx",
  },
  values: {
    controller: {
      publishService: {
        enabled: true,
      },
      watchIngressWithoutClass: true,
      metrics: {
        enabled: true,
      },
      service: {
        externalTrafficPolicy: 'Local',
      },
    }
  },
  namespace: ingressNamespace.metadata.name,
}, {
  provider: cluster.k8sProvider,
});

// Get the status field from the ingress service, and then grab a reference to the spec.
const svc = k8s.core.v1.Service.get(
  "nginx-nginx-ingress",
  pulumi.interpolate`${ingress.status.namespace}/${ingress.status.name}-ingress-nginx-controller`,
  {
    provider: cluster.k8sProvider,
    dependsOn: [
      ingress,
    ],
  },
);

export const ingressServiceIP = svc.status.apply(status => pulumi.interpolate`${status.loadBalancer.ingress[0].ip}`);
