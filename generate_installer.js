const electronInstaller = require('electron-winstaller')
const path = require('path');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join(__dirname, '/dist/app-win32-x64/'),
    outputDirectory: path.join(__dirname, '/dist/installer/'),
    authors: 'Miguel Santos - Cruz Vermelha Portuguesa',
    exe: 'app.exe',
    description: 'Notifies about Missed Calls and Calls to Return',
    title: 'Notificacoes de Chamadas',
    appId: 'org.cvp-coimbra.call_notifications',
    iconUrl: path.join(__dirname, '/resources/redcross.ico'),
    setupIcon: path.join(__dirname, '/resources/redcross.ico'),
    noMsi: false,
    version: '1.0.0'
});
resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));