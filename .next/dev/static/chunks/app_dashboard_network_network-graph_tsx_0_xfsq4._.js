(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/network/network-graph.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NetworkGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function NetworkGraph({ agents, edges }) {
    _s();
    const [selectedNode, setSelectedNode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Layout nodes in a circle
    const radius = 200;
    const centerX = 300;
    const centerY = 250;
    const nodePositions = {};
    agents.forEach((agent, i)=>{
        const angle = i / agents.length * 2 * Math.PI - Math.PI / 2;
        nodePositions[agent.id] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });
    // Edge type colors
    const edgeColors = {
        shared_owner: '#ef4444',
        shared_device: '#f59e0b',
        shared_ip: '#3b82f6',
        shared_fingerprint: '#8b5cf6'
    };
    const edgeLabels = {
        shared_owner: 'Shared Owner',
        shared_device: 'Shared Device',
        shared_ip: 'Shared IP',
        shared_fingerprint: 'Shared Fingerprint'
    };
    const connectedNodes = new Set();
    for (const edge of edges){
        connectedNodes.add(edge.source_id);
        connectedNodes.add(edge.target_id);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex items-center gap-6 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-500 font-semibold",
                        children: "Edge types:"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    Object.entries(edgeLabels).map(([type, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "w-3 h-0.5 rounded",
                                    style: {
                                        backgroundColor: edgeColors[type]
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-zinc-400",
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, type, true, {
                            fileName: "[project]/app/dashboard/network/network-graph.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-600 ml-auto",
                        children: [
                            edges.length,
                            " connections found"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "600",
                    height: "500",
                    viewBox: "0 0 600 500",
                    className: "mx-auto",
                    children: [
                        edges.map((edge, i)=>{
                            const from = nodePositions[edge.source_id];
                            const to = nodePositions[edge.target_id];
                            if (!from || !to) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: from.x,
                                        y1: from.y,
                                        x2: to.x,
                                        y2: to.y,
                                        stroke: edgeColors[edge.edge_type] ?? '#555',
                                        strokeWidth: 1.5,
                                        strokeOpacity: 0.5,
                                        strokeDasharray: edge.edge_type === 'shared_ip' ? '4 4' : undefined
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 83,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: (from.x + to.x) / 2,
                                        y: (from.y + to.y) / 2 - 6,
                                        fill: "#71717a",
                                        fontSize: "8",
                                        textAnchor: "middle",
                                        children: edgeLabels[edge.edge_type] ?? edge.edge_type
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 91,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this);
                        }),
                        agents.map((agent)=>{
                            const pos = nodePositions[agent.id];
                            if (!pos) return null;
                            const isActive = agent.status === 'active';
                            const isConnected = connectedNodes.has(agent.id);
                            const isSelected = selectedNode === agent.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                onClick: ()=>setSelectedNode(selectedNode === agent.id ? null : agent.id),
                                className: "cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: pos.x,
                                        cy: pos.y,
                                        r: isSelected ? 24 : 20,
                                        fill: isActive ? isConnected ? '#1a1a2e' : '#0f172a' : '#1a0a0a',
                                        stroke: isSelected ? '#3b82f6' : isConnected ? '#ef4444' : isActive ? '#334155' : '#7f1d1d',
                                        strokeWidth: isSelected ? 2.5 : isConnected ? 2 : 1.5
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: pos.x,
                                        y: pos.y + 1,
                                        fill: "white",
                                        fontSize: "9",
                                        fontWeight: "bold",
                                        textAnchor: "middle",
                                        dominantBaseline: "middle",
                                        children: agent.name.slice(0, 2).toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: pos.x,
                                        y: pos.y + 34,
                                        fill: "#a1a1aa",
                                        fontSize: "10",
                                        textAnchor: "middle",
                                        children: agent.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: pos.x,
                                        y: pos.y + 46,
                                        fill: isActive ? '#4ade80' : '#f87171',
                                        fontSize: "8",
                                        textAnchor: "middle",
                                        children: agent.status
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, agent.id, true, {
                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/network/network-graph.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            selectedNode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4",
                children: (()=>{
                    const agent = agents.find((a)=>a.id === selectedNode);
                    const connected = edges.filter((e)=>e.source_id === selectedNode || e.target_id === selectedNode);
                    if (!agent) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-white text-sm mb-2",
                                children: agent.name
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                lineNumber: 165,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-zinc-500 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Status: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: agent.status === 'active' ? 'text-emerald-400' : 'text-red-400',
                                                children: agent.status
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                                lineNumber: 167,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 167,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "ID: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-zinc-400",
                                                children: agent.id
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                                lineNumber: 168,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 168,
                                        columnNumber: 19
                                    }, this),
                                    connected.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-zinc-400 font-semibold",
                                                children: "Connections:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                                lineNumber: 171,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "mt-1 space-y-0.5",
                                                children: connected.map((e, i)=>{
                                                    const otherId = e.source_id === selectedNode ? e.target_id : e.source_id;
                                                    const otherName = e.source_id === selectedNode ? e.target_name ?? otherId : e.source_name ?? otherId;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "text-zinc-400",
                                                        children: [
                                                            "→ ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white",
                                                                children: otherName
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                                                lineNumber: 178,
                                                                columnNumber: 33
                                                            }, this),
                                                            " via",
                                                            ' ',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: edgeColors[e.edge_type]
                                                                },
                                                                children: edgeLabels[e.edge_type] ?? e.edge_type
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                                                lineNumber: 179,
                                                                columnNumber: 31
                                                            }, this),
                                                            ' ',
                                                            "(",
                                                            (e.confidence * 100).toFixed(0),
                                                            "% confidence)"
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 29
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                                lineNumber: 172,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                        lineNumber: 170,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                                lineNumber: 166,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                        lineNumber: 164,
                        columnNumber: 15
                    }, this);
                })()
            }, void 0, false, {
                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-400 font-semibold",
                        children: "How this works:"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    " The network graph maps relationships between agents. Explicit edges are stored in the ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                        className: "bg-zinc-800 px-1 rounded",
                        children: "network_edges"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/network/network-graph.tsx",
                        lineNumber: 197,
                        columnNumber: 42
                    }, this),
                    " table (schema: source_id, target_id, edge_type, confidence). Inferred edges (shared owner) are computed at query time from the agents table. A red node border indicates an agent connected to another — click it to see the relationship details."
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/network/network-graph.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/network/network-graph.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(NetworkGraph, "RIsWM+4oUpuhWd1/4LbQUcoZ1hw=");
_c = NetworkGraph;
var _c;
__turbopack_context__.k.register(_c, "NetworkGraph");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_dashboard_network_network-graph_tsx_0_xfsq4._.js.map