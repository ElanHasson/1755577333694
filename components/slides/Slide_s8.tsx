import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

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