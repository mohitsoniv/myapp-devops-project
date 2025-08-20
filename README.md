# myapp-devops-project (with Datadog & Bugsnag)

DevOps demo app with:
- CI/CD (GitHub Actions on `master`, CircleCI)
- Dockerized Node.js service
- Kubernetes manifests (Deployment + Service)
- Datadog APM & Bugsnag error tracking hooks

## Endpoints
- `/` -> hello JSON
- `/healthz` -> health check
- `/error` -> throws an error for Bugsnag/Datadog demo

## Local
```bash
npm ci
npm start
# http://localhost:3000/
# http://localhost:3000/error
```

## Docker
```bash
docker build -t myapp-devops-starter:local .
docker run -p 3000:3000 --rm myapp-devops-starter:local
```

## CI/CD
- GitHub Actions pushes `mohitsoniv/myapp-devops-starter:latest`
- CircleCI does the same for the `master` branch
> Note: Avoid committing secrets to repos; prefer CI secrets.

## Kubernetes
```bash
kubectl apply -f k8s/secret-sample.yaml   # set your BUGSNAG_API_KEY
kubectl apply -f k8s/deployment.yaml
kubectl get svc myapp-service
```

## Datadog
- Run the Datadog Agent in your cluster/nodes with APM enabled.
- Set `DD_SERVICE`, `DD_ENV`, `DD_VERSION` as shown in the deployment.
- Ensure `DD_SITE` & API key are configured on the Agent.

## Bugsnag
- Create a project in Bugsnag and get the API key.
- Put it into `k8s/secret-sample.yaml` or set env var `BUGSNAG_API_KEY` in your runtime.
