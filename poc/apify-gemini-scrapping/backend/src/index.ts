import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApifyClient } from 'apify-client';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const apify = new ApifyClient({ token: process.env.APIFY_TOKEN });
const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? '');

app.post('/scrape', async (req, res) => {
  const { url } = req.body as { url?: string };

  if (!url) {
    res.status(400).json({ error: 'url is required' });
    return;
  }

  try {
    console.log(`Scraping: ${url}`);

    const run = await apify.actor('apify/playwright-scraper').call({
      startUrls: [{ url }],
      maxCrawlingDepth: 0,
      maxPagesPerCrawl: 1,
      pageFunction: `async function pageFunction(context) {
        const { page, request } = context;
        const title = await page.title();
        const bodyHtml = await page.evaluate(() => document.body.innerHTML);
        return {
          url: request.url,
          title,
          bodyHtml,
        };
      }`,
    });

    const { items } = await apify.dataset(run.defaultDatasetId).listItems();
    const page = items[0] as { url: string; title: string; bodyHtml: string } | undefined;

    if (!page || page.bodyHtml === undefined) {
      res.status(500).json({ error: 'Scraper returned no data' });
      return;
    }

    res.json({ url: page.url, title: page.title, bodyHtml: page.bodyHtml });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Scrape error:', message);
    res.status(500).json({ error: message });
  }
});

app.post('/analyze', async (req, res) => {
  const { bodyHtml } = req.body as { bodyHtml?: string };

  if (!bodyHtml) {
    res.status(400).json({ error: 'bodyHtml is required' });
    return;
  }

  try {
    console.log('Analyzing with Gemini...');

    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a product price extraction assistant analyzing an e-commerce page.

Given the HTML body of a product page, extract the following:
1. The main product name
2. The current selling price (the active price, not a crossed-out original price)
3. Whether the product is currently available to purchase

Respond with a raw JSON object only — no markdown, no code fences:
{
  "product": "full product name",
  "price": "price as shown including currency symbol",
  "available": true or false,
  "confidence": "high" | "medium" | "low"
}

If you cannot find the price, set "price" to null.
If you cannot determine availability, set "available" to null.

HTML content:
${bodyHtml.slice(0, 100000)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    res.json({ result: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Analyze error:', message);
    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
