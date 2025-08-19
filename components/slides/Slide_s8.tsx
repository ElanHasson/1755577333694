import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- **Balanced outlook:** Big wins are real (Casgevy for sickle cell, early in vivo trials, consumer foods), but so are limits (delivery, off-targets, cost, equity)
- **Guardrails that matter:** rigorous safety and transparent oversight; long-term follow-up; strong consensus against clinical germline use
- **What to watch next:** base/prime editors, broader in vivo delivery, rapid CRISPR diagnostics, consumer-focused crops
- **Critical questions:** What need? Who benefits? What risks and alternatives? How are consent, equity, and environment addressed?
- **Your next steps:** build literacy; follow reputable sources; join community dialogue; weigh trade-offs with humility

\`\`\`mermaid
flowchart TD
A["Potential: treatments, resilient crops, rapid tests"]
B["Risks: off-targets, access gaps, ecological impact"]
C["Guardrails: safety, oversight, ethics, public dialogue"]
D["Responsible use"]
E["Next steps: learn, discuss, engage"]
A --> D
B --> D
C --> D
D --> E
\`\`\`

\`\`\`json
{
  "proposal": "New CRISPR therapy or crop",
  "need": "Clearly defined medical or societal need",
  "edit_type": "Somatic | Base | Prime | Regulation",
  "delivery": "Ex vivo | LNP | AAV | Other",
  "benefit_risk_summary": "Expected benefits vs credible risks",
  "off_target_plan": "Design, high-fidelity enzymes, validation assays",
  "oversight": "IRB/ethics review, regulatory pathway, monitoring",
  "equity_plan": "Access, affordability, community engagement",
  "germline": "Not applicable (no reproductive use)"
}
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
      <h1>Balanced Outlook and Next Steps</h1>
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