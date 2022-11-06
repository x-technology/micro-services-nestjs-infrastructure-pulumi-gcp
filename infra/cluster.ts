import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const name = "apps-cluster";

const config = new pulumi.Config('gke');
export const masterVersion = config.get("gke:masterVersion") ||
  gcp.container.getEngineVersions().then(it => it.latestMasterVersion);
pulumi.log.info("config" + config.get("masterVersion"))

// Create a GKE cluster
export const cluster = new gcp.container.Cluster(name, {
  // We can't create a cluster with no node pool defined, but we want to only use
  // separately managed node pools. So we create the smallest possible default
  // node pool and immediately delete it.
  initialNodeCount: config.getNumber("nodeCount"),
  removeDefaultNodePool: true,

  minMasterVersion: masterVersion,
});

const nodePool = new gcp.container.NodePool(`default-node-pool`, {
  cluster: cluster.name,
  initialNodeCount: 1,
  location: cluster.location,
  nodeConfig: {
    preemptible: true,
    machineType: config.get("nodeMachineType"),
    oauthScopes: [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ],
  },
  version: masterVersion,
  management: {
    autoRepair: true,
  },
}, {
  dependsOn: [cluster],
});

// Export the Cluster name
export const clusterName = cluster.name;

// Manufacture a GKE-style kubeconfig
export const kubeconfig = pulumi.all([cluster.name, cluster.endpoint, cluster.masterAuth]).apply(([name, endpoint, masterAuth]) => {
  const context = `${gcp.config.project}_${gcp.config.zone}_${name}`;
  return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: gke-gcloud-auth-plugin
      installHint: Install gke-gcloud-auth-plugin for use with kubectl by following
        https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke
      provideClusterInfo: true
`;
});

// Create a Kubernetes provider instance that uses our cluster from above.
export const k8sProvider = new k8s.Provider(name, {
  kubeconfig: kubeconfig,
}, {
  dependsOn: [cluster, nodePool],
});

// // Create a Kubernetes Namespace
// const ns = new k8s.core.v1.Namespace(name, {}, { provider: k8sProvider });
//
// // Export the Namespace name
// export const namespaceName = ns.metadata.name;
//
// // Create a NGINX Deployment
// const appLabels = { appClass: name };
// const deployment = new k8s.apps.v1.Deployment(name,
//   {
//     metadata: {
//       namespace: namespaceName,
//       labels: appLabels,
//     },
//     spec: {
//       replicas: 1,
//       selector: { matchLabels: appLabels },
//       template: {
//         metadata: {
//           labels: appLabels,
//         },
//         spec: {
//           containers: [
//             {
//               name: name,
//               image: "nginx:latest",
//               ports: [{ name: "http", containerPort: 80 }],
//             },
//           ],
//         },
//       },
//     },
//   },
//   {
//     provider: k8sProvider,
//   },
// );
//
// // Export the Deployment name
// export const deploymentName = deployment.metadata.name;
//
// // Create a LoadBalancer Service for the NGINX Deployment
// const service = new k8s.core.v1.Service(name,
//   {
//     metadata: {
//       labels: appLabels,
//       namespace: namespaceName,
//     },
//     spec: {
//       type: "LoadBalancer",
//       ports: [{ port: 80, targetPort: "http" }],
//       selector: appLabels,
//     },
//   },
//   {
//     provider: k8sProvider,
//   },
// );
//
// // Export the Service name and public LoadBalancer endpoint
// export const serviceName = service.metadata.name;
// export const servicePublicIP = service.status.loadBalancer.ingress[0].ip;
