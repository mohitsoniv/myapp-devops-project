# myapp-devops-project

A ready-to-run demo app for DevOps workflows:
- CI/CD with **GitHub Actions** & **CircleCI**
- Containerization with **Docker**
- **Kubernetes** manifests
- Monitoring hooks for **Datadog** (APM) & **Bugsnag** (errors)

## Quickstart

### 1) Local run
```bash
npm ci
npm start
# Visit http://localhost:3000
# Trigger an error: http://localhost:3000/error
```

### 2) Build & run with Docker
```bash
docker build -t myapp-devops-starter:local .
docker run -p 3000:3000 --rm myapp-devops-starter:local
```

### 3) Push image from CI
Configure these **GitHub Actions** repository secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (Docker Hub access token)
- Optional for deploy: `KUBECONFIG_B64` (base64 of your kubeconfig for the target cluster)

For **CircleCI** (Project Settings → Environment Variables):
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- Optional: `KUBECONFIG_B64`

The image name used is: `${DOCKERHUB_USERNAME}/myapp-devops-starter`

### 4) Deploy to Kubernetes
Edit `k8s/deployment.yaml` and replace `DOCKERHUB_USERNAME` with your Docker Hub username, or let CI inject the tag via `kubectl set image`.
```bash
kubectl apply -f k8s/secret-sample.yaml   # optional if using Bugsnag
kubectl apply -f k8s/deployment.yaml
kubectl get svc -n myapp
```

### 5) Monitoring

**Datadog APM**
- Ensure the Datadog Agent runs on the node/cluster and APM tracing is enabled.
- Common env vars (set at runtime or on Agent): `DD_ENV`, `DD_SERVICE=myapp`, `DD_VERSION`, `DD_SITE`.

**Bugsnag**
- Create a project in Bugsnag, get API key.
- Put it into `k8s/secret-sample.yaml` or as an env var `BUGSNAG_API_KEY`.

### Project Layout
```
.github/workflows/ci.yml        # GitHub Actions pipeline: build/test/push + optional deploy
.circleci/config.yml            # CircleCI pipeline: build/test/push + optional deploy
Dockerfile                      # Production Node image
.dockerignore                   # Prunes build context
src/index.js                    # Express app with /, /healthz, /error
k8s/deployment.yaml             # Namespace + Deployment + Service
k8s/secret-sample.yaml          # Example Secret for Bugsnag
```

---

## Notes
- Replace `DOCKERHUB_USERNAME` in `k8s/deployment.yaml` or rely on CI to update the image on deploy.
- Add real tests & linters as needed.
- If you prefer Ingress, add an `Ingress` manifest based on your cluster’s ingress controller.
