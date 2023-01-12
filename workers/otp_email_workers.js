const queue=require('../config/kue');


const otpMailter=require('../mailers/otps_mailer');

queue.process('emails',function(job,done){
    console.log('emila workers is processing a job',job.data);

    otpMailter.otpSent(job.data);

    done();
})