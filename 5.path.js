const path = require('node:path');

//unir rutas con path.join 
console.log(path.sep); //no muestra la separacion de barras en el os

const filePath = path.join('.', 'content', 'subfolder', 'test.txt');
console.log(filePath);

const base = path.basename('/tmp/leo-secret-files/password.txt');
console.log(base)

const fileName = path.basename('/tmp/leo-secret-files/password.txt','.txt');
console.log(fileName)

const extension = path.extname('image.jpg')
console.log(extension)