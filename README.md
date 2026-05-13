# mcp-coinpaprika

Coinpaprika MCP — alternative crypto data source

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_coins` | All ~25k tracked coins — id, name, symbol, rank, is_active. |
| `get_coin` | Full coin profile — description, team, links, tags. |
| `tickers_latest` | Latest price + market cap + volume. Without coin_id returns all tickers; with coin_id returns one. |
| `historical_ohlc` | Daily OHLC + volume + market cap. Free tier: up to 1 year back. |
| `global_market` | Total market cap, 24h volume, BTC dominance, active currencies. |
| `search` | Fuzzy search across coins, exchanges, ICOs, people, tags. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
