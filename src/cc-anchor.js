
function offsetTop(dom) {
    if(!dom) return 0;
    return offsetTop(dom.offsetParent) + dom.offsetTop;
}

function easeIn(t, b, c, d) {
    return c * (t /= d) * t * t + b;
}

function throttle(fn, wait, immediate) {
    let prev, last = 0, tid, pending = true, context = this;
    function exec(args) {
        fn.apply(context, args);
        last = prev;
        pending = true;
    }
    return function() {
        prev = Date.now();
        let args = arguments;
        if(prev - last > wait && immediate) {
            clearTimeout(tid);
            exec(args);
        } else {
            if(pending) {
                pending = false;
                tid = setTimeout(exec, wait);
            }
        }
    }
}

function animate(ops) {
    let t = ops.t, d = ops.d, b = ops.b, c = ops.c;
    _animate(t, b, c, d);
    function _animate(t, b, c, d) {
        ops.onAnimate(easeIn(t, b, c, d) | 0);
        if(t >= d) {
            ops.onAnimateEnd();
        } else {
            t++;
            setTimeout(function() {
                _animate(t, b, c, d);
            }, 16);
        }
    }
}

function ccAnchor(Vue) {
    Vue.directive('cc-anchor', {
       bind(el, binding, vnode) {
           let doms, options, index, key = '$anchor', tp = 0, offset = 0;
           doms = [].slice.call(el.children);
           options = {
               offset: 0,
               animation: true,
               target: window
           };
           if(binding.arg) key = binding.arg;
           let fn = throttle(function() {
               tp = options.target === window ? document.body.scrollTop || document.documentElement.scrollTop : options.target.scrollTop;
               for(let i = 0, l = doms.length; i < l; i++) {
                   let top = offsetTop(doms[i]) + options.offset - offset;
                   if(i === 0 && tp < top) {
                       index = '';
                       change();
                       break;
                   } else if(i === l - 1 && tp > top + doms[i].offsetHeight) {
                       index = '';
                       change();
                       break;
                   }
                   if(i !== index && tp >= top && tp < top + doms[i].offsetHeight) {
                       index = i;
                       change();
                       break;
                   }
               }
           }, 100, true);
           vnode.context[key] = {
               goto,
               setOptions: function(ops) {
                   options = Object.assign(options, ops);
                   if(options.target !== window) {
                       offset = offsetTop(options.target);
                   }
                   fn();
                   addEvent();
               },
               update: function() {
                   doms = [].slice.call(el.children)
               }
           };
           function addEvent() {
               setTimeout(() => {
                   tp = options.target === window ? document.body.scrollTop || document.documentElement.scrollTop : options.target.scrollTop;
                   options.target.addEventListener('scroll', fn);
               });
           }
           function goto(i) {
               index = i;
               options.target.removeEventListener('scroll', fn);
               if(!options.animation) {
                   options.target.scrollTo(0, offsetTop(doms[i]) + options.offset - offset);
                   change();
                   addEvent();
               } else {
                   change();
                   animate({
                       t: 0,
                       d: 300 / 16 | 0,
                       b: tp,
                       c: offsetTop(doms[i]) + options.offset - tp - offset,
                       onAnimate: function(n) {
                           options.target.scrollTo(0, n);
                       },
                       onAnimateEnd: function() {
                           addEvent();
                       }
                   })
               }
           }
           function change() {
               if(typeof options.onChange === 'function') {
                   options.onChange(index);
               }
           }
       }
    });
}

export default ccAnchor;