import React from 'react'
import Markdown from 'react-styleguidist/lib/client/rsg-components/Markdown';
const StyleGuideRenderer = ({
  title,
  version,
  homepageUrl,
  components,
  toc,
  hasSidebar
}) => (
  <div className="root">
    <h1>{title}</h1>
    {version && <h2>{version}</h2>}
    <main className="wrapper">
      <div className="content">
        {components}
        <footer className="footer">
          <Markdown
            text={`Created with [React Styleguidist](${homepageUrl})`}
          />
        </footer>
      </div>
      {hasSidebar && <div className="sidebar">{toc}</div>}
    </main>
  </div>
)
export default StyleGuideRenderer;