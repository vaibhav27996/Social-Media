class ChatEngine{
    constructor(chatBoxId, userEmail,userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect('http://52.91.126.77:5000');

        if (this.userEmail){
            this.connectionHandler();
        }
    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                user_name:self.userName,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name:self.userName,
                    chatroom: 'codeial'
                });
            }
        });


        $('#chat-message-input').keydown(function(event) {
           
            if (event.keyCode == 13) {
                let msg = $('#chat-message-input').val();

                if (msg != ''){
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        user_name:self.userName,
                        chatroom: 'codeial'
                    });
                }
            }
          });
        

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $(`<li>
                        <p>
                            <span>${data.user_name}</span><br>
                            ${data.message}
                        </p>
            
            
            </li>`);

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            // newMessage.append($('<p>', {
            //     'html': data.user_name
            // }));

            // newMessage.append($('<p>', {
            //     'html': data.message
            // }));

            

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
             $('#chat-message-input').val('');

        })
    }
}