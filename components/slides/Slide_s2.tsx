import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- Guide RNA (gRNA) = the GPS address; it base-pairs with the matching DNA letters at the target
- Cas enzyme = the scissors; Cas9/Cas12a cut DNA, Cas13 cuts RNA
- PAM = a short tag next to the target that Cas needs to dock (e.g., SpCas9 uses NGG)
- Sequence of events: find PAM → test match with gRNA → bind → cut → cell repairs (NHEJ or HDR)
- Specificity matters: design good guides, use high-fidelity Cas, check off-targets
\`\`\`python
# Tiny demo: scan a DNA string for a perfect gRNA match followed by an NGG PAM
# Simplified: forward strand only; real designs check both strands and context

def find_spcas9_sites(seq, guide):
    L = len(guide)
    hits = []
    for i in range(len(seq) - L - 2):
        window = seq[i:i+L]
        pam = seq[i+L:i+L+3]
        if window == guide and len(pam) == 3 and pam[1:] == "GG":  # NGG
            hits.append((i, window, pam))
    return hits

dna = "ACGTTACCGGTTACGAGGCTAGCTTACCGG"
site_list = find_spcas9_sites(dna, guide="TTACG")
print(site_list)  # [(index, target, PAM)]
\`\`\`
\`\`\`mermaid
flowchart TD
  A["Cas + guide RNA patrol DNA"] --> B["Find PAM 'NGG' tag"]
  B --> C["Check base-pair match to guide"]
  C -->|"Good match"| D["Stable binding"]
  D --> E["Cas makes cut"]
  E --> F["Repair: NHEJ → small insertions/deletions (knockout)"]
  E --> G["Repair: HDR → precise change with template"]
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
      <h1>How CRISPR Finds and Edits: Guide RNA, Cas, and PAM</h1>
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