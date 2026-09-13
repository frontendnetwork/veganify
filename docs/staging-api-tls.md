# Staging API TLS — required ingress spec

Local development (`bun run dev`) sets `NEXT_PUBLIC_STAGING=true` via
`.env.development` and therefore calls `https://staging.api.veganify.app`.
That hostname has **no Ingress rule** in the `veganify` namespace, so
nginx-ingress answers with its default self-signed "Kubernetes Ingress
Controller Fake Certificate" and every request fails instantly with
`DEPTH_ZERO_SELF_SIGNED_CERT` (surfacing as "unknown error" in the UI).

DNS for `staging.api.veganify.app` already points at the cluster's ingress
IPs. To fix dev, apply an Ingress with a real certificate, e.g. with
cert-manager (adjust the cluster issuer name to match the one that issued
`veganify-backend-tls`):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: veganify-backend-staging-ingress
  namespace: veganify
  annotations:
    cert-manager.io/cluster-issuer: <same-issuer-as-veganify-backend-tls>
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - staging.api.veganify.app
      secretName: veganify-backend-staging-tls
  rules:
    - host: staging.api.veganify.app
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: veganify-backend-service
                port:
                  number: 80
```

If cert-manager is not installed, create the TLS secret manually from an
existing certificate for `staging.api.veganify.app` and drop the annotation.

Note: this routes the staging hostname to the same backend deployment.
If a separate staging backend is intended, point `backend.service` at that
service instead.
