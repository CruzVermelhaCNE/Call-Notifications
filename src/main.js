// Modules to control application life and create native browser window
const {
    app,
    Menu,
    Tray,
    shell
} = require('electron');
const path = require('path')
const notifier = require('node-notifier');
const http = require('http');

function periodicNotification(notify_if_none = false) {
    http.get("http://callbacks.salop/missed_calls", function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var object = JSON.parse(body);
            let count = object.data.length;
            if (count > 0) {
                notifier.notify({
                    title: 'Chamadas Perdidas',
                    message: 'Existem ' + count + ' Chamadas Perdidas',
                    icon: path.join(__dirname, '/../resources/redcross.png'),
                    wait: true
                }, function () {
                    shell.openExternal("http://chamadasperdidas.salop");
                });
            }
            else if(notify_if_none) {
                notifier.notify({
                    title: 'Chamadas Perdidas',
                    message: 'Não Existem Chamadas Perdidas',
                    icon: path.join(__dirname, '/../resources/redcross.png'),
                    wait: true
                }, function () {
                    shell.openExternal("http://chamadasperdidas.salop");
                });
            }
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
    http.get("http://callbacks.salop/callbacks", function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var object = JSON.parse(body);
            let count = object.data.length;
            if (count > 0) {
                notifier.notify({
                    title: 'Chamadas Por Devolver',
                    message: 'Existem ' + count + ' Chamadas Por Devolver',
                    icon: path.join(__dirname, '/../resources/redcross.png'),
                    wait: true
                }, function () {
                    shell.openExternal("http://callbacks.salop");
                });
            }
            else if(notify_if_none) {
                notifier.notify({
                    title: 'Chamadas  Por Devolver',
                    message: 'Não Existem Chamadas Por Devolver',
                    open: "http://callbacks.salop",
                    icon: path.join(__dirname, '/../resources/redcross.png'),
                    wait: true
                }, function () {
                    shell.openExternal("http://callbacks.salop");
                });
            }
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
}

function createWindow() {
    periodicNotification(true);
    setInterval(periodicNotification, 5 * 60 * 1000);
    app.setAppUserModelId('org.cvp-coimbra.call_notifications');
    tray = new Tray('resources/redcross.png')
    tray.setToolTip('Notificações de Chamadas');
    const contextMenu = Menu.buildFromTemplate([{
            label: 'Lista de Chamadas Perdidas',
            type: 'normal',
            click() {
                shell.openExternal("http://chamadasperdidas.salop");
            }
        },
        {
            label: 'Lista de Chamadas Por Devolver',
            type: 'normal',
            click() {
                shell.openExternal("http://callbacks.salop");
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Verificar',
            type: 'normal',
            click() {
                periodicNotification();
            }
        }, {
            label: 'Sair',
            type: 'normal',
            click() {
                app.quit()
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
}

app.on('ready', createWindow)