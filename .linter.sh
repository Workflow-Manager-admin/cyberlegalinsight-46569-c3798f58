#!/bin/bash
cd /home/kavia/workspace/code-generation/cyberlegalinsight-46569-c3798f58/cyberlegalinsight_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

