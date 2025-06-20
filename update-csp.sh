#!/bin/bash

# Update BunkerWeb backend configuration to allow Umami domain
# This script should be used to update your BunkerWeb configuration

echo "Add this to your BunkerWeb backend configuration:"
echo ""
echo "CONTENT_SECURITY_POLICY=script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com http://100.97.234.68:3013 https://opti.tailacac2.ts.net:3013; object-src 'none'; base-uri 'self'"
echo ""
echo "This will allow both your current Umami domain and the HTTPS version."
