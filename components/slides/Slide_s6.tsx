import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const mermaidRef = useRef(0);
  
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7c3aed',
        lineColor: '#5a67d8',
        secondaryColor: '#764ba2',
        tertiaryColor: '#667eea',
        background: '#1a202c',
        mainBkg: '#2d3748',
        secondBkg: '#4a5568',
        tertiaryBkg: '#718096',
        textColor: '#fff',
        nodeTextColor: '#fff',
      }
    });
    
    // Find and render mermaid diagrams
    const renderDiagrams = async () => {
      const diagrams = document.querySelectorAll('.language-mermaid');
      for (let i = 0; i < diagrams.length; i++) {
        const element = diagrams[i];
        const graphDefinition = element.textContent;
        const id = `mermaid-${mermaidRef.current++}`;
        
        try {
          const { svg } = await mermaid.render(id, graphDefinition);
          element.innerHTML = svg;
          element.classList.remove('language-mermaid');
          element.classList.add('mermaid-rendered');
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    };
    
    renderDiagrams();
  }, [markdown]);
  
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
                <pre className="language-mermaid">
                  <code>{String(children).replace(/\n$/, '')}</code>
                </pre>
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