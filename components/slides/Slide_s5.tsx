import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- Two live examples: sickle cell (ex vivo edit) and amyloidosis (in vivo edit)
- What’s edited and why: turn fetal hemoglobin back on; turn harmful TTR down
- Delivery matters: cells edited outside the body vs a one-time IV infusion
- Results so far: durable symptom relief in SCD; large TTR drops in early studies
- Safety guardrails: somatic-only edits, careful guide design, long-term follow-up
\`\`\`mermaid
flowchart LR
S["CRISPR in action"] --> B["Ex vivo - sickle cell"]
B --> C["Collect blood stem cells"]
C --> D["Edit BCL11A enhancer"]
D --> E["Quality check and reinfuse"]
E --> F["More fetal hemoglobin; fewer crises"]
S --> H["In vivo - amyloidosis"]
H --> I["LNP delivers CRISPR to liver"]
I --> J["Cut TTR gene in hepatocytes"]
J --> K["Less misfolded TTR protein in blood"]
\`\`\`
\`\`\`python
# Demo: simple guide + PAM check (conceptual)
# Goal: find spots where a 20nt guide sits next to an NGG PAM (for SpCas9)

def find_targets(genome_seq: str, guide: str):
    hits = []
    for i in range(len(genome_seq) - len(guide) - 2):
        window = genome_seq[i:i+len(guide)]
        pam = genome_seq[i+len(guide):i+len(guide)+2]
        if window == guide and pam.endswith("GG"):
            hits.append(i)
    return hits

# Example (toy strings, not real genomes)
patient_liver = "ACGTTGACTGACTGACTGACGGTCAGG..."
guide_TTR = "TGACTGACTGACTGACTGAC"  # targets TTR
print(find_targets(patient_liver, guide_TTR))
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
      <h1>Medicine in Action: From Sickle Cell to Amyloidosis</h1>
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