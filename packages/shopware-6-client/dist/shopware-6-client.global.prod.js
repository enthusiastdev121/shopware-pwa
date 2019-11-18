var Shopware6Client=function(t,a){"use strict";a=a&&a.hasOwnProperty("default")?a.default:a;const n={endpoint:"https://shopware-2.vuestorefront.io/sales-channel-api/v1",accessToken:"SWSCMUDKAKHSRXPJEHNOSNHYAG",contextToken:"",defaultPaginationLimit:10};let e={};const o=function(t={}){e=Object.assign(e,n,t)};o();const c=function(t){e=Object.assign(e,t)},i=e,s=a.create({});function r(){s.defaults.baseURL=i.endpoint,s.defaults.headers.common["sw-access-key"]=i.accessToken,i.contextToken?s.defaults.headers.common["sw-context-token"]=i.contextToken:delete s.defaults.headers.common["sw-context-token"]}r();const u=()=>"/category",d=t=>`/category/${t}`,f=t=>`/product/${t}`,g=t=>t?`/customer/address/${t}`:"/customer/address",l=(t,a)=>`/customer/address/${a}/default-${t}`,p=t=>l("billing",t),y=t=>l("shipping",t),w=()=>"/customer",m=()=>"/customer/login",h=()=>"/customer/logout",C=()=>"/customer/email",T=()=>"/customer/password",E=()=>"/checkout/cart",k=t=>`/checkout/cart/product/${t}`,I=t=>`/checkout/cart/line-item/${t}`,x=t=>`/checkout/cart/code/${t}`,P=()=>"/context",v=()=>"/currency",N=()=>"/language",D=()=>"/country",A=()=>"/payment-method",O=()=>"/shipping-method",F=()=>"/vsf/page",S=()=>"/vsf/navigation";var b;!function(t){t[t.ONE=1]="ONE",t[t.FIVE=5]="FIVE",t[t.TEN=10]="TEN",t[t.TWENTY_FIVE=25]="TWENTY_FIVE",t[t.FIFTY=50]="FIFTY",t[t.SEVENTY_FIVE=75]="SEVENTY_FIVE",t[t.HUNDRED=100]="HUNDRED",t[t.FIVE_HUNDRED=500]="FIVE_HUNDRED"}(b||(b={}));const R=t=>{let a={};if(!t)return a;const{filters:n,sort:e,pagination:o,configuration:c}=t;if(o){const{limit:t,page:n}=o;t&&Object.values(b).includes(t)&&(a.limit=t),n&&(a.page=n,a.limit||(a.limit=i.defaultPaginationLimit))}if(e){let t=e.desc?"-":"";a.sort=`${t}${e.field}`}return n&&n.length&&(a.filter=n),c&&(a.associations=function t(a=[]){if(!a||!a.length)return;let n={};return a.forEach(a=>{n[a.name]={associations:t(a.associations)}}),n}(c.associations)),a};async function V(t){const a=(await s.patch(P(),t)).data["sw-context-token"];return M({contextToken:a}),{contextToken:a}}var $;function M(t={}){c(t),r()}return function(t){t.PRODUCT="product",t.CREDIT="credit",t.CUSTOM="custom",t.PROMOTION="promotion"}($||($={})),t.addCartItemQuantity=async function(t,a){let n={type:$.PRODUCT,quantity:a};return(await s.post(I(t),n)).data},t.addProductToCart=async function(t,a){return(await s.post(k(t),{quantity:a})).data},t.addPromotionCode=async function(t){return(await s.post(x(t))).data},t.changeCartItemQuantity=async function(t,a){let n={quantity:a};return(await s.patch(I(t),n)).data},t.clearCart=async function(){let t=(await s.post(E())).data["sw-context-token"];return M({contextToken:t}),{contextToken:t}},t.config=i,t.createCustomerAddress=async function(t){return(await s.post(g(),t)).data},t.deleteCustomerAddress=async function(t){await s.delete(g(t))},t.getAvailableCountries=async function(){return(await s.get(D())).data},t.getAvailableCurrencies=async function(){return(await s.get(v())).data},t.getAvailableLanguages=async function(){return(await s.get(N())).data},t.getAvailablePaymentMethods=async function(){return(await s.get(A())).data},t.getAvailableShippingMethods=async function(){return(await s.get(O())).data},t.getCart=async function(){return(await s.get(E())).data},t.getCategories=async function(t){return(await s.post(u(),R(t))).data},t.getCategory=async function(t){return(await s.get(d(t))).data.data},t.getCustomer=async function(){return(await s.get(w())).data.data},t.getCustomerAddress=async function(t){return(await s.get(g(t))).data.data},t.getCustomerAddresses=async function(){return(await s.get(g())).data.data},t.getNavigation=async function(t){return(await s.post(S(),t)).data},t.getPage=async function(t,a){return(await s.post(F(),{path:t})).data},t.getProduct=async function(t,a=null){return(await s.get(f(t),{params:a})).data.data},t.getProducts=async function(t){return(await s.post("/product",R(t))).data},t.getProductsIds=async function(){return(await s.post("/search-ids/product")).data},t.login=async function(t){const a=(await s.post(m(),t)).data["sw-context-token"];return M({contextToken:a}),{contextToken:a}},t.logout=async function(){await s.post(h()),M({contextToken:""})},t.register=async function(t){return(await s.post(w(),t)).data},t.removeCartItem=async function(t){return(await s.delete(I(t))).data},t.setCurrentCurrency=async function(t){let a={currencyId:t};return await V(a)},t.setCurrentLanguage=async function(t){let a={languageId:t};return await V(a)},t.setCurrentPaymentMethod=async function(t){let a={paymentMethodId:t};return await V(a)},t.setCurrentShippingMethod=async function(t){let a={shippingMethodId:t};return await V(a)},t.setDefaultCustomerBillingAddress=async function(t){return(await s.patch(p(t))).data},t.setDefaultCustomerShippingAddress=async function(t){return(await s.patch(y(t))).data},t.setup=function(t={}){o(t),r()},t.update=M,t.updateEmail=async function(t){await s.patch(C(),t)},t.updatePassword=async function(t){await s.patch(T(),t)},t.updateProfile=async function(t){await s.patch(w(),t)},t}({},axios);
