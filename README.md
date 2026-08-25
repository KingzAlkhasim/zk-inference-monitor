# zk-inference-monitor

Developer dashboard and API for real-time monitoring, zero-knowledge proof verification, and performance tracking of on-chain AI model inferences.

The project is designed as a modular observability and verification layer for AI inference workloads that interact with blockchain infrastructure.

## Overview

`zk-inference-monitor` provides infrastructure for tracking AI inference execution and verifying that reported inference results are backed by valid zero-knowledge proofs.

The project focuses on three core capabilities:

1. **Inference Monitoring** — Track inference requests, execution status, latency, and performance.
2. **ZK-Proof Verification** — Verify zero-knowledge proofs associated with AI inference results.
3. **Developer Observability** — Provide APIs and a dashboard for inspecting inference activity and performance.

The system is designed to remain modular so that additional proof systems, inference providers, models, and blockchain networks can be integrated without changing the core monitoring architecture.

## Goals

* Provide a reliable API for inference monitoring.
* Track inference lifecycle and performance metrics.
* Verify zk-proofs associated with inference results.
* Expose useful metrics to developers through an API and dashboard.
* Keep proof verification isolated from application and monitoring logic.
* Support asynchronous inference workflows.
* Provide a clear foundation for future on-chain AI integrations.

## Architecture

The project is organized into independent components:

```text
                        ┌──────────────────────┐
                        │   AI Inference App   │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │  Monitoring API      │
                        │                      │
                        │  Inference Status    │
                        │  Performance Metrics │
                        └──────────┬───────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │ Inference        │          │ ZK Verification │
          │ Monitoring       │          │ Service          │
          └────────┬─────────┘          └────────┬─────────┘
                   │                             │
                   ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │ Metrics /        │          │ Proof Verifier   │
          │ Persistence      │          │                  │
          └──────────────────┘          └──────────────────┘
```

## Planned Project Structure

```text
zk-inference-monitor/
├── src/
│   ├── api/
│   │   ├── health/
│   │   ├── inferences/
│   │   └── verification/
│   │
│   ├── inference/
│   │   ├── models/
│   │   ├── services/
│   │   └── metrics/
│   │
│   ├── verification/
│   │   ├── provers/
│   │   ├── verifiers/
│   │   └── services/
│   │
│   ├── common/
│   │   ├── errors/
│   │   ├── logging/
│   │   └── config/
│   │
│   └── main.ts
│
├── tests/
├── docs/
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── package.json
└── tsconfig.json
```

## Core Concepts

### Inference Lifecycle

Inference requests will follow an explicit lifecycle:

```text
PENDING
   │
   ▼
RUNNING
   │
   ├──────────────► FAILED
   │
   ▼
COMPLETED
   │
   ▼
VERIFIED
```

Verification is treated as a separate concern from inference execution so that an inference can be monitored independently of its proof-verification state.

### Inference Metrics

The monitoring layer is intended to expose metrics such as:

* Total inference requests.
* Successful inferences.
* Failed inferences.
* Average latency.
* Minimum latency.
* Maximum latency.
* P95 latency where supported.
* Inference throughput.
* Verification success/failure rate.

Metrics may be filtered by model, inference ID, time range, or other supported dimensions.

### Zero-Knowledge Proof Verification

Proof verification is isolated behind a verification interface so that different proof systems can be integrated without coupling them to the monitoring API.

Conceptually:

```text
Proof Request
     │
     ▼
Verification Service
     │
     ▼
Verifier Adapter
     │
     ▼
Proof System
     │
     ▼
Verification Result
```

A verification result should clearly distinguish between:

* Valid proof.
* Invalid proof.
* Malformed proof.
* Verification error.

## API

The API will expose endpoints for monitoring and verification.

Planned endpoints include:

```text
GET    /health
GET    /inferences
GET    /inferences/:id
POST   /inferences
GET    /inferences/:id/metrics
POST   /verification/proofs
GET    /verification/:id
```

The API contract will evolve alongside implementation and will be documented as endpoints become available.

## Example Inference Record

A typical inference record may contain:

```json
{
  "id": "inf_01",
  "model": "example-model",
  "status": "COMPLETED",
  "startedAt": "2026-08-25T10:00:00Z",
  "completedAt": "2026-08-25T10:00:02Z",
  "latencyMs": 2000,
  "verificationStatus": "VERIFIED"
}
```

The exact schema is subject to implementation and API versioning.

## Technology Direction

The project is intended to use a modular TypeScript backend with a dedicated persistence layer and pluggable proof-verification adapters.

The initial implementation should prioritize:

* TypeScript.
* Node.js.
* REST API.
* Automated testing.
* Structured logging.
* Environment-based configuration.
* CI validation.

Additional infrastructure such as PostgreSQL, Redis, message queues, and specific zk-proof libraries should be introduced only where required by the implementation.

## Development

### Prerequisites

Before contributing, install:

* Node.js 20+
* npm
* Git

Additional dependencies will be documented as the corresponding modules are introduced.

### Setup

Clone the repository:

```bash
git clone https://github.com/rabsqueen/zk-inference-monitor.git
cd zk-inference-monitor
```

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Configure the required environment variables before starting the application.

> **Note:** The repository is currently being established. Development commands and environment variables will be finalized as the initial application structure is implemented.

## Testing

Tests will be organized by responsibility:

```text
tests/
├── unit/
├── integration/
└── e2e/
```

The project will use automated tests to validate:

* Inference lifecycle transitions.
* Performance metric calculations.
* API behavior.
* Proof verification.
* Invalid proof handling.
* Error handling.
* Persistence and retrieval.
* Integration between monitoring and verification services.

## Contributing

Contributions are welcome.

Before starting work:

1. Check existing issues.
2. Choose an issue that is not already assigned.
3. Read the issue description and acceptance criteria.
4. Create a focused branch.
5. Keep changes limited to the issue scope.
6. Add or update tests where appropriate.
7. Ensure the project passes its quality checks.
8. Open a pull request describing the implementation.

### Branch Naming

Use descriptive branch names:

```text
feat/inference-metrics
fix/proof-verification-error
test/inference-api
docs/api-setup
```

### Commit Convention

Use conventional commits:

```text
feat: add inference latency metrics
fix: handle invalid proof input
test: add inference lifecycle tests
docs: improve local setup
refactor: isolate proof verification service
```

Commit subjects should be lowercase.

## Good First Issues

The repository is designed to support small, independently deliverable contributor tasks.

Examples include:

* Add inference health check endpoint.
* Add inference status tracking.
* Add inference latency metrics.
* Improve zk-proof verification error handling.
* Add verification result persistence.
* Add API pagination.
* Add model-level performance filtering.
* Add dashboard inference summary.
* Add proof verification integration tests.
* Improve monitoring API documentation.

Each contributor issue should contain a clear scope, technical context, acceptance criteria, and expected tests.

## Roadmap

### Phase 1 — Core Infrastructure

* [ ] Initialize backend application.
* [ ] Establish API structure.
* [ ] Add configuration management.
* [ ] Add structured logging.
* [ ] Add testing infrastructure.
* [ ] Add CI checks.
* [ ] Implement health endpoint.

### Phase 2 — Inference Monitoring

* [ ] Implement inference model.
* [ ] Implement inference lifecycle.
* [ ] Add inference API.
* [ ] Add latency metrics.
* [ ] Add performance aggregation.
* [ ] Add persistence.

### Phase 3 — ZK Verification

* [ ] Define verifier interface.
* [ ] Implement proof verification service.
* [ ] Add verifier adapter.
* [ ] Persist verification results.
* [ ] Add verification API.
* [ ] Add integration tests.

### Phase 4 — Developer Dashboard

* [ ] Build inference overview.
* [ ] Add real-time status monitoring.
* [ ] Add performance charts.
* [ ] Add verification status.
* [ ] Add model-level filtering.

### Phase 5 — On-Chain Integration

* [ ] Integrate supported blockchain data sources.
* [ ] Associate inference records with on-chain transactions.
* [ ] Track proof verification on-chain where applicable.
* [ ] Integrate with the broader on-chain AI infrastructure stack.

## Security

Security is a core requirement of the project.

Contributors must:

* Never commit private keys or API credentials.
* Never expose secrets through API responses or logs.
* Validate externally supplied proof and inference data.
* Avoid trusting client-provided verification results.
* Treat proof verification as an independent security boundary.
* Add tests for malformed and adversarial inputs where relevant.

If you discover a security vulnerability, please do not disclose exploit details in a public issue. Report it through the repository's designated security reporting process.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Project Status

**Early development**

The repository is currently being initialized. The architecture and API contracts may evolve as the core monitoring, verification, and dashboard components are implemented.

The goal is to maintain a modular codebase where contributors can independently work on well-scoped features without requiring changes across the entire system.
