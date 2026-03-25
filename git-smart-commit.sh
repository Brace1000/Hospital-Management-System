#!/bin/bash

# Smart Git Commit Script - Fixed Version

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Smart Git Commit Script${NC}"
echo "=================================================="

# Check if in git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository${NC}"
    exit 1
fi

# Get ALL changed files (tracked + untracked)
ALL_FILES=$(git status --porcelain | awk '{print $2}')

if [ -z "$ALL_FILES" ]; then
    echo -e "${YELLOW}ℹ️  No changes to commit${NC}"
    exit 0
fi

TOTAL_FILES=$(echo "$ALL_FILES" | wc -l | tr -d ' ')
echo -e "${BLUE}�� Found $TOTAL_FILES file(s) to commit${NC}"
echo ""

generate_commit_message() {
    file=$1
    filename=$(basename "$file")
    ext="${filename##*.}"

    if [[ "$filename" == "README.md" ]]; then
        echo "docs: Add README"
    elif [[ "$ext" == "md" ]]; then
        echo "docs: Add $filename"
    elif [[ "$ext" == "yml" || "$ext" == "yaml" || "$filename" == "docker-compose.yml" ]]; then
        echo "build: Add $filename"
    elif [[ "$ext" == "sh" ]]; then
        echo "chore: Add script $filename"
    elif [[ "$ext" == "go" || "$ext" == "rs" || "$ext" == "js" || "$ext" == "ts" || "$ext" == "py" ]]; then
        echo "feat: Add $filename"
    else
        echo "feat: Add $filename"
    fi
}

COMMIT_COUNT=0

while IFS= read -r file; do
    if [ -n "$file" ]; then
        COMMIT_COUNT=$((COMMIT_COUNT + 1))

        COMMIT_MSG=$(generate_commit_message "$file")

        git add "$file"

        if git commit -m "$COMMIT_MSG"; then
            echo -e "${GREEN}✅ [$COMMIT_COUNT/$TOTAL_FILES] $COMMIT_MSG${NC}"
        else
            echo -e "${RED}❌ Failed: $file${NC}"
        fi
    fi
done <<< "$ALL_FILES"

echo ""
echo -e "${GREEN}✅ All files committed!${NC}"

# Push section
echo ""
read -p "🚀 Push to remote? (y/n): " choice

if [[ "$choice" == "y" ]]; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    git push -u origin "$BRANCH"
fi
