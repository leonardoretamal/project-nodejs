const os = require('node:os') //desde la version 16 ya no es recomendable usar el nombre dle modulo.

console.log('Informacion del sistema operativo:')
console.log('---------------------------------------')

console.log('Nombre del sistema operativo: ', os.platform())
console.log('Version del sistema operativo: ', os.release())
console.log('Arquitectura: ', os.arch())
console.log('CPUs', os.cpus()) //<- con esto vamos  a poder escalar procesos en node
console.log('Memoria libre: ', os.freemem() / 1024 / 1024)
console.log('Memoria total: ', os.totalmem() /1024 / 1024)
console.log('uptime: ', os.uptime() / 60 / 60)