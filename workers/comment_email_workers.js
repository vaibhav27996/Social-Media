const queue=require('../config/kue');


const commetMailter=require('../mailers/comments_mailer');

queue.process('emails',function(job,done){
    console.log('emila workers is processing a job',job.data);

    commetMailter.newComment(job.data);

    done();
})