#!/bin/bash
cd /home/kavia/workspace/code-generation/quick-notes-manager-255029-255044/react_notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

