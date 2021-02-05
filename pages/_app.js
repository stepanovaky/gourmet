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

const theme = {
  colors: {
    topBar: {
      background: "#fff",
      backgroundLighter: "#F4F6F8",
      backgroundDarker: "#DFE3E8",
      border: "#C4CDD5",
      color: "#212B36",
    },
  },
};

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  fetch: fetch,
  fetchOptions: {
    credentials: "include",
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

    const navigationMarkup = (
      <Navigation location="/">
        <Navigation.Section
          items={[
            {
              url: "/index",
              label: "Home",
            },
            {
              url: "/products",
              label: "Products",
            },
            {
              url: "/amazonwarranties",
              label: "Check Amazon Warranties",
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
    const shopOrigin = "muscled-store.myshopify.com";
    return (
      <AppProvider i18n={translations}>
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
