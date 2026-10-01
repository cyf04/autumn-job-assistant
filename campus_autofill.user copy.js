// ==UserScript==
// @name         OfferTong - AI 一键网申填简历 (Campus AutoFill Master)
// @namespace    https://github.com/campus-autofill
// @version      1.0.25
// @description  自动识别各类校招招聘系统表单（北森 Beisen/Moka/大易/自研系统等），发光旋转光环悬浮球、紧凑智能面板、实时光标聚焦简历小助手与一键注入复制。
// @author       OfferTong Team
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @connect      127.0.0.1
// @connect      localhost
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';
  const injectedStyle = "/* ==========================================================================\n   OfferTong - AI \u4e00\u952e\u7f51\u7533\u586b\u7b80\u5386 (Campus AutoFill Master)\n   \u6838\u5fc3\u5185\u5bb9\u6837\u5f0f\u8868 - \u5b8c\u7f8e\u590d\u523b OfferTong \u73b0\u4ee3\u8d28\u611f\u89c6\u89c9\u4e0e\u4ea4\u4e92\u7cfb\u7edf\n   ========================================================================== */\n\n:root {\n  --ot-brand-primary: #0f67ff;\n  --ot-brand-primary-hover: #0058ea;\n  --ot-brand-primary-soft: #edf5ff;\n  --ot-brand-cyan: #38bdf8;\n  --ot-brand-orange: #ff6b16;\n  --ot-brand-orange-soft: #fff3ea;\n  --ot-ink-strong: #071321;\n  --ot-ink: #172033;\n  --ot-ink-secondary: #536074;\n  --ot-ink-muted: #98a2b3;\n  --ot-surface: #ffffff;\n  --ot-surface-soft: #f8fbff;\n  --ot-surface-muted: #f3f7fc;\n  --ot-border: #dce8f7;\n  --ot-border-strong: #c8d9ed;\n  --ot-success: #168a55;\n  --ot-success-soft: #edf9f3;\n  --ot-warning: #c96a12;\n  --ot-warning-soft: #fff7ed;\n  --ot-danger: #d92d20;\n  --ot-danger-soft: #fff1f0;\n  --ot-orbit: linear-gradient(90deg, var(--ot-brand-primary), var(--ot-brand-cyan));\n  --ot-radius-xs: 6px;\n  --ot-radius-sm: 8px;\n  --ot-radius-md: 10px;\n  --ot-radius-lg: 12px;\n  --ot-radius-xl: 14px;\n  --ot-radius-pill: 999px;\n  --ot-shadow-xs: 0 1px 2px rgba(15, 40, 90, 0.06);\n  --ot-shadow-sm: 0 4px 14px rgba(15, 40, 90, 0.08);\n  --ot-shadow-md: 0 10px 26px rgba(15, 40, 90, 0.12);\n  --ot-shadow-lg: 0 20px 48px rgba(12, 34, 74, 0.2);\n  --ot-focus-ring: 0 0 0 3px rgba(15, 103, 255, 0.28);\n  --ot-motion-fast: 0.14s;\n  --ot-motion: 0.2s;\n  --ot-ease: cubic-bezier(0.22, 0.61, 0.36, 1);\n  --ot-font-sans: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif;\n}\n\n#ot-root, #ot-root * {\n  box-sizing: border-box;\n}\n\n#ot-root {\n  font-family: var(--ot-font-sans);\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--ot-ink);\n  -webkit-font-smoothing: antialiased;\n}\n\n/* ==========================================================================\n   1. \u53d1\u5149\u5149\u73af\u60ac\u6d6e\u7403 (Floating Launcher) & \u7d27\u51d1\u60ac\u6d6e\u9762\u677f (Floating Panel)\n   ========================================================================== */\n\n.ot-floating-shell {\n  position: fixed;\n  z-index: 2147483000;\n  bottom: 28px;\n  right: 28px;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 12px;\n  pointer-events: auto;\n  user-select: none;\n}\n\n.ot-floating-shell[data-dragging=\"true\"] .ot-floating-launcher {\n  cursor: grabbing !important;\n  box-shadow: var(--ot-shadow-lg), 0 0 0 6px rgba(15, 103, 255, 0.16);\n}\n\n.ot-floating-launcher-wrap {\n  position: relative;\n  align-self: flex-end;\n}\n\n/* 52x52 \u6781\u5149\u5149\u73af\u60ac\u6d6e\u7403 */\n.ot-floating-launcher {\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  background: var(--ot-surface);\n  border: 2px solid var(--ot-brand-primary);\n  box-shadow: var(--ot-shadow-md);\n  cursor: grab;\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  color: var(--ot-brand-primary);\n  transition: transform var(--ot-motion-fast) var(--ot-ease), box-shadow var(--ot-motion) var(--ot-ease);\n}\n\n.ot-floating-launcher:hover {\n  transform: scale(1.05);\n  box-shadow: var(--ot-shadow-lg);\n}\n\n/* \u60ac\u6d6e\u7403\u6781\u5149\u65cb\u8f6c\u8fb9\u6846\u5149\u6548 */\n.ot-floating-launcher:before {\n  content: \"\";\n  position: absolute;\n  inset: -5px;\n  border-radius: 50%;\n  background: var(--ot-orbit);\n  padding: 2px;\n  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n  -webkit-mask-composite: xor;\n  mask-composite: exclude;\n  opacity: 0.75;\n  animation: 3.2s linear infinite ot-orbit-spin;\n  transition: opacity var(--ot-motion) var(--ot-ease);\n}\n\n.ot-floating-launcher:hover:before {\n  opacity: 1;\n}\n\n.ot-floating-launcher svg {\n  width: 26px;\n  height: 26px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2.2px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  pointer-events: none;\n}\n\n.ot-floating-launcher img {\n  width: 32px;\n  height: 32px;\n  object-fit: contain;\n  pointer-events: none;\n}\n\n/* \u60ac\u6d6e\u7403\u8f85\u52a9\u83dc\u5355\u5fae\u578b\u63a7\u5236\u5668 */\n.ot-floating-launcher-controls {\n  position: absolute;\n  top: -10px;\n  left: -10px;\n  width: 24px;\n  height: 24px;\n  z-index: 10;\n}\n\n.ot-floating-launcher-controls__trigger {\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  border: 1px solid var(--ot-border-strong);\n  background: var(--ot-surface);\n  color: var(--ot-ink-secondary);\n  font-size: 13px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: var(--ot-shadow-xs);\n  transition: all var(--ot-motion-fast) var(--ot-ease);\n  padding: 0;\n}\n\n.ot-floating-launcher-controls__trigger:hover {\n  color: var(--ot-ink-strong);\n  background: var(--ot-surface-soft);\n  transform: scale(1.1);\n}\n\n/* \u5f39\u51fa\u83dc\u5355 */\n.ot-floating-launcher-menu {\n  position: absolute;\n  bottom: calc(100% + 8px);\n  right: 0;\n  width: 210px;\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-lg);\n  box-shadow: var(--ot-shadow-lg);\n  padding: 8px;\n  display: none;\n  flex-direction: column;\n  gap: 3px;\n  z-index: 100;\n  animation: ot-floating-rise var(--ot-motion) var(--ot-ease);\n}\n\n.ot-floating-launcher-menu[data-visible=\"true\"] {\n  display: flex;\n}\n\n.ot-floating-launcher-menu strong {\n  font-size: 11px;\n  font-weight: 700;\n  color: var(--ot-ink-secondary);\n  padding: 4px 8px;\n  letter-spacing: 0.3px;\n}\n\n.ot-floating-launcher-menu button {\n  width: 100%;\n  text-align: left;\n  border: 1px solid transparent;\n  background: transparent;\n  color: var(--ot-ink);\n  font-size: 12.5px;\n  padding: 8px 10px;\n  border-radius: var(--ot-radius-sm);\n  cursor: pointer;\n  transition: all var(--ot-motion-fast) var(--ot-ease);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.ot-floating-launcher-menu button:hover {\n  background: var(--ot-brand-primary-soft);\n  color: var(--ot-brand-primary);\n}\n\n.ot-floating-launcher-menu .menu-divider {\n  height: 1px;\n  background: var(--ot-border);\n  margin: 4px 0;\n}\n\n.ot-floating-launcher-menu__danger {\n  color: var(--ot-danger) !important;\n}\n\n.ot-floating-launcher-menu__danger:hover {\n  background: var(--ot-danger-soft) !important;\n}\n\n/* \u7d27\u51d1\u60ac\u6d6e\u5361\u7247\u9762\u677f */\n.ot-floating-panel-anchor {\n  width: 320px;\n  max-width: 90vw;\n  margin-bottom: 8px;\n  animation: ot-floating-rise var(--ot-motion) var(--ot-ease);\n}\n\n.ot-floating-panel-anchor[data-expanded=\"false\"] {\n  display: none;\n}\n\n.ot-floating-panel {\n  width: 320px;\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-xl);\n  box-shadow: var(--ot-shadow-lg);\n  overflow: hidden;\n  color: var(--ot-ink);\n}\n\n.ot-floating-panel__header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  background: var(--ot-surface);\n  border-bottom: 1px solid var(--ot-border);\n  position: relative;\n}\n\n.ot-floating-panel__header:after {\n  content: \"\";\n  position: absolute;\n  bottom: -1px;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: var(--ot-orbit);\n  opacity: 0.8;\n}\n\n.ot-brand-mark--sm {\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  background: var(--ot-surface);\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  font-size: 15px;\n}\n\n.ot-brand-mark--sm:before {\n  content: \"\";\n  position: absolute;\n  inset: -2px;\n  border-radius: inherit;\n  background: var(--ot-orbit);\n  padding: 1px;\n  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n  -webkit-mask-composite: xor;\n  mask-composite: exclude;\n  animation: 3s linear infinite ot-orbit-spin;\n}\n\n.ot-floating-panel__brand {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n}\n\n.ot-floating-panel__brand strong {\n  font-size: 13.5px;\n  font-weight: 700;\n  color: var(--ot-ink-strong);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ot-floating-panel__status {\n  padding: 3px 9px;\n  border-radius: var(--ot-radius-pill);\n  font-size: 11px;\n  font-weight: 650;\n  background: var(--ot-brand-primary-soft);\n  color: var(--ot-brand-primary);\n  flex-shrink: 0;\n}\n\n.ot-floating-panel__status[data-tone=\"processing\"] {\n  background: #fef3c7;\n  color: #b45309;\n}\n\n.ot-floating-panel__status[data-tone=\"success\"] {\n  background: var(--ot-success-soft);\n  color: var(--ot-success);\n}\n\n.ot-floating-panel__close {\n  width: 24px;\n  height: 24px;\n  border-radius: var(--ot-radius-xs);\n  border: 0;\n  background: transparent;\n  color: var(--ot-ink-secondary);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  font-size: 13px;\n  padding: 0;\n}\n\n.ot-floating-panel__close:hover {\n  background: var(--ot-surface-muted);\n  color: var(--ot-ink);\n}\n\n.ot-floating-panel__body {\n  padding: 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n/* \u5f53\u524d\u7b80\u5386\u5c55\u793a\u884c */\n.ot-floating-resume-line {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 8px 10px;\n  background: var(--ot-surface-muted);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-sm);\n  font-size: 12px;\n}\n\n.ot-floating-resume-line__label {\n  color: var(--ot-ink-secondary);\n  font-size: 11.5px;\n  flex-shrink: 0;\n}\n\n.ot-floating-resume-line strong {\n  color: var(--ot-ink-strong);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 650;\n  font-size: 12.5px;\n  flex: 1;\n  text-align: right;\n  cursor: pointer;\n}\n\n/* \u6309\u94ae\u7ec4 */\n.ot-floating-action {\n  width: 100%;\n  min-height: 40px;\n  border-radius: var(--ot-radius-sm);\n  border: 1px solid transparent;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  padding: 8px 12px;\n  font-size: 13px;\n  font-weight: 650;\n  cursor: pointer;\n  transition: transform var(--ot-motion-fast) var(--ot-ease), background var(--ot-motion-fast) var(--ot-ease);\n}\n\n.ot-floating-action:hover:not(:disabled) {\n  transform: translateY(-1px);\n}\n\n.ot-floating-action--primary {\n  color: #fff;\n  background: var(--ot-brand-primary);\n  border-color: var(--ot-brand-primary);\n  min-height: 44px;\n  box-shadow: var(--ot-shadow-sm);\n}\n\n.ot-floating-action--primary:hover:not(:disabled) {\n  background: var(--ot-brand-primary-hover);\n}\n\n.ot-floating-panel__secondary-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n\n.ot-floating-action--soft {\n  color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary-soft);\n  border-color: var(--ot-border);\n}\n\n.ot-floating-action--soft:hover:not(:disabled) {\n  border-color: var(--ot-border-strong);\n}\n\n.ot-floating-action--ghost {\n  color: var(--ot-ink);\n  background: var(--ot-surface);\n  border-color: var(--ot-border);\n}\n\n.ot-floating-action--ghost:hover:not(:disabled) {\n  background: var(--ot-surface-muted);\n}\n\n/* \u8fdb\u5ea6\u6761\u4e0e\u6267\u884c\u52a8\u6548 */\n.ot-floating-processing {\n  background: var(--ot-surface-soft);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-md);\n  padding: 12px;\n  display: none;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.ot-floating-processing[data-active=\"true\"] {\n  display: flex;\n}\n\n.ot-floating-panel__processing-head {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 12px;\n  color: var(--ot-ink-secondary);\n}\n\n.ot-floating-track {\n  width: 100%;\n  height: 6px;\n  background: var(--ot-surface-muted);\n  border-radius: var(--ot-radius-pill);\n  overflow: hidden;\n}\n\n.ot-floating-track span {\n  display: block;\n  height: 100%;\n  background: var(--ot-orbit);\n  border-radius: inherit;\n  transition: width var(--ot-motion) var(--ot-ease);\n}\n\n/* \u586b\u5145\u7edf\u8ba1\u4e0e\u73af\u5f62\u8fdb\u5ea6\u6761 */\n.ot-floating-summary {\n  display: none;\n  align-items: center;\n  gap: 14px;\n  padding: 12px;\n  background: var(--ot-surface-soft);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-md);\n}\n\n.ot-floating-summary[data-active=\"true\"] {\n  display: flex;\n}\n\n.ot-floating-ring {\n  width: 58px;\n  height: 58px;\n  border-radius: 50%;\n  background: conic-gradient(var(--ot-brand-primary) var(--ot-ring-fill, 0deg), var(--ot-surface-muted) 0);\n  display: grid;\n  place-items: center;\n  position: relative;\n  flex-shrink: 0;\n}\n\n.ot-floating-ring:before {\n  content: \"\";\n  position: absolute;\n  inset: 5.5px;\n  background: var(--ot-surface);\n  border-radius: 50%;\n}\n\n.ot-floating-ring__value {\n  position: relative;\n  font-size: 14px;\n  font-weight: 700;\n  color: var(--ot-ink-strong);\n}\n\n.ot-floating-summary__detail {\n  display: grid;\n  gap: 2px;\n}\n\n.ot-floating-summary__detail strong {\n  font-size: 13.5px;\n  color: var(--ot-ink-strong);\n}\n\n.ot-floating-summary__detail span {\n  font-size: 11.5px;\n  color: var(--ot-ink-secondary);\n}\n\n.ot-floating-notice--warn {\n  padding: 10px 12px;\n  background: var(--ot-warning-soft);\n  border: 1px solid #fadfba;\n  border-radius: var(--ot-radius-sm);\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  font-size: 12px;\n}\n\n.ot-floating-notice--warn strong {\n  color: var(--ot-warning);\n}\n\n.ot-floating-notice--warn button {\n  background: var(--ot-brand-orange);\n  color: #fff;\n  border: 0;\n  border-radius: var(--ot-radius-xs);\n  padding: 6px 10px;\n  font-size: 11.5px;\n  font-weight: 650;\n  cursor: pointer;\n  align-self: flex-start;\n}\n\n/* ==========================================================================\n   2. \u7b80\u5386\u5c0f\u52a9\u624b (Resume Assistant) - OfferTong \u6838\u5fc3\u738b\u724c\u8f85\u52a9\u586b\u5199\u60ac\u6d6e\u7a97\n   ========================================================================== */\n\n.ot-resume-assistant {\n  position: fixed;\n  z-index: 2147483647;\n  right: 60px;\n  bottom: 80px;\n  width: 520px;\n  height: 560px;\n  max-width: calc(100vw - 32px);\n  max-height: calc(100vh - 32px);\n  min-width: 380px;\n  min-height: 400px;\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-xl);\n  box-shadow: var(--ot-shadow-lg);\n  display: none;\n  flex-direction: column;\n  overflow: hidden;\n  animation: ot-resume-assistant-appear var(--ot-motion) var(--ot-ease);\n  pointer-events: auto;\n}\n\n.ot-resume-assistant[data-visible=\"true\"] {\n  display: flex;\n}\n\n/* \u9876\u90e8\u6807\u9898\u680f */\n.ot-resume-assistant__header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  background: linear-gradient(180deg, var(--ot-brand-primary-soft), var(--ot-surface));\n  border-bottom: 1px solid var(--ot-border);\n  cursor: move;\n  user-select: none;\n  position: relative;\n}\n\n.ot-resume-assistant__header:after {\n  content: \"\";\n  position: absolute;\n  bottom: -1px;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: var(--ot-orbit);\n  opacity: 0.8;\n}\n\n.ot-resume-assistant__title {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.ot-resume-assistant__title strong {\n  font-size: 14.5px;\n  font-weight: 700;\n  color: var(--ot-ink-strong);\n}\n\n.ot-resume-assistant__title small {\n  font-size: 11px;\n  color: var(--ot-ink-secondary);\n}\n\n.ot-resume-assistant__controls {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.ot-resume-assistant__icon-button {\n  width: 28px;\n  height: 28px;\n  border-radius: var(--ot-radius-sm);\n  border: 1px solid var(--ot-border);\n  background: var(--ot-surface);\n  color: var(--ot-ink-secondary);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  transition: all var(--ot-motion-fast) var(--ot-ease);\n}\n\n.ot-resume-assistant__icon-button:hover {\n  color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary-soft);\n}\n\n/* \u7126\u70b9\u611f\u77e5\u6761 (Focus Information Banner) */\n.ot-resume-assistant__status {\n  min-height: 34px;\n  padding: 8px 14px;\n  background: var(--ot-surface-soft);\n  border-bottom: 1px solid var(--ot-border);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n}\n\n.ot-resume-assistant__focus-info {\n  flex: 1;\n  font-size: 11.5px;\n  font-weight: 500;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ot-resume-assistant__focus-active {\n  color: var(--ot-success);\n  font-weight: 600;\n}\n\n.ot-resume-assistant__focus-inactive {\n  color: var(--ot-ink-secondary);\n}\n\n.ot-resume-assistant__fill-stats {\n  font-size: 11px;\n  color: var(--ot-ink-muted);\n  flex-shrink: 0;\n}\n\n/* \u52a9\u624b\u4e2d\u90e8\u53cc\u680f\u7ed3\u6784 */\n.ot-resume-assistant__body {\n  flex: 1;\n  display: grid;\n  grid-template-columns: 86px minmax(0, 1fr);\n  gap: 8px;\n  padding: 10px 12px 12px;\n  min-height: 0;\n  overflow: hidden;\n}\n\n/* \u5de6\u4fa7\u76ee\u5f55\u5bfc\u822a (TOC) */\n.ot-resume-assistant__toc {\n  background: var(--ot-surface-soft);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-md);\n  padding: 6px 4px;\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  overflow-y: auto;\n}\n\n.ot-resume-assistant__toc strong {\n  font-size: 10px;\n  font-weight: 700;\n  color: var(--ot-ink-secondary);\n  padding: 2px 6px 4px;\n  letter-spacing: 0.3px;\n}\n\n.ot-resume-assistant__toc button {\n  width: 100%;\n  text-align: left;\n  border: 0;\n  background: transparent;\n  color: var(--ot-ink-secondary);\n  font-size: 11px;\n  font-weight: 600;\n  padding: 6px 6px 6px 10px;\n  border-radius: var(--ot-radius-xs);\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  transition: all var(--ot-motion-fast) var(--ot-ease);\n}\n\n.ot-resume-assistant__toc button:before {\n  content: \"\";\n  position: absolute;\n  left: 2px;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 3px;\n  height: 0;\n  background: var(--ot-brand-primary);\n  border-radius: var(--ot-radius-pill);\n  transition: height var(--ot-motion-fast) var(--ot-ease);\n}\n\n.ot-resume-assistant__toc button:hover {\n  color: var(--ot-ink);\n  background: var(--ot-brand-primary-soft);\n}\n\n.ot-resume-assistant__toc button.active {\n  color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary-soft);\n}\n\n.ot-resume-assistant__toc button.active:before {\n  height: 60%;\n}\n\n/* \u53f3\u4fa7\u591a\u5206\u7ec4\u7ecf\u5386\u5361\u7247 */\n.ot-resume-assistant__groups {\n  min-height: 0;\n  overflow-y: auto;\n  padding-right: 4px;\n}\n\n.ot-resume-assistant__group {\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-md);\n  margin-bottom: 8px;\n  overflow: hidden;\n}\n\n.ot-resume-assistant__group-header {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 10px;\n  background: var(--ot-surface-soft);\n  border: 0;\n  color: var(--ot-ink);\n  text-align: left;\n  cursor: pointer;\n}\n\n.ot-resume-assistant__group-header:hover {\n  background: var(--ot-surface-muted);\n}\n\n.ot-resume-assistant__group-header .name {\n  flex: 1;\n  font-size: 12.5px;\n  font-weight: 650;\n}\n\n.ot-resume-assistant__group-header .count {\n  font-size: 10px;\n  font-weight: 650;\n  padding: 1px 7px;\n  border-radius: var(--ot-radius-pill);\n  background: var(--ot-brand-primary-soft);\n  color: var(--ot-brand-primary);\n}\n\n.ot-resume-assistant__subgroup {\n  border-top: 1px solid var(--ot-border);\n}\n\n.ot-resume-assistant__subgroup header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 6px 10px 2px;\n  border-left: 3px solid var(--ot-brand-primary);\n}\n\n.ot-resume-assistant__subgroup header strong {\n  font-size: 11.5px;\n  font-weight: 650;\n  color: var(--ot-ink);\n}\n\n.ot-resume-assistant__group-fields {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  padding: 8px 10px;\n}\n\n/* \u5355\u4e2a\u5b57\u6bb5\u82af\u7247\u6309\u94ae (\u652f\u6301\u62d6\u62fd\u6ce8\u5165\u3001\u70b9\u51fb\u9009\u62e9\u4e0e\u5feb\u6377\u7f16\u8f91) */\n.ot-resume-assistant__field-button {\n  min-width: 60px;\n  min-height: 28px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 5px;\n  padding: 4px 9px;\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border-strong);\n  border-radius: var(--ot-radius-sm);\n  font-size: 11.5px;\n  font-weight: 550;\n  color: var(--ot-ink);\n  cursor: grab;\n  user-select: none;\n  transition: all var(--ot-motion-fast) var(--ot-ease);\n  position: relative;\n}\n\n.ot-resume-assistant__field-button:active {\n  cursor: grabbing;\n}\n\n.ot-resume-assistant__field-button.is-dragging {\n  opacity: 0.45;\n  transform: scale(0.95);\n  box-shadow: var(--ot-shadow-md);\n}\n\n.ot-resume-assistant__field-button[data-selected=\"true\"] {\n  border-color: var(--ot-brand-primary) !important;\n  background: var(--ot-brand-primary-soft) !important;\n  color: var(--ot-brand-primary) !important;\n  box-shadow: 0 0 0 2px rgba(15, 103, 255, 0.25) !important;\n  font-weight: 650;\n}\n\n.ot-resume-assistant__field-button span.title {\n  max-width: 130px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  pointer-events: none;\n}\n\n.ot-resume-assistant__field-button:hover {\n  color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary-soft);\n  border-color: var(--ot-brand-primary);\n  transform: translateY(-1px);\n}\n\n/* \u82af\u7247\u4e0a\u7684\u5fae\u578b\u7f16\u8f91\u5c0f\u94c5\u7b14\u56fe\u6807 */\n.ot-field-edit-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  border-radius: 4px;\n  border: 0;\n  background: transparent;\n  color: var(--ot-ink-secondary);\n  font-size: 10.5px;\n  cursor: pointer;\n  padding: 0;\n  margin-left: 2px;\n  opacity: 0.4;\n  transition: all 0.15s ease;\n}\n\n.ot-resume-assistant__field-button:hover .ot-field-edit-btn,\n.ot-resume-assistant[data-mode=\"edit\"] .ot-field-edit-btn {\n  opacity: 1;\n}\n\n.ot-field-edit-btn:hover {\n  background: rgba(15, 103, 255, 0.15);\n  color: var(--ot-brand-primary);\n  transform: scale(1.15);\n}\n\n.ot-resume-assistant__field-button.copied {\n  background: var(--ot-success-soft) !important;\n  color: var(--ot-success) !important;\n  border-color: var(--ot-success) !important;\n}\n\n/* \u52a9\u624b\u6a21\u5f0f\u5207\u6362\u5fbd\u7ae0\u6309\u94ae */\n.ot-mode-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 3px 8px;\n  border-radius: var(--ot-radius-pill);\n  border: 1px solid var(--ot-border-strong);\n  background: var(--ot-surface);\n  color: var(--ot-ink-secondary);\n  font-size: 11px;\n  font-weight: 650;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n\n.ot-mode-btn:hover {\n  border-color: var(--ot-brand-primary);\n  color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary-soft);\n}\n\n.ot-mode-btn[data-active=\"true\"] {\n  border-color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary);\n  color: #fff;\n}\n\n/* \u62d6\u62fd\u6ce8\u5165\u76ee\u6807\u8f93\u5165\u6846\u9ad8\u4eae\u6307\u793a (Drop Target Active) */\n.ot-drop-hover {\n  outline: 3px dashed #0f67ff !important;\n  outline-offset: 2px !important;\n  background-color: #edf5ff !important;\n  box-shadow: 0 0 20px rgba(15, 103, 255, 0.45) !important;\n  transition: all 0.15s ease !important;\n  cursor: copy !important;\n}\n\n/* \u968f\u9f20\u6807\u79fb\u52a8\u7684\u62d6\u62fd\u6d6e\u52a8\u5fbd\u7ae0 (Drag Ghost Badge) */\n.ot-drag-ghost-badge {\n  position: fixed;\n  z-index: 2147483647;\n  pointer-events: none;\n  background: linear-gradient(135deg, #0f67ff, #0058ea);\n  color: #ffffff;\n  padding: 7px 14px;\n  border-radius: var(--ot-radius-pill);\n  font-size: 12px;\n  font-weight: 700;\n  box-shadow: 0 8px 24px rgba(15, 103, 255, 0.35);\n  display: none;\n  align-items: center;\n  gap: 6px;\n  transform: translate(14px, 14px);\n  white-space: nowrap;\n}\n\n.ot-drag-ghost-badge[data-visible=\"true\"] {\n  display: flex;\n}\n\n/* \u7b80\u5386\u5c0f\u52a9\u624b\u5e95\u90e8\u6587\u672c\u62d6\u5165\u63a5\u6536\u533a (Reverse Dropzone) */\n.ot-assistant-dropzone {\n  margin: 6px 12px 10px;\n  padding: 8px 12px;\n  border: 1.5px dashed var(--ot-border-strong);\n  border-radius: var(--ot-radius-md);\n  background: var(--ot-surface-soft);\n  text-align: center;\n  color: var(--ot-ink-secondary);\n  font-size: 11px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n\n.ot-assistant-dropzone:hover,\n.ot-assistant-dropzone.dragover {\n  border-color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary-soft);\n  color: var(--ot-brand-primary);\n}\n\n/* ==========================================================================\n   3. \u5b57\u6bb5\u4fe1\u606f\u5feb\u901f\u7f16\u8f91\u5f39\u7a97 (Field Information Editor Modal)\n   ========================================================================== */\n.ot-editor-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483647;\n  background: rgba(7, 19, 33, 0.45);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  animation: ot-floating-rise 0.2s var(--ot-ease);\n}\n\n.ot-editor-card {\n  width: min(440px, 94vw);\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-xl);\n  box-shadow: var(--ot-shadow-lg);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n\n.ot-editor-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 14px 18px;\n  background: var(--ot-surface-soft);\n  border-bottom: 1px solid var(--ot-border);\n}\n\n.ot-editor-header strong {\n  font-size: 14.5px;\n  font-weight: 700;\n  color: var(--ot-ink-strong);\n}\n\n.ot-editor-close {\n  border: 0;\n  background: transparent;\n  color: var(--ot-ink-secondary);\n  font-size: 14px;\n  cursor: pointer;\n  padding: 2px 6px;\n  border-radius: 4px;\n}\n\n.ot-editor-close:hover {\n  background: var(--ot-surface-muted);\n  color: var(--ot-ink);\n}\n\n.ot-editor-body {\n  padding: 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n\n.ot-editor-field {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n\n.ot-editor-field label {\n  font-size: 12px;\n  font-weight: 650;\n  color: var(--ot-ink-secondary);\n}\n\n.ot-editor-input {\n  width: 100%;\n  height: 36px;\n  padding: 0 10px;\n  border: 1px solid var(--ot-border-strong);\n  border-radius: var(--ot-radius-sm);\n  font-size: 13px;\n  color: var(--ot-ink);\n  outline: none;\n}\n\n.ot-editor-textarea {\n  width: 100%;\n  min-height: 100px;\n  padding: 8px 10px;\n  border: 1px solid var(--ot-border-strong);\n  border-radius: var(--ot-radius-sm);\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--ot-ink);\n  outline: none;\n  resize: vertical;\n  font-family: inherit;\n}\n\n.ot-editor-input:focus,\n.ot-editor-textarea:focus {\n  border-color: var(--ot-brand-primary);\n  box-shadow: var(--ot-focus-ring);\n}\n\n.ot-editor-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 10px;\n  padding: 12px 18px 16px;\n  background: var(--ot-surface-soft);\n  border-top: 1px solid var(--ot-border);\n}\n\n.ot-editor-btn {\n  padding: 8px 16px;\n  border-radius: var(--ot-radius-sm);\n  font-size: 12.5px;\n  font-weight: 650;\n  cursor: pointer;\n  border: 1px solid transparent;\n  transition: all 0.15s ease;\n}\n\n.ot-editor-btn--primary {\n  background: var(--ot-brand-primary);\n  color: #fff;\n}\n\n.ot-editor-btn--primary:hover {\n  background: var(--ot-brand-primary-hover);\n}\n\n.ot-editor-btn--ghost {\n  background: var(--ot-surface);\n  border-color: var(--ot-border-strong);\n  color: var(--ot-ink);\n}\n\n.ot-editor-btn--ghost:hover {\n  background: var(--ot-surface-muted);\n}\n\n/* \u7f29\u653e\u624b\u67c4 */\n.ot-resume-assistant__resize-handle {\n  position: absolute;\n  bottom: 3px;\n  right: 3px;\n  width: 14px;\n  height: 14px;\n  cursor: se-resize;\n  background-image: linear-gradient(-45deg, transparent 50%, var(--ot-border-strong) 50%);\n  border-radius: 2px;\n}\n\n/* \u60ac\u6d6e\u63d0\u793a\u6846 (Tooltip) */\n.ot-tooltip {\n  position: fixed;\n  z-index: 2147483647;\n  background: var(--ot-ink-strong);\n  color: #fff;\n  border-radius: var(--ot-radius-xs);\n  padding: 6px 10px;\n  font-size: 11px;\n  line-height: 1.4;\n  max-width: 280px;\n  box-shadow: var(--ot-shadow-md);\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 0.15s ease;\n  transform: translate(-50%, -100%);\n}\n\n.ot-tooltip[data-visible=\"true\"] {\n  opacity: 1;\n}\n\n/* \u586b\u8868\u5168\u5c4f\u5c45\u4e2d\u8fdb\u5ea6\u6761 (Progress Overlay) */\n.ot-autofill-progress-overlay {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 2147482999;\n  width: min(340px, 90vw);\n  background: rgba(255, 255, 255, 0.95);\n  backdrop-filter: blur(8px);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-lg);\n  box-shadow: var(--ot-shadow-lg);\n  padding: 16px 20px;\n  display: none;\n  grid-template-columns: 1fr auto;\n  gap: 8px 12px;\n  font-size: 13px;\n}\n\n.ot-autofill-progress-overlay[data-visible=\"true\"] {\n  display: grid;\n}\n\n.ot-autofill-progress-overlay span {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ot-autofill-progress-overlay strong {\n  color: var(--ot-brand-primary);\n  font-variant-numeric: tabular-nums;\n}\n\n.ot-autofill-progress-overlay i.bar {\n  grid-column: 1 / -1;\n  height: 5px;\n  background: var(--ot-surface-muted);\n  border-radius: var(--ot-radius-pill);\n  display: block;\n  overflow: hidden;\n}\n\n.ot-autofill-progress-overlay i.bar > i.fill {\n  display: block;\n  height: 100%;\n  background: var(--ot-orbit);\n  border-radius: inherit;\n  transition: width 0.15s ease;\n}\n\n/* \u5b57\u6bb5\u9ad8\u4eae\u6ce8\u5165\u52a8\u753b */\n.ot-filled-highlight {\n  animation: ot-pulse-ring 1.4s cubic-bezier(0.2, 0.8, 0.2, 1);\n  outline: 2px solid var(--ot-brand-primary) !important;\n  outline-offset: 1px !important;\n}\n\n@keyframes ot-pulse-ring {\n  0% { box-shadow: 0 0 0 0 rgba(15, 103, 255, 0.6); }\n  70% { box-shadow: 0 0 0 10px rgba(15, 103, 255, 0); }\n  100% { box-shadow: 0 0 0 0 rgba(15, 103, 255, 0); }\n}\n\n/* Toast \u63d0\u793a */\n.ot-toast {\n  position: fixed;\n  bottom: 88px;\n  left: 50%;\n  transform: translateX(-50%) translateY(20px);\n  z-index: 2147483647;\n  padding: 10px 18px;\n  border-radius: var(--ot-radius-pill);\n  background: rgba(7, 19, 33, 0.9);\n  color: #fff;\n  font-size: 12.5px;\n  font-weight: 600;\n  box-shadow: var(--ot-shadow-md);\n  pointer-events: none;\n  opacity: 0;\n  transition: all 0.25s var(--ot-ease);\n}\n\n.ot-toast.show {\n  opacity: 1;\n  transform: translateX(-50%) translateY(0);\n}\n\n/* ==========================================================================\n   3. \u62d6\u62fd\u6ce8\u5165\u4e0e\u9ad8\u4eae\u53cd\u9988 (Drag-and-Drop Injection & Visual Feedback)\n   ========================================================================== */\n\n/* \u76ee\u6807\u7f51\u9875\u8f93\u5165\u6846\u63a5\u6536\u62d6\u62fd\u65f6\u7684\u53d1\u5149\u9ad8\u4eae\u63d0\u793a */\n.ot-drop-hover {\n  outline: 2.5px dashed var(--ot-brand-primary) !important;\n  outline-offset: 2px !important;\n  background-color: var(--ot-brand-primary-soft) !important;\n  box-shadow: 0 0 0 5px rgba(15, 103, 255, 0.2), var(--ot-shadow-md) !important;\n  transition: all 0.15s ease !important;\n  cursor: copy !important;\n}\n\n/* \u62d6\u62fd\u65f6\u7684\u82af\u7247\u534a\u900f\u660e\u72b6\u6001 */\n.ot-resume-assistant__field-button[data-dragging=\"true\"] {\n  opacity: 0.45 !important;\n  border-style: dashed !important;\n  border-color: var(--ot-brand-primary) !important;\n  transform: scale(0.96);\n}\n\n/* \u82af\u7247\u60ac\u505c\u4e0e\u6293\u53d6\u9f20\u6807\u6307\u9488 */\n.ot-resume-assistant__field-button {\n  cursor: grab !important;\n  user-select: none;\n  -webkit-user-drag: element;\n}\n\n.ot-resume-assistant__field-button:active {\n  cursor: grabbing !important;\n}\n\n/* \u5b57\u6bb5\u82af\u7247\u9009\u4e2d\u9ad8\u4eae\u72b6\u6001 (Selection State) */\n.ot-resume-assistant__field-button[data-selected=\"true\"] {\n  background: var(--ot-brand-primary-soft) !important;\n  border-color: var(--ot-brand-primary) !important;\n  color: var(--ot-brand-primary) !important;\n  font-weight: 650 !important;\n  box-shadow: 0 0 0 2px rgba(15, 103, 255, 0.25) !important;\n}\n\n.ot-resume-assistant__field-button[data-selected=\"true\"]::before {\n  content: \"\u2713\";\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 800;\n  margin-right: 2px;\n  color: var(--ot-brand-primary);\n}\n\n/* \u82af\u7247\u60ac\u505c\u64cd\u4f5c\u5c0f\u5de5\u5177\u680f (\u7f16\u8f91\u94c5\u7b14\u56fe\u6807) */\n.ot-field-edit-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  margin-left: 2px;\n  border-radius: 50%;\n  border: 0;\n  background: transparent;\n  color: var(--ot-ink-muted);\n  cursor: pointer;\n  opacity: 0;\n  transition: all 0.15s ease;\n  font-size: 11px;\n  padding: 0;\n}\n\n.ot-resume-assistant__field-button:hover .ot-field-edit-btn,\n.ot-resume-assistant[data-mode=\"edit\"] .ot-field-edit-btn {\n  opacity: 1;\n}\n\n.ot-field-edit-btn:hover {\n  background: rgba(15, 103, 255, 0.15);\n  color: var(--ot-brand-primary);\n  transform: scale(1.15);\n}\n\n/* \u62d6\u62fd\u65f6\u7684\u5e7d\u7075\u8ddf\u624b\u5fbd\u7ae0 (Drag Ghost Preview) */\n.ot-drag-ghost-badge {\n  position: fixed;\n  top: -1000px;\n  left: -1000px;\n  z-index: 2147483647;\n  padding: 7px 14px;\n  background: var(--ot-ink-strong);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 600;\n  border-radius: var(--ot-radius-pill);\n  box-shadow: var(--ot-shadow-lg);\n  pointer-events: none;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n\n.ot-drag-ghost-badge .badge-icon {\n  font-size: 14px;\n}\n\n.ot-drag-ghost-badge .badge-val {\n  color: var(--ot-brand-cyan);\n  font-weight: 700;\n  max-width: 180px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/* \u52a9\u624b\u9876\u680f\u6a21\u5f0f\u5207\u6362\u5f00\u5173 (\u26a1 \u6ce8\u5165\u6a21\u5f0f / \u270f\ufe0f \u7f16\u8f91\u6a21\u5f0f) */\n.ot-mode-pill {\n  display: inline-flex;\n  align-items: center;\n  background: var(--ot-surface-muted);\n  border: 1px solid var(--ot-border-strong);\n  border-radius: var(--ot-radius-pill);\n  padding: 2px;\n  font-size: 11.5px;\n  font-weight: 600;\n  cursor: pointer;\n  gap: 2px;\n}\n\n.ot-mode-pill button {\n  border: 0;\n  background: transparent;\n  padding: 3px 8px;\n  border-radius: var(--ot-radius-pill);\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--ot-ink-secondary);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n\n.ot-mode-pill button.active {\n  background: var(--ot-brand-primary);\n  color: #fff;\n  box-shadow: var(--ot-shadow-xs);\n}\n\n/* \u5e95\u90e8\u9009\u62e9\u64cd\u4f5c\u6761 (Bottom Selection Bar) */\n.ot-assistant-selection-bar {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: var(--ot-surface);\n  border-top: 2px solid var(--ot-brand-primary);\n  padding: 8px 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  box-shadow: 0 -4px 16px rgba(15, 40, 90, 0.12);\n  z-index: 50;\n  transform: translateY(100%);\n  transition: transform 0.2s var(--ot-ease);\n}\n\n.ot-assistant-selection-bar[data-visible=\"true\"] {\n  transform: translateY(0);\n}\n\n.ot-selection-bar-info {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--ot-ink);\n}\n\n.ot-selection-bar-badge {\n  background: var(--ot-brand-primary);\n  color: #fff;\n  padding: 2px 7px;\n  border-radius: var(--ot-radius-pill);\n  font-size: 11px;\n}\n\n.ot-selection-bar-actions {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.ot-selection-drag-handle {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  background: var(--ot-brand-primary);\n  color: #fff;\n  border: 1px solid var(--ot-brand-primary);\n  border-radius: var(--ot-radius-sm);\n  padding: 5px 10px;\n  font-size: 11.5px;\n  font-weight: 650;\n  cursor: grab !important;\n  box-shadow: var(--ot-shadow-xs);\n}\n\n.ot-selection-drag-handle:active {\n  cursor: grabbing !important;\n}\n\n.ot-selection-clear-btn {\n  background: transparent;\n  border: 1px solid var(--ot-border-strong);\n  border-radius: var(--ot-radius-sm);\n  padding: 5px 8px;\n  font-size: 11px;\n  color: var(--ot-ink-secondary);\n  cursor: pointer;\n}\n\n.ot-selection-clear-btn:hover {\n  background: var(--ot-surface-muted);\n  color: var(--ot-ink);\n}\n\n/* \u65b0\u589e\u5b57\u6bb5\u6309\u94ae */\n.ot-btn-add-field {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 11.5px;\n  color: var(--ot-brand-primary);\n  background: var(--ot-brand-primary-soft);\n  border: 1px dashed var(--ot-brand-primary);\n  border-radius: var(--ot-radius-sm);\n  padding: 4px 10px;\n  cursor: pointer;\n  font-weight: 600;\n  transition: all 0.15s ease;\n}\n\n.ot-btn-add-field:hover {\n  background: #dbeafe;\n  transform: translateY(-1px);\n}\n\n/* ==========================================================================\n   4. \u5b57\u6bb5\u4fe1\u606f\u7f16\u8f91\u5f39\u7a97 (Field Editor Modal)\n   ========================================================================== */\n\n.ot-editor-overlay {\n  position: fixed;\n  inset: 0;\n  background: rgba(7, 19, 33, 0.5);\n  backdrop-filter: blur(4px);\n  z-index: 2147483647;\n  display: none;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  animation: ot-floating-rise 0.2s var(--ot-ease);\n}\n\n.ot-editor-overlay[data-visible=\"true\"] {\n  display: flex;\n}\n\n.ot-editor-card {\n  width: 480px;\n  max-width: 95vw;\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-xl);\n  box-shadow: var(--ot-shadow-lg);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n\n.ot-editor-card__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 14px 18px;\n  background: linear-gradient(180deg, var(--ot-brand-primary-soft), var(--ot-surface));\n  border-bottom: 1px solid var(--ot-border);\n  position: relative;\n}\n\n.ot-editor-card__header:after {\n  content: \"\";\n  position: absolute;\n  bottom: -1px;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: var(--ot-orbit);\n}\n\n.ot-editor-card__header h3 {\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n  color: var(--ot-ink-strong);\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.ot-editor-card__close {\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  border: 0;\n  background: transparent;\n  color: var(--ot-ink-secondary);\n  font-size: 15px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ot-editor-card__close:hover {\n  background: var(--ot-surface-muted);\n  color: var(--ot-ink);\n}\n\n.ot-editor-card__body {\n  padding: 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n\n.ot-editor-form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.ot-editor-form-group label {\n  font-size: 12px;\n  font-weight: 650;\n  color: var(--ot-ink);\n}\n\n.ot-editor-input,\n.ot-editor-textarea,\n.ot-editor-select {\n  width: 100%;\n  padding: 9px 12px;\n  border-radius: var(--ot-radius-sm);\n  border: 1px solid var(--ot-border-strong);\n  background: var(--ot-surface);\n  color: var(--ot-ink);\n  font-size: 13px;\n  font-family: inherit;\n  outline: none;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n\n.ot-editor-input:focus,\n.ot-editor-textarea:focus,\n.ot-editor-select:focus {\n  border-color: var(--ot-brand-primary);\n  box-shadow: var(--ot-focus-ring);\n}\n\n.ot-editor-textarea {\n  min-height: 96px;\n  resize: vertical;\n  line-height: 1.5;\n}\n\n.ot-editor-tip {\n  font-size: 11.5px;\n  color: var(--ot-ink-muted);\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.ot-editor-card__footer {\n  padding: 12px 18px;\n  background: var(--ot-surface-soft);\n  border-top: 1px solid var(--ot-border);\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 10px;\n}\n\n.ot-editor-btn {\n  padding: 8px 16px;\n  border-radius: var(--ot-radius-sm);\n  font-size: 13px;\n  font-weight: 650;\n  cursor: pointer;\n  border: 1px solid transparent;\n  transition: all 0.15s ease;\n}\n\n.ot-editor-btn--cancel {\n  background: var(--ot-surface);\n  border-color: var(--ot-border-strong);\n  color: var(--ot-ink);\n}\n\n.ot-editor-btn--cancel:hover {\n  background: var(--ot-surface-muted);\n}\n\n.ot-editor-btn--delete {\n  margin-right: auto;\n  background: var(--ot-danger-soft);\n  border-color: #fca5a5;\n  color: var(--ot-danger);\n}\n\n.ot-editor-btn--delete:hover {\n  background: #fee2e2;\n}\n\n.ot-editor-btn--save {\n  background: var(--ot-brand-primary);\n  color: #fff;\n}\n\n.ot-editor-btn--save:hover {\n  background: var(--ot-brand-primary-hover);\n  box-shadow: var(--ot-shadow-xs);\n}\n\n/* ==========================================================================\n   5. \u4fee\u6b63\u5185\u5bb9\u4e0e\u8865\u5145\u66f4\u591a\u4fe1\u606f\u7cfb\u7edf (Correction & Supplement Center)\n   ========================================================================== */\n\n/* \u7126\u70b9\u6761\u5feb\u6377\u64cd\u4f5c\u6309\u94ae */\n.ot-focus-action-group {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  margin-left: auto;\n  flex-shrink: 0;\n}\n\n.ot-focus-action-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  padding: 3px 8px;\n  border-radius: var(--ot-radius-xs);\n  border: 1px solid var(--ot-border-strong);\n  background: var(--ot-surface);\n  color: var(--ot-ink-secondary);\n  font-size: 11px;\n  font-weight: 650;\n  cursor: pointer;\n  transition: all var(--ot-motion-fast) var(--ot-ease);\n}\n\n.ot-focus-action-btn:hover {\n  background: var(--ot-brand-primary-soft);\n  color: var(--ot-brand-primary);\n  border-color: var(--ot-brand-primary);\n  transform: translateY(-1px);\n}\n\n.ot-focus-action-btn--primary {\n  background: var(--ot-brand-primary-soft);\n  color: var(--ot-brand-primary);\n  border-color: rgba(15, 103, 255, 0.4);\n}\n\n.ot-focus-action-btn--primary:hover {\n  background: var(--ot-brand-primary);\n  color: #fff;\n  border-color: var(--ot-brand-primary);\n}\n\n/* \u4fee\u6b63\u4e0e\u8865\u5145\u4e2d\u5fc3\u5361\u7247\u5f39\u7a97 */\n.ot-cs-card {\n  width: 580px;\n  max-width: 95vw;\n  max-height: 88vh;\n  background: var(--ot-surface);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-xl);\n  box-shadow: var(--ot-shadow-lg);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  animation: ot-floating-rise 0.2s var(--ot-ease);\n}\n\n.ot-cs-card__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 18px 0;\n  background: linear-gradient(180deg, var(--ot-brand-primary-soft), var(--ot-surface));\n  border-bottom: 1px solid var(--ot-border);\n  position: relative;\n}\n\n.ot-cs-tabs {\n  display: flex;\n  gap: 8px;\n}\n\n.ot-cs-tab {\n  padding: 8px 14px;\n  border: 0;\n  background: transparent;\n  font-size: 13.5px;\n  font-weight: 650;\n  color: var(--ot-ink-secondary);\n  cursor: pointer;\n  position: relative;\n  transition: color 0.15s ease;\n  border-bottom: 2.5px solid transparent;\n}\n\n.ot-cs-tab:hover {\n  color: var(--ot-brand-primary);\n}\n\n.ot-cs-tab.active {\n  color: var(--ot-brand-primary);\n  border-bottom-color: var(--ot-brand-primary);\n}\n\n.ot-cs-card__body {\n  padding: 18px;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  max-height: calc(88vh - 120px);\n}\n\n/* \u5feb\u901f\u4fa6\u6d4b\u4fee\u6b63\u5361\u7247\u63d0\u793a */\n.ot-quick-detected-box {\n  background: var(--ot-surface-soft);\n  border: 1px solid var(--ot-border);\n  border-radius: var(--ot-radius-md);\n  padding: 12px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.ot-quick-detected-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 12px;\n  color: var(--ot-ink);\n}\n\n.ot-quick-detected-head strong {\n  color: var(--ot-brand-primary);\n}\n\n.ot-quick-detected-input {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n\n/* \u8865\u5145\u4fe1\u606f\u7c7b\u578b\u9009\u62e9\u5668 */\n.ot-supp-type-bar {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  padding-bottom: 4px;\n  border-bottom: 1px solid var(--ot-border);\n}\n\n.ot-supp-type-btn {\n  padding: 5px 12px;\n  border-radius: var(--ot-radius-pill);\n  border: 1px solid var(--ot-border-strong);\n  background: var(--ot-surface);\n  font-size: 12px;\n  font-weight: 650;\n  color: var(--ot-ink);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n\n.ot-supp-type-btn:hover {\n  border-color: var(--ot-brand-primary);\n  color: var(--ot-brand-primary);\n}\n\n.ot-supp-type-btn.active {\n  background: var(--ot-brand-primary);\n  color: #fff;\n  border-color: var(--ot-brand-primary);\n  box-shadow: var(--ot-shadow-xs);\n}\n\n/* \u8868\u5355\u5206\u680f\u6805\u683c */\n.ot-form-grid-2 {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n\n/* \u52a8\u6548\u5173\u952e\u5e27 */\n@keyframes ot-floating-rise {\n  0% { opacity: 0; transform: translateY(6px); }\n  100% { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes ot-resume-assistant-appear {\n  0% { opacity: 0; transform: translateY(6px); }\n  100% { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes ot-orbit-spin {\n  to { transform: rotate(360deg); }\n}\n\n\n";
  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(injectedStyle);
  } else {
    const s = document.createElement('style');
    s.textContent = injectedStyle;
    document.head.appendChild(s);
  }

  /**
   * OfferTong - AI 一键网申填简历 (Campus AutoFill Master)
   * 核心内容脚本 (Content Script)
   * 
   * 核心功能完整复刻：
   * 1. 极光光环发光悬浮球 (Floating Orb Launcher) 与微型控制器菜单
   * 2. 紧凑型智能控制面板 (Compact Floating Panel，带环形仪表盘与进度动效)
   * 3. 核心杀手级功能：简历小助手 (Resume Assistant 悬浮窗，实时光标聚焦检测与单项瞬间注入)
   * 4. 禁用网站管理 (Blacklist / Disabled Sites) 与设置中心无缝协同
   * 5. 全自适应表单语义引擎 (北森 Beisen Phoenix、Moka、Ant Design、Element UI/Plus、Vue/React 原型链 Setter 注入)
   * 6. 本地 Python 服务 (http://127.0.0.1:8765) 双端数据实时联动与离线缓存
   */

  (function () {
    'use strict';

    if (window.__OFFERTONG_CAMPUS_AUTOFILL_LOADED__) return;
    window.__OFFERTONG_CAMPUS_AUTOFILL_LOADED__ = true;

    const SERVER_URL = 'http://127.0.0.1:8765';
    const STORAGE_KEY_DISABLED = 'ot_disabled_sites';
    const STORAGE_KEY_PREFS = 'ot_preferences';
    const STORAGE_KEY_POS = 'ot_launcher_pos';

    // 1. 示例校招候选人资料（张三）
    // ============================================================
    // 秋招助手 - 示例候选人资料
    // 注意：以下全部为虚拟测试数据，不对应真实个人
    // ============================================================

    let currentProfileData = {

      // ==========================================================
      // 基础资料
      // ==========================================================
      "profile_id": "demo", // 个人资料唯一 ID
      "profile_name": "张三 - 校招简历 (前端/全栈开发)", // 资料名称
      "updated_at": "2026-09-29", // 资料最后更新时间

      "basic": {

        "name": "张三", // 姓名
        "gender": "男", // 性别
        "birthday": "2003-05-18", // 出生日期
        "phone": "13800000000", // 手机号码
        "email": "zhangsan@example.com", // 邮箱
        "id_card": "000000000000000000", // 身份证号（测试数据）
        "id_type": "居民身份证", // 证件类型
        "political_status": "群众", // 政治面貌
        "ethnicity": "汉族", // 民族
        "marital_status": "未婚", // 婚姻状况
        "nationality": "中国", // 国籍

        "height": "175", // 身高，单位：cm
        "weight": "65", // 体重，单位：kg
        "health_status": "良好", // 健康状况

        "native_place": "福建省/福州市", // 籍贯
        "origin_place": "福建省/福州市", // 生源地
        "hukou": "福建省/福州市", // 户籍所在地
        "current_city": "福州市", // 当前所在城市
        "address": "福建省福州市XX区XX街道", // 当前联系地址
        "postal_code": "350000", // 邮政编码

        "emergency_contact_name": "李女士", // 紧急联系人姓名
        "emergency_contact_phone": "13900000000", // 紧急联系人电话
        "emergency_contact_relation": "母亲", // 紧急联系人与本人关系

        "expected_salary": "10", // 期望年薪，单位：万元
        "expected_salary_text": "10万元/年", // 期望薪资展示文本
        "expected_city": "福州市 / 厦门市 / 杭州市", // 期望工作城市
        "job_category": "前端开发工程师 / 全栈开发工程师", // 求职岗位方向

        "available_date": "毕业后立即到岗", // 可入职时间
        "willing_relocate": "是", // 是否接受异地工作
        "accept_adjustment": "接受", // 是否接受岗位调剂

        "signature": "张三", // 电子签名
        "sign_date": "2026-09-29" // 签署日期
      },


      // ==========================================================
      // 本科教育经历
      // ==========================================================
      "education": {

        "school": "XX大学", // 本科院校名称
        "degree": "本科", // 学历
        "education_level": "大学本科", // 学历层次
        "degree_type": "学士", // 学位类型
        "major": "计算机科学与技术", // 所学专业
        "major_category": "工学 / 计算机类", // 专业类别

        "start_date": "2023-09-01", // 入学时间
        "end_date": "2027-06-01", // 毕业时间
        "graduation_year": "2027", // 毕业年份

        "is_full_time": "是", // 是否全日制
        "is_highest": "是", // 是否最高学历
        "is_major": "是", // 是否为主要专业

        "gpa": "88", // GPA / 综合成绩
        "rank": "10", // 专业排名
        "class_size": "60", // 班级总人数

        "is_overseas": "否", // 是否海外学历

        "core_courses":
          "数据结构与算法、计算机网络、操作系统、数据库原理、软件工程、Web前端开发技术", // 核心课程

        "major_description":
          "系统学习计算机科学基础理论与软件开发技术，具备 Web 前后端开发、数据库应用及软件工程实践能力。" // 专业介绍
      },


      // ==========================================================
      // 大专教育经历
      // ==========================================================
      "junior_college_education": {

        "school": "XX职业技术学院", // 大专院校名称
        "degree": "大专", // 学历
        "education_level": "专科", // 学历层次
        "degree_type": "无", // 学位类型
        "major": "软件技术", // 所学专业

        "start_date": "2020-09-01", // 入学时间
        "end_date": "2023-06-01", // 毕业时间
        "graduation_year": "2023", // 毕业年份

        "is_full_time": "是", // 是否全日制
        "is_highest": "否", // 是否最高学历
        "is_major": "是" // 是否主要专业
      },


      // ==========================================================
      // 高中教育经历
      // ==========================================================
      "high_school_education": {

        "school": "XX市第一中学", // 高中学校
        "degree": "高中", // 学历
        "education_level": "高中", // 学历层次
        "degree_type": "无", // 学位类型
        "major": "普通高中", // 高中类型

        "start_date": "2017-09-01", // 入学时间
        "end_date": "2020-06-01", // 毕业时间
        "graduation_year": "2020", // 毕业年份

        "is_full_time": "是", // 是否全日制
        "is_highest": "否", // 是否最高学历
        "is_major": "是" // 是否主要教育经历
      },


      // ==========================================================
      // 技能与语言能力
      // ==========================================================
      "skills_and_languages": {

        "english_level": "大学英语六级", // 英语水平
        "english_score": "435", // 英语成绩
        "english_cet4": "520", // 英语四级成绩
        "foreign_language": "英语", // 外语语种

        // 技术能力总结
        "tech_skills":
          "熟练掌握 Web 前端开发，熟悉 HTML、CSS、JavaScript、TypeScript、Vue2/Vue3，具备 Node.js、Spring Boot、MySQL 等后端开发基础。",

        // 计算机技能列表
        "computer_skills": [

          // 前端核心技术
          "HTML5、CSS3、JavaScript（ES6+）、TypeScript、Vue2/Vue3（熟练）",

          // 前端工程化与 UI 技术
          "Vite、Webpack、Git、Axios、Element Plus、ECharts（熟练）",

          // 跨端开发技术
          "uni-app、微信小程序、多端开发（熟练）",

          // 后端及服务器技术
          "Node.js、Spring Boot、MySQL、Nginx（了解）",

          // 办公软件
          "WPS、Office 办公软件（熟练）"
        ],

        // 证书列表
        "certificates": [

          {
            "name": "计算机技术与软件专业技术资格（水平）考试初级", // 证书名称
            "date": "2025-05-30", // 获得时间
            "field": "信息技术" // 所属领域
          },

          {
            "name": "全国计算机等级考试一级", // 证书名称
            "date": "2024-12-30", // 获得时间
            "field": "信息技术" // 所属领域
          }
        ],

        // 证书名称汇总文本
        "certificates_text":
          "计算机技术与软件专业技术资格（水平）考试初级、全国计算机等级考试一级"
      },


      // ==========================================================
      // 实习经历
      // ==========================================================
      "internships": [

        {
          "company": "XX科技有限公司", // 实习公司
          "department": "研发中心", // 所属部门
          "role": "前端开发实习生", // 实习岗位
          "employment_type": "实习", // 工作类型
          "nature": "民营/私营公司", // 公司性质
          "industry": "互联网/IT服务", // 公司所属行业

          "start_date": "2025-06-01", // 实习开始时间
          "end_date": "2026-03-01", // 实习结束时间

          // 实习经历简介
          "description":
            "参与企业 Web 系统及微信小程序开发，使用 Vue、uni-app、ECharts 等技术完成业务模块开发、接口联调及页面性能优化。"
        }
      ],


      // ==========================================================
      // 项目经历
      // ==========================================================
      "projects": [

        {
          "name": "企业智慧管理平台", // 项目名称
          "role": "前端开发", // 项目角色
          "level": "企业级", // 项目级别
          "nature": "企业信息化项目", // 项目性质

          "start_date": "2025-07-01", // 项目开始时间
          "end_date": "2026-02-01", // 项目结束时间

          // 项目简介
          "description":
            "参与企业智慧管理平台开发，负责设备管理、数据展示、用户权限等业务模块。",

          // 项目具体工作内容
          "details":
            "基于 Vue3 + Element Plus 开发业务页面，使用 ECharts 实现数据可视化，基于 RBAC 实现角色权限控制，封装多个通用组件提升开发效率。"
        },


        {
          "name": "校园服务小程序", // 项目名称
          "role": "前端开发", // 项目角色
          "level": "校级", // 项目级别
          "nature": "校园项目", // 项目性质

          "start_date": "2025-03-01", // 项目开始时间
          "end_date": "2025-06-01", // 项目结束时间

          // 项目简介
          "description":
            "负责微信小程序主要功能开发，实现校园资讯、活动报名、个人中心等功能。",

          // 项目具体工作内容
          "details":
            "使用 uni-app 开发小程序，完成登录、用户信息、活动报名等功能，并完成接口联调及页面适配。"
        },


        {
          "name": "跨境电商商城", // 项目名称
          "role": "全栈开发", // 项目角色
          "level": "商用项目", // 项目级别
          "nature": "电商项目", // 项目性质

          "start_date": "2026-01-01", // 项目开始时间
          "end_date": "2026-06-01", // 项目结束时间

          // 项目简介
          "description":
            "参与跨境电商商城开发，负责前后端功能开发、数据库设计及项目部署。",

          // 项目具体工作内容
          "details":
            "基于 Vue、Node.js、MySQL 完成商城核心功能开发，使用 Nginx 配置生产环境并完成项目部署上线。"
        }
      ],


      // ==========================================================
      // 获奖经历
      // ==========================================================
      "awards": [

        {
          "name": "全国大学生软件设计竞赛一等奖", // 奖项名称
          "level": "国家级", // 奖项级别
          "date": "2026-05-30", // 获奖时间
          "issuer": "相关竞赛组委会" // 颁发单位
        },

        {
          "name": "大学生程序设计竞赛二等奖", // 奖项名称
          "level": "省级", // 奖项级别
          "date": "2025-12-30", // 获奖时间
          "issuer": "相关竞赛组委会" // 颁发单位
        },

        {
          "name": "优秀学生奖学金二等奖", // 奖项名称
          "level": "校级", // 奖项级别
          "date": "2025-06-01", // 获奖时间
          "issuer": "XX大学" // 颁发单位
        }
      ],


      // ==========================================================
      // 家庭成员
      // ==========================================================
      "family_members": [

        {
          "relation": "父亲", // 与本人关系
          "name": "张某某", // 姓名
          "birthday": "1975-01-01", // 出生日期
          "political_status": "群众", // 政治面貌
          "company": "XX公司", // 工作单位
          "role": "职员" // 职务
        },

        {
          "relation": "母亲", // 与本人关系
          "name": "李某某", // 姓名
          "birthday": "1976-01-01", // 出生日期
          "political_status": "群众", // 政治面貌
          "company": "XX单位", // 工作单位
          "role": "职员" // 职务
        }
      ],


      // ==========================================================
      // 自我评价与求职目标
      // ==========================================================
      "self_evaluation":
        "自我评价：\n" +
        "熟悉 Web 前端开发技术，具备一定的全栈开发能力，参与过企业级 Web 项目及小程序项目开发。学习能力较强，能够快速学习并应用新技术，具备良好的沟通能力和团队协作意识。\n\n" +

        "求职目标：\n" +
        "期望从事 Web 前端开发或全栈开发相关岗位，希望参与真实业务项目，在实践中不断提升工程能力和技术水平。",


      // ==========================================================
      // 优势与不足 
      // ==========================================================
      "strengths_and_weaknesses":
        "优势：\n" +
        "1. 熟悉 Vue、JavaScript、TypeScript 等前端技术；\n" +
        "2. 具备 Web 前端及后端基础开发能力；\n" +
        "3. 有实际项目开发经验，能够完成接口联调及项目部署；\n" +
        "4. 学习能力较强，能够快速适应新技术和业务。\n\n" +

        "不足：\n" +
        "1. 大型项目及高并发系统经验较少；\n" +
        "2. 对底层原理及系统架构仍需要进一步深入学习。",


      // ==========================================================
      // 兴趣爱好与个人特长
      // ==========================================================
      "hobbies_and_specialties":
        "特长：熟悉 Web 前端开发，能够独立完成页面开发、接口联调及常见问题排查。\n\n" +

        "爱好：关注前端技术发展，喜欢阅读技术文章、学习开源项目；业余时间喜欢运动、骑行和羽毛球。",


      // ==========================================================
      // 补充资料
      // ==========================================================
      "supplement": [

        {
          "key": "微信号", // 字段名称
          "value": "zhangsan_demo", // 字段值
          "keywords": "微信,微信号,wechat,wx" // 用于 AI / 搜索匹配的关键词
        },

        {
          "key": "QQ号",
          "value": "100000000",
          "keywords": "qq,qq号,腾讯qq"
        },

        {
          "key": "期望工作城市",
          "value": "福州市 / 厦门市 / 杭州市",
          "keywords": "期望城市,意向城市,工作地点,期望地点"
        },

        {
          "key": "高考总分及科类",
          "value": "500分（普通类）",
          "keywords": "高考,高考成绩,高考总分,文理科,理科,文科"
        },

        {
          "key": "现任导师/推荐人",
          "value": "王老师",
          "keywords": "导师,指导老师,推荐人,导师姓名"
        },

        {
          "key": "到岗时间/实习时长",
          "value": "随时到岗，可全职实习6个月以上",
          "keywords": "到岗时间,到岗,入职时间,实习时长,可实习"
        },

        {
          "key": "个人主页/作品集",
          "value": "https://github.com/zhangsan-demo",
          "keywords": "github,个人主页,个人网站,作品集,博客,主页"
        },

        {
          "key": "英语六级成绩",
          "value": "已通过（435分）",
          "keywords": "六级,cet6,cet-6,英语六级"
        },

        {
          "key": "身高与体重",
          "value": "身高175cm / 体重65kg",
          "keywords": "身高,体重"
        },

        {
          "key": "身体健康状况",
          "value": "良好",
          "keywords": "健康状况,身体状况,病史"
        }
      ]
    };

    // 全局偏好与运行时状态
    let isServerOnline = false;
    let currentActiveField = null; // 实时聚焦在网页中的输入框元素
    let currentActiveLabel = '';   // 实时聚焦输入框的语义标签名
    let userPrefs = {
      autoOpenSidebarOnIncomplete: true,
      showFloatingButton: true,
      autoDetect: true,
      highlight: true
    };

    // 存储适配层
    const Storage = {
      async get(key, defaultVal) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          return new Promise(resolve => {
            chrome.storage.local.get([key], res => {
              resolve(res[key] !== undefined ? res[key] : defaultVal);
            });
          });
        }
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : defaultVal;
        } catch (e) {
          return defaultVal;
        }
      },
      async set(key, val) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          return new Promise(resolve => {
            chrome.storage.local.set({ [key]: val }, resolve);
          });
        }
        try {
          localStorage.setItem(key, JSON.stringify(val));
        } catch (e) { }
      }
    };

    // 检查当前网站是否已被禁用
    async function checkSiteDisabled() {
      const disabledSites = await Storage.get(STORAGE_KEY_DISABLED, []);
      const host = window.location.hostname;
      return disabledSites.some(s => s && (s === host || host.endsWith('.' + s)));
    }

    // 复制到剪贴板工具函数
    function copyToClipboard(text) {
      if (!text && text !== 0) return false;
      const str = String(text);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str).catch(() => { });
        return true;
      }
      const t = document.createElement('textarea');
      t.value = str;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(t);
        return true;
      } catch (e) {
        document.body.removeChild(t);
        return false;
      }
    }

    // 弹出 Toast 消息
    function showToast(msg, duration = 2200) {
      let toast = document.getElementById('ot-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ot-toast';
        toast.className = 'ot-toast';
        document.body.appendChild(toast);
      }
      toast.innerText = msg;
      toast.classList.add('show');
      clearTimeout(toast.__timer);
      toast.__timer = setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }

    // ==========================================================================
    // 2. 深度表单语义识别与自动填充引擎 (兼容北森 Beisen、Moka、Vue/React)
    // ==========================================================================

    // 原生原型 Setter 绕过框架虚拟 DOM 劫持与触发真实事件链
    function setNativeInputValue(element, val) {
      if (!element || val === undefined || val === null) return false;
      const strVal = String(val);

      const wasReadOnly = element.readOnly;
      if (wasReadOnly) {
        try { element.readOnly = false; } catch (e) { }
      }

      const proto = Object.getPrototypeOf(element);
      const protoSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      const directSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;

      if (protoSetter && protoSetter !== directSetter) {
        protoSetter.call(element, strVal);
      } else if (directSetter) {
        directSetter.call(element, strVal);
      } else {
        element.value = strVal;
      }

      element.dispatchEvent(new Event('focus', { bubbles: true }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));

      // 触发 React 内部属性
      const reactKey = Object.keys(element).find(k => k.startsWith('__reactProps$') || k.startsWith('__reactEvents$'));
      if (reactKey && element[reactKey]) {
        const props = element[reactKey];
        if (typeof props.onChange === 'function') props.onChange({ target: element, currentTarget: element });
        if (typeof props.onInput === 'function') props.onInput({ target: element, currentTarget: element });
      }

      if (wasReadOnly) {
        try { element.readOnly = true; } catch (e) { }
      }

      if (userPrefs.highlight) {
        element.classList.add('ot-filled-highlight');
        setTimeout(() => element.classList.remove('ot-filled-highlight'), 1500);
      }
      return true;
    }

    // 提取输入元素的语义上下文
    function getElementContext(el) {
      if (!el) return { label: '', section: '', cardIndex: 0 };

      // 1) 寻找所属章节
      const sectionEl = el.closest('.sc-iAKWXU, section, .section, .form-section, .form-card, fieldset');
      let section = '';
      if (sectionEl) {
        const titleNode = sectionEl.querySelector('.sc-efQSVx, .section-title, .title, legend, h1, h2, h3, h4');
        if (titleNode) section = titleNode.innerText.replace(/[\s*：:【】]/g, '');
      }

      // 2) 寻找卡片序号 (多卡片教育、项目、经历)
      const cardEl = el.closest('.sc-AjmGg, .card, .record-item, .ant-card, .el-card, .experience-item, .sub-form');
      let cardIndex = 0;
      if (cardEl && cardEl.parentElement) {
        const siblings = Array.from(cardEl.parentElement.children).filter(c =>
          c.classList.contains('sc-AjmGg') || c.classList.contains('card') ||
          c.classList.contains('record-item') || c.classList.contains('ant-card') ||
          c.classList.contains('el-card') || c.classList.contains('experience-item')
        );
        const idx = siblings.indexOf(cardEl);
        if (idx !== -1) cardIndex = idx;
      }

      // 3) 提取标签 Label
      let label = '';
      const formItem = el.closest('.form-item, .form-item--phoenix, .el-form-item, .ant-form-item, .form-group, .field, tr, dl');
      if (formItem) {
        const lbl = formItem.querySelector('.form-item__text, .el-form-item__label, .ant-form-item-label, label, th, dt, .label');
        if (lbl) label = lbl.innerText.replace(/[\s*：:【】]/g, '');
      }
      if (!label && el.id) {
        try {
          const lblFor = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          if (lblFor) label = lblFor.innerText.replace(/[\s*：:【】]/g, '');
        } catch (e) { }
      }
      if (!label) {
        const prev = el.previousElementSibling;
        if (prev && prev.innerText && prev.innerText.length < 30) {
          label = prev.innerText.replace(/[\s*：:【】]/g, '');
        }
      }
      if (!label) {
        label = (el.getAttribute('placeholder') || el.getAttribute('aria-label') || el.name || '').replace(/[\s*：:【】]/g, '');
      }

      return { label, section, cardIndex };
    }

    // 日期格式化自适应
    function adaptDateFormat(rawDateStr, placeholder = '') {
      if (!rawDateStr) return '';
      const clean = String(rawDateStr).trim();
      const m = clean.match(/^(\d{4})[-/.]?(\d{1,2})?[-/.]?(\d{1,2})?$/);
      if (!m) return clean;

      const y = m[1];
      const month = m[2] ? m[2].padStart(2, '0') : '01';
      const day = m[3] ? m[3].padStart(2, '0') : '01';

      const p = placeholder.toLowerCase();
      if (p.includes('年') || p.includes('yyyy年')) {
        if (p.includes('日') || p.includes('dd')) return `${y}年${month}月${day}日`;
        if (p.includes('月') || p.includes('mm')) return `${y}年${month}月`;
        return `${y}年`;
      }
      if (p.includes('/')) {
        if (p.includes('dd')) return `${y}/${month}/${day}`;
        return `${y}/${month}`;
      }
      if (p.includes('.')) {
        if (p.includes('dd')) return `${y}.${month}.${day}`;
        return `${y}.${month}`;
      }
      if (p.includes('yyyy-mm') && !p.includes('dd')) {
        return `${y}-${month}`;
      }
      if (p === 'yyyy' || p.includes('年份')) {
        return y;
      }
      return `${y}-${month}-${day}`;
    }

    // 求解字段的目标值
    function resolveTargetValue(label, section, cardIndex) {
      const s = section || '';
      const lbl = label || '';
      const cIdx = cardIndex || 0;

      // A. 教育背景 (0: 本科, 1: 大专, 2: 高中)
      if (/教育经历|教育背景|最高学历/i.test(s) || /学历段|毕业院校/i.test(lbl)) {
        if (cIdx === 0) {
          if (/学校|院校|高校|大学/i.test(lbl)) return currentProfileData.education.school;
          if (/专业大类|门类/i.test(lbl)) return currentProfileData.education.major_category;
          if (/专业/i.test(lbl)) return currentProfileData.education.major;
          if (/学历层次/i.test(lbl)) return currentProfileData.education.education_level;
          if (/学历/i.test(lbl)) return currentProfileData.education.degree;
          if (/学位/i.test(lbl)) return currentProfileData.education.degree_type;
          if (/开始时间|入学/i.test(lbl)) return currentProfileData.education.start_date;
          if (/结束时间|毕业/i.test(lbl)) return currentProfileData.education.end_date;
          if (/毕业年份/i.test(lbl)) return currentProfileData.education.graduation_year;
          if (/全日制/i.test(lbl)) return currentProfileData.education.is_full_time;
          if (/平均分|gpa|绩点/i.test(lbl)) return currentProfileData.education.gpa;
          if (/排名/i.test(lbl)) return currentProfileData.education.rank;
          if (/总人数/i.test(lbl)) return currentProfileData.education.class_size;
          if (/核心课程/i.test(lbl)) return currentProfileData.education.core_courses;
          if (/专业描述/i.test(lbl)) return currentProfileData.education.major_description;
        } else if (cIdx === 1) {
          if (/学校|院校|高校|大学/i.test(lbl)) return currentProfileData.junior_college_education.school;
          if (/专业/i.test(lbl)) return currentProfileData.junior_college_education.major;
          if (/学历/i.test(lbl)) return currentProfileData.junior_college_education.degree;
          if (/开始时间|入学/i.test(lbl)) return currentProfileData.junior_college_education.start_date;
          if (/结束时间|毕业/i.test(lbl)) return currentProfileData.junior_college_education.end_date;
        } else if (cIdx === 2) {
          if (/学校|院校|高中/i.test(lbl)) return currentProfileData.high_school_education.school;
          if (/学历/i.test(lbl)) return currentProfileData.high_school_education.degree;
          if (/开始时间|入学/i.test(lbl)) return currentProfileData.high_school_education.start_date;
          if (/结束时间|毕业/i.test(lbl)) return currentProfileData.high_school_education.end_date;
        }
      }

      // B. 工作与实习
      if (/工作|实习/i.test(s) || /单位名称|实习公司/i.test(lbl)) {
        const exp = currentProfileData.internships[0] || {};
        if (/企业名称|单位名称|公司名称|工作单位|实习单位/i.test(lbl)) return exp.company;
        if (/部门/i.test(lbl)) return exp.department;
        if (/职位|岗位|职务/i.test(lbl)) return exp.role;
        if (/描述|职责|工作内容/i.test(lbl)) return exp.description;
        if (/性质/i.test(lbl)) return exp.nature;
        if (/行业/i.test(lbl)) return exp.industry;
        if (/开始时间|入职/i.test(lbl)) return exp.start_date;
        if (/结束时间|离职/i.test(lbl)) return exp.end_date;
      }

      // C. 项目经历
      if (/项目|科研/i.test(s) || /项目名称/i.test(lbl)) {
        const proj = currentProfileData.projects[cIdx] || currentProfileData.projects[0] || {};
        if (/项目名称/i.test(lbl)) return proj.name;
        if (/担任角色|职务|角色/i.test(lbl)) return proj.role;
        if (/项目级别|项目类型/i.test(lbl)) return proj.level;
        if (/开始时间/i.test(lbl)) return proj.start_date;
        if (/结束时间/i.test(lbl)) return proj.end_date;
        if (/工作描述|职责|项目描述|工作内容/i.test(lbl)) return proj.details || proj.description;
      }

      // D. 获奖荣誉
      if (/获奖|奖励|荣誉/i.test(s) || /奖励名称|奖项/i.test(lbl)) {
        const aw = currentProfileData.awards[cIdx] || currentProfileData.awards[0] || {};
        if (/名称/i.test(lbl)) return aw.name;
        if (/时间/i.test(lbl)) return aw.date;
        if (/级别/i.test(lbl)) return aw.level;
        if (/机构|单位/i.test(lbl)) return aw.issuer || '组委会';
      }

      // E. 证书技能
      if (/资格|证书|技能|语言/i.test(s) || /英语|技能/i.test(lbl)) {
        const skl = currentProfileData.skills_and_languages || {};
        if (/语种/i.test(lbl)) return skl.foreign_language;
        if (/英语水平|外语等级|等级/i.test(lbl)) return skl.english_level;
        if (/四级|cet4|分数|成绩/i.test(lbl)) return skl.english_score;
        if (/技能描述|专业技能/i.test(lbl)) return skl.tech_skills;
      }

      // F. 家庭成员
      if (/家庭成员|亲属/i.test(s) || /家庭关系/i.test(lbl)) {
        const fm = currentProfileData.family_members[cIdx] || currentProfileData.family_members[0] || {};
        if (/关系/i.test(lbl)) return fm.relation;
        if (/姓名/i.test(lbl)) return fm.name;
        if (/出生/i.test(lbl)) return fm.birthday;
        if (/政治面貌/i.test(lbl)) return fm.political_status;
        if (/单位/i.test(lbl)) return fm.company;
        if (/职务|职位/i.test(lbl)) return fm.role;
      }

      // G. 基础信息
      const b = currentProfileData.basic || {};
      if (/(?:真实)?姓名|候选人姓名/i.test(lbl) && !/联系人|亲属|学校|单位/i.test(lbl)) return b.name;
      if (/证件号码|身份证/i.test(lbl)) return b.id_card;
      if (/证件类型|证件种类/i.test(lbl)) return b.id_type;
      if (/出生年月|出生日期|生日/i.test(lbl)) return b.birthday;
      if (/移动电话|手机号码|联系电话/i.test(lbl) && !/紧急/i.test(lbl)) return b.phone;
      if (/电子邮箱|邮箱/i.test(lbl)) return b.email;
      if (/民族/i.test(lbl)) return b.ethnicity;
      if (/政治面貌|党派/i.test(lbl)) return b.political_status;
      if (/婚姻状况|婚姻/i.test(lbl)) return b.marital_status;
      if (/国籍/i.test(lbl)) return b.nationality;
      if (/身高/i.test(lbl)) return b.height;
      if (/体重/i.test(lbl)) return b.weight;
      if (/健康状况/i.test(lbl)) return b.health_status;
      if (/籍贯/i.test(lbl)) return b.native_place;
      if (/生源地/i.test(lbl)) return b.origin_place;
      if (/户口所在地/i.test(lbl)) return b.hukou;
      if (/现居住地|现居城市/i.test(lbl)) return b.current_city;
      if (/通信地址|详细地址|家庭住址/i.test(lbl)) return b.address;
      if (/邮政编码|邮编/i.test(lbl)) return b.postal_code;
      if (/紧急联系人姓名|紧急联系人/i.test(lbl) && !/电话|方式|关系/i.test(lbl)) return b.emergency_contact_name;
      if (/紧急联系人电话|紧急联系方式/i.test(lbl)) return b.emergency_contact_phone;
      if (/紧急联系人关系|与本人关系/i.test(lbl)) return b.emergency_contact_relation;
      if (/期望待遇|期望薪资/i.test(lbl)) return b.expected_salary;
      if (/期望城市|期望工作城市|期望地点/i.test(lbl)) return b.expected_city;
      if (/求职意向|投递职位|应聘职位/i.test(lbl)) return b.job_category;
      if (/到岗时间/i.test(lbl)) return b.available_date;

      // H. 评价与承诺
      if (/特长|爱好/i.test(lbl)) return currentProfileData.hobbies_and_specialties;
      if (/优势|优缺点/i.test(lbl)) return currentProfileData.strengths_and_weaknesses;
      if (/自我评价/i.test(lbl)) return currentProfileData.self_evaluation;
      if (/本人承诺/i.test(lbl)) return "同意接受";
      if (/填表人签名|签名/i.test(lbl)) return b.signature;
      if (/填表日期|日期/i.test(lbl)) return b.sign_date;

      // I. 补充字段
      const cleanLbl = lbl.toLowerCase();
      for (const item of (currentProfileData.supplement || [])) {
        if (!item.key || !item.value) continue;
        if (cleanLbl.includes(item.key.toLowerCase())) return item.value;
        if (item.keywords && item.keywords.split(',').some(k => cleanLbl.includes(k.trim().toLowerCase()))) {
          return item.value;
        }
      }

      return null;
    }

    // 深度北森与现代自定义下拉框填入
    function fillCustomSelect(container, val) {
      if (!container || !val) return false;
      const targetStr = String(val).trim();

      // 1) 北森 Phoenix 下拉框 (.phoenix-select)
      if (container.classList.contains('phoenix-select') || container.querySelector('.phoenix-select')) {
        const selectBox = container.classList.contains('phoenix-select') ? container : container.querySelector('.phoenix-select');
        const hiddenInput = selectBox.querySelector('input');
        const placeholder = selectBox.querySelector('.phoenix-select__placeHolder');

        if (hiddenInput) {
          setNativeInputValue(hiddenInput, targetStr);
        }
        if (placeholder) {
          placeholder.innerText = targetStr;
          placeholder.style.color = '#172033';
        }
        selectBox.click();
        setTimeout(() => {
          const options = document.querySelectorAll('.phoenix-select-dropdown__item, .phoenix-option, [role="option"]');
          for (const opt of options) {
            if (opt.innerText && opt.innerText.trim().includes(targetStr)) {
              opt.click();
              break;
            }
          }
        }, 50);
        return true;
      }

      // 2) Element UI / Plus (.el-select)
      if (container.classList.contains('el-select') || container.querySelector('.el-select')) {
        const elSelect = container.classList.contains('el-select') ? container : container.querySelector('.el-select');
        const input = elSelect.querySelector('.el-input__inner');
        if (input) {
          setNativeInputValue(input, targetStr);
          elSelect.click();
          setTimeout(() => {
            const opts = document.querySelectorAll('.el-select-dropdown__item');
            for (const opt of opts) {
              if (opt.innerText && opt.innerText.trim().includes(targetStr)) {
                opt.click();
                break;
              }
            }
          }, 80);
          return true;
        }
      }

      // 3) Ant Design (.ant-select)
      if (container.classList.contains('ant-select') || container.querySelector('.ant-select')) {
        const antSelect = container.classList.contains('ant-select') ? container : container.querySelector('.ant-select');
        const input = antSelect.querySelector('.ant-select-selection-search-input');
        if (input) {
          setNativeInputValue(input, targetStr);
          antSelect.click();
          setTimeout(() => {
            const items = document.querySelectorAll('.ant-select-item-option-content');
            for (const it of items) {
              if (it.innerText && it.innerText.trim().includes(targetStr)) {
                it.click();
                break;
              }
            }
          }, 80);
          return true;
        }
      }

      return false;
    }

    // 深度单选按钮组触发
    function fillRadioGroup(container, val) {
      if (!container || !val) return false;
      const targetStr = String(val).trim();

      // 1) 原生 input[type="radio"]
      const radios = container.querySelectorAll('input[type="radio"]');
      for (const r of radios) {
        const lbl = r.parentElement ? r.parentElement.innerText.trim() : '';
        if (lbl.includes(targetStr) || r.value === targetStr) {
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
          r.click();
          return true;
        }
      }

      // 2) 北森 Phoenix 单选 (.phoenix-radio)
      const pRadios = container.querySelectorAll('.phoenix-radio, .el-radio, .ant-radio-wrapper');
      for (const pr of pRadios) {
        if (pr.innerText && pr.innerText.trim().includes(targetStr)) {
          pr.click();
          pr.classList.add('phoenix-radio--checked', 'is-checked', 'ant-radio-wrapper-checked');
          return true;
        }
      }

      return false;
    }

    // 执行全页表单智能嗅探与填充
    function runAutoFill(onProgress = null) {
      let scannedCount = 0;
      let filledCount = 0;

      // 1. 扫描所有常规输入框与文本域
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea'));

      // 2. 扫描所有原生下拉框
      const selects = Array.from(document.querySelectorAll('select'));

      // 3. 扫描北森与 Element 等自定义下拉框与单选组
      const customSelects = Array.from(document.querySelectorAll('.phoenix-select, .el-select, .ant-select'));
      const radioGroups = Array.from(document.querySelectorAll('.phoenix-radio-group, .el-radio-group, .ant-radio-group, .radio-group'));

      const allCandidates = [
        ...inputs.map(el => ({ type: 'input', el })),
        ...selects.map(el => ({ type: 'select', el })),
        ...customSelects.map(el => ({ type: 'custom_select', el })),
        ...radioGroups.map(el => ({ type: 'radio_group', el }))
      ].filter(item => {
        // 过滤掉 OfferTong 插件自身的元素
        return !item.el.closest('#ot-root') && !item.el.closest('#ot-toast');
      });

      scannedCount = allCandidates.length;

      allCandidates.forEach((cand, idx) => {
        const ctx = getElementContext(cand.el);
        const targetVal = resolveTargetValue(ctx.label, ctx.section, ctx.cardIndex);

        if (targetVal !== null && targetVal !== undefined && targetVal !== '') {
          let ok = false;
          if (cand.type === 'input') {
            const ph = cand.el.getAttribute('placeholder') || '';
            const isDate = cand.el.type === 'date' || cand.el.type === 'month' || /日期|时间|年月|出生|入学|毕业/i.test(`${ctx.label} ${ph}`);
            const formatted = isDate ? adaptDateFormat(targetVal, ph) : targetVal;
            ok = setNativeInputValue(cand.el, formatted);
          } else if (cand.type === 'select') {
            const options = Array.from(cand.el.options);
            const matchOpt = options.find(o => o.text.includes(String(targetVal)) || o.value === String(targetVal));
            if (matchOpt) {
              cand.el.value = matchOpt.value;
              cand.el.dispatchEvent(new Event('change', { bubbles: true }));
              ok = true;
            }
          } else if (cand.type === 'custom_select') {
            ok = fillCustomSelect(cand.el, targetVal);
          } else if (cand.type === 'radio_group') {
            ok = fillRadioGroup(cand.el, targetVal);
          }

          if (ok) filledCount++;
        }

        if (typeof onProgress === 'function') {
          const pct = Math.round(((idx + 1) / scannedCount) * 100);
          onProgress(idx + 1, scannedCount, pct, ctx.label || '表单字段');
        }
      });

      return { scannedCount, filledCount };
    }

    // ==========================================================================
    // 3. 实时光标焦点捕获系统 (Focus Tracking for Resume Assistant)
    // ==========================================================================

    function initFocusTracker() {
      const handleFocus = (e) => {
        const el = e.target;
        if (!el || el.closest('#ot-root')) return;

        if (el.matches && el.matches('input, textarea, select, [contenteditable="true"]')) {
          currentActiveField = el;
          const ctx = getElementContext(el);
          currentActiveLabel = ctx.label || el.placeholder || el.name || '输入框';

          // 更新简历小助手顶部焦点状态
          updateAssistantFocusUI(true, currentActiveLabel);
        }
      };

      document.addEventListener('focusin', handleFocus, true);
      document.addEventListener('click', handleFocus, true);
    }

    function updateAssistantFocusUI(isFocused, labelName) {
      const focusEl = document.getElementById('ot-assistant-focus-info');
      if (!focusEl) return;

      if (isFocused && labelName) {
        focusEl.innerHTML = `
        <span class="ot-resume-assistant__focus-active">🟢 聚焦：[<strong>${labelName}</strong>]</span>
        <div class="ot-focus-action-group">
          <button type="button" class="ot-focus-action-btn ot-focus-action-btn--primary" id="ot-btn-quick-correct" title="修正此项内容或提取网页内容回简历">📝 修正内容</button>
          <button type="button" class="ot-focus-action-btn" id="ot-btn-quick-supp" title="补充更多经历或自定义信息">➕ 补充信息</button>
        </div>
      `;
      } else {
        focusEl.innerHTML = `
        <span class="ot-resume-assistant__focus-inactive">⚪ 拖拽字段注入，或点击复制</span>
        <div class="ot-focus-action-group">
          <button type="button" class="ot-focus-action-btn" id="ot-btn-quick-correct" title="选择字段修正内容">📝 修正内容</button>
          <button type="button" class="ot-focus-action-btn" id="ot-btn-quick-supp" title="补充更多经历或自定义信息">➕ 补充信息</button>
        </div>
      `;
      }

      const correctBtn = focusEl.querySelector('#ot-btn-quick-correct');
      const suppBtn = focusEl.querySelector('#ot-btn-quick-supp');

      if (correctBtn) {
        correctBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openCorrectionSupplementHub('correct');
        });
      }
      if (suppBtn) {
        suppBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openCorrectionSupplementHub('supp');
        });
      }
    }

    // ==========================================================================
    // 4. OfferTong 现代 UI 渲染系统 (Launcher + Floating Panel + Assistant)
    // ==========================================================================

    function createOfferTongUI() {
      if (document.getElementById('ot-root')) return;

      const root = document.createElement('div');
      root.id = 'ot-root';

      root.innerHTML = `
      <!-- 全局浮动操作外壳 -->
      <div class="ot-floating-shell" id="ot-floating-shell">
        
        <!-- 紧凑悬浮卡片面板 (附着于悬浮球上方) -->
        <div class="ot-floating-panel-anchor" id="ot-panel-anchor" data-expanded="false">
          <div class="ot-floating-panel" id="ot-floating-panel">
            
            <!-- 面板顶栏 -->
            <header class="ot-floating-panel__header">
              <div class="ot-floating-panel__brand">
                <span class="ot-brand-mark--sm">⚡</span>
                <strong>OfferTong 网申助手</strong>
              </div>
              <span class="ot-floating-panel__status" id="ot-panel-status" data-tone="brand">待命</span>
              <button class="ot-floating-panel__close" id="ot-panel-close-btn" title="收起面板">✕</button>
            </header>

            <!-- 面板主体 -->
            <div class="ot-floating-panel__body">
              
              <!-- 当前激活简历版本行 -->
              <div class="ot-floating-resume-line">
                <span class="ot-floating-resume-line__label">当前简历</span>
                <strong id="ot-active-resume-name" title="点击切换简历版本">${currentProfileData.profile_name.split('(')[0].trim()}</strong>
              </div>

              <!-- 核心按钮：一键全量填 -->
              <button class="ot-floating-action ot-floating-action--primary" id="ot-btn-fill-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <span>一键填简历</span>
              </button>

              <!-- 次要操作按钮组 -->
              <div class="ot-floating-panel__secondary-row">
                <button class="ot-floating-action ot-floating-action--soft" id="ot-btn-open-assistant">
                  <span>📋 简历小助手</span>
                </button>
                <button class="ot-floating-action ot-floating-action--ghost" id="ot-btn-open-hub" title="修正内容与补充更多经历信息">
                  <span>🛠️ 修正与补充</span>
                </button>
              </div>

              <!-- 填充执行进度视图 -->
              <div class="ot-floating-processing" id="ot-processing-box" data-active="false">
                <div class="ot-floating-panel__processing-head">
                  <span id="ot-proc-step">正在解析表单语义...</span>
                  <strong id="ot-proc-count">0/0</strong>
                </div>
                <div class="ot-floating-track">
                  <span id="ot-proc-bar" style="width: 0%;"></span>
                </div>
              </div>

              <!-- 填充完成环形仪表盘汇总 -->
              <div class="ot-floating-summary" id="ot-summary-box" data-active="false">
                <div class="ot-floating-ring" id="ot-summary-ring" style="--ot-ring-fill: 0deg;">
                  <span class="ot-floating-ring__value" id="ot-summary-pct">0%</span>
                </div>
                <div class="ot-floating-summary__detail">
                  <strong id="ot-summary-title">已成功填入 0 项</strong>
                  <span id="ot-summary-sub">覆盖当前页面表单字段</span>
                </div>
              </div>

              <!-- 未完全填入时的智能提醒 -->
              <div class="ot-floating-notice--warn" id="ot-incomplete-notice" style="display:none;">
                <strong>💡 存在部分需要补充的项</strong>
                <span>页面含有动态卡片或个性化提问，点击下方打开【简历小助手】点选补填</span>
                <button type="button" id="ot-btn-jump-assistant">打开简历小助手 ↗</button>
              </div>

            </div>
          </div>
        </div>

        <!-- 悬浮球容器 -->
        <div class="ot-floating-launcher-wrap">
          
          <!-- 悬浮球辅助菜单微型控制器 -->
          <div class="ot-floating-launcher-controls" id="ot-launcher-controls">
            <button class="ot-floating-launcher-controls__trigger" id="ot-launcher-menu-trigger" title="快捷菜单">⋮</button>
            <div class="ot-floating-launcher-menu" id="ot-launcher-menu" data-visible="false">
              <strong>OfferTong 快捷操作</strong>
              <button type="button" id="ot-menu-toggle-panel">展开 / 收起面板</button>
              <button type="button" id="ot-menu-open-assistant">📋 打开简历小助手</button>
              <button type="button" id="ot-menu-fill-now">⚡ 一键智能填简历</button>
              <button type="button" id="ot-menu-sync">🔄 同步本地数据服务</button>
              <div class="menu-divider"></div>
              <button type="button" id="ot-menu-open-options">⚙️ 插件设置中心</button>
              <button type="button" class="ot-floating-launcher-menu__danger" id="ot-menu-disable-site">🚫 在本站禁用悬浮球</button>
            </div>
          </div>

          <!-- 发光光环旋转悬浮球 -->
          <button class="ot-floating-launcher" id="ot-launcher-btn" title="OfferTong 校招简历助手 (点击展开/拖动位置)">
            <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </button>
        </div>

      </div>

      <!-- ==========================================================================
           核心杀手级功能：简历小助手 (Resume Assistant 悬浮窗)
           ========================================================================== -->
      <div class="ot-resume-assistant" id="ot-resume-assistant" data-visible="false">
        
        <!-- 助手顶栏 (支持全屏自由平滑拖拽) -->
        <header class="ot-resume-assistant__header" id="ot-assistant-drag-header">
          <div class="ot-resume-assistant__title">
            <strong>📋 简历小助手 (Resume Assistant)</strong>
            <small>点击/拖拽字段直接注入网页输入框，支持多选批量注入与编辑</small>
          </div>
          <div class="ot-resume-assistant__controls">
            <div class="ot-mode-pill" id="ot-assistant-mode-pill" title="切换操作模式">
              <button type="button" class="active" id="ot-mode-inject-btn" data-mode="inject">⚡ 注入</button>
              <button type="button" id="ot-mode-edit-btn" data-mode="edit">✏️ 编辑</button>
            </div>
            <button class="ot-resume-assistant__icon-button" id="ot-assistant-hub-btn" title="🛠️ 修正内容与补充更多信息">🛠️</button>
            <button class="ot-resume-assistant__icon-button" id="ot-assistant-add-btn" title="新增自定义简历字段">➕</button>
            <button class="ot-resume-assistant__icon-button" id="ot-assistant-sync-btn" title="从本地服务同步简历">🔄</button>
            <button class="ot-resume-assistant__icon-button" id="ot-assistant-reset-btn" title="复位悬浮窗位置">🎯</button>
            <button class="ot-resume-assistant__icon-button" id="ot-assistant-close-btn" title="关闭助手">✕</button>
          </div>
        </header>

        <!-- 实时焦点感知条 -->
        <div class="ot-resume-assistant__status">
          <div class="ot-resume-assistant__focus-info" id="ot-assistant-focus-info">
            <span class="ot-resume-assistant__focus-inactive">⚪ 拖拽字段注入，或点击复制</span>
            <div class="ot-focus-action-group">
              <button type="button" class="ot-focus-action-btn" id="ot-btn-quick-correct" title="选择字段修正内容">📝 修正内容</button>
              <button type="button" class="ot-focus-action-btn" id="ot-btn-quick-supp" title="补充更多经历或自定义信息">➕ 补充信息</button>
            </div>
          </div>
          <span class="ot-resume-assistant__fill-stats" id="ot-assistant-field-count">共 68 个可用字段</span>
        </div>

        <!-- 助手中部双栏：左 TOC 目录 + 右字段分组 -->
        <div class="ot-resume-assistant__body">
          <!-- 左侧目录导航 -->
          <nav class="ot-resume-assistant__toc" id="ot-assistant-toc">
            <strong>分类导航</strong>
            <button type="button" class="active" data-group="basic">👤 基本信息</button>
            <button type="button" data-group="intent">🎯 求职意向</button>
            <button type="button" data-group="edu">🎓 教育经历</button>
            <button type="button" data-group="internship">💼 实习经历</button>
            <button type="button" data-group="project">🚀 科研项目</button>
            <button type="button" data-group="award">🏆 竞赛荣誉</button>
            <button type="button" data-group="cert">📜 技能证书</button>
            <button type="button" data-group="family">👨‍👩‍👦 家庭成员</button>
            <button type="button" data-group="qa">✍️ 评价问答</button>
            <button type="button" data-group="supp">✏️ 补充信息</button>
          </nav>

          <!-- 右侧卡片芯片容器 -->
          <div class="ot-resume-assistant__groups" id="ot-assistant-groups"></div>
        </div>

        <!-- 底部多选批量操作条 -->
        <div class="ot-assistant-selection-bar" id="ot-assistant-selection-bar" data-visible="false">
          <div class="ot-selection-bar-info">
            <span class="ot-selection-bar-badge" id="ot-selection-count">0</span>
            <span id="ot-selection-label">已选 0 个字段</span>
          </div>
          <div class="ot-selection-bar-actions">
            <div class="ot-selection-drag-handle" id="ot-selection-drag-handle" draggable="true" title="按住拖拽至网页输入框批量填入">
              <span>✋ 拖拽批量注入</span>
            </div>
            <button type="button" class="ot-selection-clear-btn" id="ot-selection-clear-btn" title="清空已选字段">清空</button>
          </div>
        </div>

        <!-- 右下角尺寸缩放手柄 -->
        <div class="ot-resume-assistant__resize-handle" id="ot-assistant-resize-handle"></div>
      </div>

      <!-- 全屏居中进度指示条 -->
      <div class="ot-autofill-progress-overlay" id="ot-progress-overlay">
        <span id="ot-overlay-step">正在识别网申表单...</span>
        <strong id="ot-overlay-count">0/0</strong>
        <i class="bar"><i class="fill" id="ot-overlay-bar" style="width: 0%;"></i></i>
      </div>

      <!-- 字段悬浮预览浮窗 (Tooltip) -->
      <div class="ot-tooltip" id="ot-field-tooltip"></div>

      <!-- 字段编辑模态弹窗 -->
      <div class="ot-editor-overlay" id="ot-field-editor-overlay" data-visible="false">
        <div class="ot-editor-card">
          <div class="ot-editor-card__header">
            <h3 id="ot-editor-modal-title">✏️ 编辑简历信息</h3>
            <button type="button" class="ot-editor-card__close" id="ot-editor-close-btn">✕</button>
          </div>
          <div class="ot-editor-card__body">
            <div class="ot-editor-form-group">
              <label for="ot-editor-field-key">字段名称</label>
              <input type="text" class="ot-editor-input" id="ot-editor-field-key" placeholder="如：姓名、手机号码、技术特长" />
            </div>
            <div class="ot-editor-form-group">
              <label for="ot-editor-field-val">字段内容 / 注入值</label>
              <textarea class="ot-editor-textarea" id="ot-editor-field-val" placeholder="填写对应的真实简历内容"></textarea>
            </div>
            <div class="ot-editor-tip">
              <span>💡 保存后将即时更新小助手并持久化同步至本地配置文件</span>
            </div>
          </div>
          <div class="ot-editor-card__footer">
            <button type="button" class="ot-editor-btn ot-editor-btn--delete" id="ot-editor-delete-btn" style="display: none;">🗑️ 删除</button>
            <button type="button" class="ot-editor-btn ot-editor-btn--cancel" id="ot-editor-cancel-btn">取消</button>
            <button type="button" class="ot-editor-btn ot-editor-btn--save" id="ot-editor-save-btn">💾 保存并同步</button>
          </div>
        </div>
      </div>

      <!-- 修正内容与补充更多信息中心 (Correction & Supplement Center) -->
      <div class="ot-editor-overlay" id="ot-correct-supp-overlay" data-visible="false">
        <div class="ot-cs-card">
          <header class="ot-cs-card__header">
            <div class="ot-cs-tabs">
              <button type="button" class="ot-cs-tab active" id="ot-cs-tab-correct" data-tab="correct">🛠️ 修正内容</button>
              <button type="button" class="ot-cs-tab" id="ot-cs-tab-supp" data-tab="supp">➕ 补充更多信息</button>
            </div>
            <button type="button" class="ot-editor-card__close" id="ot-cs-close-btn">✕</button>
          </header>

          <div class="ot-cs-card__body">
            <!-- 模块 1：修正内容 (Correction) -->
            <div id="ot-cs-pane-correct">
              <!-- 快捷从网页当前输入框抓取修正 -->
              <div class="ot-quick-detected-box" id="ot-detected-box" style="display: none;">
                <div class="ot-quick-detected-head">
                  <span>检测到当前网页输入框：<strong id="ot-detected-label">未知</strong></span>
                  <small style="color: var(--ot-ink-secondary);">可一键提取填入值修正回简历</small>
                </div>
                <div class="ot-quick-detected-input">
                  <input type="text" class="ot-editor-input" id="ot-detected-val" placeholder="网页输入框中当前填入的内容" />
                  <button type="button" class="ot-editor-btn ot-editor-btn--save" id="ot-btn-accept-detected" style="white-space: nowrap;">提取并修正</button>
                </div>
              </div>

              <!-- 自主选择简历字段并修正 -->
              <div class="ot-editor-form-group" style="margin-top: 10px;">
                <label for="ot-correct-field-select">选择需要修正的简历字段：</label>
                <select class="ot-editor-select" id="ot-correct-field-select"></select>
              </div>

              <div class="ot-editor-form-group">
                <label for="ot-correct-field-val">修正后的内容 / 正确值：</label>
                <textarea class="ot-editor-textarea" id="ot-correct-field-val" placeholder="请输入修正后的正确内容"></textarea>
              </div>

              <div class="ot-editor-tip">
                <span>💡 修正后不仅会即时生效，还会同步回写入本地简历配置文件</span>
              </div>
            </div>

            <!-- 模块 2：补充更多信息 (Supplement) -->
            <div id="ot-cs-pane-supp" style="display: none;">
              <div class="ot-supp-type-bar" id="ot-supp-type-bar">
                <button type="button" class="ot-supp-type-btn active" data-type="internship">💼 补充实习经历</button>
                <button type="button" class="ot-supp-type-btn" data-type="project">🚀 补充项目经历</button>
                <button type="button" class="ot-supp-type-btn" data-type="award">🏆 补充获奖荣誉</button>
                <button type="button" class="ot-supp-type-btn" data-type="family">👨‍👩‍👦 补充家庭成员</button>
                <button type="button" class="ot-supp-type-btn" data-type="custom">✏️ 补充自定义字段</button>
              </div>

              <!-- 动态表单区域 -->
              <div id="ot-supp-form-fields" style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
          </div>

          <footer class="ot-editor-card__footer">
            <button type="button" class="ot-editor-btn ot-editor-btn--cancel" id="ot-cs-cancel-btn">取消</button>
            <button type="button" class="ot-editor-btn ot-editor-btn--save" id="ot-cs-save-btn">💾 确认保存并同步</button>
          </footer>
        </div>
      </div>

      <!-- 拖拽幽灵跟手徽章 -->
      <div class="ot-drag-ghost-badge" id="ot-drag-ghost-badge">
        <span class="badge-icon">📋</span>
        <span class="badge-title"></span>: 
        <span class="badge-val"></span>
      </div>
    `;

      document.body.appendChild(root);

      // 绑定交互事件
      bindUIEvents();
      renderAssistantFields();
      updateAssistantFocusUI(false, '');
    }

    // ==========================================================================
    // 5. 交互事件与逻辑绑定
    // ==========================================================================

    function bindUIEvents() {
      const shell = document.getElementById('ot-floating-shell');
      const launcherBtn = document.getElementById('ot-launcher-btn');
      const panelAnchor = document.getElementById('ot-panel-anchor');
      const panelCloseBtn = document.getElementById('ot-panel-close-btn');
      const panelStatus = document.getElementById('ot-panel-status');
      const btnFillAll = document.getElementById('ot-btn-fill-all');
      const btnOpenAssistant = document.getElementById('ot-btn-open-assistant');
      const btnJumpAssistant = document.getElementById('ot-btn-jump-assistant');

      const menuTrigger = document.getElementById('ot-launcher-menu-trigger');
      const launcherMenu = document.getElementById('ot-launcher-menu');
      const menuTogglePanel = document.getElementById('ot-menu-toggle-panel');
      const menuOpenAssistant = document.getElementById('ot-menu-open-assistant');
      const menuFillNow = document.getElementById('ot-menu-fill-now');
      const menuSync = document.getElementById('ot-menu-sync');
      const menuOpenOptions = document.getElementById('ot-menu-open-options');
      const menuDisableSite = document.getElementById('ot-menu-disable-site');

      const assistant = document.getElementById('ot-resume-assistant');
      const assistantCloseBtn = document.getElementById('ot-assistant-close-btn');
      const assistantResetBtn = document.getElementById('ot-assistant-reset-btn');
      const assistantSyncBtn = document.getElementById('ot-assistant-sync-btn');
      const assistantDragHeader = document.getElementById('ot-assistant-drag-header');
      const assistantResizeHandle = document.getElementById('ot-assistant-resize-handle');

      // 1) 悬浮球自由平滑拖拽
      let isDraggingLauncher = false;
      let launcherStartX = 0;
      let launcherStartY = 0;
      let startRight = 28;
      let startBottom = 28;
      let hasMovedLauncher = false;

      // 读取上次保存的位置
      Storage.get(STORAGE_KEY_POS, null).then(pos => {
        if (pos && typeof pos.right === 'number' && typeof pos.bottom === 'number') {
          shell.style.right = `${pos.right}px`;
          shell.style.bottom = `${pos.bottom}px`;
        }
      });

      launcherBtn.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        isDraggingLauncher = true;
        hasMovedLauncher = false;
        launcherStartX = e.clientX;
        launcherStartY = e.clientY;

        const rect = shell.getBoundingClientRect();
        startRight = window.innerWidth - rect.right;
        startBottom = window.innerHeight - rect.bottom;
        shell.setAttribute('data-dragging', 'true');
        launcherBtn.setPointerCapture(e.pointerId);
      });

      launcherBtn.addEventListener('pointermove', (e) => {
        if (!isDraggingLauncher) return;
        const dx = e.clientX - launcherStartX;
        const dy = e.clientY - launcherStartY;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMovedLauncher = true;
        }

        if (hasMovedLauncher) {
          let newRight = startRight - dx;
          let newBottom = startBottom - dy;

          newRight = Math.max(10, Math.min(window.innerWidth - 65, newRight));
          newBottom = Math.max(10, Math.min(window.innerHeight - 65, newBottom));

          shell.style.right = `${newRight}px`;
          shell.style.bottom = `${newBottom}px`;
        }
      });

      const stopLauncherDrag = (e) => {
        if (isDraggingLauncher) {
          isDraggingLauncher = false;
          shell.setAttribute('data-dragging', 'false');
          try { launcherBtn.releasePointerCapture(e.pointerId); } catch (err) { }

          if (hasMovedLauncher) {
            // 保存拖拽后位置
            const rect = shell.getBoundingClientRect();
            const r = Math.round(window.innerWidth - rect.right);
            const b = Math.round(window.innerHeight - rect.bottom);
            Storage.set(STORAGE_KEY_POS, { right: r, bottom: b });
          } else {
            // 单击：切换面板展开/收起
            togglePanel();
          }
        }
      };

      launcherBtn.addEventListener('pointerup', stopLauncherDrag);
      launcherBtn.addEventListener('pointercancel', stopLauncherDrag);

      // 2) 悬浮面板展开收起
      function togglePanel() {
        const isExp = panelAnchor.getAttribute('data-expanded') === 'true';
        panelAnchor.setAttribute('data-expanded', isExp ? 'false' : 'true');
      }

      panelCloseBtn.addEventListener('click', () => {
        panelAnchor.setAttribute('data-expanded', 'false');
      });

      // 3) 悬浮球快捷控制器菜单
      menuTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVis = launcherMenu.getAttribute('data-visible') === 'true';
        launcherMenu.setAttribute('data-visible', isVis ? 'false' : 'true');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#ot-launcher-controls')) {
          launcherMenu.setAttribute('data-visible', 'false');
        }
      });

      menuTogglePanel.addEventListener('click', () => {
        launcherMenu.setAttribute('data-visible', 'false');
        togglePanel();
      });

      menuOpenAssistant.addEventListener('click', () => {
        launcherMenu.setAttribute('data-visible', 'false');
        openAssistant();
      });

      menuFillNow.addEventListener('click', () => {
        launcherMenu.setAttribute('data-visible', 'false');
        triggerAutofill();
      });

      menuSync.addEventListener('click', () => {
        launcherMenu.setAttribute('data-visible', 'false');
        syncFromPythonServer();
      });

      menuOpenOptions.addEventListener('click', () => {
        launcherMenu.setAttribute('data-visible', 'false');
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'), '_blank');
        }
      });

      // 禁用当前网站
      menuDisableSite.addEventListener('click', async () => {
        launcherMenu.setAttribute('data-visible', 'false');
        const host = window.location.hostname;
        if (confirm(`确定要在当前网站 (${host}) 禁用 OfferTong 悬浮球吗？\n禁用后悬浮球将不再在此网站显示，您可以在插件设置中心随时恢复。`)) {
          const sites = await Storage.get(STORAGE_KEY_DISABLED, []);
          if (!sites.includes(host)) {
            sites.push(host);
            await Storage.set(STORAGE_KEY_DISABLED, sites);
          }
          shell.style.display = 'none';
          assistant.style.display = 'none';
          showToast(`🚫 已在 ${host} 禁用浮动球，可在设置中心恢复`);
        }
      });

      // 4) 核心按钮触发：一键智能填简历
      function triggerAutofill() {
        panelStatus.innerText = '填写中';
        panelStatus.setAttribute('data-tone', 'processing');

        const procBox = document.getElementById('ot-processing-box');
        const procStep = document.getElementById('ot-proc-step');
        const procCount = document.getElementById('ot-proc-count');
        const procBar = document.getElementById('ot-proc-bar');

        const summaryBox = document.getElementById('ot-summary-box');
        const summaryRing = document.getElementById('ot-summary-ring');
        const summaryPct = document.getElementById('ot-summary-pct');
        const summaryTitle = document.getElementById('ot-summary-title');
        const incompleteNotice = document.getElementById('ot-incomplete-notice');

        const overlay = document.getElementById('ot-progress-overlay');
        const overlayStep = document.getElementById('ot-overlay-step');
        const overlayCount = document.getElementById('ot-overlay-count');
        const overlayBar = document.getElementById('ot-overlay-bar');

        procBox.setAttribute('data-active', 'true');
        summaryBox.setAttribute('data-active', 'false');
        incompleteNotice.style.display = 'none';
        overlay.setAttribute('data-visible', 'true');

        setTimeout(() => {
          const { scannedCount, filledCount } = runAutoFill((curr, total, pct, lbl) => {
            procStep.innerText = `正在匹配: ${lbl}`;
            procCount.innerText = `${curr}/${total}`;
            procBar.style.width = `${pct}%`;

            overlayStep.innerText = `正在识别填写: ${lbl}`;
            overlayCount.innerText = `${curr}/${total}`;
            overlayBar.style.width = `${pct}%`;
          });

          // 完成处理
          setTimeout(() => {
            overlay.setAttribute('data-visible', 'false');
            procBox.setAttribute('data-active', 'false');

            const finalPct = scannedCount > 0 ? Math.round((filledCount / scannedCount) * 100) : 100;
            const deg = Math.round((finalPct / 100) * 360);

            summaryBox.setAttribute('data-active', 'true');
            summaryRing.style.setProperty('--ot-ring-fill', `${deg}deg`);
            summaryPct.innerText = `${finalPct}%`;
            summaryTitle.innerText = `成功填入 ${filledCount}/${scannedCount} 项`;

            panelStatus.innerText = finalPct === 100 ? '已填完' : '部分完成';
            panelStatus.setAttribute('data-tone', finalPct === 100 ? 'success' : 'brand');

            showToast(`⚡ 一键填表完成！成功填入 ${filledCount} 个字段 (${finalPct}%)`);

            // 若未满 100% 且开启了智能提醒模式，自动呼出简历小助手
            if (finalPct < 100) {
              incompleteNotice.style.display = 'flex';
              if (userPrefs.autoOpenSidebarOnIncomplete) {
                setTimeout(() => {
                  openAssistant();
                  showToast('💡 已为您自动展开【简历小助手】，方便光标点中输入框快速补填！', 3000);
                }, 600);
              }
            }
          }, 300);
        }, 100);
      }

      btnFillAll.addEventListener('click', triggerAutofill);

      // 5) 打开简历小助手
      function openAssistant() {
        assistant.setAttribute('data-visible', 'true');
        panelAnchor.setAttribute('data-expanded', 'false');
      }

      function closeAssistant() {
        assistant.setAttribute('data-visible', 'false');
      }

      btnOpenAssistant.addEventListener('click', openAssistant);
      btnJumpAssistant.addEventListener('click', openAssistant);
      assistantCloseBtn.addEventListener('click', closeAssistant);

      // 助手平滑拖拽移动
      makeElementDraggable(assistant, assistantDragHeader);

      // 复位居中
      assistantResetBtn.addEventListener('click', () => {
        assistant.style.right = '60px';
        assistant.style.bottom = '80px';
        assistant.style.left = '';
        assistant.style.top = '';
        showToast('🎯 简历小助手已复位');
      });

      assistantSyncBtn.addEventListener('click', () => {
        syncFromPythonServer();
      });

      // 助手右下角缩放
      let isResizing = false;
      let resizeStartX = 0;
      let resizeStartY = 0;
      let startW = 0;
      let startH = 0;

      assistantResizeHandle.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        startW = assistant.offsetWidth;
        startH = assistant.offsetHeight;
        assistantResizeHandle.setPointerCapture(e.pointerId);
      });

      assistantResizeHandle.addEventListener('pointermove', (e) => {
        if (!isResizing) return;
        const dw = e.clientX - resizeStartX;
        const dh = e.clientY - resizeStartY;
        assistant.style.width = `${Math.max(380, startW + dw)}px`;
        assistant.style.height = `${Math.max(400, startH + dh)}px`;
      });

      const stopResize = (e) => {
        if (isResizing) {
          isResizing = false;
          try { assistantResizeHandle.releasePointerCapture(e.pointerId); } catch (err) { }
        }
      };
      assistantResizeHandle.addEventListener('pointerup', stopResize);
      assistantResizeHandle.addEventListener('pointercancel', stopResize);

      // 6) 切换当前简历版本
      const resumeNameEl = document.getElementById('ot-active-resume-name');
      resumeNameEl.addEventListener('click', async () => {
        try {
          const resp = await fetch(`${SERVER_URL}/api/profiles`);
          if (resp.ok) {
            const json = await resp.json();
            if (json.profiles && json.profiles.length > 1) {
              const nextProf = json.profiles.find(p => !p.is_active) || json.profiles[0];
              await fetch(`${SERVER_URL}/api/profile/switch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile_id: nextProf.id })
              });
              await syncFromPythonServer();
              showToast(`🔄 已切换至简历：${nextProf.name}`);
              return;
            }
          }
        } catch (e) { }
        showToast('当前已是默认校招简历');
      });

      // 助手模式切换：注入模式 / 编辑模式
      const modeInjectBtn = document.getElementById('ot-mode-inject-btn');
      const modeEditBtn = document.getElementById('ot-mode-edit-btn');
      if (modeInjectBtn && modeEditBtn) {
        modeInjectBtn.addEventListener('click', () => {
          assistantMode = 'inject';
          modeInjectBtn.classList.add('active');
          modeEditBtn.classList.remove('active');
          assistant.setAttribute('data-mode', 'inject');
          showToast('⚡ 已切换为【注入模式】：可单击或拖拽字段直接注入网页输入框！');
        });
        modeEditBtn.addEventListener('click', () => {
          assistantMode = 'edit';
          modeEditBtn.classList.add('active');
          modeInjectBtn.classList.remove('active');
          assistant.setAttribute('data-mode', 'edit');
          showToast('✏️ 已切换为【编辑模式】：点击任意字段即可修改简历信息并保存！');
        });
      }

      // 顶部新增自定义字段按钮
      const addFieldBtn = document.getElementById('ot-assistant-add-btn');
      if (addFieldBtn) {
        addFieldBtn.addEventListener('click', () => {
          openFieldEditor({ key: '', val: '', isNew: true, isCustom: true });
        });
      }

      // 底部多选清空
      const selectionClearBtn = document.getElementById('ot-selection-clear-btn');
      if (selectionClearBtn) {
        selectionClearBtn.addEventListener('click', () => {
          clearFieldSelection();
        });
      }

      // 底部批量拖拽手柄
      const selectionDragHandle = document.getElementById('ot-selection-drag-handle');
      if (selectionDragHandle) {
        selectionDragHandle.addEventListener('dragstart', (e) => {
          if (selectedFieldsMap.size === 0) {
            e.preventDefault();
            return;
          }
          const items = Array.from(selectedFieldsMap.values());
          currentDragPayload = { items, isBatch: true };
          e.dataTransfer.setData('text/plain', items.map(i => `${i.key}: ${i.val}`).join('\n'));
          try {
            e.dataTransfer.setData('application/json', JSON.stringify(currentDragPayload));
          } catch (err) { }
          e.dataTransfer.effectAllowed = 'copyMove';

          const ghostBadge = document.getElementById('ot-drag-ghost-badge');
          if (ghostBadge) {
            ghostBadge.querySelector('.badge-title').innerText = `已选 ${items.length} 个字段`;
            ghostBadge.querySelector('.badge-val').innerText = items.map(i => i.key).slice(0, 3).join(', ') + '...';
          }
        });

        selectionDragHandle.addEventListener('dragend', () => {
          currentDragPayload = null;
          document.querySelectorAll('.ot-drop-hover').forEach(el => el.classList.remove('ot-drop-hover'));
        });
      }

      // 编辑弹窗事件绑定
      const editorOverlay = document.getElementById('ot-field-editor-overlay');
      const editorCloseBtn = document.getElementById('ot-editor-close-btn');
      const editorCancelBtn = document.getElementById('ot-editor-cancel-btn');
      const editorSaveBtn = document.getElementById('ot-editor-save-btn');
      const editorDeleteBtn = document.getElementById('ot-editor-delete-btn');

      if (editorCloseBtn) editorCloseBtn.addEventListener('click', closeFieldEditor);
      if (editorCancelBtn) editorCancelBtn.addEventListener('click', closeFieldEditor);
      if (editorSaveBtn) editorSaveBtn.addEventListener('click', saveFieldEditor);
      if (editorDeleteBtn) editorDeleteBtn.addEventListener('click', deleteFieldEditor);

      if (editorOverlay) {
        editorOverlay.addEventListener('click', (e) => {
          if (e.target === editorOverlay) closeFieldEditor();
        });
      }

      // 修正与补充中心 (Correction & Supplement Center)
      const btnOpenHub = document.getElementById('ot-btn-open-hub');
      const assistantHubBtn = document.getElementById('ot-assistant-hub-btn');
      const csOverlay = document.getElementById('ot-correct-supp-overlay');
      const csCloseBtn = document.getElementById('ot-cs-close-btn');
      const csCancelBtn = document.getElementById('ot-cs-cancel-btn');
      const csSaveBtn = document.getElementById('ot-cs-save-btn');
      const tabCorrect = document.getElementById('ot-cs-tab-correct');
      const tabSupp = document.getElementById('ot-cs-tab-supp');
      const btnAcceptDetected = document.getElementById('ot-btn-accept-detected');
      const correctSelect = document.getElementById('ot-correct-field-select');

      if (btnOpenHub) {
        btnOpenHub.addEventListener('click', () => {
          openCorrectionSupplementHub('correct');
        });
      }
      if (assistantHubBtn) {
        assistantHubBtn.addEventListener('click', () => {
          openCorrectionSupplementHub('correct');
        });
      }
      if (csCloseBtn) csCloseBtn.addEventListener('click', closeCorrectionSupplementHub);
      if (csCancelBtn) csCancelBtn.addEventListener('click', closeCorrectionSupplementHub);
      if (csSaveBtn) csSaveBtn.addEventListener('click', saveCorrectionSupplementHub);
      if (csOverlay) {
        csOverlay.addEventListener('click', (e) => {
          if (e.target === csOverlay) closeCorrectionSupplementHub();
        });
      }
      if (tabCorrect) tabCorrect.addEventListener('click', () => switchHubTab('correct'));
      if (tabSupp) tabSupp.addEventListener('click', () => switchHubTab('supp'));

      if (btnAcceptDetected) {
        btnAcceptDetected.addEventListener('click', () => {
          const detectedValInput = document.getElementById('ot-detected-val');
          const correctValArea = document.getElementById('ot-correct-field-val');
          if (detectedValInput && correctValArea) {
            correctValArea.value = detectedValInput.value || '';
            correctValArea.focus();
            showToast('📥 已将当前网页输入框内容提取到修正编辑区！');
          }
        });
      }

      if (correctSelect) {
        correctSelect.addEventListener('change', updateCorrectValFromSelect);
      }

      const suppTypeBar = document.getElementById('ot-supp-type-bar');
      if (suppTypeBar) {
        suppTypeBar.querySelectorAll('.ot-supp-type-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            suppTypeBar.querySelectorAll('.ot-supp-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.getAttribute('data-type');
            renderSuppForm(type);
          });
        });
      }

      // 全局拖拽目标识别与注入监听 (HTML5 Drag & Drop Target Handlers)
      document.addEventListener('dragover', (e) => {
        if (!currentDragPayload) return;
        const target = e.target.closest('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select, [contenteditable="true"]');
        const root = document.getElementById('ot-root');

        if (target && (!root || !root.contains(target))) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';

          if (!target.classList.contains('ot-drop-hover')) {
            document.querySelectorAll('.ot-drop-hover').forEach(el => el.classList.remove('ot-drop-hover'));
            target.classList.add('ot-drop-hover');
          }
        } else {
          document.querySelectorAll('.ot-drop-hover').forEach(el => el.classList.remove('ot-drop-hover'));
        }
      });

      document.addEventListener('dragleave', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('ot-drop-hover')) {
          e.target.classList.remove('ot-drop-hover');
        }
      });

      document.addEventListener('drop', (e) => {
        if (!currentDragPayload) return;
        const root = document.getElementById('ot-root');
        const target = e.target.closest('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select, [contenteditable="true"]');

        if (target && (!root || !root.contains(target))) {
          e.preventDefault();
          e.stopPropagation();
          target.classList.remove('ot-drop-hover');

          const { items, isBatch } = currentDragPayload;

          if (!isBatch || items.length === 1) {
            // 单个字段拖拽注入
            const item = items[0];
            setNativeInputValue(target, item.val);
            target.classList.remove('ot-filled-highlight');
            void target.offsetWidth;
            target.classList.add('ot-filled-highlight');
            showToast(`🎉 已成功将【${item.key}】拖拽注入目标输入框！`);
          } else {
            // 多个选定字段依次注入当前表单输入框
            const form = target.closest('form') || document.body;
            const allInputs = Array.from(form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'))
              .filter(el => (!root || !root.contains(el)) && el.offsetParent !== null);

            let startIndex = allInputs.indexOf(target);
            if (startIndex === -1) startIndex = 0;

            let injectedCount = 0;
            items.forEach((item, i) => {
              const tgt = allInputs[startIndex + i];
              if (tgt) {
                setNativeInputValue(tgt, item.val);
                tgt.classList.remove('ot-filled-highlight');
                void tgt.offsetWidth;
                tgt.classList.add('ot-filled-highlight');
                injectedCount++;
              }
            });

            showToast(`⚡ 已成功将选定的 ${injectedCount} 个字段依次注入表单！`);
          }
        }

        currentDragPayload = null;
        document.querySelectorAll('.ot-drop-hover').forEach(el => el.classList.remove('ot-drop-hover'));
      });

      document.addEventListener('dragend', () => {
        currentDragPayload = null;
        document.querySelectorAll('.ot-drop-hover').forEach(el => el.classList.remove('ot-drop-hover'));
      });

      // 快捷键 Alt+F 唤醒简历小助手
      document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'f' || e.key === 'F')) {
          e.preventDefault();
          const isVis = assistant.getAttribute('data-visible') === 'true';
          if (isVis) closeAssistant(); else openAssistant();
        }
      });
    }

    // 通用平滑拖拽封装
    function makeElementDraggable(targetEl, handleEl) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let initialLeft = 0;
      let initialTop = 0;

      handleEl.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('button, .ot-mode-pill, input, select, textarea')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = targetEl.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // 切换为 left / top 定位
        targetEl.style.left = `${initialLeft}px`;
        targetEl.style.top = `${initialTop}px`;
        targetEl.style.right = 'auto';
        targetEl.style.bottom = 'auto';

        handleEl.setPointerCapture(e.pointerId);
      });

      handleEl.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const newLeft = Math.max(10, Math.min(window.innerWidth - targetEl.offsetWidth - 10, initialLeft + dx));
        const newTop = Math.max(10, Math.min(window.innerHeight - targetEl.offsetHeight - 10, initialTop + dy));

        targetEl.style.left = `${newLeft}px`;
        targetEl.style.top = `${newTop}px`;
      });

      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try { handleEl.releasePointerCapture(e.pointerId); } catch (err) { }
        }
      };
      handleEl.addEventListener('pointerup', stopDrag);
      handleEl.addEventListener('pointercancel', stopDrag);
    }

    // ==========================================================================
    // 6. 简历小助手状态管理、全量字段渲染与编辑同步系统
    // ==========================================================================

    // 助手操作模式：'inject' (注入/选择模式) | 'edit' (编辑模式)
    let assistantMode = 'inject';
    // 当前多选暂存集合 Map<key, { key, val, path, isCustom }>
    const selectedFieldsMap = new Map();
    // 当前拖拽数据：{ items: [{ key, val, path, isCustom }], isBatch: boolean }
    let currentDragPayload = null;
    // 当前正在编辑的字段上下文
    let currentEditingContext = null;

    // 深入对象读取/写入属性助手
    function getNestedValue(obj, path) {
      if (!obj || !path) return undefined;
      let curr = obj;
      for (const k of path) {
        if (curr === undefined || curr === null) return undefined;
        curr = curr[k];
      }
      return curr;
    }

    function setNestedValue(obj, path, val) {
      if (!obj || !path || path.length === 0) return;
      let curr = obj;
      for (let i = 0; i < path.length - 1; i++) {
        const k = path[i];
        if (curr[k] === undefined || curr[k] === null || typeof curr[k] !== 'object') {
          curr[k] = typeof path[i + 1] === 'number' ? [] : {};
        }
        curr = curr[k];
      }
      curr[path[path.length - 1]] = val;
    }

    // 字段编辑浮层呼出
    function openFieldEditor(context) {
      currentEditingContext = context;
      const overlay = document.getElementById('ot-field-editor-overlay');
      const titleEl = document.getElementById('ot-editor-modal-title');
      const keyInput = document.getElementById('ot-editor-field-key');
      const valTextarea = document.getElementById('ot-editor-field-val');
      const deleteBtn = document.getElementById('ot-editor-delete-btn');

      if (!overlay || !keyInput || !valTextarea) return;

      if (context.isNew) {
        titleEl.innerText = '➕ 新增自定义简历字段';
        keyInput.value = '';
        keyInput.removeAttribute('readonly');
        keyInput.focus();
        valTextarea.value = '';
        if (deleteBtn) deleteBtn.style.display = 'none';
      } else {
        titleEl.innerText = `✏️ 编辑字段：${context.key}`;
        keyInput.value = context.key || '';
        valTextarea.value = context.val !== undefined && context.val !== null ? String(context.val) : '';
        if (context.isCustom) {
          keyInput.removeAttribute('readonly');
          if (deleteBtn) deleteBtn.style.display = 'block';
        } else {
          if (deleteBtn) deleteBtn.style.display = 'none';
        }
        valTextarea.focus();
      }

      overlay.setAttribute('data-visible', 'true');
    }

    function closeFieldEditor() {
      const overlay = document.getElementById('ot-field-editor-overlay');
      if (overlay) overlay.setAttribute('data-visible', 'false');
      currentEditingContext = null;
    }

    async function saveFieldEditor() {
      if (!currentEditingContext) return;
      const keyInput = document.getElementById('ot-editor-field-key');
      const valTextarea = document.getElementById('ot-editor-field-val');
      const newKey = (keyInput.value || '').trim();
      const newVal = valTextarea.value || '';

      if (!newKey) {
        showToast('⚠️ 字段名称不能为空');
        keyInput.focus();
        return;
      }

      if (currentEditingContext.isNew) {
        if (!currentProfileData.supplement) currentProfileData.supplement = [];
        currentProfileData.supplement.push({ key: newKey, value: newVal });
      } else if (currentEditingContext.path) {
        if (currentEditingContext.path[0] === 'supplement') {
          const idx = currentEditingContext.path[1];
          if (currentProfileData.supplement && currentProfileData.supplement[idx]) {
            currentProfileData.supplement[idx] = { key: newKey, value: newVal };
          }
        } else {
          setNestedValue(currentProfileData, currentEditingContext.path, newVal);
        }
      } else {
        if (!currentProfileData.supplement) currentProfileData.supplement = [];
        currentProfileData.supplement.push({ key: newKey, value: newVal });
      }

      // 持久化存储到本地缓存与本地服务端
      await Storage.set('ot_candidate_profile', currentProfileData);
      try {
        await fetch(`${SERVER_URL}/api/profile/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: currentProfileData })
        });
      } catch (err) { }

      // 重新渲染助手芯片
      renderAssistantFields();
      closeFieldEditor();
      showToast(`✅ 字段【${newKey}】信息已成功保存并同步！`);
    }

    async function deleteFieldEditor() {
      if (!currentEditingContext) return;
      if (currentEditingContext.path && currentEditingContext.path[0] === 'supplement') {
        const idx = currentEditingContext.path[1];
        if (currentProfileData.supplement) {
          currentProfileData.supplement.splice(idx, 1);
          await Storage.set('ot_candidate_profile', currentProfileData);
          try {
            await fetch(`${SERVER_URL}/api/profile/save`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: currentProfileData })
            });
          } catch (err) { }
          renderAssistantFields();
          closeFieldEditor();
          showToast('🗑️ 该自定义字段已删除');
        }
      }
    }

    // ==========================================================================
    // 6.2 修正内容与补充更多信息中心 (Correction & Supplement Center) 逻辑
    // ==========================================================================

    let currentHubTab = 'correct';
    let currentSuppType = 'internship';

    function getAllFlatProfileFields() {
      const list = [];
      const b = currentProfileData.basic || {};
      const edu = currentProfileData.education || {};
      const jEdu = currentProfileData.junior_college_education || {};
      const hEdu = currentProfileData.high_school_education || {};
      const skl = currentProfileData.skills_and_languages || {};

      // 1. 基本信息与求职意向
      [
        { label: '基本信息 · 姓名', path: ['basic', 'name'], val: b.name },
        { label: '基本信息 · 性别', path: ['basic', 'gender'], val: b.gender },
        { label: '基本信息 · 出生日期', path: ['basic', 'birthday'], val: b.birthday },
        { label: '基本信息 · 身份证号', path: ['basic', 'id_card'], val: b.id_card },
        { label: '基本信息 · 手机号码', path: ['basic', 'phone'], val: b.phone },
        { label: '基本信息 · 电子邮箱', path: ['basic', 'email'], val: b.email },
        { label: '基本信息 · 民族', path: ['basic', 'ethnicity'], val: b.ethnicity },
        { label: '基本信息 · 政治面貌', path: ['basic', 'political_status'], val: b.political_status },
        { label: '基本信息 · 籍贯', path: ['basic', 'native_place'], val: b.native_place },
        { label: '基本信息 · 户口所在地', path: ['basic', 'hukou'], val: b.hukou },
        { label: '基本信息 · 现居城市', path: ['basic', 'current_city'], val: b.current_city },
        { label: '基本信息 · 详细通讯地址', path: ['basic', 'address'], val: b.address },
        { label: '基本信息 · 邮编', path: ['basic', 'postal_code'], val: b.postal_code },
        { label: '基本信息 · 紧急联系人姓名', path: ['basic', 'emergency_contact_name'], val: b.emergency_contact_name },
        { label: '基本信息 · 紧急联系人电话', path: ['basic', 'emergency_contact_phone'], val: b.emergency_contact_phone },
        { label: '基本信息 · 紧急联系人关系', path: ['basic', 'emergency_contact_relation'], val: b.emergency_contact_relation },
        { label: '基本信息 · 身高(cm)', path: ['basic', 'height'], val: b.height },
        { label: '基本信息 · 体重(kg)', path: ['basic', 'weight'], val: b.weight },
        { label: '基本信息 · 健康状况', path: ['basic', 'health_status'], val: b.health_status },
        { label: '求职意向 · 期望职位', path: ['basic', 'job_category'], val: b.job_category },
        { label: '求职意向 · 意向工作城市', path: ['basic', 'expected_city'], val: b.expected_city },
        { label: '求职意向 · 期望薪资', path: ['basic', 'expected_salary_text'], val: b.expected_salary_text || `${b.expected_salary}万元/年` },
        { label: '求职意向 · 到岗时间', path: ['basic', 'available_date'], val: b.available_date },
        { label: '求职意向 · 是否服从调剂', path: ['basic', 'accept_adjustment'], val: b.accept_adjustment },
        { label: '求职意向 · 是否接受出差/外派', path: ['basic', 'willing_relocate'], val: b.willing_relocate }
      ].forEach(item => list.push(item));

      // 2. 教育经历
      [
        { label: '教育经历 · 本科院校', path: ['education', 'school'], val: edu.school },
        { label: '教育经历 · 本科专业', path: ['education', 'major'], val: edu.major },
        { label: '教育经历 · 学历层次', path: ['education', 'education_level'], val: edu.education_level },
        { label: '教育经历 · 学位类型', path: ['education', 'degree_type'], val: edu.degree_type },
        { label: '教育经历 · 专业大类', path: ['education', 'major_category'], val: edu.major_category },
        { label: '教育经历 · 入学时间', path: ['education', 'start_date'], val: edu.start_date },
        { label: '教育经历 · 毕业时间', path: ['education', 'end_date'], val: edu.end_date },
        { label: '教育经历 · 综合绩点/GPA', path: ['education', 'gpa'], val: edu.gpa },
        { label: '教育经历 · 专业排名', path: ['education', 'rank'], val: `${edu.rank || ''}/${edu.class_size || ''}` },
        { label: '教育经历 · 核心主修课程', path: ['education', 'core_courses'], val: edu.core_courses },
        { label: '教育经历 · 专业描述', path: ['education', 'major_description'], val: edu.major_description },
        { label: '前置学历 · 专科学校', path: ['junior_college_education', 'school'], val: jEdu.school },
        { label: '前置学历 · 专科专业', path: ['junior_college_education', 'major'], val: jEdu.major },
        { label: '高中学历 · 高中学校', path: ['high_school_education', 'school'], val: hEdu.school }
      ].forEach(item => list.push(item));

      // 3. 技能与证书
      [
        { label: '技能与语言 · 外语语种', path: ['skills_and_languages', 'foreign_language'], val: skl.foreign_language },
        { label: '技能与语言 · 英语等级', path: ['skills_and_languages', 'english_level'], val: skl.english_level },
        { label: '技能与语言 · 英语四级成绩', path: ['skills_and_languages', 'english_score'], val: skl.english_score },
        { label: '技能与语言 · 技术特长', path: ['skills_and_languages', 'tech_skills'], val: skl.tech_skills },
        { label: '技能与语言 · 行业资格证书', path: ['skills_and_languages', 'certificates_text'], val: skl.certificates_text }
      ].forEach(item => list.push(item));

      // 4. 实习经历
      (currentProfileData.internships || []).forEach((exp, idx) => {
        list.push({ label: `实习经历 #${idx + 1} · ${exp.company} (单位名称)`, path: ['internships', idx, 'company'], val: exp.company });
        list.push({ label: `实习经历 #${idx + 1} · ${exp.company} (所在部门)`, path: ['internships', idx, 'department'], val: exp.department });
        list.push({ label: `实习经历 #${idx + 1} · ${exp.company} (岗位职务)`, path: ['internships', idx, 'role'], val: exp.role });
        list.push({ label: `实习经历 #${idx + 1} · ${exp.company} (入职时间)`, path: ['internships', idx, 'start_date'], val: exp.start_date });
        list.push({ label: `实习经历 #${idx + 1} · ${exp.company} (离职时间)`, path: ['internships', idx, 'end_date'], val: exp.end_date });
        list.push({ label: `实习经历 #${idx + 1} · ${exp.company} (工作描述与成果)`, path: ['internships', idx, 'description'], val: exp.description });
      });

      // 5. 项目经历
      (currentProfileData.projects || []).forEach((proj, idx) => {
        list.push({ label: `项目经历 #${idx + 1} · ${proj.name} (项目名称)`, path: ['projects', idx, 'name'], val: proj.name });
        list.push({ label: `项目经历 #${idx + 1} · ${proj.name} (担任角色)`, path: ['projects', idx, 'role'], val: proj.role });
        list.push({ label: `项目经历 #${idx + 1} · ${proj.name} (项目级别)`, path: ['projects', idx, 'level'], val: proj.level });
        list.push({ label: `项目经历 #${idx + 1} · ${proj.name} (技术亮点与职责)`, path: ['projects', idx, 'details'], val: proj.details || proj.description });
      });

      // 6. 荣誉奖项
      (currentProfileData.awards || []).forEach((aw, idx) => {
        list.push({ label: `荣誉奖项 #${idx + 1} · ${aw.name}`, path: ['awards', idx, 'name'], val: aw.name });
      });

      // 7. 家庭成员
      (currentProfileData.family_members || []).forEach((fm, idx) => {
        list.push({ label: `家庭成员 · ${fm.relation} · ${fm.name} (姓名)`, path: ['family_members', idx, 'name'], val: fm.name });
        list.push({ label: `家庭成员 · ${fm.relation} · ${fm.name} (单位/职务)`, path: ['family_members', idx, 'company'], val: `${fm.company || ''} / ${fm.role || ''}` });
      });

      // 8. 评价与承诺
      [
        { label: '自我评价 · 自我评价与求职目标', path: ['self_evaluation'], val: currentProfileData.self_evaluation },
        { label: '自我评价 · 个人优势与不足', path: ['strengths_and_weaknesses'], val: currentProfileData.strengths_and_weaknesses },
        { label: '自我评价 · 特长与业余爱好', path: ['hobbies_and_specialties'], val: currentProfileData.hobbies_and_specialties },
        { label: '签署承诺 · 手写签名', path: ['basic', 'signature'], val: b.signature },
        { label: '签署承诺 · 签名日期', path: ['basic', 'sign_date'], val: b.sign_date }
      ].forEach(item => list.push(item));

      // 9. 补充与自定义问答
      (currentProfileData.supplement || []).forEach((s, idx) => {
        list.push({ label: `常用补充 · ${s.key}`, path: ['supplement', idx, 'value'], val: s.value, isCustom: true });
      });

      return list;
    }

    function populateCorrectFieldSelect(targetLabel) {
      const select = document.getElementById('ot-correct-field-select');
      if (!select) return;
      select.innerHTML = '';

      const fields = getAllFlatProfileFields();
      let matchedIndex = -1;
      const cleanTarget = (targetLabel || '').trim().toLowerCase();

      fields.forEach((f, idx) => {
        const opt = document.createElement('option');
        opt.value = JSON.stringify(f.path);
        const strVal = f.val !== undefined && f.val !== null ? String(f.val).trim() : '';
        const displayVal = strVal.length > 20 ? strVal.slice(0, 20) + '…' : strVal;
        opt.textContent = `${f.label} [当前: ${displayVal || '空'}]`;
        opt.setAttribute('data-val', String(f.val || ''));
        opt.setAttribute('data-label', f.label);
        select.appendChild(opt);

        if (matchedIndex === -1 && cleanTarget) {
          const fullLabel = f.label.toLowerCase();
          const shortName = fullLabel.split('·').pop().trim().replace(/\(.*\)/, '');
          if (cleanTarget.includes(shortName) || fullLabel.includes(cleanTarget)) {
            matchedIndex = idx;
          }
        }
      });

      select.selectedIndex = matchedIndex >= 0 ? matchedIndex : 0;
      updateCorrectValFromSelect();
    }

    function updateCorrectValFromSelect() {
      const select = document.getElementById('ot-correct-field-select');
      const textarea = document.getElementById('ot-correct-field-val');
      if (!select || !textarea || select.selectedIndex < 0) return;

      const opt = select.options[select.selectedIndex];
      if (opt) {
        textarea.value = opt.getAttribute('data-val') || '';
      }
    }

    function renderSuppForm(type) {
      currentSuppType = type || 'internship';
      const container = document.getElementById('ot-supp-form-fields');
      if (!container) return;

      if (currentSuppType === 'internship') {
        container.innerHTML = `
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-intern-company">实习单位/公司名称 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
            <input type="text" class="ot-editor-input" id="ot-supp-intern-company" placeholder="例如：字节跳动科技有限公司" />
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-intern-dept">所属部门</label>
            <input type="text" class="ot-editor-input" id="ot-supp-intern-dept" placeholder="例如：商业化研发部" />
          </div>
        </div>
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-intern-role">实习岗位/职务 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
            <input type="text" class="ot-editor-input" id="ot-supp-intern-role" placeholder="例如：前端开发实习生" />
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-intern-nature">公司性质/行业</label>
            <input type="text" class="ot-editor-input" id="ot-supp-intern-nature" placeholder="例如：民营IT互联网" />
          </div>
        </div>
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-intern-start">入职时间</label>
            <input type="date" class="ot-editor-input" id="ot-supp-intern-start" value="2025-06-01" />
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-intern-end">离职时间</label>
            <input type="date" class="ot-editor-input" id="ot-supp-intern-end" value="2025-12-01" />
          </div>
        </div>
        <div class="ot-editor-form-group">
          <label for="ot-supp-intern-desc">工作职责与项目产出</label>
          <textarea class="ot-editor-textarea" id="ot-supp-intern-desc" placeholder="详细描述在实习期间参与的核心项目、负责的技术模块、解决的难题以及业务成果产出..."></textarea>
        </div>
      `;
      } else if (currentSuppType === 'project') {
        container.innerHTML = `
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-proj-name">项目名称 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
            <input type="text" class="ot-editor-input" id="ot-supp-proj-name" placeholder="例如：基于微服务的高并发电商平台" />
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-proj-role">担任角色 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
            <input type="text" class="ot-editor-input" id="ot-supp-proj-role" placeholder="例如：核心开发 / 项目负责人" />
          </div>
        </div>
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-proj-level">项目级别 / 性质</label>
            <select class="ot-editor-select" id="ot-supp-proj-level">
              <option value="商用项目">商用项目</option>
              <option value="省部级项目">省部级项目</option>
              <option value="国家级项目">国家级项目</option>
              <option value="学校科研">学校科研</option>
              <option value="个人开源">个人开源</option>
            </select>
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-proj-period">起止时间</label>
            <input type="text" class="ot-editor-input" id="ot-supp-proj-period" placeholder="例如：2025-09 ~ 2026-03" />
          </div>
        </div>
        <div class="ot-editor-form-group">
          <label for="ot-supp-proj-desc">项目简介与背景</label>
          <input type="text" class="ot-editor-input" id="ot-supp-proj-desc" placeholder="简要概述项目定位及业务规模" />
        </div>
        <div class="ot-editor-form-group">
          <label for="ot-supp-proj-details">技术栈亮点与核心贡献</label>
          <textarea class="ot-editor-textarea" id="ot-supp-proj-details" placeholder="详细说明采用的技术方案、性能调优指标、攻克的技术难点以及最终效益..."></textarea>
        </div>
      `;
      } else if (currentSuppType === 'award') {
        container.innerHTML = `
        <div class="ot-editor-form-group">
          <label for="ot-supp-award-name">奖项与荣誉名称 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
          <input type="text" class="ot-editor-input" id="ot-supp-award-name" placeholder="例如：全国大学生数学建模竞赛一等奖" />
        </div>
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-award-level">奖项级别</label>
            <select class="ot-editor-select" id="ot-supp-award-level">
              <option value="国家级">国家级</option>
              <option value="省部级">省部级</option>
              <option value="市级">市级</option>
              <option value="院校级">院校级</option>
            </select>
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-award-date">获奖时间</label>
            <input type="text" class="ot-editor-input" id="ot-supp-award-date" placeholder="例如：2026-05-20" />
          </div>
        </div>
        <div class="ot-editor-form-group">
          <label for="ot-supp-award-issuer">授奖机构 / 组织部门</label>
          <input type="text" class="ot-editor-input" id="ot-supp-award-issuer" placeholder="例如：中国工业与应用数学学会" />
        </div>
      `;
      } else if (currentSuppType === 'family') {
        container.innerHTML = `
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-fam-rel">亲属关系 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
            <select class="ot-editor-select" id="ot-supp-fam-rel">
              <option value="父亲">父亲</option>
              <option value="母亲">母亲</option>
              <option value="配偶">配偶</option>
              <option value="子女">子女</option>
              <option value="哥哥">哥哥</option>
              <option value="弟弟">弟弟</option>
              <option value="姐姐">姐姐</option>
              <option value="妹妹">妹妹</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-fam-name">姓名 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
            <input type="text" class="ot-editor-input" id="ot-supp-fam-name" placeholder="请输入成员姓名" />
          </div>
        </div>
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-fam-birth">出生日期</label>
            <input type="text" class="ot-editor-input" id="ot-supp-fam-birth" placeholder="例如：1978-05-12" />
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-fam-pol">政治面貌</label>
            <select class="ot-editor-select" id="ot-supp-fam-pol">
              <option value="群众">群众</option>
              <option value="中共党员">中共党员</option>
              <option value="共青团员">共青团员</option>
              <option value="民主党派">民主党派</option>
            </select>
          </div>
        </div>
        <div class="ot-form-grid-2">
          <div class="ot-editor-form-group">
            <label for="ot-supp-fam-company">工作单位</label>
            <input type="text" class="ot-editor-input" id="ot-supp-fam-company" placeholder="例如：福州市水利局 或 无" />
          </div>
          <div class="ot-editor-form-group">
            <label for="ot-supp-fam-role">职务 / 职业</label>
            <input type="text" class="ot-editor-input" id="ot-supp-fam-role" placeholder="例如：工程师 / 教师 / 自由职业" />
          </div>
        </div>
      `;
      } else if (currentSuppType === 'custom') {
        container.innerHTML = `
        <div class="ot-editor-form-group">
          <label for="ot-supp-custom-key">字段名称 / 个性化问答标题 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
          <input type="text" class="ot-editor-input" id="ot-supp-custom-key" placeholder="例如：英语专八成绩、博客地址、期望年薪范围" />
        </div>
        <div class="ot-editor-form-group">
          <label for="ot-supp-custom-val">对应内容 / 答案详情 <strong style="color:var(--ot-danger); font-size:12px;">*</strong></label>
          <textarea class="ot-editor-textarea" id="ot-supp-custom-val" placeholder="填写对应的真实内容"></textarea>
        </div>
        <div class="ot-editor-form-group">
          <label for="ot-supp-custom-kw">智能匹配关键词 (选填，英文逗号分隔)</label>
          <input type="text" class="ot-editor-input" id="ot-supp-custom-kw" placeholder="例如：专八,tem8,英语专八" />
        </div>
      `;
      }
    }

    function openCorrectionSupplementHub(defaultTab = 'correct') {
      const overlay = document.getElementById('ot-correct-supp-overlay');
      if (!overlay) return;

      switchHubTab(defaultTab);

      // 检查当前网页输入框焦点
      const detectedBox = document.getElementById('ot-detected-box');
      const detectedLabel = document.getElementById('ot-detected-label');
      const detectedVal = document.getElementById('ot-detected-val');

      if (currentActiveField && document.body.contains(currentActiveField)) {
        if (detectedBox) detectedBox.style.display = 'flex';
        if (detectedLabel) detectedLabel.innerText = currentActiveLabel || '当前网页输入框';
        if (detectedVal) detectedVal.value = currentActiveField.value || '';
      } else {
        if (detectedBox) detectedBox.style.display = 'none';
      }

      populateCorrectFieldSelect(currentActiveLabel);
      renderSuppForm(currentSuppType);

      overlay.setAttribute('data-visible', 'true');
    }

    function closeCorrectionSupplementHub() {
      const overlay = document.getElementById('ot-correct-supp-overlay');
      if (overlay) overlay.setAttribute('data-visible', 'false');
    }

    function switchHubTab(tabName) {
      currentHubTab = tabName || 'correct';
      const tabCorrect = document.getElementById('ot-cs-tab-correct');
      const tabSupp = document.getElementById('ot-cs-tab-supp');
      const paneCorrect = document.getElementById('ot-cs-pane-correct');
      const paneSupp = document.getElementById('ot-cs-pane-supp');

      if (tabCorrect && tabSupp && paneCorrect && paneSupp) {
        if (currentHubTab === 'correct') {
          tabCorrect.classList.add('active');
          tabSupp.classList.remove('active');
          paneCorrect.style.display = 'block';
          paneSupp.style.display = 'none';
        } else {
          tabSupp.classList.add('active');
          tabCorrect.classList.remove('active');
          paneSupp.style.display = 'block';
          paneCorrect.style.display = 'none';
          renderSuppForm(currentSuppType);
        }
      }
    }

    async function saveCorrectionSupplementHub() {
      const isCorrectTab = (document.getElementById('ot-cs-tab-correct')?.classList.contains('active')) || currentHubTab === 'correct';
      if (isCorrectTab) {
        const select = document.getElementById('ot-correct-field-select');
        const textarea = document.getElementById('ot-correct-field-val');
        if (!select || !textarea) return;
        if (select.selectedIndex < 0 && select.options.length > 0) {
          select.selectedIndex = 0;
        }
        if (select.selectedIndex < 0) return;

        let path;
        try {
          path = JSON.parse(select.value);
        } catch (e) {
          showToast('⚠️ 解析字段路径失败');
          return;
        }

        const newVal = textarea.value;
        const opt = select.options[select.selectedIndex];
        const fieldLabel = opt ? opt.getAttribute('data-label') : '字段';

        setNestedValue(currentProfileData, path, newVal);

        // 持久化存储
        await Storage.set('ot_candidate_profile', currentProfileData);
        try {
          await fetch(`${SERVER_URL}/api/profile/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: currentProfileData })
          });
        } catch (err) { }

        // 如果当前聚焦该元素，同时更新网页输入框
        try {
          if (currentActiveField && document.body.contains(currentActiveField) && typeof currentActiveField.value !== 'undefined') {
            setNativeInputValue(currentActiveField, newVal);
          }
        } catch (err) { }

        renderAssistantFields();
        closeCorrectionSupplementHub();
        showToast(`✅ 【${fieldLabel}】内容已修正并持久化同步！`);
      } else {
        // 补充信息逻辑
        let addedName = '';
        if (currentSuppType === 'internship') {
          const comp = (document.getElementById('ot-supp-intern-company')?.value || '').trim();
          const role = (document.getElementById('ot-supp-intern-role')?.value || '').trim();
          if (!comp || !role) {
            showToast('⚠️ 请填写单位名称和岗位职务');
            return;
          }
          const dept = (document.getElementById('ot-supp-intern-dept')?.value || '').trim();
          const nature = (document.getElementById('ot-supp-intern-nature')?.value || '').trim();
          const start = document.getElementById('ot-supp-intern-start')?.value || '';
          const end = document.getElementById('ot-supp-intern-end')?.value || '';
          const desc = document.getElementById('ot-supp-intern-desc')?.value || '';

          if (!currentProfileData.internships) currentProfileData.internships = [];
          currentProfileData.internships.push({
            company: comp,
            department: dept,
            role: role,
            nature: nature || '民营企业',
            start_date: start,
            end_date: end,
            description: desc
          });
          addedName = `实习 · ${comp}`;
        } else if (currentSuppType === 'project') {
          const name = (document.getElementById('ot-supp-proj-name')?.value || '').trim();
          const role = (document.getElementById('ot-supp-proj-role')?.value || '').trim();
          if (!name || !role) {
            showToast('⚠️ 请填写项目名称和担任角色');
            return;
          }
          const level = document.getElementById('ot-supp-proj-level')?.value || '商用项目';
          const period = (document.getElementById('ot-supp-proj-period')?.value || '').trim();
          const desc = document.getElementById('ot-supp-proj-desc')?.value || '';
          const details = document.getElementById('ot-supp-proj-details')?.value || '';

          if (!currentProfileData.projects) currentProfileData.projects = [];
          currentProfileData.projects.push({
            name: name,
            role: role,
            level: level,
            start_date: period.split('~')[0]?.trim() || '',
            end_date: period.split('~')[1]?.trim() || '',
            description: desc,
            details: details
          });
          addedName = `项目 · ${name}`;
        } else if (currentSuppType === 'award') {
          const name = (document.getElementById('ot-supp-award-name')?.value || '').trim();
          if (!name) {
            showToast('⚠️ 请填写奖项荣誉名称');
            return;
          }
          const level = document.getElementById('ot-supp-award-level')?.value || '院校级';
          const date = (document.getElementById('ot-supp-award-date')?.value || '').trim();
          const issuer = (document.getElementById('ot-supp-award-issuer')?.value || '').trim();

          if (!currentProfileData.awards) currentProfileData.awards = [];
          currentProfileData.awards.push({
            name: name,
            level: level,
            date: date,
            issuer: issuer
          });
          addedName = `荣誉 · ${name}`;
        } else if (currentSuppType === 'family') {
          const rel = document.getElementById('ot-supp-fam-rel')?.value || '亲属';
          const name = (document.getElementById('ot-supp-fam-name')?.value || '').trim();
          if (!name) {
            showToast('⚠️ 请填写家庭成员姓名');
            return;
          }
          const birth = (document.getElementById('ot-supp-fam-birth')?.value || '').trim();
          const pol = document.getElementById('ot-supp-fam-pol')?.value || '群众';
          const comp = (document.getElementById('ot-supp-fam-company')?.value || '').trim();
          const role = (document.getElementById('ot-supp-fam-role')?.value || '').trim();

          if (!currentProfileData.family_members) currentProfileData.family_members = [];
          currentProfileData.family_members.push({
            relation: rel,
            name: name,
            birthday: birth,
            political_status: pol,
            company: comp || '无',
            role: role || '无'
          });
          addedName = `家庭成员 · ${rel}(${name})`;
        } else if (currentSuppType === 'custom') {
          const key = (document.getElementById('ot-supp-custom-key')?.value || '').trim();
          const val = (document.getElementById('ot-supp-custom-val')?.value || '').trim();
          if (!key || !val) {
            showToast('⚠️ 请填写字段名称和内容');
            return;
          }
          const kw = (document.getElementById('ot-supp-custom-kw')?.value || '').trim();

          if (!currentProfileData.supplement) currentProfileData.supplement = [];
          currentProfileData.supplement.push({
            key: key,
            value: val,
            keywords: kw
          });
          addedName = `自定义字段 · ${key}`;
        }

        // 持久化存储
        await Storage.set('ot_candidate_profile', currentProfileData);
        try {
          await fetch(`${SERVER_URL}/api/profile/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: currentProfileData })
          });
        } catch (err) { }

        renderAssistantFields();
        closeCorrectionSupplementHub();
        showToast(`🎉 已成功补充【${addedName}】！小助手已生成专属芯片，可立即拖拽使用！`);
      }
    }

    function toggleFieldSelection(field, btnEl) {
      if (selectedFieldsMap.has(field.key)) {
        selectedFieldsMap.delete(field.key);
        btnEl.removeAttribute('data-selected');
      } else {
        selectedFieldsMap.set(field.key, field);
        btnEl.setAttribute('data-selected', 'true');
      }
      updateSelectionBar();
    }

    function updateSelectionBar() {
      const bar = document.getElementById('ot-assistant-selection-bar');
      const countBadge = document.getElementById('ot-selection-count');
      const labelEl = document.getElementById('ot-selection-label');
      if (!bar) return;

      const count = selectedFieldsMap.size;
      if (count > 0) {
        bar.setAttribute('data-visible', 'true');
        if (countBadge) countBadge.innerText = String(count);
        if (labelEl) labelEl.innerText = `已选 ${count} 个字段 (可拖拽批量填入)`;
      } else {
        bar.setAttribute('data-visible', 'false');
      }
    }

    function clearFieldSelection() {
      selectedFieldsMap.clear();
      const assistant = document.getElementById('ot-resume-assistant');
      if (assistant) {
        assistant.querySelectorAll('.ot-resume-assistant__field-button[data-selected="true"]')
          .forEach(b => b.removeAttribute('data-selected'));
      }
      updateSelectionBar();
    }

    function renderAssistantFields() {
      const groupsContainer = document.getElementById('ot-assistant-groups');
      const tocNav = document.getElementById('ot-assistant-toc');
      const tooltip = document.getElementById('ot-field-tooltip');
      if (!groupsContainer) return;

      groupsContainer.innerHTML = '';

      // 数据源结构定义
      const b = currentProfileData.basic || {};
      const edu = currentProfileData.education || {};
      const jEdu = currentProfileData.junior_college_education || {};
      const hEdu = currentProfileData.high_school_education || {};
      const skl = currentProfileData.skills_and_languages || {};

      const schemaGroups = [
        {
          id: 'basic',
          name: '👤 基本信息',
          fields: [
            { key: '姓名', val: b.name, path: ['basic', 'name'] },
            { key: '性别', val: b.gender, path: ['basic', 'gender'] },
            { key: '出生日期', val: b.birthday, path: ['basic', 'birthday'] },
            { key: '身份证号', val: b.id_card, path: ['basic', 'id_card'] },
            { key: '手机号码', val: b.phone, path: ['basic', 'phone'] },
            { key: '电子邮箱', val: b.email, path: ['basic', 'email'] },
            { key: '民族', val: b.ethnicity, path: ['basic', 'ethnicity'] },
            { key: '政治面貌', val: b.political_status, path: ['basic', 'political_status'] },
            { key: '籍贯', val: b.native_place, path: ['basic', 'native_place'] },
            { key: '生源地', val: b.origin_place, path: ['basic', 'origin_place'] },
            { key: '户口所在', val: b.hukou, path: ['basic', 'hukou'] },
            { key: '现居住地', val: b.current_city, path: ['basic', 'current_city'] },
            { key: '详细通讯地址', val: b.address, path: ['basic', 'address'] },
            { key: '邮编', val: b.postal_code, path: ['basic', 'postal_code'] },
            { key: '紧急联系人姓名', val: b.emergency_contact_name, path: ['basic', 'emergency_contact_name'] },
            { key: '紧急联系人电话', val: b.emergency_contact_phone, path: ['basic', 'emergency_contact_phone'] },
            { key: '紧急联系人关系', val: b.emergency_contact_relation, path: ['basic', 'emergency_contact_relation'] },
            { key: '身高(cm)', val: b.height, path: ['basic', 'height'] },
            { key: '体重(kg)', val: b.weight, path: ['basic', 'weight'] },
            { key: '健康状况', val: b.health_status, path: ['basic', 'health_status'] }
          ]
        },
        {
          id: 'intent',
          name: '🎯 求职意向',
          fields: [
            { key: '期望职位', val: b.job_category, path: ['basic', 'job_category'] },
            { key: '意向工作城市', val: b.expected_city, path: ['basic', 'expected_city'] },
            { key: '期望薪资', val: b.expected_salary_text || `${b.expected_salary}万元/年`, path: ['basic', 'expected_salary_text'] },
            { key: '最快到岗时间', val: b.available_date, path: ['basic', 'available_date'] },
            { key: '是否服从调剂', val: b.accept_adjustment, path: ['basic', 'accept_adjustment'] },
            { key: '是否接受出差/外派', val: b.willing_relocate, path: ['basic', 'willing_relocate'] }
          ]
        },
        {
          id: 'edu',
          name: '🎓 教育经历',
          subgroups: [
            {
              title: `最高学历 (本科) · ${edu.school}`,
              fields: [
                { key: '本科院校', val: edu.school, path: ['education', 'school'] },
                { key: '就读专业', val: edu.major, path: ['education', 'major'] },
                { key: '学历层次', val: edu.education_level, path: ['education', 'education_level'] },
                { key: '学位类型', val: edu.degree_type, path: ['education', 'degree_type'] },
                { key: '专业大类', val: edu.major_category, path: ['education', 'major_category'] },
                { key: '入学时间', val: edu.start_date, path: ['education', 'start_date'] },
                { key: '毕业时间', val: edu.end_date, path: ['education', 'end_date'] },
                { key: '毕业年份', val: edu.graduation_year, path: ['education', 'graduation_year'] },
                { key: '全日制', val: edu.is_full_time, path: ['education', 'is_full_time'] },
                { key: '综合绩点/分', val: edu.gpa, path: ['education', 'gpa'] },
                { key: '专业排名', val: `${edu.rank}/${edu.class_size}`, path: ['education', 'rank'] },
                { key: '核心课程', val: edu.core_courses, path: ['education', 'core_courses'] },
                { key: '专业描述', val: edu.major_description, path: ['education', 'major_description'] }
              ]
            },
            {
              title: `前置专科 · ${jEdu.school}`,
              fields: [
                { key: '专科学校', val: jEdu.school, path: ['junior_college_education', 'school'] },
                { key: '专科专业', val: jEdu.major, path: ['junior_college_education', 'major'] },
                { key: '入学时间', val: jEdu.start_date, path: ['junior_college_education', 'start_date'] },
                { key: '毕业时间', val: jEdu.end_date, path: ['junior_college_education', 'end_date'] }
              ]
            },
            {
              title: `高中学历 · ${hEdu.school}`,
              fields: [
                { key: '高中学校', val: hEdu.school, path: ['high_school_education', 'school'] },
                { key: '就读时间', val: `${hEdu.start_date} ~ ${hEdu.end_date}`, path: ['high_school_education', 'start_date'] }
              ]
            }
          ]
        },
        {
          id: 'internship',
          name: '💼 实习经历',
          subgroups: (currentProfileData.internships || []).map((exp, idx) => ({
            title: `实习 #${idx + 1} · ${exp.company}`,
            fields: [
              { key: '实习单位', val: exp.company, path: ['internships', idx, 'company'] },
              { key: '所属部门', val: exp.department, path: ['internships', idx, 'department'] },
              { key: '岗位职务', val: exp.role, path: ['internships', idx, 'role'] },
              { key: '入职时间', val: exp.start_date, path: ['internships', idx, 'start_date'] },
              { key: '离职时间', val: exp.end_date, path: ['internships', idx, 'end_date'] },
              { key: '企业性质', val: exp.nature, path: ['internships', idx, 'nature'] },
              { key: '工作职责与成果描述', val: exp.description, path: ['internships', idx, 'description'] }
            ]
          }))
        },
        {
          id: 'project',
          name: '🚀 科研与商业项目',
          subgroups: (currentProfileData.projects || []).map((proj, idx) => ({
            title: `项目 #${idx + 1} · ${proj.name}`,
            fields: [
              { key: '项目名称', val: proj.name, path: ['projects', idx, 'name'] },
              { key: '担任角色', val: proj.role, path: ['projects', idx, 'role'] },
              { key: '项目级别', val: proj.level, path: ['projects', idx, 'level'] },
              { key: '项目性质', val: proj.nature, path: ['projects', idx, 'nature'] },
              { key: '项目周期', val: `${proj.start_date} ~ ${proj.end_date}`, path: ['projects', idx, 'start_date'] },
              { key: '项目简介', val: proj.description, path: ['projects', idx, 'description'] },
              { key: '技术亮点与职责', val: proj.details || proj.description, path: ['projects', idx, 'details'] }
            ]
          }))
        },
        {
          id: 'award',
          name: '🏆 竞赛与荣誉奖项',
          fields: (currentProfileData.awards || []).map((aw, idx) => ({
            key: aw.name,
            val: `${aw.name} (${aw.level} · ${aw.date} · 授奖机构: ${aw.issuer || '组委会'})`,
            path: ['awards', idx, 'name']
          }))
        },
        {
          id: 'cert',
          name: '📜 技能与资格证书',
          fields: [
            { key: '外语语种', val: skl.foreign_language, path: ['skills_and_languages', 'foreign_language'] },
            { key: '英语四级成绩', val: skl.english_score, path: ['skills_and_languages', 'english_score'] },
            { key: '英语等级', val: skl.english_level, path: ['skills_and_languages', 'english_level'] },
            { key: '计算机与全栈技术特长', val: skl.tech_skills, path: ['skills_and_languages', 'tech_skills'] },
            { key: '软考与行业资格证书', val: skl.certificates_text, path: ['skills_and_languages', 'certificates_text'] }
          ]
        },
        {
          id: 'family',
          name: '👨‍👩‍👦 家庭主要成员',
          subgroups: (currentProfileData.family_members || []).map((fm, idx) => ({
            title: `${fm.relation} · ${fm.name}`,
            fields: [
              { key: '关系', val: fm.relation, path: ['family_members', idx, 'relation'] },
              { key: '姓名', val: fm.name, path: ['family_members', idx, 'name'] },
              { key: '出生日期', val: fm.birthday, path: ['family_members', idx, 'birthday'] },
              { key: '政治面貌', val: fm.political_status, path: ['family_members', idx, 'political_status'] },
              { key: '工作单位', val: fm.company, path: ['family_members', idx, 'company'] },
              { key: '职务', val: fm.role, path: ['family_members', idx, 'role'] }
            ]
          }))
        },
        {
          id: 'qa',
          name: '✍️ 评价与承诺问答',
          fields: [
            { key: '自我评价与求职目标', val: currentProfileData.self_evaluation, path: ['self_evaluation'] },
            { key: '个人优势与不足', val: currentProfileData.strengths_and_weaknesses, path: ['strengths_and_weaknesses'] },
            { key: '特长与业余爱好', val: currentProfileData.hobbies_and_specialties, path: ['hobbies_and_specialties'] },
            { key: '本人承诺', val: '同意接受', path: ['pledge'] },
            { key: '手写签名', val: b.signature, path: ['basic', 'signature'] },
            { key: '签名日期', val: b.sign_date, path: ['basic', 'sign_date'] }
          ]
        },
        {
          id: 'supp',
          name: '✏️ 常用补充信息',
          fields: (currentProfileData.supplement || []).map((s, idx) => ({
            key: s.key,
            val: s.value,
            path: ['supplement', idx, 'value'],
            isCustom: true
          }))
        }
      ];

      // 计算总字段数
      let totalFields = 0;
      schemaGroups.forEach(g => {
        if (g.fields) totalFields += g.fields.length;
        if (g.subgroups) g.subgroups.forEach(sg => totalFields += sg.fields.length);
      });
      const countBadge = document.getElementById('ot-assistant-field-count');
      if (countBadge) countBadge.innerText = `共 ${totalFields} 个可用字段`;

      // 渲染右侧内容
      schemaGroups.forEach(g => {
        const groupEl = document.createElement('div');
        groupEl.className = 'ot-resume-assistant__group';
        groupEl.id = `ot-group-${g.id}`;

        // 分组头部折叠
        const count = g.fields ? g.fields.length : g.subgroups.reduce((acc, sg) => acc + sg.fields.length, 0);
        const head = document.createElement('button');
        head.className = 'ot-resume-assistant__group-header';
        head.type = 'button';
        head.innerHTML = `
        <span class="name">${g.name}</span>
        <span class="count">${count} 项</span>
      `;

        const contentBox = document.createElement('div');

        head.addEventListener('click', () => {
          contentBox.style.display = contentBox.style.display === 'none' ? 'block' : 'none';
        });

        groupEl.appendChild(head);

        // 单层字段列表
        if (g.fields) {
          const fieldGrid = document.createElement('div');
          fieldGrid.className = 'ot-resume-assistant__group-fields';
          g.fields.forEach(f => {
            fieldGrid.appendChild(createFieldChip(f, tooltip));
          });

          // 若是补充信息分类，底部增加“+ 新增自定义字段”按钮
          if (g.id === 'supp') {
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'ot-btn-add-field';
            addBtn.innerHTML = `<span>➕ 新增自定义字段</span>`;
            addBtn.addEventListener('click', () => {
              openFieldEditor({ key: '', val: '', isNew: true, isCustom: true });
            });
            fieldGrid.appendChild(addBtn);
          }

          contentBox.appendChild(fieldGrid);
        }

        // 多子组经历
        if (g.subgroups) {
          g.subgroups.forEach(sg => {
            const subEl = document.createElement('div');
            subEl.className = 'ot-resume-assistant__subgroup';
            subEl.innerHTML = `<header><strong>${sg.title}</strong></header>`;

            const subGrid = document.createElement('div');
            subGrid.className = 'ot-resume-assistant__group-fields';
            sg.fields.forEach(f => {
              subGrid.appendChild(createFieldChip(f, tooltip));
            });
            subEl.appendChild(subGrid);
            contentBox.appendChild(subEl);
          });
        }

        groupEl.appendChild(contentBox);
        groupsContainer.appendChild(groupEl);
      });

      // 左侧 TOC 点击滚动定位
      if (tocNav) {
        const tocBtns = tocNav.querySelectorAll('button');
        tocBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            tocBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const groupId = btn.getAttribute('data-group');
            const target = document.getElementById(`ot-group-${groupId}`);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });
      }

      updateSelectionBar();
    }

    // 创建字段芯片按钮 (具备 拖拽注入 / 单击聚焦注入 / 多选暂存 / 编辑修改 四合一能力)
    function createFieldChip(field, tooltip) {
      const { key, val, path, isCustom } = field;
      const btn = document.createElement('button');
      btn.className = 'ot-resume-assistant__field-button';
      btn.type = 'button';
      btn.draggable = true;
      btn.setAttribute('data-val', String(val || ''));
      btn.setAttribute('data-key', key);

      if (selectedFieldsMap.has(key)) {
        btn.setAttribute('data-selected', 'true');
      }

      const displayTitle = key.length > 14 ? key.slice(0, 13) + '…' : key;
      btn.innerHTML = `
      <span class="title">${displayTitle}</span>
      <span class="ot-field-edit-btn" title="编辑【${key}】信息">✏️</span>
    `;

      // Tooltip 悬浮预览完整内容
      btn.addEventListener('mouseenter', (e) => {
        if (!val && val !== 0) return;
        const strVal = String(val);
        const preview = strVal.length > 200 ? strVal.slice(0, 200) + '...' : strVal;
        tooltip.innerText = `${key}：${preview}`;
        tooltip.setAttribute('data-visible', 'true');

        const rect = btn.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 8}px`;
      });

      btn.addEventListener('mouseleave', () => {
        tooltip.setAttribute('data-visible', 'false');
      });

      // 编辑按钮点击：直接呼出编辑模态框
      const editBtn = btn.querySelector('.ot-field-edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          openFieldEditor({ key, val, path, isCustom });
        });
      }

      // 双击芯片：呼出编辑
      btn.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        e.preventDefault();
        openFieldEditor({ key, val, path, isCustom });
      });

      // 拖拽开始 (HTML5 Drag & Drop)
      btn.addEventListener('dragstart', (e) => {
        btn.setAttribute('data-dragging', 'true');
        const strVal = String(val || '');

        let payloadItems;
        if (selectedFieldsMap.has(key) && selectedFieldsMap.size > 1) {
          payloadItems = Array.from(selectedFieldsMap.values());
        } else {
          payloadItems = [{ key, val: strVal, path, isCustom }];
        }

        currentDragPayload = {
          items: payloadItems,
          isBatch: payloadItems.length > 1
        };

        e.dataTransfer.setData('text/plain', strVal);
        try {
          e.dataTransfer.setData('application/json', JSON.stringify(currentDragPayload));
        } catch (err) { }
        e.dataTransfer.effectAllowed = 'copyMove';

        // 幽灵预览提示
        const ghostBadge = document.getElementById('ot-drag-ghost-badge');
        if (ghostBadge) {
          ghostBadge.querySelector('.badge-title').innerText = payloadItems.length > 1
            ? `已选 ${payloadItems.length} 项`
            : key;
          ghostBadge.querySelector('.badge-val').innerText = payloadItems.length > 1
            ? payloadItems.map(p => p.key).slice(0, 3).join(', ')
            : (strVal.length > 15 ? strVal.slice(0, 15) + '…' : strVal);
        }
      });

      btn.addEventListener('dragend', () => {
        btn.removeAttribute('data-dragging');
        currentDragPayload = null;
        document.querySelectorAll('.ot-drop-hover').forEach(el => el.classList.remove('ot-drop-hover'));
      });

      // 单击处理
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        // 如果当前是编辑模式，单击即打开编辑
        if (assistantMode === 'edit') {
          openFieldEditor({ key, val, path, isCustom });
          return;
        }

        // 如果按住 Ctrl/Meta/Shift，进行多选切换
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
          toggleFieldSelection(field, btn);
          return;
        }

        // 常规注入模式：注入当前激活焦点输入框 或 复制剪贴板
        const strVal = String(val || '');
        if (currentActiveField && document.body.contains(currentActiveField) && !currentActiveField.disabled) {
          setNativeInputValue(currentActiveField, strVal);
          copyToClipboard(strVal);

          btn.classList.add('copied');
          btn.innerHTML = `<span>✓ 已填入</span>`;
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `
            <span class="title">${displayTitle}</span>
            <span class="ot-field-edit-btn" title="编辑【${key}】信息">✏️</span>
          `;
            const nb = btn.querySelector('.ot-field-edit-btn');
            if (nb) nb.addEventListener('click', (ev) => {
              ev.stopPropagation();
              openFieldEditor({ key, val, path, isCustom });
            });
          }, 1500);

          showToast(`🎉 已成功将【${key}】直接注入当前光标输入框！`);
        } else {
          const ok = copyToClipboard(strVal);
          if (ok) {
            btn.classList.add('copied');
            btn.innerHTML = `<span>✓ 已复制</span>`;
            setTimeout(() => {
              btn.classList.remove('copied');
              btn.innerHTML = `
              <span class="title">${displayTitle}</span>
              <span class="ot-field-edit-btn" title="编辑【${key}】信息">✏️</span>
            `;
              const nb = btn.querySelector('.ot-field-edit-btn');
              if (nb) nb.addEventListener('click', (ev) => {
                ev.stopPropagation();
                openFieldEditor({ key, val, path, isCustom });
              });
            }, 1500);
            showToast(`📋 已复制【${key}】到剪贴板，先在网页中点击输入框即可瞬间填入！`);
          }
        }
      });

      return btn;
    }

    // ==========================================================================
    // 7. 本地 Python 服务同步与热联动
    // ==========================================================================

    async function syncFromPythonServer(silent = false) {
      try {
        const resp = await fetch(`${SERVER_URL}/api/profile`, { cache: 'no-store' });
        if (resp.ok) {
          const json = await resp.json();
          if (json.data) {
            currentProfileData = json.data;
            isServerOnline = true;

            const resumeNameEl = document.getElementById('ot-active-resume-name');
            if (resumeNameEl) {
              resumeNameEl.innerText = (currentProfileData.profile_name || '校招简历').split('(')[0].trim();
            }

            renderAssistantFields();
            if (!silent) showToast('🔄 已成功从本地服务同步最新简历数据！');
            return;
          }
        }
      } catch (e) { }

      isServerOnline = false;
      if (!silent) showToast('⚪ 本地服务未运行，已自动切换为内置离线简历');
    }

    // ==========================================================================
    // 8. 启动引导入口
    // ==========================================================================

    async function init() {
      // 1. 读取用户偏好
      const prefs = await Storage.get(STORAGE_KEY_PREFS, null);
      if (prefs) userPrefs = { ...userPrefs, ...prefs };

      // 2. 检查是否在禁用网站列表中
      const isDisabled = await checkSiteDisabled();
      if (isDisabled || !userPrefs.showFloatingButton) {
        return; // 禁用浮动球时不渲染
      }

      // 3. 构建 OfferTong 核心 UI
      createOfferTongUI();

      // 4. 启动实时光标焦点探测
      initFocusTracker();

      // 5. 自动同步本地服务
      syncFromPythonServer(true);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

  })();

})();
