---
name: mostlyright-sdk
description: Install and use the Mostly Right Python SDK to pull weather observations, climate reports, numerical model forecasts, and Kalshi settlement pairs. Use when an agent needs weather data for a US city to price, backtest, or settle prediction market contracts.
---

# Mostly Right Python SDK

Mostly Right is the settlement truth layer for prediction markets. This skill shows how to fetch data through the official Python SDK.

## When to use this skill

- You need historical METAR or SPECI observations for a US city.
- You need daily NWS CLI climate reports, the official Kalshi settlement source.
- You need numerical model forecasts (Open-Meteo seamless or IEM discrete runs).
- You need settlement "pairs" (observations joined to climate and forecast by date).
- You need live METAR direct from the Aviation Weather Center.

If you only need a single one-off HTTP request, the companion skill `mostlyright-api` covers direct REST access.

## Install

```bash
pip install mostlyright
```

Python 3.12 or newer. `pandas` and `pyarrow` are optional installs for `as_dataframe=True` and `format="parquet"` respectively.

## Authenticate

```bash
export MOSTLYRIGHT_API_KEY="mr_..."
```

Request a key by emailing vuhcze@gmail.com with a GitHub handle and a one-line description of the use case. Private beta.

The SDK picks the key up from `MOSTLYRIGHT_API_KEY` automatically. No configuration needed.

## Two clients

```python
from mostlyright import MostlyRightClient, WeatherLive
```

- `MostlyRightClient` handles historical observations, climate, forecasts, and pairs. `TherminalClient` is a backward-compatible alias.
- `WeatherLive` hits AWC directly for real-time METAR with the same column schema as the historical endpoint.

## Minimal example

```python
from mostlyright import MostlyRightClient

client = MostlyRightClient()

obs = client.observations(
    station="NYC",
    from_date="2026-04-01",
    to_date="2026-04-07",
)

pairs = client.pairs(
    station="NYC",
    from_date="2026-01-01",
    to_date="2026-04-01",
    include_forecast=True,
)
```

## Stations

Twenty US cities are in the registry:

```
ATL AUS BOS DCA DEN DFW HOU LAS LAX MDW
MIA MSP NYC ORD PDX PHX SAN SEA SFO STL
```

Use 3-letter NWS codes, not ICAO. Unknown codes return 404 with the full valid list in the body.

## Agent-friendly helpers

```python
tools = client.as_tools()           # function schemas for Claude or GPT tool-use
catalog = client.feature_catalog()  # every field with unit, dtype, bounds, description
```

Call `feature_catalog()` before building a feature vector. It tells the agent which columns exist, what each one means, and what transforms are safe.

## Canonical documentation

- Install and import: https://mostlyright.md/docs/sdk/installation/
- MostlyRightClient reference: https://mostlyright.md/docs/sdk/therminal-client/
- WeatherLive reference: https://mostlyright.md/docs/sdk/weather-live/
- Quickstart end-to-end: https://mostlyright.md/docs/quickstart/
- Authentication, rate limits, headers: https://mostlyright.md/docs/authentication/
- Raw-as-reported data policy: https://mostlyright.md/docs/concepts/raw-as-reported/

## Related resources

- OpenAPI specification: https://api.mostlyright.md/openapi.json
- Health endpoint: https://api.mostlyright.md/health
- Capabilities endpoint: https://api.mostlyright.md/capabilities
