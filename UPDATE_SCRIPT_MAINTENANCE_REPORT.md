## Update Script Maintenance Report

Date: 2026-03-04

- Root cause: workflow stability issues from legacy action pattern and narrow dependency pinning.
- Fixes made: replaced PR-creation workflow path with commit-if-changed automation, added explicit `permissions: contents: write`, moved workflow runtime to Python 3.11, and relaxed `pandas` pin for compatibility.
- Validation: reviewed dependency install path and update sequence (`make`, `make clean`) with controlled commit scope.
- Known blockers: UN/UNECE source format changes can still break parsing and may require script-side adjustments.
