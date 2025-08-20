import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- Everyday encounters beyond medicine
  - On shelves: high-oleic soybean oil, non-browning mushrooms, high-GABA tomatoes (Japan)
  - Traits focus on taste, nutrition, shelf life, or less waste—not adding foreign DNA in many cases
  - Labels vary by country; look for QR codes or brand info pages for details
  - Safety and oversight differ by region (US, EU, UK); approvals require food-safety review
- CRISPR diagnostics you may see
  - Portable tests use Cas12/Cas13 to spot a pathogen’s genetic “barcode”
  - Results show up like a pregnancy-test line or in an app; fast and low-cost are the goals
  - Pilots exist for flu, COVID, and other infections in clinics and some point-of-care settings
  - Data privacy and quality standards matter as these move closer to consumers
\`\`\`mermaid
flowchart TD
A[Gene-edited trait] --> B[Farm production]
B --> C[Processing and packaging]
C --> D[Store or restaurant]
D --> E[What you see: label or QR code]
F[CRISPR diagnostic sample] --> G[Cas enzyme detects target]
G --> H[Signal generation]
H --> I[Readout: line or app]
\`\`\`
\`\`\`python
# Toy demo: how a CRISPR diagnostic decision might be shown in an app
def crispr_detect(sample_signal, threshold=0.6):
    return "Positive" if sample_signal >= threshold else "Negative"
signals = {"Tom": 0.72, "Ava": 0.18}  # example fluorescence values
for name, s in signals.items():
    print(name, crispr_detect(s))
# Output: Tom Positive; Ava Negative
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Beyond the Clinic: Food and Diagnostics You Might Encounter</h1>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Handle inline code
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return (
                <Mermaid chart={String(children).replace(/\n$/, '')} />
              );
            }
            
            // Handle code blocks with syntax highlighting
            if (language) {
              return (
                <SyntaxHighlighter
                  language={language}
                  style={atomDark}
                  showLineNumbers={true}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            
            // Default code block without highlighting
            return (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}