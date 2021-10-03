import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue'

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo'

const httpLink = createHttpLink({
  // GraphQLサーバのURIを指定
  uri: 'http://localhost:4000/graphql',
})

// クエリキャッシュの取得
const cache = new InMemoryCache()

// Apollo client インスタンス生成
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})


// Bootstrap
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// Vue Apollo
Vue.use(VueApollo);

Vue.config.productionTip = false;

// クライアント側からGraphQLのデータを読み込む
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
