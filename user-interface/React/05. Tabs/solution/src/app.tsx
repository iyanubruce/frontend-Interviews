import Tabs from './tabs';

export default function App() {
  return (
    <div className="wrapper">
      <Tabs
        items={[
          {
            value: 'html',
            label: 'HTML',
            panel: (
              <p>
                The HyperText Markup Language or HTML is the standard markup
                language for documents designed to be displayed in a web
                browser.
              </p>
            ),
          },
          {
            value: 'css',
            label: 'CSS',
            panel: (
              <p>
                Cascading Style Sheets is a style sheet language used for
                describing the presentation of a document written in a markup
                language such as HTML or XML.
              </p>
            ),
          },
          {
            value: 'javascript',
            label: 'JavaScript',
            panel: (
              <p>
                JavaScript, often abbreviated as JS, is a programming language
                that is one of the core technologies of the World Wide Web,
                alongside HTML and CSS.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
