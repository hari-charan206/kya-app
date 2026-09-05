module.exports=[19407,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(38246);let e=[{id:"issue-credential",title:"Issue Credential",method:"POST",path:"/api/credentials",description:"Create a scoped, signed credential for an AI agent. The credential defines the agent's spend limit, allowed transaction categories, and expiry.",requestBody:`{
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
});`}],f=[{id:"overview",label:"Overview"},{id:"authentication",label:"Authentication"},{id:"issue-credential",label:"Issue Credential"},{id:"verify-transaction",label:"Verify Transaction"},{id:"revoke-agent",label:"Revoke Agent"},{id:"query-agent",label:"Query Agent Status"},{id:"anomaly-check",label:"Anomaly Check"},{id:"errors",label:"Error Codes"}];a.s(["default",0,function(){let[a,g]=(0,c.useState)("overview"),[h,i]=(0,c.useState)("curl");return(0,b.jsxs)("div",{className:"min-h-screen bg-white text-zinc-900",children:[(0,b.jsx)("nav",{className:"border-b border-zinc-100",children:(0,b.jsxs)("div",{className:"max-w-6xl mx-auto px-6 py-4 flex items-center justify-between",children:[(0,b.jsxs)(d.default,{href:"/",className:"flex items-center gap-2",children:[(0,b.jsx)("div",{className:"w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center",children:(0,b.jsx)("span",{className:"text-white text-xs font-bold",children:"K"})}),(0,b.jsx)("span",{className:"font-semibold text-lg",children:"KYA"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-6 text-sm",children:[(0,b.jsx)(d.default,{href:"/docs",className:"text-zinc-900 font-medium",children:"Docs"}),(0,b.jsx)(d.default,{href:"/how-it-works",className:"text-zinc-600 hover:text-zinc-900",children:"How it works"}),(0,b.jsx)(d.default,{href:"/pricing",className:"text-zinc-600 hover:text-zinc-900",children:"Pricing"}),(0,b.jsx)(d.default,{href:"/auth/login",className:"bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800",children:"Log in"})]})]})}),(0,b.jsxs)("div",{className:"flex",children:[(0,b.jsxs)("aside",{className:"w-56 border-r border-zinc-100 p-6 sticky top-0 h-screen overflow-y-auto",children:[(0,b.jsx)("div",{className:"text-xs uppercase text-zinc-400 font-semibold mb-4",children:"API Reference"}),f.map(c=>(0,b.jsx)("button",{onClick:()=>{g(c.id),document.getElementById(c.id)?.scrollIntoView({behavior:"smooth"})},className:`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors mb-0.5 ${a===c.id?"bg-zinc-100 text-zinc-900 font-medium":"text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"}`,children:c.label},c.id))]}),(0,b.jsxs)("main",{className:"flex-1 max-w-3xl p-8",children:[(0,b.jsxs)("div",{id:"overview",className:"mb-12",children:[(0,b.jsx)("h1",{className:"text-3xl font-bold mb-4",children:"API Reference"}),(0,b.jsx)("p",{className:"text-zinc-600 leading-relaxed",children:"KYA provides RESTful endpoints for issuing credentials, verifying transactions, revoking agents, and querying status. All requests and responses use JSON."}),(0,b.jsxs)("div",{className:"mt-4 bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm",children:[(0,b.jsx)("div",{className:"font-medium mb-1",children:"Base URL"}),(0,b.jsx)("code",{className:"text-xs bg-zinc-100 px-2 py-1 rounded",children:"https://your-project.supabase.co"})]})]}),(0,b.jsxs)("div",{id:"authentication",className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-xl font-bold mb-3",children:"Authentication"}),(0,b.jsx)("p",{className:"text-zinc-600 text-sm leading-relaxed mb-3",children:"API routes are accessible without authentication in this demo build (the proxy bypasses auth for /api/* paths). In production, requests would require a Supabase session token or API key in the Authorization header."})]}),e.map(a=>(0,b.jsxs)("div",{id:a.id,className:"mb-12 scroll-mt-20",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-3",children:[(0,b.jsx)("span",{className:`px-2 py-0.5 rounded text-xs font-bold uppercase ${"GET"===a.method?"bg-emerald-100 text-emerald-700":"bg-blue-100 text-blue-700"}`,children:a.method}),(0,b.jsx)("code",{className:"text-sm font-mono text-zinc-700",children:a.path})]}),(0,b.jsx)("h2",{className:"text-xl font-bold mb-2",children:a.title}),(0,b.jsx)("p",{className:"text-zinc-600 text-sm leading-relaxed mb-4",children:a.description}),a.requestBody&&(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("h3",{className:"text-xs font-semibold text-zinc-500 uppercase mb-2",children:"Request body"}),(0,b.jsx)("pre",{className:"bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono",children:a.requestBody})]}),(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("h3",{className:"text-xs font-semibold text-zinc-500 uppercase mb-2",children:"Response"}),a.responseSuccess&&(0,b.jsx)("pre",{className:"bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mb-2",children:a.responseSuccess}),a.responseDenied&&(0,b.jsx)("pre",{className:"bg-zinc-950 text-red-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mb-2",children:a.responseDenied}),a.responseHighValue&&(0,b.jsx)("pre",{className:"bg-zinc-950 text-amber-300 text-xs p-4 rounded-lg overflow-x-auto font-mono",children:a.responseHighValue}),a.responseFlagged&&(0,b.jsx)("pre",{className:"bg-zinc-950 text-amber-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mt-2",children:a.responseFlagged})]}),(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[(0,b.jsx)("h3",{className:"text-xs font-semibold text-zinc-500 uppercase",children:"Code samples"}),(0,b.jsx)("div",{className:"flex bg-zinc-100 rounded p-0.5",children:["curl","python","node"].map(a=>(0,b.jsx)("button",{onClick:()=>i(a),className:`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${h===a?"bg-white shadow text-zinc-900":"text-zinc-500 hover:text-zinc-700"}`,children:"node"===a?"Node.js":a.toUpperCase()},a))})]}),(0,b.jsx)("pre",{className:"bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono",children:a[h]??"# Example not available"})]})]},a.id)),(0,b.jsxs)("div",{id:"errors",className:"mb-12",children:[(0,b.jsx)("h2",{className:"text-xl font-bold mb-3",children:"Error Codes"}),(0,b.jsx)("div",{className:"border border-zinc-200 rounded-lg overflow-hidden",children:(0,b.jsxs)("table",{className:"w-full text-xs text-left",children:[(0,b.jsx)("thead",{className:"bg-zinc-50 border-b border-zinc-200",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"p-3 font-semibold",children:"Code"}),(0,b.jsx)("th",{className:"p-3 font-semibold",children:"Meaning"})]})}),(0,b.jsxs)("tbody",{children:[(0,b.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,b.jsx)("td",{className:"p-3 font-mono",children:"400"}),(0,b.jsx)("td",{className:"p-3",children:"Missing required fields"})]}),(0,b.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,b.jsx)("td",{className:"p-3 font-mono",children:"401"}),(0,b.jsx)("td",{className:"p-3",children:"Invalid or expired credential token"})]}),(0,b.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,b.jsx)("td",{className:"p-3 font-mono",children:"403"}),(0,b.jsx)("td",{className:"p-3",children:"Scope violation — amount, category, or revoked"})]}),(0,b.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,b.jsx)("td",{className:"p-3 font-mono",children:"404"}),(0,b.jsx)("td",{className:"p-3",children:"Credential or agent not found"})]}),(0,b.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,b.jsx)("td",{className:"p-3 font-mono",children:"409"}),(0,b.jsx)("td",{className:"p-3",children:"Already resolved / already revoked"})]}),(0,b.jsxs)("tr",{className:"border-b border-zinc-100",children:[(0,b.jsx)("td",{className:"p-3 font-mono",children:"429"}),(0,b.jsx)("td",{className:"p-3",children:"Rate limit exceeded"})]}),(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{className:"p-3 font-mono",children:"503"}),(0,b.jsx)("td",{className:"p-3",children:"System degraded — fail-safe mode active"})]})]})]})})]})]})]})]})}])},46058,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},14827,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={createLinkPrefetchPartialError:function(){return g},createUnrenderedSegmentError:function(){return f}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});function f(a,b){let c=`Route "${a}": Could not validate that a segment in your UI has instant navigation.`;if(b.length>0){let a=1===b.length?"Dropped segment":"Dropped segments";c+=`

This segment was dropped from rendering. Issues that would prevent instant navigation will go undetected.

${a}:
${b.map(a=>`  ${a}`).join("\n")}

Ways to fix this:
  - [render] Render the dropped segment
  - [ignore] Set \`export const instant = false\` to opt the dropped segment out of instant-navigation validation

Learn more: https://nextjs.org/docs/messages/instant-unrendered-segment`}return Object.defineProperty(Error(c),"__NEXT_ERROR_CODE",{value:"E1286",enumerable:!1,configurable:!0})}function g(a){return Object.defineProperty(Error(`Next.js encountered dynamic data during prefetching for "${a}".

This will lead to slower, more expensive prefetches.

Ways to fix this:
  - [upgrade] Opt into Partial Prefetching by exporting \`const prefetch = 'partial'\` from the page or layout, or by setting \`partialPrefetching: true\` in next.config to opt the whole app in
  - [disable] Remove \`prefetch={true}\` from the <Link> to use the default prefetch
  - [ignore] Set \`export const instant = false\` to opt the route out of instant-navigation validation

Learn more: https://nextjs.org/docs/messages/instant-link-prefetch-partial`),"__NEXT_ERROR_CODE",{value:"E1435",enumerable:!1,configurable:!0})}},88644,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"InvariantError",{enumerable:!0,get:function(){return d}});class d extends Error{constructor(a,b){super(`Invariant: ${a.endsWith(".")?a:a+"."} This is a bug in Next.js.`,b),Object.defineProperty(this,"__NEXT_ERROR_CODE",{value:"E1179",enumerable:!1,configurable:!0}),this.name="InvariantError"}}},19924,(a,b,c)=>{"use strict";function d(a){return a.startsWith("/")?a:`/${a}`}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureLeadingSlash",{enumerable:!0,get:function(){return d}})},54427,(a,b,c)=>{"use strict";function d(){let a,b,c=new Promise((c,d)=>{a=c,b=d});return{resolve:a,reject:b,promise:c}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"createPromiseWithResolvers",{enumerable:!0,get:function(){return d}})},53808,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={compareAppPaths:function(){return i},normalizeAppPath:function(){return h},normalizeRscURL:function(){return j}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(19924),g=a.r(39118);function h(a){return(0,f.ensureLeadingSlash)(a.split("/").reduce((a,b,c,d)=>!b||(0,g.isGroupSegment)(b)||"@"===b[0]||("page"===b||"route"===b)&&c===d.length-1?a:`${a}/${b}`,""))}function i(a,b){let c=a.includes("/@"),d=b.includes("/@");return c&&!d?-1:!c&&d?1:a.localeCompare(b)}function j(a){return a.replace(/\.rsc($|\?)/,"$1")}},18099,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={INTERCEPTION_ROUTE_MARKERS:function(){return g},extractInterceptionRouteInformation:function(){return i},isInterceptionRouteAppPath:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(53808),g=["(..)(..)","(.)","(..)","(...)"];function h(a){return void 0!==a.split("/").find(a=>g.find(b=>a.startsWith(b)))}function i(a){let b,c,d;for(let e of a.split("/"))if(c=g.find(a=>e.startsWith(a))){[b,d]=a.split(c,2);break}if(!b||!c||!d)throw Object.defineProperty(Error(`Invalid interception route: ${a}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`),"__NEXT_ERROR_CODE",{value:"E269",enumerable:!1,configurable:!0});switch(b=(0,f.normalizeAppPath)(b),c){case"(.)":d="/"===b?`/${d}`:b+"/"+d;break;case"(..)":if("/"===b)throw Object.defineProperty(Error(`Invalid interception route: ${a}. Cannot use (..) marker at the root level, use (.) instead.`),"__NEXT_ERROR_CODE",{value:"E207",enumerable:!1,configurable:!0});d=b.split("/").slice(0,-1).concat(d).join("/");break;case"(...)":d="/"+d;break;case"(..)(..)":let e=b.split("/");if(e.length<=2)throw Object.defineProperty(Error(`Invalid interception route: ${a}. Cannot use (..)(..) marker at the root level or one level up.`),"__NEXT_ERROR_CODE",{value:"E486",enumerable:!1,configurable:!0});d=e.slice(0,-2).concat(d).join("/");break;default:throw Object.defineProperty(Error("Invariant: unexpected marker"),"__NEXT_ERROR_CODE",{value:"E112",enumerable:!1,configurable:!0})}return{interceptingRoute:b,interceptedRoute:d}}},91735,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={assign:function(){return i},searchParamsToUrlQuery:function(){return f},urlQueryToSearchParams:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});function f(a){let b={};for(let[c,d]of a.entries()){let a=b[c];void 0===a?b[c]=d:Array.isArray(a)?a.push(d):b[c]=[a,d]}return b}function g(a){return"string"==typeof a?a:("number"!=typeof a||isNaN(a))&&"boolean"!=typeof a?"":String(a)}function h(a){let b=new URLSearchParams;for(let[c,d]of Object.entries(a))if(Array.isArray(d))for(let a of d)b.append(c,g(a));else b.set(c,g(d));return b}function i(a,...b){for(let c of b){for(let b of c.keys())a.delete(b);for(let[b,d]of c.entries())a.append(b,d)}return a}},39118,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={DEFAULT_SEGMENT_KEY:function(){return l},NOT_FOUND_SEGMENT_KEY:function(){return m},PAGE_SEGMENT_KEY:function(){return k},addSearchParamsIfPageSegment:function(){return i},computeSelectedLayoutSegment:function(){return j},getSegmentValue:function(){return f},getSelectedLayoutSegmentPath:function(){return function a(b,c,d=!0,e=[]){let g;if(d)g=b[1][c];else{let a=b[1];g=a.children??Object.values(a)[0]}if(!g)return e;let h=f(g[0]);return!h||h.startsWith(k)?e:(e.push(h),a(g,c,!1,e))}},isGroupSegment:function(){return g},isParallelRouteSegment:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});function f(a){return Array.isArray(a)?a[1]:a}function g(a){return"("===a[0]&&a.endsWith(")")}function h(a){return a.startsWith("@")&&"@children"!==a}function i(a,b){if(a.includes(k)){let a=JSON.stringify(b);return"{}"!==a?k+"?"+a:k}return a}function j(a,b){if(!a||0===a.length)return null;let c="children"===b?a[0]:a[a.length-1];return c===l?null:c}let k="__PAGE__",l="__DEFAULT__",m="/_not-found"},46272,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={DecodeError:function(){return r},MiddlewareNotFoundError:function(){return v},MissingStaticPage:function(){return u},NormalizeError:function(){return s},PageNotFoundError:function(){return t},SP:function(){return p},ST:function(){return q},WEB_VITALS:function(){return f},execOnce:function(){return g},getDisplayName:function(){return l},getLocationOrigin:function(){return j},getURL:function(){return k},isAbsoluteUrl:function(){return i},isResSent:function(){return m},loadGetInitialProps:function(){return o},normalizeRepeatedSlashes:function(){return n},stringifyError:function(){return w}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=["CLS","FCP","FID","INP","LCP","TTFB"];function g(a){let b,c=!1;return(...d)=>(c||(c=!0,b=a(...d)),b)}let h=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,i=a=>{let b=a.charCodeAt(0);return!!(b>=65&&b<=90||b>=97&&b<=122)&&h.test(a)};function j(){let{protocol:a,hostname:b,port:c}=window.location;return`${a}//${b}${c?":"+c:""}`}function k(){let{href:a}=window.location,b=j();return a.substring(b.length)}function l(a){return"string"==typeof a?a:a.displayName||a.name||"Unknown"}function m(a){return a.finished||a.headersSent}function n(a){let b=a.split("?");return b[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(b[1]?`?${b.slice(1).join("?")}`:"")}async function o(a,b){let c=b.res||b.ctx&&b.ctx.res;if(!a.getInitialProps)return b.ctx&&b.Component?{pageProps:await o(b.Component,b.ctx)}:{};let d=await a.getInitialProps(b);if(c&&m(c))return d;if(!d)throw Object.defineProperty(Error(`"${l(a)}.getInitialProps()" should resolve to an object. But found "${d}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return d}let p="u">typeof performance,q=p&&["mark","measure","getEntriesByName"].every(a=>"function"==typeof performance[a]);class r extends Error{}class s extends Error{}class t extends Error{constructor(a){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${a}`}}class u extends Error{constructor(a,b){super(),this.message=`Failed to load static file for page: ${a} ${b}`}}class v extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function w(a){return JSON.stringify({message:a.message,stack:a.stack})}}];

//# sourceMappingURL=_0341kej._.js.map