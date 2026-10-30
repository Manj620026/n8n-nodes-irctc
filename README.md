# 🔄 `n8n-nodes-irctc` — Indian Railways Community Node for n8n

[![Powered by irctc.dev](https://img.shields.io/badge/Rail_Engine-irctc.dev-blue?style=flat-square&logo=train)](https://irctc.dev)
[![n8n Community Node](https://img.shields.io/badge/n8n-Community_Node-EA4B71?style=flat-square&logo=n8n)](https://n8n.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Official [n8n](https://n8n.io) community node for [irctc.dev](https://irctc.dev). Connect self-hosted and cloud n8n automation workflows to live Indian Railways data with sub-10ms response times.

Automate live PNR tracking, WhatsApp train delay alerts, Slack morning commute digests, and Tatkal/post-charting vacant seat notifications with zero code.

---

## ⚡ Installation in n8n

### For Docker & Self-Hosted n8n Instances:
In your n8n root directory (or container):
```bash
npm install n8n-nodes-irctc
```
Or in the n8n Web UI:
1. Go to **Settings ➔ Community Nodes**.
2. Click **Install a community node**.
3. Enter `n8n-nodes-irctc` and accept the community install.

---

## 🛠️ Operations & Capabilities (All 14 Indian Railways Endpoints)

| Resource | Operation | Capabilities |
| :--- | :--- | :--- |
| **PNR Status** | `Check PNR Status` | Checks live passenger confirmation (`CNF`, `RAC`, `WL`), coach/berth details (`S4 65 LOWER`), and chart preparation status. |
| **Live Tracking & Station Board** | `Get Live Running Status` | Real-time GPS train location, current delay in minutes, next station halt, and platform numbers. |
| **Live Tracking & Station Board** | `Get Live Station Board` | Real-time arrivals & departures board for any Indian railway station within 2 hours. |
| **Trains & Fares** | `Search Trains Between Stations` | Direct train discovery between two stations with travel duration, distance, and running days. |
| **Trains & Fares** | `Check Seat Availability Forecast` | Official 14-day continuous seat availability calendar forecast across travel classes (`3A`, `2A`, `SL`) and quotas (`GN`, `TQ`). |
| **Trains & Fares** | `Get Vacant Berths After Chart` | Post-charting vacant berth allocations from online reservation charts for Current Booking. |
| **Trains & Fares** | `Calculate Ticket Fare Breakup` | Itemized IRCTC fare calculation (Base Fare, Superfast, GST, Catering). |
| **Trains & Fares** | `Get Full Route Schedule` | Full intermediate halt stations, arrival/departure timings, stop durations, and distances. |
| **Trains & Fares** | `Get Train by Number` | Quick basic train details, running days, origin, destination, and train type. |
| **Trains & Fares** | `Search Trains by Name` | Partial train name lookup (e.g. "Rajdhani", "Shatabdi", "Vande Bharat"). |
| **Trains & Fares** | `Get Cancelled Trains` | Real-time list of today's cancelled, diverted, and partially cancelled trains. |
| **Stations & Timetables** | `Search Stations Autocomplete` | Station search with autocomplete by station code or city name (e.g. "delhi"). |
| **Stations & Timetables** | `Get Station Details by Code` | Station metadata, state, and railway division information. |
| **Stations & Timetables** | `Get Station Timetable by Date` | All trains arriving at or departing from a station on a given date. |
| **Engine Health** | `Get Engine Health` | Live Rail Engine health check and service status. |

---

## 📦 3 Ready-to-Import Workflow Templates (Included in `/workflows`)

1. **`pnr-confirmation-alert.json`:**
   - Polls PNR every 30 minutes.
   - If ticket transitions to `CNF`, sends immediate WhatsApp/Telegram alert with coach and seat number.
2. **`morning-commute-delay-digest.json`:**
   - Runs weekdays at 8:30 AM IST.
   - Checks daily commute train status and posts high-contrast delay report to tech team Slack channel.
3. **`tatkal-vacancy-watchdog.json`:**
   - Monitors train charts 4 hours prior to departure.
   - Immediately alerts user when vacant berths open up for Current Booking.

---

## 🔐 Credentials Setup

1. In n8n, click **Credentials ➔ New Credential ➔ IRCTC API**.
2. Enter your secret API key from [https://irctc.dev/dashboard](https://irctc.dev/dashboard) (claim **10,000 Free Credits** on 1-click Google signup).
3. Save credential and attach to any IRCTC node in your workflows.

---

## 📄 License

MIT © [irctc.dev Developer Platform](https://irctc.dev)
