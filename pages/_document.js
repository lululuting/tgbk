import Document, { Html, Head, Main, NextScript } from 'next/document';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

const MyDocument = () => (
  <Html lang="en">
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);

  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `</script>${extractStyle(cache)}<script>`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function getCookie(cname){
                  var name = cname + "=";
                  var ca = document.cookie.split(';');
                  for(var i=0; i<ca.length; i++) 
                  {
                    var c = ca[i].trim();
                    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
                  }
                  return "";
                }
                function setCookie(name,value,seconds){
                  seconds = seconds || 0;   
                  var expires = "";
                  if (seconds != 0 ) {
                    var date = new Date();
                    date.setTime(date.getTime()+(seconds*1000));
                    expires = "; expires="+date.toGMTString();
                  }
                  document.cookie = name+"="+escape(value)+expires+"; path=/";
                }
                function setTheme(theme, cookieTheme) {
                  window.__theme = cookieTheme;
                  setCookie('theme', cookieTheme);
                  document.documentElement.setAttribute('theme', theme)
                }

                var initialTheme = 'auto';
                var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

                try {
                  initialTheme = getCookie('theme').replace(/"/g, "");
                } catch (err) { }

                if (!initialTheme || initialTheme === 'auto') {
                  initialTheme = darkQuery.matches ? 'dark' : 'light' ;
                  setTheme(initialTheme, 'auto');
                }else{
                  setTheme(initialTheme, initialTheme);
                }

                darkQuery.addEventListener('change', function (e) {
                  let theme = e.matches ? 'dark' : 'light'
                  let cookieTheme = getCookie('theme').replace(/"/g, "")
                  if (!cookieTheme || cookieTheme === 'auto') {
                    setTheme(theme, cookieTheme);
                    window.refreshApp && window.refreshApp();
                  }
                });
              })();
            `
          }}
        />
      </>
    )
  };
}

export default MyDocument;


