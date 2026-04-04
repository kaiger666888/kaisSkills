#!/usr/bin/env bash
# project-init.sh — Initialize a kais-team project directory and state.json
# Usage: bash project-init.sh <project-name> [goal-description]

set -euo pipefail

PROJECT="${1:?Usage: project-init.sh <project-name> [goal]}"
GOAL="${2:-}"
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_DIR="${SKILL_DIR}/projects"
PROJECT_DIR="${PROJECTS_DIR}/${PROJECT}"

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
  "goal": "${GOAL}",
  "team": [],
  "tasks": [],
  "checkpoints": [],
  "contextSnapshot": "",
  "createdAt": "${NOW}",
  "lastActive": "${NOW}"
}
EOF

echo "OK: Project initialized at $PROJECT_DIR/state.json"
