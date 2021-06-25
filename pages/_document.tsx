// TODO: FIXME: implement server side styling

import Document from 'next/document'

// type StyletronProps = { stylesheets: Sheet[] }

class AppDocument extends Document {
    // static override async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & StyletronProps> {
    //     const renderPage = () =>
    //         ctx.renderPage({
    //             enhanceApp: (App: AppType) =>
    //                 function StyletronApp(props) {
    //                     return (
    //                         <StyletronProvider value={styletron}>
    //                             <App {...props} />
    //                         </StyletronProvider>
    //                     )
    //                 },
    //         })
    //     const initialProps = await super.getInitialProps({
    //         ...ctx,
    //         renderPage,
    //     })
    //     const stylesheets = (styletron as Server).getStylesheets()
    //     return { ...initialProps, stylesheets: stylesheets }
    // }
    // override render(): JSX.Element {
    //     return (
    //         <Html>
    //             <Head>
    //                 {this.props.stylesheets?.map((sheet, i) => (
    //                     <style
    //                         className={HydrateClass}
    //                         dangerouslySetInnerHTML={{ __html: sheet.css }}
    //                         data-hydrate={sheet.attrs['data-hydrate']}
    //                         key={i}
    //                         media={sheet.attrs['media']}
    //                     />
    //                 ))}
    //             </Head>
    //             <body>
    //                 <Main />
    //                 <NextScript />
    //             </body>
    //         </Html>
    //     )
    // }
}

export default AppDocument
