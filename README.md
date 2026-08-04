# @pipeworx/coinpaprika

Coinpaprika MCP — alternative crypto data source (~25k coins). Keyless free tier (25k req/month, no signup).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `list_coins()` — all tracked coins
- `get_coin(coin_id)` — coin profile
- `tickers_latest(coin_id?, quotes?)` — latest price + market data
- `historical_ohlc(coin_id, start, end?, limit?, quote?)` — daily OHLC
- `global_market()` — total market cap, BTC dominance, etc.
- `search(query, modifier?, limit?)` — fuzzy search across coins, exchanges, ICOs

## Data source

`https://api.coinpaprika.com/v1/` — no auth.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "coinpaprika": {
      "url": "https://gateway.pipeworx.io/coinpaprika/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Coinpaprika data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
