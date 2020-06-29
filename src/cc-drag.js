function change(tdx, sdx, data) {
    let tmp = data[sdx], i;
    if(sdx < tdx) {
        for(i = sdx; i < tdx; i++) {
            data[i] = data[i + 1];
        }
    } else {
        for(i = sdx; i > tdx; i--) {
            data[i] = data[i - 1];
        }
    }
    data[i] = tmp;
}
function scrollTop(dom) {
    if(dom.nodeName === 'BODY') return 0;
    return scrollTop(dom.parentNode) + (dom.scrollTop || 0);
}
function scrollLeft(dom) {
    if(dom.nodeName === 'BODY') return 0;
    return scrollLeft(dom.parentNode) + (dom.scrollLeft || 0);
}
function offsetTop(dom) {
    if(!dom) return 0;
    return offsetTop(dom.offsetParent) + dom.offsetTop;
}
function offsetLeft(dom) {
    if(!dom) return 0;
    return offsetLeft(dom.offsetParent) + dom.offsetLeft;
}
function findParent(target, el, dom) {
    if(target === dom) return true;
    if(target === el) return false;
    return findParent(target.parentNode, el, dom);
}
function getMargin(dom) {
    let d = getComputedStyle(dom);
    return {
        top: parseInt(d.marginTop),
        bottom: parseInt(d.marginBottom),
        left: parseInt(d.marginLeft),
        right: parseInt(d.marginRight)
    }
}

function ccDrag(Vue) {
    Vue.directive('cc-drag', {
        bind: function(el, binding) {
            let ops = '';
            if(typeof binding.value === 'function') ops = binding.value();
            else if(typeof binding.value === 'object') ops = binding.value;
            else ops = {static: true};
            let options = Object.assign({
                    direction: 'v',
                    offsetY: 0,
                    static: false,
                    offsetX: 0,
                    activeClass: '',
                    zIndex: 9
                }, ops);
            let targetIndex = 0, sourceIndex = 0, nIndex = 0, doms, node, height, width, x, y, tp, lt, target, cc, ob = [], min, max;
            el.addEventListener('mousedown', function(e) {
                if(['SELECT', 'INPUT', 'TEXTAREA'].indexOf(e.target.nodeName) > -1) return;
                min = 999999;
                max = -999999;
                doms = [].slice.call(el.children);
                ob = [];
                target = null;
                e.preventDefault();
                doms.forEach((dom, i) => {
                    let mg = getMargin(dom);
                    ob.push({
                        t: offsetTop(dom) - scrollTop(el),
                        l: offsetLeft(dom) - scrollLeft(el),
                        v: 0,
                        h: 0,
                        flag: 0,
                        mgtb: Math.max(mg.top, mg.bottom),
                        mglr: Math.max(mg.left, mg.right)
                    });
                    if(findParent(e.target, el, dom)) {
                        target = dom;
                        sourceIndex = i;
                        targetIndex = i;
                        nIndex = i;
                        node = dom.cloneNode(true);
                        if(options.activeClass) {
                            let c = node.className.split(' ');
                            c.push(options.activeClass);
                            node.className = c.join(' ');
                        }
                        tp = offsetTop(dom) - scrollTop(el);
                        lt = offsetLeft(dom) - scrollLeft(el);
                        cc = document.createElement('div');
                        cc.style.cssText = `overflow:hidden;position:absolute;top:${tp}px;width:${dom.offsetWidth+mg.left}px;z-index:${options.zIndex};left:${offsetLeft(dom)}px;margin-left:-${mg.left}px;margin-top:-${mg.top}px`;
                        node.style.width = '100%';
                        node.style.margin = getComputedStyle(dom).margin;
                        cc.appendChild(node);
                        dom.style.cssText = `visibility:hidden`;
                        height = dom.offsetHeight;
                        width = dom.offsetWidth;
                        document.body.appendChild(cc);
                    } else {
                        dom.style.transform = 'translate3d(0,0,0)';
                        dom.style.transitionDuration = '0.3s';
                    }
                });
                if(!target) {
                    return doms.forEach(dom => {
                        dom.style.transform = '';
                        dom.style.transitionDuration = '';
                    });
                }
                ob.forEach(d => {
                    min = Math.min(d.l, min);
                    max = Math.max(d.l, max);
                });
                y = e.clientY;
                x = e.clientX;
                document.addEventListener('mouseup', up);
                document.addEventListener('mousemove', move);
            });
            function move(e) {
                e.preventDefault();
                let dy = e.clientY - y;
                let dx = e.clientX - x;
                let top = tp + dy;
                let left = lt + dx;
                let pv = dy > 0 ? -height : height;
                let ph = dx > 0 ? -width : width;
                let minv = Math.min(tp, top);
                let maxv = Math.max(tp, top);
                let minh = Math.min(lt, left);
                let maxh = Math.max(lt, left);
                if(options.direction === 'v') {
                    cc.style.top = top + 'px';
                    doms.forEach((dom, i) => {
                        let t = ob[i].t, v = ob[i].v;
                        if(dom !== target && maxv > t - height / 2 + v && t + height / 2 + v > minv) {
                            targetIndex = i;
                            v = pv > 0 ? pv + ob[i].mgtb + options.offsetY: pv - ob[i].mgtb - options.offsetY;
                            if(ob[i].v !== 0 && v !== ob[i].v) {
                                targetIndex = v < 0 ? targetIndex + 1 : targetIndex - 1;
                                v = 0;
                            }
                            ob[i].v = v;
                            dom.style.transform = `translate3d(0,${v}px,0)`;
                        }
                    });
                } else if(options.direction === 'h') {
                    cc.style.left = left + 'px';
                    doms.forEach((dom, i) => {
                        let l = ob[i].l, h = ob[i].h;
                        if(dom !== target && maxh > l - width / 2 + h && l + width / 2 + h > minh) {
                            targetIndex = i;
                            h = ph > 0 ? ph + ob[i].mglr + options.offsetX : ph - ob[i].mglr - options.offsetX;
                            if(ob[i].h !== 0 && h !== ob[i].h) {
                                targetIndex = h < 0 ? targetIndex + 1 : targetIndex - 1;
                                h = 0;
                            }
                            ob[i].h = h;
                            dom.style.transform = `translate3d(${h}px,0,0)`;
                        }
                    });
                } else if(options.direction === 'vh') {
                    cc.style.left = left + 'px';
                    cc.style.top = top + 'px';
                    ob.forEach((o, i) => {
                        let l = ob[i].l, h = ob[i].h, t = ob[i].t, v = ob[i].v;
                        if(i !== nIndex && maxv > t - height / 2 + v && t + height / 2 + v > minv && maxh > l - width / 2 + h && l + width / 2 + h > minh) {
                            let m;
                            targetIndex = i;
                            if(i > nIndex) {
                                for(m = nIndex + 1; m <= i; m++) {
                                    h = -width - ob[m].mglr - options.offsetX;
                                    ob[m - 1].flag = 1;
                                    v = 0;
                                    if(ob[m].l === min) {
                                        h = ob[m - 1].l - min + ob[m - 1].mglr - options.offsetX;
                                        v = -height - ob[m].mgtb - options.offsetY;
                                    }
                                    if(ob[m].flag) {
                                        h = 0;
                                        v = 0;
                                        ob[m].flag = 0;
                                        ob[m - 1].flag = 0;
                                    }
                                    doms[m].style.transform = `translate3d(${h}px,${v}px,0)`;
                                }
                            } else {
                                for(m = nIndex - 1; m >= i; m--) {
                                    h = width + ob[m].mglr + options.offsetX;
                                    ob[m + 1].flag = 1;
                                    v = 0;
                                    if(ob[m].l === max) {
                                        h = ob[m + 1].l - max - ob[m + 1].mglr + options.offsetX;
                                        v = height + ob[m].mgtb + options.offsetY;
                                    }
                                    if(ob[m].flag) {
                                        h = 0;
                                        v = 0;
                                        ob[m].flag = 0;
                                        ob[m + 1].flag = 0;
                                    }
                                    doms[m].style.transform = `translate3d(${h}px,${v}px,0)`;
                                }
                            }
                            change(targetIndex, nIndex, doms);
                            nIndex = targetIndex;
                        }
                    });
                }
                lt = left;
                tp = top;
                y = e.clientY;
                x = e.clientX;
            }

            function up() {
                cc.style.transitionDuration = '0.3s';
                switch(options.direction) {
                    case 'v':
                        cc.style.top = `${ob[targetIndex].t}px`;
                        break;
                    case 'h':
                        cc.style.left = `${ob[targetIndex].l}px`;
                        break;
                    case 'vh':
                        cc.style.top = `${ob[targetIndex].t}px`;
                        cc.style.left = `${ob[targetIndex].l}px`;
                        break;
                }
                setTimeout(() => {
                    cc.remove();
                    doms.forEach(dom => {
                        target.style.visibility = '';
                        dom.style.transform = '';
                        dom.style.transitionDuration = '';
                    });
                    if(options.static) {
                        if(options.direction === 'v' || options.direction === 'h') {
                            change(targetIndex, sourceIndex, doms);
                        }
                        let frag = document.createDocumentFragment();
                        doms.forEach(dom => frag.appendChild(dom));
                        el.appendChild(frag);
                    }
                    if(typeof options.onChange === 'function') {
                        if(options.static) {
                            options.onChange(targetIndex, sourceIndex);
                        } else {
                            options.onChange(function(data) {
                                if(!data instanceof Array) return data;
                                if(sourceIndex === targetIndex) return data;
                                data = JSON.parse(JSON.stringify(data));
                                change(targetIndex, sourceIndex, data);
                                return data;
                            }, targetIndex, sourceIndex);
                        }
                    }
                }, 300);
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }
        }
    })
}

export default ccDrag;