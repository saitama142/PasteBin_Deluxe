# BunkerWeb Configuration Fix

Update your BunkerWeb backend configuration to allow the HTTPS Umami script:

```
IS_DRAFT=no
SERVER_NAME=api.pastebin.bruhphoria.xyz
USE_TEMPLATE=medium
BAD_BEHAVIOR_THRESHOLD=50
BAD_BEHAVIOR_BAN_TIME=14200
USE_CORS=yes
CORS_ALLOW_ORIGIN=https://pastebin.bruhphoria.xyz
CORS_ALLOW_HEADERS=Content-Type,X-Requested-With,Cache-Control,Pragma,Authorization
USE_DNSBL=no
KEEP_UPSTREAM_HEADERS=*
CONTENT_SECURITY_POLICY=default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://opti.tailacac2.ts.net:3013; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self' https://api.pastebin.bruhphoria.xyz
PERMISSIONS_POLICY=
COOKIE_FLAGS=* SameSite=Lax
AUTO_LETS_ENCRYPT=yes
LIMIT_CONN_MAX_HTTP1=100
LIMIT_CONN_MAX_HTTP2=150
LIMIT_CONN_MAX_HTTP3=150
LIMIT_REQ_RATE=30r/s
ALLOWED_METHODS=GET|POST|HEAD|OPTIONS|PUT|DELETE|PATCH
MAX_CLIENT_SIZE=50m
USE_MODSECURITY=no
USE_REVERSE_PROXY=yes
REVERSE_PROXY_HOST=http://100.118.127.61:3001
REVERSE_PROXY_HEADERS=X-Forwarded-Proto $scheme;X-Forwarded-For $proxy_add_x_forwarded_for;Host $host
REVERSE_SCAN_PORTS=22 80 443
WHITELIST_IP=80.12.92.191
```

Key change: Added proper CSP directive to allow your Umami script source.
