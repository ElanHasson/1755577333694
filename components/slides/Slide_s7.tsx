import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- 30‑second pulse: Type G = OK, Y = Unsure, R = Not now
- Rate these scenarios as we read them aloud:
  - Treating sickle cell (somatic therapy)
  - Preventing inherited disease via embryo editing (germline)
  - Enhancing muscle or memory in embryos
  - Editing crops for disease resistance
  - Gene drive to reduce malaria mosquitoes
- No right or wrong—just mapping the room
- We’ll use your pattern to frame the ethics discussion
\`\`\`mermaid
flowchart TD
S["Scenario shown"]
C1["Allow (G)"]
C2["Unsure (Y)"]
C3["Not now (R)"]
S --> C1
S --> C2
S --> C3
C1 --> H["Group heatmap"]
C2 --> H
C3 --> H
H --> D["1-line debrief"]
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Interactive: Drawing the Line Together</h1>
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