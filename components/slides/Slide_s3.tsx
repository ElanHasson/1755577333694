import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- After a cut, cells choose a repair path: NHEJ is fast and often knocks out genes; HDR is template‑guided and precise but less efficient
- Editing without cutting both strands: base editors swap single letters; prime editors do small search‑and‑replace
- No sequence change: CRISPRi/CRISPRa dial gene activity down or up; epigenome editing tweaks chemical marks
- Choice depends on goal, cell type, and delivery; fewer breaks often mean fewer risks
- Real‑world links: Casgevy uses a knockout strategy; PCSK9 base editing aims to lower LDL; prime editing is entering trials
\`\`\`mermaid
flowchart TD
Start["CRISPR finds the DNA target"] --> Q{"Create a double-strand break?"}
Q -->|Yes| NHEJ["NHEJ 'quick fix' → small indels → often gene knockout"]
Q -->|Yes| HDR["HDR 'copy-from-template' → precise change (needs donor; best in dividing cells)"]
Q -->|No| Base["Base editor 'letter swap' (e.g., C→T, A→G)"]
Q -->|No| Prime["Prime editor 'search-and-replace' (small insertions/deletions/substitutions)"]
Q -->|No| Reg["CRISPRi/a 'volume knob' for gene activity (no DNA sequence change)"]
\`\`\`
\`\`\`python
# Picking a repair/editing path (conceptual)
def choose_path(goal, dividing_cells):
    if goal == "knockout":
        return "NHEJ"
    if goal == "precise_correction" and dividing_cells:
        return "HDR + donor template"
    if goal in ("single_letter", "small_edit"):
        return "Base or Prime editing"
    return "CRISPRi/a (regulate without changing sequence)"

print(choose_path("knockout", dividing_cells=False))  # NHEJ
\`\`\`
`;
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
      <h1>After the Cut: Repair Paths and Editing Without Cutting</h1>
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