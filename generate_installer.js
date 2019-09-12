const electronInstaller = require('electron-winstaller')
const path = require('path');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join(__dirname, '/dist/notificacoes_chamadas-win32-x64/'),
    outputDirectory: path.join(__dirname, '/dist/installer/'),
    authors: 'Miguel Santos - Cruz Vermelha Portuguesa',
    exe: 'notificacoes_chamadas.exe',
    name: 'org.cvp-coimbra.call_notifications',
    description: 'Notificações de Chamadas',
    appId: 'org.cvp-coimbra.call_notifications',
    iconUrl: path.join(__dirname, '/resources/redcross.ico'),
    setupIcon: path.join(__dirname, '/resources/redcross.ico'),
    noMsi: true,
    version: '1.0.6'
});
resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));