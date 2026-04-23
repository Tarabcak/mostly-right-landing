---
name: mostlyright-api
description: Call the Mostly Right REST API directly over HTTPS to fetch weather observations, climate reports, forecasts, and Kalshi settlement pairs. Use when an agent needs raw HTTP access without the Python SDK, for example from a language with no SDK binding or from a serverless runtime.
---

# Mostly Right REST API

Mostly Right is the settlement truth layer for prediction markets. This skill covers the REST surface at `api.mostlyright.md`. If Python is available, prefer the companion skill `mostlyright-sdk`.

## When to use this skill

- You are calling from a language without an official SDK (Node, Go, Rust, shell, etc.).
- You want minimum dependencies in a serverless runtime.
- You are generating code for another agent that will issue raw HTTP requests.

## Base URL

```
https://api.mostlyright.md
```

OpenAPI specification: https://api.mostlyright.md/openapi.json

## Authentication

Every endpoint except `/health`, `/capabilities`, and `/openapi.json` requires the `X-API-Key` header.

```bash
curl -H "X-API-Key: $MOSTLYRIGHT_API_KEY" \
  "https://api.mostlyright.md/observations?station=NYC&from_date=2026-04-01&to_date=2026-04-07"
```

Request a key by emailing vuhcze@gmail.com.

## Endpoint map

| Path | Purpose |
|------|---------|
| `GET /health` | Liveness probe. No auth. |
| `GET /capabilities` | SDK capabilities, supported methods, station registry. |
| `GET /stations` | List all stations. |
| `GET /stations/{code}` | Metadata for one station. Accepts 3-letter NWS or 4-letter ICAO. |
| `GET /observations` | METAR or SPECI observations. 30 raw fields per row. |
| `GET /climate` | Daily NWS CLI climate reports. Kalshi settlement source. |
| `GET /forecasts` | IEM discrete-run forecast data. |
| `GET /forecast_series` | Open-Meteo seamless forecast series. |
| `GET /pairs` | Observations joined to climate and forecast per settlement date. |
| `GET /snapshot` | Point-in-time view for a station at a given UTC moment. |
| `GET /availability/{station}` | Earliest and latest dates per data type for a station. |
| `GET /feature-catalog` | Every field with unit, dtype, description, transforms. |

## Formats

Most endpoints accept a `format` query parameter:

- `json` (default)
- `csv`
- `parquet` (raw bytes, ideal for bulk pulls)
- `toon` (compact token-efficient format for LLM context)

Example:

```bash
curl -H "X-API-Key: $MOSTLYRIGHT_API_KEY" \
  "https://api.mostlyright.md/pairs?station=NYC&from_date=2026-01-01&to_date=2026-04-01&format=toon"
```

## Stations

Twenty US cities:

```
ATL AUS BOS DCA DEN DFW HOU LAS LAX MDW
MIA MSP NYC ORD PDX PHX SAN SEA SFO STL
```

Use the 3-letter NWS code. Unknown codes return 404 with the valid list in the body.

## Temporal honesty

Climate reports are withheld until the NWS CLI publication threshold passes. `/snapshot` filters observations to `[window_start_utc, as_of]`. This is intentional: the API returns only what was actually available at the queried moment, so backtests do not leak future data.

## Canonical documentation

- API reference: https://mostlyright.md/docs/api/
- Introduction and design: https://mostlyright.md/docs/introduction/
- Authentication: https://mostlyright.md/docs/authentication/
- Raw-as-reported data policy: https://mostlyright.md/docs/concepts/raw-as-reported/
- Observation schema: https://mostlyright.md/docs/concepts/observation-schema/

## Related resources

- Python SDK (`pip install mostlyright`): https://mostlyright.md/docs/sdk/installation/
- Quickstart walkthrough: https://mostlyright.md/docs/quickstart/
