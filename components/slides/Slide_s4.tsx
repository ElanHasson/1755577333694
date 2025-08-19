import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `**Key takeaways**
- Two routes to get CRISPR where it needs to work: ex vivo vs in vivo
- Ex vivo: remove cells, edit and check them, then return; great for blood/immune cells; example Casgevy for sickle cell disease
- In vivo: send the editor directly to tissues using carriers like lipid nanoparticles (LNPs) or AAV; example liver-targeted TTR amyloidosis
- Trade-offs: ex vivo offers control and testing; in vivo reaches tissues you can’t easily remove; both require careful monitoring for off-target effects
- Choice depends on tissue, safety, and how long the editor should act; many therapies aim for short, transient exposure

\`\`\`mermaid
flowchart LR
A["Editing goal"] --> B["Ex vivo — edit cells outside the body"]
A --> C["In vivo — deliver editor inside the body"]
B --> D["Common cells: blood/immune"]
B --> E["Example: Casgevy for sickle cell"]
C --> F["Delivery vehicles"]
F --> G["LNPs often reach liver"]
F --> H["AAV engineered for eye or muscle"]
C --> I["Example: TTR amyloidosis trial"]
\`\`\`

\`\`\`json
[
  {
    "route": "ex_vivo",
    "cargo": "Cas9_gRNA",
    "vehicle": "electroporation",
    "target_tissue": "blood",
    "goal": "gene_knockout"
  },
  {
    "route": "in_vivo",
    "cargo": "base_editor",
    "vehicle": "LNP",
    "target_tissue": "liver",
    "goal": "gene_silencing"
  }
]
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
      <h1>Getting CRISPR Into Cells: Ex Vivo vs In Vivo Delivery</h1>
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