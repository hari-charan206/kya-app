(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,14287,e=>{"use strict";var t=e.i(43476),r=e.i(71645),n=e.i(22016);let s=[{id:"issue-credential",title:"Issue Credential",method:"POST",path:"/api/credentials",description:"Create a scoped, signed credential for an AI agent. The credential defines the agent's spend limit, allowed transaction categories, and expiry.",requestBody:`{
  "agent_id": "a1111111-1111-1111-1111-111111111111",
  "max_amount": 5000,
  "allowed_categories": ["groceries", "utilities"],
  "expires_in_days": 30
}`,responseSuccess:`{
  "credential_id": "c1111111-...",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-10-05T00:00:00Z"
}`,responseHighValue:`{
  "pending_approval": true,
  "pending_id": "p1111111-...",
  "message": "Amount ₹100,000 exceeds auto-approve threshold of ₹50,000. A senior_admin must approve."
}`,curl:`curl -X POST https://your-project.supabase.co/api/credentials \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "a1111111-1111-1111-1111-111111111111",
    "max_amount": 5000,
    "allowed_categories": ["groceries", "utilities"],
    "expires_in_days": 30
  }'`,python:`import requests

response = requests.post(
    "https://your-project.supabase.co/api/credentials",
    json={
        "agent_id": "a1111111-1111-1111-1111-111111111111",
        "max_amount": 5000,
        "allowed_categories": ["groceries", "utilities"],
        "expires_in_days": 30,
    }
)
print(response.json())`,node:`const response = await fetch("/api/credentials", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agent_id: "a1111111-1111-1111-1111-111111111111",
    max_amount: 5000,
    allowed_categories: ["groceries", "utilities"],
    expires_in_days: 30,
  }),
});
const data = await response.json();`},{id:"verify-transaction",title:"Verify Transaction",method:"POST",path:"/api/verify",description:"The real-time hot-path verification. Checks the credential's signature, expiry, revocation status, amount, and category — and returns an approve/deny decision with a human-readable reason.",requestBody:`{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "amount": 2500,
  "category": "groceries"
}`,responseSuccess:`{
  "decision": "approve",
  "reason": "within scope",
  "transaction_id": "t1000001-..."
}`,responseDenied:`{
  "decision": "deny",
  "reason": "amount exceeds max_amount of 5000",
  "transaction_id": "t1000002-..."
}`,curl:`curl -X POST https://your-project.supabase.co/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "amount": 2500,
    "category": "groceries"
  }'`,python:`response = requests.post(
    "https://your-project.supabase.co/api/verify",
    json={
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "amount": 2500,
        "category": "groceries",
    }
)`,node:`const response = await fetch("/api/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    token: "eyJhbGciOiJIUzI1NiIs...",
    amount: 2500,
    category: "groceries",
  }),
});`},{id:"revoke-agent",title:"Revoke Agent",method:"POST",path:"/api/revoke",description:"Instantly revoke an agent's authority. This flips the agent status to revoked, invalidates all active credentials, and writes a revocation event and audit log entry.",requestBody:`{
  "agent_id": "a1111111-1111-1111-1111-111111111111",
  "reason": "Agent behaviour indicates compromise",
  "revoked_by": "admin_dashboard"
}`,responseSuccess:`{
  "revoked": true,
  "revocation_id": "r1111111-..."
}`,curl:`curl -X POST https://your-project.supabase.co/api/revoke \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "a1111111-1111-1111-1111-111111111111",
    "reason": "Agent behaviour indicates compromise"
  }'`,python:`response = requests.post(
    "https://your-project.supabase.co/api/revoke",
    json={
        "agent_id": "a1111111-1111-1111-1111-111111111111",
        "reason": "Agent behaviour indicates compromise",
    }
)`,node:`const response = await fetch("/api/revoke", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agent_id: "a1111111-1111-1111-1111-111111111111",
    reason: "Agent behaviour indicates compromise",
  }),
});`},{id:"query-agent",title:"Query Agent Status",method:"GET",path:"/api/agents/{id}",description:"Retrieve an agent's full profile: status, credentials, transaction history with decisions, and revocation events.",requestBody:null,responseSuccess:`{
  "agent": {
    "id": "a1111111-...",
    "name": "GroceryBot",
    "status": "active",
    "created_at": "2026-08-22T00:00:00Z"
  },
  "credentials": [...],
  "transactions": [
    {
      "id": "t1000001-...",
      "amount": 1200,
      "category": "groceries",
      "decisions": [{ "decision_type": "approve", "reason": "within scope" }]
    }
  ],
  "revocations": []
}`,curl:"curl https://your-project.supabase.co/api/agents/a1111111-1111-1111-1111-111111111111",python:`response = requests.get(
    "https://your-project.supabase.co/api/agents/a1111111-1111-1111-1111-111111111111"
)`,node:'const response = await fetch("/api/agents/a1111111-...");'},{id:"anomaly-check",title:"Anomaly Check",method:"POST",path:"/api/anomaly-check",description:"Run behavioural anomaly detection on a transaction. Checks ceiling proximity, unusual timing, and frequency spikes. Returns a risk score and reason codes if flagged.",requestBody:`{
  "transaction_id": "t1000001-1111-1111-1111-111111111111"
}`,responseSuccess:`{
  "flagged": false
}`,responseFlagged:`{
  "flagged": true,
  "flag_id": "f1111111-...",
  "risk_score": 0.55,
  "reason_codes": [
    "amount is over 80% of the agent's max_amount"
  ]
}`,curl:`curl -X POST https://your-project.supabase.co/api/anomaly-check \\
  -H "Content-Type: application/json" \\
  -d '{"transaction_id": "t1000001-..."}'`,python:`response = requests.post(
    "https://your-project.supabase.co/api/anomaly-check",
    json={"transaction_id": "t1000001-..."}
)`,node:`const response = await fetch("/api/anomaly-check", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ transaction_id: "t1000001-..." }),
});`}],o=[{id:"overview",label:"Overview"},{id:"authentication",label:"Authentication"},{id:"issue-credential",label:"Issue Credential"},{id:"verify-transaction",label:"Verify Transaction"},{id:"revoke-agent",label:"Revoke Agent"},{id:"query-agent",label:"Query Agent Status"},{id:"anomaly-check",label:"Anomaly Check"},{id:"errors",label:"Error Codes"}];e.s(["default",0,function(){let[e,a]=(0,r.useState)("overview"),[i,c]=(0,r.useState)("curl");return(0,t.jsxs)("div",{className:"min-h-screen bg-white text-zinc-900",children:[(0,t.jsx)("nav",{className:"border-b border-zinc-100",children:(0,t.jsxs)("div",{className:"max-w-6xl mx-auto px-6 py-4 flex items-center justify-between",children:[(0,t.jsxs)(n.default,{href:"/",className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center",children:(0,t.jsx)("span",{className:"text-white text-xs font-bold",children:"K"})}),(0,t.jsx)("span",{className:"font-semibold text-lg",children:"KYA"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-6 text-sm",children:[(0,t.jsx)(n.default,{href:"/docs",className:"text-zinc-900 font-medium",children:"Docs"}),(0,t.jsx)(n.default,{href:"/how-it-works",className:"text-zinc-600 hover:text-zinc-900",children:"How it works"}),(0,t.jsx)(n.default,{href:"/pricing",className:"text-zinc-600 hover:text-zinc-900",children:"Pricing"}),(0,t.jsx)(n.default,{href:"/auth/login",className:"bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800",children:"Log in"})]})]})}),(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsxs)("aside",{className:"w-56 border-r border-zinc-100 p-6 sticky top-0 h-screen overflow-y-auto",children:[(0,t.jsx)("div",{className:"text-xs uppercase text-zinc-400 font-semibold mb-4",children:"API Reference"}),o.map(r=>(0,t.jsx)("button",{onClick:()=>{a(r.id),document.getElementById(r.id)?.scrollIntoView({behavior:"smooth"})},className:`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors mb-0.5 ${e===r.id?"bg-zinc-100 text-zinc-900 font-medium":"text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"}`,children:r.label},r.id))]}),(0,t.jsxs)("main",{className:"flex-1 max-w-3xl p-8",children:[(0,t.jsxs)("div",{id:"overview",className:"mb-12",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold mb-4",children:"API Reference"}),(0,t.jsx)("p",{className:"text-zinc-600 leading-relaxed",children:"KYA provides RESTful endpoints for issuing credentials, verifying transactions, revoking agents, and querying status. All requests and responses use JSON."}),(0,t.jsxs)("div",{className:"mt-4 bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm",children:[(0,t.jsx)("div",{className:"font-medium mb-1",children:"Base URL"}),(0,t.jsx)("code",{className:"text-xs bg-zinc-100 px-2 py-1 rounded",children:"https://your-project.supabase.co"})]})]}),(0,t.jsxs)("div",{id:"authentication",className:"mb-12",children:[(0,t.jsx)("h2",{className:"text-xl font-bold mb-3",children:"Authentication"}),(0,t.jsx)("p",{className:"text-zinc-600 text-sm leading-relaxed mb-3",children:"API routes are accessible without authentication in this demo build (the proxy bypasses auth for /api/* paths). In production, requests would require a Supabase session token or API key in the Authorization header."})]}),s.map(e=>(0,t.jsxs)("div",{id:e.id,className:"mb-12 scroll-mt-20",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-3",children:[(0,t.jsx)("span",{className:`px-2 py-0.5 rounded text-xs font-bold uppercase ${"GET"===e.method?"bg-emerald-100 text-emerald-700":"bg-blue-100 text-blue-700"}`,children:e.method}),(0,t.jsx)("code",{className:"text-sm font-mono text-zinc-700",children:e.path})]}),(0,t.jsx)("h2",{className:"text-xl font-bold mb-2",children:e.title}),(0,t.jsx)("p",{className:"text-zinc-600 text-sm leading-relaxed mb-4",children:e.description}),e.requestBody&&(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsx)("h3",{className:"text-xs font-semibold text-zinc-500 uppercase mb-2",children:"Request body"}),(0,t.jsx)("pre",{className:"bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono",children:e.requestBody})]}),(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsx)("h3",{className:"text-xs font-semibold text-zinc-500 uppercase mb-2",children:"Response"}),e.responseSuccess&&(0,t.jsx)("pre",{className:"bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mb-2",children:e.responseSuccess}),e.responseDenied&&(0,t.jsx)("pre",{className:"bg-zinc-950 text-red-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mb-2",children:e.responseDenied}),e.responseHighValue&&(0,t.jsx)("pre",{className:"bg-zinc-950 text-amber-300 text-xs p-4 rounded-lg overflow-x-auto font-mono",children:e.responseHighValue}),e.responseFlagged&&(0,t.jsx)("pre",{className:"bg-zinc-950 text-amber-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mt-2",children:e.responseFlagged})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[(0,t.jsx)("h3",{className:"text-xs font-semibold text-zinc-500 uppercase",children:"Code samples"}),(0,t.jsx)("div",{className:"flex bg-zinc-100 rounded p-0.5",children:["curl","python","node"].map(e=>(0,t.jsx)("button",{onClick:()=>c(e),className:`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${i===e?"bg-white shadow text-zinc-900":"text-zinc-500 hover:text-zinc-700"}`,children:"node"===e?"Node.js":e.toUpperCase()},e))})]}),(0,t.jsx)("pre",{className:"bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono",children:e[i]??"# Example not available"})]})]},e.id)),(0,t.jsxs)("div",{id:"errors",className:"mb-12",children:[(0,t.jsx)("h2",{className:"text-xl font-bold mb-3",children:"Error Codes"}),(0,t.jsx)("div",{className:"border border-zinc-200 rounded-lg overflow-hidden",children:(0,t.jsxs)("table",{className:"w-full text-xs text-left",children:[(0,t.jsx)("thead",{className:"bg-zinc-50 border-b border-zinc-200",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"p-3 font-semibold",children:"Code"}),(0,t.jsx)("th",{className:"p-3 font-semibold",children:"Meaning"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,t.jsx)("td",{className:"p-3 font-mono",children:"400"}),(0,t.jsx)("td",{className:"p-3",children:"Missing required fields"})]}),(0,t.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,t.jsx)("td",{className:"p-3 font-mono",children:"401"}),(0,t.jsx)("td",{className:"p-3",children:"Invalid or expired credential token"})]}),(0,t.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,t.jsx)("td",{className:"p-3 font-mono",children:"403"}),(0,t.jsx)("td",{className:"p-3",children:"Scope violation — amount, category, or revoked"})]}),(0,t.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,t.jsx)("td",{className:"p-3 font-mono",children:"404"}),(0,t.jsx)("td",{className:"p-3",children:"Credential or agent not found"})]}),(0,t.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,t.jsx)("td",{className:"p-3 font-mono",children:"409"}),(0,t.jsx)("td",{className:"p-3",children:"Already resolved / already revoked"})]}),(0,t.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,t.jsx)("td",{className:"p-3 font-mono",children:"429"}),(0,t.jsx)("td",{className:"p-3",children:"Rate limit exceeded"})]}),(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{className:"p-3 font-mono",children:"503"}),(0,t.jsx)("td",{className:"p-3",children:"System degraded — fail-safe mode active"})]})]})]})})]})]})]})]})}])},22016,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return g},useLinkStatus:function(){return y}};for(var s in n)Object.defineProperty(r,s,{enumerable:!0,get:n[s]});let o=e.r(90809),a=e.r(43476),i=o._(e.r(71645)),c=e.r(95057),l=e.r(8372),d=e.r(18581),u=e.r(18967),p=e.r(5550),f=e.r(88540),h=e.r(91949),m=e.r(73668),x=e.r(9396);function g(t){var r;let n,s,o,[g,y]=(0,i.useOptimistic)(h.IDLE_LINK_STATUS),v=(0,i.useRef)(null),{href:j,as:N,children:_,prefetch:w=null,passHref:S,replace:z,shallow:T,scroll:k,onClick:P,onMouseEnter:O,onTouchStart:C,legacyBehavior:A=!1,onNavigate:E,transitionTypes:I,ref:R,unstable_dynamicOnHover:U,...q}=t;n=_,A&&("string"==typeof n||"number"==typeof n)&&(n=(0,a.jsx)("a",{children:n}));let L=i.default.useContext(l.AppRouterContext),B=!1!==w,$=!1===w?"none":!0===w?"full":"auto",M="none"!==$&&"full"===$?x.FetchStrategy.Full:x.FetchStrategy.PPR,J="string"==typeof(r=N||j)?r:(0,c.formatUrl)(r);if(A){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});s=i.default.Children.only(n)}let D=A?s&&"object"==typeof s&&s.ref:R,F,K=i.default.useCallback(e=>(null!==L&&(v.current=(0,h.mountLinkInstance)(e,J,L,M,B,y,F)),()=>{v.current&&((0,h.unmountLinkForCurrentNavigation)(v.current),v.current=null),(0,h.unmountPrefetchableInstance)(e)}),[B,J,L,M,y,F]),G={ref:(0,d.useMergedRef)(K,D),onClick(t){A||"function"!=typeof P||P(t),A&&s.props&&"function"==typeof s.props.onClick&&s.props.onClick(t),!L||t.defaultPrevented||function(t,r,n,s,o,a,c,l="none"){if("u">typeof window){let d,{nodeName:u}=t.currentTarget;if("A"===u.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){s&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),a){let e=!1;if(a({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:p}=e.r(99781);i.default.startTransition(()=>{p(r,s?"replace":"push",!1===o?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,n.current,c,l)})}}(t,J,v,z,k,E,I,$)},onMouseEnter(e){A||"function"!=typeof O||O(e),A&&s.props&&"function"==typeof s.props.onMouseEnter&&s.props.onMouseEnter(e),L&&B&&(0,h.onNavigationIntent)(e.currentTarget,!0===U)},onTouchStart:function(e){A||"function"!=typeof C||C(e),A&&s.props&&"function"==typeof s.props.onTouchStart&&s.props.onTouchStart(e),L&&B&&(0,h.onNavigationIntent)(e.currentTarget,!0===U)}};return(0,u.isAbsoluteUrl)(J)?G.href=J:A&&!S&&("a"!==s.type||"href"in s.props)||(G.href=(0,p.addBasePath)(J)),o=A?i.default.cloneElement(s,G):(0,a.jsx)("a",{...q,...G,children:n}),(0,a.jsx)(b.Provider,{value:g,children:o})}let b=(0,i.createContext)(h.IDLE_LINK_STATUS),y=()=>(0,i.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return s}});let n=e.r(71645);function s(e,t){let r=(0,n.useRef)(null),s=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(r.current=o(e,n)),t&&(s.current=o(t,n))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},18967,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return g},MiddlewareNotFoundError:function(){return j},MissingStaticPage:function(){return v},NormalizeError:function(){return b},PageNotFoundError:function(){return y},SP:function(){return m},ST:function(){return x},WEB_VITALS:function(){return o},execOnce:function(){return a},getDisplayName:function(){return u},getLocationOrigin:function(){return l},getURL:function(){return d},isAbsoluteUrl:function(){return c},isResSent:function(){return p},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return f},stringifyError:function(){return N}};for(var s in n)Object.defineProperty(r,s,{enumerable:!0,get:n[s]});let o=["CLS","FCP","FID","INP","LCP","TTFB"];function a(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let i=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,c=e=>{let t=e.charCodeAt(0);return!!(t>=65&&t<=90||t>=97&&t<=122)&&i.test(e)};function l(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function d(){let{href:e}=window.location,t=l();return e.substring(t.length)}function u(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function p(e){return e.finished||e.headersSent}function f(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&p(r))return n;if(!n)throw Object.defineProperty(Error(`"${u(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let m="u">typeof performance,x=m&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class g extends Error{}class b extends Error{}class y extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class v extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class j extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function N(e){return JSON.stringify({message:e.message,stack:e.stack})}},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return o}});let n=e.r(18967),s=e.r(52817);function o(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,s.hasBasePath)(r.pathname)}catch(e){return!1}}},98183,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return c},searchParamsToUrlQuery:function(){return o},urlQueryToSearchParams:function(){return i}};for(var s in n)Object.defineProperty(r,s,{enumerable:!0,get:n[s]});function o(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function a(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function i(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,a(e));else t.set(r,a(n));return t}function c(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},95057,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return i},formatWithValidation:function(){return l},urlObjectKeys:function(){return c}};for(var s in n)Object.defineProperty(r,s,{enumerable:!0,get:n[s]});let o=e.r(90809)._(e.r(98183)),a=/https?|ftp|gopher|file/;function i(e){let{auth:t,hostname:r}=e,n=e.protocol||"",s=e.pathname||"",i=e.hash||"",c=e.query||"",l=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?l=t+e.host:r&&(l=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(l+=":"+e.port)),c&&"object"==typeof c&&(c=String(o.urlQueryToSearchParams(c)));let d=e.search||c&&`?${c}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||a.test(n))&&!1!==l?(l="//"+(l||""),s&&"/"!==s[0]&&(s="/"+s)):l||(l=""),i&&"#"!==i[0]&&(i="#"+i),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${n}${l}${s}${d}${i}`}let c=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function l(e){return i(e)}}]);