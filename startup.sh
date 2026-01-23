#!/bin/bash

# Start the main application (React frontend)
nginx -g "daemon off;" &

# SSH Tunnel and kubectl port-forward (run in background)
{
  sleep 5  # Wait for main app to start
  echo "0967558394@Yg" | ssh -tt -o StrictHostKeyChecking=no -L 9260:127.0.0.1:9260 sysadmin@196.188.240.124 <<EOF
    kubectl get svc -n egov
    kubectl port-forward svc/egov-idgen -n egov 9260:8080
EOF
} &