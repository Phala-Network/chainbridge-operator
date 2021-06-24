import { AppType, DocumentContext } from 'next/dist/next-server/lib/utils'
import Document, { DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document'
import { Server, Sheet } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import { styletron } from '../libs/styletron'

type PropExtensions = DocumentInitialProps & { styletronStyles: Sheet[] }

class AppDocument extends Document<PropExtensions> {
    static override async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & PropExtensions> {
        const renderPage = () =>
            ctx.renderPage({
                enhanceApp: (App: AppType) =>
                    function StyletronApp(props) {
                        return (
                            <StyletronProvider value={styletron}>
                                <App {...props} />
                            </StyletronProvider>
                        )
                    },
            })

        const initialProps = await Document.getInitialProps({
            ...ctx,
            renderPage,
        })

        const stylesheets = (styletron as Server).getStylesheets() || []

        return { ...initialProps, styletronStyles: stylesheets }
    }

    override render(): JSX.Element {
        return (
            <Html>
                <Head>
                    {this.props.styletronStyles.map((sheet, i) => (
                        <style
                            className="_styletron_hydrate_"
                            dangerouslySetInnerHTML={{ __html: sheet.css }}
                            data-hydrate={sheet.attrs['data-hydrate']}
                            key={i}
                            media={sheet.attrs['media']}
                        />
                    ))}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default AppDocument
