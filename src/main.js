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


if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};

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
                });
            } else if (notify_if_none) {
                notifier.notify({
                    title: 'Chamadas Perdidas',
                    message: 'Não Existem Chamadas Perdidas',
                    icon: path.join(__dirname, '/../resources/redcross.png'),
                    wait: true
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
                });
            } else if (notify_if_none) {
                notifier.notify({
                    title: 'Chamadas  Por Devolver',
                    message: 'Não Existem Chamadas Por Devolver',
                    icon: path.join(__dirname, '/../resources/redcross.png'),
                    wait: true
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
    tray = new Tray(path.join(__dirname, '/../resources/redcross.png'), )
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