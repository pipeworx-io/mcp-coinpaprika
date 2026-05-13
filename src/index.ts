interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Coinpaprika MCP — alternative crypto data source
 *
 * Free tier: 25k req/month, no signup needed.
 * Docs: https://api.coinpaprika.com/
 */


const BASE = 'https://api.coinpaprika.com/v1';

const tools: McpToolExport['tools'] = [
  {
    name: 'list_coins',
    description: 'All ~25k tracked coins — id, name, symbol, rank, is_active.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_coin',
    description: 'Full coin profile — description, team, links, tags.',
    inputSchema: {
      type: 'object',
      properties: { coin_id: { type: 'string', description: 'Coinpaprika id (e.g. "btc-bitcoin")' } },
      required: ['coin_id'],
    },
  },
  {
    name: 'tickers_latest',
    description: 'Latest price + market cap + volume. Without coin_id returns all tickers; with coin_id returns one.',
    inputSchema: {
      type: 'object',
      properties: {
        coin_id: { type: 'string' },
        quotes: { type: 'string', description: 'Comma-sep quote currencies — USD,BTC,ETH,EUR,GBP,JPY (default USD)' },
      },
    },
  },
  {
    name: 'historical_ohlc',
    description: 'Daily OHLC + volume + market cap. Free tier: up to 1 year back.',
    inputSchema: {
      type: 'object',
      properties: {
        coin_id: { type: 'string' },
        start: { type: 'string', description: 'YYYY-MM-DD or unix timestamp' },
        end: { type: 'string', description: 'YYYY-MM-DD or unix timestamp (optional)' },
        limit: { type: 'number', description: '1-365 (default 1)' },
        quote: { type: 'string', description: 'usd | btc (default usd)' },
      },
      required: ['coin_id', 'start'],
    },
  },
  {
    name: 'global_market',
    description: 'Total market cap, 24h volume, BTC dominance, active currencies.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'search',
    description: 'Fuzzy search across coins, exchanges, ICOs, people, tags.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        modifier: { type: 'string', description: 'symbol_search to search by ticker' },
        limit: { type: 'number', description: '1-250 (default 6)' },
      },
      required: ['query'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_coins':
      return paprikaGet('/coins');
    case 'get_coin':
      return paprikaGet(`/coins/${encodeURIComponent(reqStr(args, 'coin_id', '"btc-bitcoin"'))}`);
    case 'tickers_latest': {
      const quotes = String(args.quotes ?? 'USD').toUpperCase();
      const id = (args.coin_id as string | undefined)?.trim();
      const params = new URLSearchParams({ quotes });
      return paprikaGet(id ? `/tickers/${encodeURIComponent(id)}?${params}` : `/tickers?${params}`);
    }
    case 'historical_ohlc': {
      const id = reqStr(args, 'coin_id', '"btc-bitcoin"');
      const params = new URLSearchParams({
        start: reqStr(args, 'start', '"2024-01-01"'),
        limit: String(Math.min(365, Math.max(1, (args.limit as number) ?? 1))),
        quote: String((args.quote as string) ?? 'usd').toLowerCase(),
      });
      if (args.end) params.set('end', String(args.end));
      return paprikaGet(`/coins/${encodeURIComponent(id)}/ohlcv/historical?${params}`);
    }
    case 'global_market':
      return paprikaGet('/global');
    case 'search': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"bitcoin"'),
        c: 'currencies',
        limit: String(Math.min(250, Math.max(1, (args.limit as number) ?? 6))),
      });
      if (args.modifier) params.set('modifier', String(args.modifier));
      return paprikaGet(`/search?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function paprikaGet(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } });
  if (res.status === 404) throw new Error(`Coinpaprika: not found (${path})`);
  if (res.status === 429) throw new Error('Coinpaprika: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Coinpaprika error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
