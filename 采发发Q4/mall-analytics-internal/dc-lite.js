/*
 * dc-lite.js — 静态演示用的轻量模板运行时
 * 支持：{{path}} 插值、<sc-for list as>、<sc-if value>、on* 事件、受控 input/select、
 *       class Component extends DCLogic（state / setState / renderVals / componentDidMount）。
 * 仅用于本目录下的原型页面，不是通用框架。
 */
(function () {
  'use strict';

  function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    if (!next) return;
    var changed = false;
    for (var k in next) {
      if (Object.prototype.hasOwnProperty.call(next, k) && this.state[k] !== next[k]) { changed = true; break; }
    }
    if (!changed) return;
    this.state = Object.assign({}, this.state, next);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__schedule) this.__schedule(); };
  window.DCLogic = DCLogic;

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var BOOL_ATTRS = { disabled: 1, checked: 1, selected: 1, hidden: 1, readonly: 1, required: 1, open: 1 };

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) {
      var v = lookup(p, scope);
      return v == null ? '' : String(v);
    });
  }

  // 构建时已把 <sc-for>/<sc-if> 换成 <template data-sc>，避免被表格、下拉框的解析规则挪走
  function prepare(src) {
    return src
      .replace(/<sc-for\b/g, '<template data-sc="for"').replace(/<\/sc-for>/g, '</template>')
      .replace(/<sc-if\b/g, '<template data-sc="if"').replace(/<\/sc-if>/g, '</template>');
  }

  function renderChildren(nodes, scope, parent, inSvg) {
    for (var i = 0; i < nodes.length; i++) renderNode(nodes[i], scope, parent, inSvg);
  }

  function renderNode(node, scope, parent, inSvg) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      parent.appendChild(document.createTextNode(t.indexOf('{{') >= 0 ? interp(t, scope) : t));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();
    if (tag === 'template' && node.getAttribute('data-sc')) {
      var kind = node.getAttribute('data-sc');
      var kids = node.content ? node.content.childNodes : node.childNodes;
      if (kind === 'if') {
        var m = WHOLE.exec(node.getAttribute('value') || '');
        var val = m ? lookup(m[1], scope) : node.getAttribute('value');
        if (val) renderChildren(kids, scope, parent, inSvg);
      } else {
        var lm = WHOLE.exec(node.getAttribute('list') || '');
        var list = lm ? lookup(lm[1], scope) : null;
        var as = node.getAttribute('as') || 'item';
        if (list && list.length) {
          for (var j = 0; j < list.length; j++) {
            var s = Object.create(scope);
            s[as] = list[j];
            s.$index = j;
            renderChildren(kids, s, parent, inSvg);
          }
        }
      }
      return;
    }
    if (tag === 'helmet') return;
    var svg = inSvg || tag === 'svg';
    var el = svg ? document.createElementNS(SVG_NS, node.tagName) : document.createElement(tag);
    var deferredValue;
    var attrs = node.attributes;
    for (var a = 0; a < attrs.length; a++) {
      var name = attrs[a].name, raw = attrs[a].value;
      if (name.indexOf('hint-') === 0) continue;
      var wm = WHOLE.exec(raw);
      if (/^on[a-z]/.test(name)) {
        var fn = wm ? lookup(wm[1], scope) : null;
        if (typeof fn === 'function') {
          var ev = name.slice(2);
          (function (f) { el.addEventListener(ev, function (e) { f(e); }); })(fn);
        }
        continue;
      }
      var v = wm ? lookup(wm[1], scope) : (raw.indexOf('{{') >= 0 ? interp(raw, scope) : raw);
      if (name === 'value' && (tag === 'input' || tag === 'select' || tag === 'textarea')) { deferredValue = v == null ? '' : String(v); continue; }
      if (BOOL_ATTRS[name] && !svg) {
        var on = wm ? (!!v && v !== 'false') : true;
        if (on) el.setAttribute(name, '');
        if (name === 'checked') el.checked = on;
        continue;
      }
      if (v === false && !/^aria-/.test(name)) continue;
      if (v == null) continue;
      el.setAttribute(name, typeof v === 'boolean' ? String(v) : v);
    }
    if (tag === 'template') { el.innerHTML = node.innerHTML; parent.appendChild(el); return; }
    renderChildren(node.childNodes, scope, el, svg && tag !== 'foreignobject');
    if (deferredValue !== undefined) el.value = deferredValue;
    parent.appendChild(el);
  }

  function keyOf(el, root) {
    var path = [];
    var n = el;
    while (n && n !== root) {
      var p = n.parentNode;
      if (!p) break;
      path.unshift(Array.prototype.indexOf.call(p.childNodes, n));
      n = p;
    }
    return path.join('.');
  }
  function byKey(root, key) {
    if (!key) return null;
    var n = root;
    var parts = key.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (!n || !n.childNodes) return null;
      n = n.childNodes[Number(parts[i])];
    }
    return n || null;
  }

  function boot() {
    var src = document.getElementById('dc-src');
    var script = document.querySelector('script[data-dc-script]');
    var mount = document.getElementById('dc-mount');
    if (!src || !script || !mount) return;
    var tpl = src;
    // helmet 里的样式提到 <head>
    tpl.content.querySelectorAll('helmet style, helmet link').forEach(function (n) { document.head.appendChild(n.cloneNode(true)); });
    mount.className = 'dc-mount';

    var Component = new Function('DCLogic', script.textContent + '\n;return Component;')(DCLogic);
    var inst = new Component({});
    var pending = false;

    function render() {
      pending = false;
      var vals = inst.renderVals ? inst.renderVals() : {};
      // 记住焦点与滚动位置，重绘后恢复
      var active = document.activeElement;
      var focusKey = null, focusLabel = null, selS = null, selE = null;
      if (active && mount.contains(active)) {
        focusKey = keyOf(active, mount);
        focusLabel = active.getAttribute('aria-label');
        try { selS = active.selectionStart; selE = active.selectionEnd; } catch (e) { /* not text */ }
      }
      var scrolls = [];
      mount.querySelectorAll('*').forEach(function (n) {
        if (n.scrollTop > 0 || n.scrollLeft > 0) scrolls.push([keyOf(n, mount), n.scrollTop, n.scrollLeft]);
      });
      var frag = document.createDocumentFragment();
      renderChildren(tpl.content.childNodes, vals, frag, false);
      mount.replaceChildren(frag);
      scrolls.forEach(function (s) {
        var n = byKey(mount, s[0]);
        if (n && n.nodeType === 1) { n.scrollTop = s[1]; n.scrollLeft = s[2]; }
      });
      if (focusKey !== null) {
        var target = null;
        if (focusLabel) target = mount.querySelector('[aria-label="' + focusLabel.replace(/"/g, '\\"') + '"]');
        if (!target) target = byKey(mount, focusKey);
        if (target && target.focus) {
          target.focus({ preventScroll: true });
          try { if (selS != null) target.setSelectionRange(selS, selE); } catch (e) { /* ignore */ }
        }
      }
    }
    inst.__schedule = function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(render);
    };
    render();
    if (typeof inst.componentDidMount === 'function') inst.componentDidMount();
    window.addEventListener('beforeunload', function () {
      if (typeof inst.componentWillUnmount === 'function') inst.componentWillUnmount();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
