class ChatEngine{constructor(e,s,a){this.chatBox=$(`#${e}`),this.userEmail=s,this.userName=a,this.socket=io.connect("http://52.91.126.77:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(function(){console.log("connection established using sockets...!"),e.socket.emit("join_room",{user_email:e.userEmail,user_name:e.userName,chatroom:"codeial"}),e.socket.on("user_joined",(function(e){console.log("a user joined!",e)}))})),$("#send-message").click((function(){let s=$("#chat-message-input").val();""!=s&&e.socket.emit("send_message",{message:s,user_email:e.userEmail,user_name:e.userName,chatroom:"codeial"})})),$("#chat-message-input").keydown((function(s){if(13==s.keyCode){let s=$("#chat-message-input").val();""!=s&&e.socket.emit("send_message",{message:s,user_email:e.userEmail,user_name:e.userName,chatroom:"codeial"})}})),e.socket.on("receive_message",(function(s){console.log("message received",s.message);let a=$(`<li>\n                        <p>\n                            <span>${s.user_name}</span><br>\n                            ${s.message}\n                        </p>\n            \n            \n            </li>`),n="other-message";s.user_email==e.userEmail&&(n="self-message"),a.addClass(n),$("#chat-messages-list").append(a),$("#chat-message-input").val("")}))}}