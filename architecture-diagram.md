<!-- API Structure -->

Browser Request
       ↓
┌─────────────────────────────────────────┐
│  Host Machine (Your Computer)          │
│                                         │
│  Port 5173 ────────────────────────────┼──→ Direct to Frontend
│       ↓                                 │
│  Port 8080 ────→ Nginx Container       │
│                      ↓                  │
│              Routes requests to:        │
│              • Frontend (/)             │
│              • Backend (/api/v1/)       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Docker Network                        │
│                                         │
│  Frontend Container (client:5173)      │
│  Backend Container (api:5050)          │
└─────────────────────────────────────────┘
