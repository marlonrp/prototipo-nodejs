console.log("worker started");
const queue = require("../rabbitmq");
queue.consume("fila1", message => {
    //process the message
    console.log("processing " + message.content.toString());
})
