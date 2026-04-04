#!/usr/bin/env bash
# project-init.sh — Initialize a kais-team project directory and state.json
# Usage: bash project-init.sh [--autopilot] <project-name> [goal-description]
# Note: <project-name> can be a simple name (stored in skills/kais-team/projects/) or an absolute path.

set -euo pipefail

MODE="normal"
if [[ "${1:-}" == "--autopilot" ]]; then
  MODE="autopilot"
  shift
fi

PROJECT="${1:?Usage: project-init.sh [--autopilot] <project-name> [goal-description]}"
GOAL="${2:-}"
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Support absolute paths or simple names
if [[ "$PROJECT" == /* ]]; then
  PROJECT_DIR="${PROJECT}"
else
  PROJECTS_DIR="${SKILL_DIR}/projects"
  PROJECT_DIR="${PROJECTS_DIR}/${PROJECT}"
fi

# Validate: no path traversal
if [[ "${PROJECT_DIR}" == *".."* ]]; then
  echo "ERROR: Path traversal not allowed."
  exit 1
fi

if [ -d "$PROJECT_DIR" ]; then
  echo "ERROR: Project '$PROJECT' already exists at $PROJECT_DIR"
  exit 1
fi

mkdir -p "$PROJECT_DIR"

NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$PROJECT_DIR/state.json" << EOF
{
  "project": "${PROJECT}",
  "phase": "analyzing",
  "mode": "${MODE}",
  "goal": "${GOAL}",
  "team": [],
  "tasks": [],
  "checkpoints": [],
  "decisions": [],
  "contextSnapshot": "",
  "createdAt": "${NOW}",
  "updatedAt": "${NOW}",
  "lastActive": "${NOW}"
}
EOF

echo "OK: Project initialized at $PROJECT_DIR/state.json (mode: ${MODE})"
