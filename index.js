// middleware
module.exports = function (host = '127.0.0.1', port = 5500) {
    return function (req, res, next) {
        res.render = (view, options, callback) => {
            var app = req.app;
            var done = callback;
            var opts = options || {};

            // support callback function as second arg
            if (typeof options === 'function') {
                done = options;
                opts = {};
            }

            // merge res.locals
            opts._locals = res.locals;

            // default callback to respond
            done = done || function (err, str) {
                if (err) return req.next(err);

                const script = getScript(host, port);
                res.send(str.replace("</body>", `${script}</body>`));
            };

            // render
            app.render(view, opts, done);
        }

        next()
    }
}


function getScript(host, port) {
    return `<!-- vscode live server script -->
    <script>
        if ('WebSocket' in window) {
            (function () {
                function refreshCSS() {
                    var sheets = [].slice.call(document.getElementsByTagName("link"));
                    var head = document.getElementsByTagName("head")[0];
                    for (var i = 0; i < sheets.length; ++i) {
                        var elem = sheets[i];
                        var parent = elem.parentElement || head;
                        parent.removeChild(elem);
                        var rel = elem.rel;
                        if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                            var url = elem.href.replace(/(&|\\?)_cacheOverride=\\d+/, '');
                            elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
                        }
                        parent.appendChild(elem);
                    }
                }
                var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
                var address = protocol + "${host}:${port}" + window.location.pathname + '/ws';
                var socket = new WebSocket(address);
                socket.onmessage = function (msg) {
                    if (msg.data == 'reload') window.location.reload();
                    else if (msg.data == 'refreshcss') refreshCSS();
                };
                if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
                    console.log('Live reload enabled.');
                    sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
                }
            })();
        }
        else {
            console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
        }
    </script>`
}
