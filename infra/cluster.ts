import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const name = "apps-cluster";

const config = new pulumi.Config('gke');
export const masterVersion = config.get("masterVersion") ||
  gcp.container.getEngineVersions().then(it => it.latestMasterVersion);

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
