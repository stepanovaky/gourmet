import { useState, useCallback } from "react";
import fetch from "node-fetch";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { Frame, Navigation, TopBar } from "@shopify/polaris";
import "./_app.css";

const theme = {
  colors: {
    topBar: {
      background: "linear-gradient(#f3ba81, #f5f5f5)",
      border: "#f3ba81",
      color: "#212B36",
    },
  },
};

const client = new ApolloClient({
  uri: "http://gourmet-b.herokuapp.com/graphql",
  fetch: fetch,
  fetchOptions: {
    credentials: "include",
  },
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});
class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavigationActive: false,
      searchActive: false,
      searchValue: "",
    };
  }

  render() {
    const handleNavigationToggle = () => {
      this.setState({
        mobileNavigationActive: !this.state.mobileNavigationActive,
      });
    };
    const path = this.props.router.asPath;
    const navigationMarkup = (
      <Navigation location="/">
        <Navigation.Section
          items={[
            {
              url: "/index",
              label: "Home",
              selected:
                path === "/index" || path.includes("hmac") ? true : false,
            },
            {
              url: "/products",
              label: "Products",
              selected: path === "/products" ? true : false,
            },
            {
              url: "/amazonwarranties",
              label: "Check Amazon Warranties",
              selected: path === "/amazonwarranties" ? true : false,
            },
          ]}
        />
      </Navigation>
    );

    const topBarMarkup = (
      <TopBar
        showNavigationToggle
        onNavigationToggle={handleNavigationToggle}
      />
    );

    // console.log(this.props);
    const { Component, pageProps } = this.props;
    const shopOrigin = "gourmeteasy.myshopify.com";
    return (
      <AppProvider i18n={translations} theme={theme}>
        <Provider
          config={{
            apiKey: API_KEY,
            shopOrigin: shopOrigin,
            forceRedirect: true,
          }}
        >
          <ApolloProvider client={client}>
            <Frame
              showMobileNavigation={this.state.mobileNavigationActive}
              onNavigationDismiss={handleNavigationToggle}
              topBar={topBarMarkup}
              //userMenu
              //onNavigationToggle

              navigation={navigationMarkup}
            >
              <Component {...pageProps} />
            </Frame>
          </ApolloProvider>
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    shopOrigin: ctx.query.shop,
  };
};

export default MyApp;
