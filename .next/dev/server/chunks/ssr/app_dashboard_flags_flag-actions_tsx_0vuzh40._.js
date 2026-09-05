module.exports = [
"[project]/app/dashboard/flags/flag-actions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FlagActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
const rationalePresets = {
    resolved: [
        'Reviewed — false positive, normal usage pattern',
        'Reviewed — within acceptable risk tolerance',
        'Reviewed — agent scope was recently updated, flag is stale'
    ],
    escalated: [
        'Requires deeper investigation before resolution',
        'Multiple flags from same agent in 24h — pattern review needed',
        'User contacted about suspicious activity — awaiting response'
    ]
};
function FlagActions({ flagId, currentStatus }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modal, setModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rationale, setRationale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPresets, setShowPresets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const currentPresets = modal && modal !== 'revoke' ? rationalePresets[modal] ?? [] : [
        'Flagged activity indicates agent may be compromised',
        'Agent exceeded scope limits multiple times'
    ];
    async function handleConfirm() {
        if (!rationale.trim()) {
            alert('A rationale is required for the audit trail.');
            return;
        }
        setLoading(true);
        try {
            if (modal === 'approve' || modal === 'escalate') {
                const res = await fetch(`/api/flags/${flagId}/resolve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        resolution: modal === 'approve' ? 'resolved' : 'escalated',
                        rationale: rationale.trim()
                    })
                });
                if (!res.ok) {
                    const data = await res.json().catch(()=>({}));
                    throw new Error(data.error ?? 'Failed to update flag');
                }
            } else if (modal === 'revoke') {
                // Resolve the flag first
                const resolveRes = await fetch(`/api/flags/${flagId}/resolve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        resolution: 'resolved',
                        rationale: `[REVOKED] ${rationale.trim()}`
                    })
                });
                if (!resolveRes.ok) throw new Error('Failed to resolve flag');
                // Get agent_id from the flag
                const flagRes = await fetch(`/api/flags/${flagId}`);
                const flagData = await flagRes.json();
                if (flagData.agent_id) {
                    const revokeRes = await fetch('/api/revoke', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            agent_id: flagData.agent_id,
                            reason: rationale.trim(),
                            revoked_by: 'case_queue'
                        })
                    });
                    if (!revokeRes.ok) {
                        const data = await revokeRes.json().catch(()=>({}));
                        throw new Error(data.error ?? 'Failed to revoke agent');
                    }
                }
            }
            setModal(null);
            setRationale('');
            setShowPresets(false);
            router.refresh();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to complete action');
        } finally{
            setLoading(false);
        }
    }
    const modalConfig = {
        approve: {
            title: 'Approve Flag',
            color: 'emerald',
            icon: '✓',
            desc: 'Mark this flag as reviewed — a false positive or acceptable risk.'
        },
        escalate: {
            title: 'Escalate Flag',
            color: 'amber',
            icon: '↑',
            desc: 'Escalate to senior review. The flag stays open for deeper investigation.'
        },
        revoke: {
            title: 'Revoke Agent',
            color: 'red',
            icon: '⛔',
            desc: 'This agent will be immediately shut down. All credentials invalidated.'
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setModal('approve');
                            setRationale(rationalePresets.resolved[0]);
                            setShowPresets(true);
                        },
                        disabled: loading,
                        className: "px-3 py-1.5 rounded text-xs font-medium bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 transition-colors disabled:opacity-50",
                        children: "Approve"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setModal('escalate');
                            setRationale(rationalePresets.escalated[0]);
                            setShowPresets(true);
                        },
                        disabled: loading,
                        className: "px-3 py-1.5 rounded text-xs font-medium bg-amber-950 text-amber-400 hover:bg-amber-900 border border-amber-800 transition-colors disabled:opacity-50",
                        children: "Escalate"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setModal('revoke');
                            setRationale('Flagged activity indicates agent may be compromised');
                            setShowPresets(true);
                        },
                        disabled: loading,
                        className: "px-3 py-1.5 rounded text-xs font-medium bg-red-950 text-red-400 hover:bg-red-900 border border-red-800 transition-colors disabled:opacity-50",
                        children: "Revoke"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            modal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60",
                onClick: ()=>{
                    setModal(null);
                    setRationale('');
                    setShowPresets(false);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg shadow-2xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 mb-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${modal === 'approve' ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : modal === 'escalate' ? 'bg-amber-950 border-amber-800 text-amber-400' : 'bg-red-950 border-red-800 text-red-400'}`,
                                    children: modalConfig[modal].icon
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-white",
                                    children: modalConfig[modal].title
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-zinc-500 mb-4 ml-11",
                            children: modalConfig[modal].desc
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                            lineNumber: 144,
                            columnNumber: 13
                        }, this),
                        showPresets && currentPresets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-zinc-500 uppercase font-semibold mb-2",
                                    children: "Quick select"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 149,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: currentPresets.map((preset, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setRationale(preset),
                                            className: `w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${rationale === preset ? modal === 'approve' ? 'bg-emerald-950/40 border-emerald-700 text-white' : modal === 'escalate' ? 'bg-amber-950/40 border-amber-700 text-white' : 'bg-red-950/40 border-red-700 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'}`,
                                            children: preset
                                        }, i, false, {
                                            fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                            lineNumber: 152,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 150,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                            lineNumber: 148,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-zinc-500 uppercase font-semibold mb-1.5",
                                    children: "Rationale (required for audit trail)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: rationale,
                                    onChange: (e)=>setRationale(e.target.value),
                                    className: "w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono h-16 resize-none focus:outline-none focus:border-blue-500 placeholder:text-zinc-600",
                                    placeholder: "Explain your decision..."
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 173,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                            lineNumber: 171,
                            columnNumber: 13
                        }, this),
                        modal === 'revoke' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 bg-amber-950/30 border border-amber-900/50 rounded-lg px-3 py-2 text-[11px] text-amber-300",
                            children: "⚠ This will immediately invalidate all of the agent's active credentials. This action is permanent and will be recorded in the immutable audit log."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                            lineNumber: 182,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center pt-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setModal(null);
                                        setRationale('');
                                        setShowPresets(false);
                                    },
                                    disabled: loading,
                                    className: "px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 189,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleConfirm,
                                    disabled: loading || !rationale.trim(),
                                    className: `px-5 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${modal === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' : modal === 'escalate' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-600 hover:bg-red-500'}`,
                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                                lineNumber: 207,
                                                columnNumber: 21
                                            }, this),
                                            "Processing..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                        lineNumber: 206,
                                        columnNumber: 19
                                    }, this) : `Confirm ${modal === 'approve' ? 'Approval' : modal === 'escalate' ? 'Escalation' : 'Revocation'}`
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                            lineNumber: 188,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/flags/flag-actions.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_dashboard_flags_flag-actions_tsx_0vuzh40._.js.map