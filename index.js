const http = require("http");                                                                                        
                                                                                                                       
  const PORT = 3000;                                                                                                   
                                                                                                                     
  const server = http.createServer((req, res) => {                                                                     
    if (req.url === "/") {                                                                                           
      res.writeHead(200, { "Content-Type": "application/json" });                                                      
      res.end(JSON.stringify({ message: "Hello DevOps! Your first CI/CD project is running." }));                    
    } else if (req.url === "/health") {                                                                                
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));                                                                       
    } else {                                                                                                           
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));                                                                 
    }                                                                                                                
  });                                                                                                                  
                                                                                                                     
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });                                                                                                                  
   
  module.exports = server;

