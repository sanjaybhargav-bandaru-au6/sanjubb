import { createServer } from 'http';
import app from "./app";
const port = parseInt(process.env.Port,10) || 1234 ;
app.set('port', port);

const server =createServer(app);
server.listen(port);

// app.listen(1234,() => console.log(`server connected at ${1234}`) );
