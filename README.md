# zk-inference-monitor

**Stellar-focused developer dashboard and API for real-time monitoring, zero-knowledge proof verification, and performance analytics for on-chain AI inference.**

[![Stellar](https://img.shields.io/badge/Stellar-Soroban-7D00FF?logo=stellar&logoColor=white)](https://stellar.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Node.js-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **Project status:** Early development. Core architecture and API contracts are being established.

---

## Overview

`zk-inference-monitor` is a developer observability and verification layer for AI inference workloads that interact with **Stellar and Soroban**.

The project is designed to make AI inference activity easier to inspect, verify, and analyze by bringing together:

- **Inference monitoring** — Track inference requests, lifecycle state, latency, and performance.
- **Zero-knowledge proof verification** — Verify proofs associated with reported AI inference results.
- **Developer observability** — Expose inference and verification data through APIs and a developer dashboard.
- **Stellar/Soroban integration** — Associate inference activity with Stellar transactions and Soroban smart-contract workflows as the on-chain integration layer evolves.
- **Performance analytics** — Aggregate inference and verification metrics for developers building or operating on-chain AI applications.

The architecture is intentionally modular. Proof systems, inference providers, AI models, and blockchain integrations can be introduced through defined interfaces without coupling the core monitoring layer to a single implementation.

---

## Why Stellar?

Stellar provides the primary blockchain ecosystem target for this project.

`zk-inference-monitor` is intended to sit alongside applications that use **Stellar assets, Stellar transactions, and Soroban smart contracts** while AI inference is performed by an off-chain or distributed inference component.

A conceptual workflow is:

```text
                    AI / ML Application
                           │
                           │ inference request
                           ▼
                  ┌───────────────────┐
                  │ Inference Runtime │
                  └─────────┬─────────┘
                            │
                 inference result + proof
                            │
                            ▼
                 ┌──────────────────────┐
                 │ zk-inference-monitor │
                 │                      │
                 │ Monitoring API       │
                 │ Metrics              │
                 │ ZK Verification      │
                 └──────────┬───────────┘
                            │
              ┌─────────────┴──────────────┐
              │                            │
              ▼                            ▼
       Stellar / Soroban            Developer Dashboard
       transaction context           observability
              │
              ▼
       On-chain application
```

The Stellar integration is designed to evolve without making the monitoring core dependent on a single Soroban contract or application.

> **Important:** Stellar/Soroban integration is part of the project's target architecture and roadmap. It should not be interpreted as functionality that is already fully implemented in the current repository.

---

## Core Capabilities

### 1. Real-Time Inference Monitoring

Monitor AI inference workloads through a developer-facing API and dashboard.

Planned capabilities include:

- Inference registration.
- Inference lifecycle tracking.
- Model identification.
- Execution timestamps.
- Latency measurement.
- Success/failure tracking.
- Verification state.
- Filtering and pagination.
- Real-time status updates.

### 2. Zero-Knowledge Proof Verification

Proof verification is isolated behind a dedicated abstraction.

This allows the project to support different proof systems without coupling the monitoring API to one cryptographic implementation.

Verification outcomes are explicitly distinguished:

```text
VALID
INVALID
MALFORMED
VERIFICATION_ERROR
```

The system does not treat a client-provided verification result as authoritative. Verification belongs to the server-side verification boundary.

### 3. Performance Analytics

The monitoring layer is designed to expose:

- Total inference requests.
- Successful inferences.
- Failed inferences.
- Average latency.
- Minimum latency.
- Maximum latency.
- P95 latency where supported.
- Inference throughput.
- Verification success/failure rate.

Metrics can be filtered by model, inference ID, time range, and other supported dimensions.

### 4. Stellar and Soroban Context

As on-chain integration is implemented, inference records can be associated with relevant Stellar/Soroban context such as:

- Stellar transaction identifiers.
- Ledger-related identifiers.
- Soroban contract interactions.
- On-chain execution metadata.
- Application-level associations between inference results and blockchain activity.

The exact data model will evolve with the supported Stellar integration.

### 5. Developer Dashboard

The dashboard is intended to provide a single operational view for:

- Active inference activity.
- Inference lifecycle state.
- Model performance.
- Latency and throughput.
- Verification results.
- ZK verification failures.
- Model-level analytics.
- On-chain context where available.

---

## Architecture

The system is organized around independent monitoring and verification components.

```text
                           ┌─────────────────────────┐
                           │   AI / ML Application   │
                           └────────────┬────────────┘
                                        │
                                        ▼
                           ┌─────────────────────────┐
                           │     Monitoring API      │
                           │                         │
                           │ Inference Status        │
                           │ Performance Metrics    │
                           │ Verification API        │
                           └────────────┬────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                         ▼                             ▼
              ┌────────────────────┐       ┌────────────────────┐
              │ Inference Monitoring│       │ ZK Verification   │
              │                    │       │ Service            │
              │ Lifecycle          │       │                    │
              │ Metrics             │       │ Verification       │
              └─────────┬──────────┘       └─────────┬──────────┘
                        │                            │
                        ▼                            ▼
              ┌────────────────────┐       ┌────────────────────┐
              │ Persistence /      │       │ Verifier Adapter   │
              │ Metrics Store      │       │                    │
              └────────────────────┘       └─────────┬──────────┘
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │ Selected ZK     │
                                             │ Proof System    │
                                             └─────────────────┘

                         Stellar / Soroban Context
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │ On-Chain Integration │
                           │ Adapter              │
                           └──────────────────────┘
```

### Architectural Principles

- **Modularity:** Components communicate through explicit interfaces.
- **Separation of concerns:** Monitoring and proof verification remain independent.
- **Provider abstraction:** Blockchain and inference providers should be replaceable.
- **Verification isolation:** ZK verification is treated as a separate security boundary.
- **API-first design:** Monitoring capabilities are exposed through stable API contracts.
- **Security by default:** External data is validated and client-provided verification is not trusted.
- **Stellar-first integration:** Stellar/Soroban is the primary on-chain target while keeping the architecture extensible.

---

## Inference Lifecycle

Inference execution follows an explicit lifecycle:

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

Verification remains separate from inference execution.

An inference can therefore be:

```text
COMPLETED + verification pending
COMPLETED + verification valid
COMPLETED + verification invalid
```

This distinction is important because successful model execution does not, by itself, establish that a submitted proof is valid.

---

## ZK Verification Architecture

Proof verification is intentionally isolated:

```text
Proof Request
     │
     ▼
Validation
     │
     ▼
Verification Service
     │
     ▼
Verifier Interface
     │
     ▼
Concrete Verifier Adapter
     │
     ▼
Selected Proof System
     │
     ▼
Normalized Verification Result
```

The verifier interface should support at least:

```text
VALID
INVALID
MALFORMED
VERIFICATION_ERROR
```

A concrete proof system will be selected as part of implementation. The repository does not assume a particular ZK library before that decision is made.

---

## Stellar / Soroban Integration

The project is being developed with Stellar as its primary on-chain ecosystem target.

Potential integration points include:

### Stellar Network Data

The monitoring layer can associate inference activity with relevant Stellar transaction and ledger context.

### Soroban Smart Contracts

Inference-related workflows may interact with Soroban smart contracts where the application architecture requires on-chain logic.

### On-Chain Verification Context

Where applicable, the platform can track relationships between:

```text
AI Inference
     │
     ├── Inference ID
     │
     ├── Model
     │
     ├── Result
     │
     ├── ZK Proof
     │
     └── Stellar / Soroban Transaction
```

The exact contract interfaces and on-chain verification design are intentionally left open until the corresponding implementation issues are addressed.

For Stellar smart-contract development, see the official Soroban documentation:

https://developers.stellar.org/docs/build/smart-contracts/overview

---

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
│   ├── blockchain/
│   │   ├── stellar/
│   │   └── soroban/
│   │
│   ├── common/
│   │   ├── errors/
│   │   ├── logging/
│   │   └── config/
│   │
│   └── main.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── package.json
└── tsconfig.json
```

The exact structure may evolve as implementation progresses.

---

## API

The API is designed around inference monitoring and proof verification.

### Planned Endpoints

```text
GET    /health

GET    /inferences
POST   /inferences
GET    /inferences/:id
GET    /inferences/:id/metrics

POST   /verification/proofs
GET    /verification/:id
```

Additional Stellar/Soroban endpoints may be introduced only where required by the implementation.

### Example Inference Record

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

A future Stellar-aware representation may additionally associate an inference with on-chain context:

```json
{
  "id": "inf_01",
  "model": "example-model",
  "status": "COMPLETED",
  "verificationStatus": "VERIFIED",
  "stellar": {
    "transactionId": "..."
  }
}
```

The exact schema is subject to implementation and API versioning.

---

## Technology Direction

The initial implementation prioritizes:

- **TypeScript**
- **Node.js 20+**
- **REST API**
- **Automated testing**
- **Structured logging**
- **Environment-based configuration**
- **CI validation**
- **Modular persistence**
- **Pluggable ZK verification**
- **Stellar/Soroban integration**

Additional infrastructure such as PostgreSQL, Redis, message queues, and specific ZK-proof libraries should be introduced only where required.

The project should avoid infrastructure complexity that does not directly support an accepted implementation requirement.

---

## Development

### Prerequisites

Install:

- Node.js 20+
- npm
- Git

Additional dependencies will be documented as the corresponding modules are introduced.

### Clone

```bash
git clone https://github.com/rabsqueen/zk-inference-monitor.git
cd zk-inference-monitor
```

### Install

```bash
npm install
```

### Environment

Create a local environment file:

```bash
cp .env.example .env
```

Configure only the variables required by the current implementation.

Never commit a populated `.env` file.

---

## Testing

Tests are organized by responsibility:

```text
tests/
├── unit/
├── integration/
└── e2e/
```

Testing should cover:

- Inference lifecycle transitions.
- Metric calculations.
- API behavior.
- Proof verification.
- Invalid proof handling.
- Malformed proof handling.
- Verification errors.
- Persistence and retrieval.
- Monitoring/verification integration.
- Stellar/Soroban integration where implemented.
- Security-sensitive input validation.

The goal is to keep critical domain behavior independently testable while also validating complete workflows through integration and end-to-end tests.

---

## Security

Security is a core requirement.

### Rules for Contributors

- Never commit private keys.
- Never commit API credentials.
- Never expose secrets through API responses.
- Never expose secrets through logs.
- Validate externally supplied inference data.
- Validate externally supplied proof data.
- Never trust client-provided verification results.
- Treat ZK proof verification as an independent security boundary.
- Test malformed and adversarial inputs.
- Avoid storing sensitive proof material unless it is required by the application.
- Use environment-based configuration for credentials and deployment-specific secrets.

### Stellar/Soroban Security

When Stellar or Soroban functionality is introduced:

- Transaction inputs must be validated.
- Contract interactions must be explicit.
- Network configuration must be environment-driven.
- Signing credentials must never be committed.
- Testnet and production configuration must remain clearly separated.
- On-chain verification results must be independently validated rather than accepted solely from client input.

If you discover a security vulnerability, do not publish exploit details in a public issue. Use the repository's designated security reporting process.

---

## Contributing

Contributions are welcome.

Before starting work:

1. Check existing issues.
2. Choose an issue that is not already assigned.
3. Read the issue description and acceptance criteria.
4. Create a focused branch.
5. Keep changes within the issue scope.
6. Add or update tests.
7. Run the project's quality checks.
8. Open a pull request describing the implementation.

### Branch Naming

Use descriptive branch names:

```text
feat/inference-metrics
feat/stellar-adapter
feat/soroban-integration
fix/proof-verification-error
test/inference-api
docs/api-setup
```

### Commit Convention

Use Conventional Commits:

```text
feat: add inference latency metrics
feat: add stellar transaction context
feat: add soroban integration
fix: handle invalid proof input
test: add inference lifecycle tests
docs: improve local setup
refactor: isolate proof verification service
```

Commit subjects should be lowercase.

---

## Good First Issues

The project is designed around small, independently deliverable contributor tasks.

Examples include:

- Add the health endpoint.
- Add inference status tracking.
- Add inference latency metrics.
- Add API pagination.
- Add model-level performance filtering.
- Improve ZK verification error handling.
- Add verification result persistence.
- Add proof verification integration tests.
- Add Stellar transaction context to inference records.
- Improve monitoring API documentation.

Each contributor issue should define:

- Objective.
- Scope.
- Technical context.
- Acceptance criteria.
- Expected tests.
- Dependencies.

---

## Roadmap

### Phase 1 — Core Infrastructure

- [ ] Initialize backend application.
- [ ] Establish API structure.
- [ ] Add configuration management.
- [ ] Add structured logging.
- [ ] Add testing infrastructure.
- [ ] Add CI checks.
- [ ] Implement health/readiness endpoints.

### Phase 2 — Inference Monitoring

- [ ] Implement inference domain model.
- [ ] Implement inference lifecycle.
- [ ] Add inference API.
- [ ] Add latency metrics.
- [ ] Add performance aggregation.
- [ ] Add persistence.
- [ ] Add filtering and pagination.

### Phase 3 — ZK Verification

- [ ] Define verifier interface.
- [ ] Implement proof verification service.
- [ ] Select and integrate a proof-verifier adapter.
- [ ] Persist verification results.
- [ ] Add verification API.
- [ ] Add integration tests.

### Phase 4 — Stellar / Soroban Integration

- [ ] Define Stellar blockchain adapter.
- [ ] Add Stellar transaction context.
- [ ] Define Soroban integration boundary.
- [ ] Associate inference records with supported on-chain activity.
- [ ] Track relevant Soroban execution metadata.
- [ ] Add Stellar/Soroban integration tests.

### Phase 5 — Developer Dashboard

- [ ] Build inference overview.
- [ ] Add real-time inference monitoring.
- [ ] Add performance charts.
- [ ] Add ZK verification status.
- [ ] Add model-level filtering.
- [ ] Add Stellar/Soroban context where available.

### Phase 6 — Security and Operations

- [ ] Add authentication and authorization.
- [ ] Add operational metrics.
- [ ] Add structured audit events.
- [ ] Add monitoring and health checks.
- [ ] Expand integration and E2E coverage.

### Phase 7 — On-Chain AI Platform Integration

- [ ] Expand supported on-chain data sources where justified.
- [ ] Associate inference records with on-chain transactions.
- [ ] Track proof verification on-chain where applicable.
- [ ] Integrate with broader on-chain AI infrastructure.

---

## Project Development Strategy

The implementation is intentionally incremental.

```text
Foundation
    │
    ▼
Inference Monitoring
    │
    ▼
ZK Verification
    │
    ▼
Stellar / Soroban Integration
    │
    ▼
Developer Dashboard
    │
    ▼
Security + Observability
    │
    ▼
On-Chain AI Integration
```

Each stage should produce independently testable functionality before the next major integration layer is introduced.

---

## Ecosystem Positioning

`zk-inference-monitor` is intended to provide infrastructure for developers building applications where:

```text
AI Inference
     +
Zero-Knowledge Verification
     +
Stellar / Soroban
     +
Developer Observability
```

come together.

The project does not attempt to replace an AI inference engine or a general blockchain indexer. Its role is to provide the monitoring, verification, analytics, and developer-facing observability layer around inference workloads and their relevant on-chain context.

---

## Project Status

**Early development**

The repository is currently being initialized and restructured.

The architecture and API contracts may evolve as:

- Core inference monitoring is implemented.
- The verification boundary is tested.
- A concrete ZK proof system is selected.
- Stellar/Soroban integration is introduced.
- The developer dashboard is implemented.
- Security and operational requirements mature.

The project prioritizes a modular contributor-friendly codebase where individual contributors can implement well-scoped features without requiring changes across the entire platform.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Stellar Resources

- [Stellar](https://stellar.org/)
- [Stellar Developers](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://developers.stellar.org/docs/build/smart-contracts/overview)
- [Stellar Developer Tools](https://developers.stellar.org/docs/tools)

