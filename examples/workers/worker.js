require('../../index')(console, { format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' });
console.log('Log 1 from worker');
console.error('Error 1 from worker');
console.log('Log 2 from worker');
console.error('Error 2 from worker');
