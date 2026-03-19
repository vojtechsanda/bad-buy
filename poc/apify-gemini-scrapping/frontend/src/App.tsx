import { useState } from 'react';

type Stage = 'idle' | 'scraping' | 'analyzing' | 'done' | 'error';

type PriceResult = {
  product?: string;
  price?: string | null;
  available?: boolean | null;
  confidence?: string;
  raw?: string;
};

export default function App() {
  const [url, setUrl] = useState(
    'https://eshop.krejcovstvinaklinku.cz/kluci/kalhoty/zimni/?prev_page=21#limetkova1,antracitova4,puzzle,98',
  );
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<PriceResult | null>(null);

  const handleScrape = async () => {
    if (!url.trim()) return;

    setStage('scraping');
    setError('');
    setResult(null);

    try {
      // Stage 1: scrape with Apify
      const scrapeRes = await fetch('/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const scrapeData = await scrapeRes.json();

      if (!scrapeRes.ok || scrapeData.error) {
        setError(scrapeData.error ?? 'Scraping failed');
        setStage('error');
        return;
      }

      // Stage 2: analyze with Gemini
      setStage('analyzing');

      const analyzeRes = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bodyHtml: scrapeData.bodyHtml }),
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok || analyzeData.error) {
        setError(analyzeData.error ?? 'Analysis failed');
        setStage('error');
        return;
      }

      setResult(analyzeData.result);
      setStage('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setStage('error');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Price Wolf</h1>
      <p style={styles.subtitle}>Paste a product URL to extract its price</p>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="url"
          placeholder="https://example.com/product"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
          disabled={stage === 'scraping' || stage === 'analyzing'}
        />
        <button
          style={{
            ...styles.button,
            opacity: stage === 'scraping' || stage === 'analyzing' || !url.trim() ? 0.6 : 1,
          }}
          onClick={handleScrape}
          disabled={stage === 'scraping' || stage === 'analyzing' || !url.trim()}
        >
          {stage === 'scraping' || stage === 'analyzing' ? 'Working...' : 'Extract Price'}
        </button>
      </div>

      {stage === 'scraping' && <StatusCard icon="🔍" text="Scraping page with Apify..." />}
      {stage === 'analyzing' && (
        <StatusCard icon="🤖" text="Data received. Analyzing price with AI..." />
      )}

      {stage === 'error' && (
        <div style={styles.errorCard}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {stage === 'done' && result && <ResultCard result={result} />}
    </div>
  );
}

function StatusCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={styles.statusCard}>
      <span style={styles.spinner}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function ResultCard({ result }: { result: PriceResult }) {
  if (result.raw) {
    return (
      <div style={styles.resultCard}>
        <p style={styles.errorText}>Could not parse price from this page.</p>
        <textarea style={styles.textarea} value={result.raw} readOnly />
      </div>
    );
  }

  const available = result.available;
  const hasPrice = result.price != null;

  return (
    <div style={styles.resultCard}>
      {result.product && <p style={styles.productName}>{result.product}</p>}

      {hasPrice ? (
        <p style={styles.price}>{result.price}</p>
      ) : (
        <p style={styles.errorText}>Price could not be determined</p>
      )}

      {available !== null && available !== undefined && (
        <p style={{ ...styles.availability, color: available ? '#16a34a' : '#dc2626' }}>
          {available ? 'In stock' : 'Out of stock'}
        </p>
      )}

      {result.confidence && <p style={styles.confidence}>Confidence: {result.confidence}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 640,
    margin: '60px auto',
    padding: '0 20px',
    fontFamily: 'sans-serif',
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 28,
    marginTop: 0,
  },
  inputRow: {
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: 15,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: 15,
    fontWeight: 600,
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  statusCard: {
    marginTop: 24,
    padding: '16px 20px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 15,
    color: '#374151',
  },
  spinner: {
    fontSize: 20,
  },
  errorCard: {
    marginTop: 24,
    padding: '16px 20px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 10,
    color: '#b91c1c',
    fontSize: 14,
  },
  resultCard: {
    marginTop: 24,
    padding: '24px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  productName: {
    fontSize: 16,
    color: '#374151',
    margin: '0 0 12px 0',
  },
  price: {
    fontSize: 36,
    fontWeight: 700,
    color: '#111',
    margin: '0 0 12px 0',
  },
  errorText: {
    color: '#6b7280',
    fontSize: 15,
    margin: '0 0 12px 0',
  },
  availability: {
    fontSize: 14,
    fontWeight: 600,
    margin: '0 0 8px 0',
  },
  confidence: {
    fontSize: 13,
    color: '#9ca3af',
    margin: 0,
  },
  textarea: {
    width: '100%',
    height: 200,
    padding: 10,
    fontSize: 13,
    fontFamily: 'monospace',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
};
