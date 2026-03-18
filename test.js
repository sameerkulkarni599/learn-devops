const http = require("http");
  const server = require("./index");                                                                                   
                                                                                                                       
  function makeRequest(path) {                                                                                         
    return new Promise((resolve, reject) => {                                                                          
      const req = http.get(`http://localhost:3000${path}`, (res) => {                                                  
        let data = "";                                            
        res.on("data", (chunk) => (data += chunk));                                                                    
        res.on("end", () => resolve({ statusCode: res.statusCode, body: JSON.parse(data) }));
      });                                                                                                              
      req.on("error", reject);                                    
    });                                                                                                                
  }                                                               

  async function runTests() {
    let passed = 0;
    let failed = 0;                                                                                                    
                                                                                                                       
    try {                                                                                                              
      const res = await makeRequest("/");                                                                              
      if (res.statusCode === 200 && res.body.message.includes("Hello DevOps")) {
        console.log("PASS: Home route works");                                                                         
        passed++;                                                                                                      
      } else {                                                                                                         
        console.log("FAIL: Home route broken");                                                                        
        failed++;                                                                                                      
      }
    } catch (err) {                                                                                                    
      console.log("FAIL:", err.message);                          
      failed++;                                                                                                        
    }
                                                                                                                       
    try {                                                         
      const res = await makeRequest("/health");
      if (res.statusCode === 200 && res.body.status === "ok") {
        console.log("PASS: Health check works");                                                                       
        passed++;
      } else {                                                                                                         
        console.log("FAIL: Health check broken");                 
        failed++;
      }
    } catch (err) {                                                                                                    
      console.log("FAIL:", err.message);
      failed++;                                                                                                        
    }                                                             
                                                                                                                       
    try {                                                         
      const res = await makeRequest("/unknown");
      if (res.statusCode === 404) {
        console.log("PASS: 404 works for unknown routes");                                                             
        passed++;                                                                                                      
      } else {                                                                                                         
        console.log("FAIL: Should return 404");                                                                        
        failed++;                                                                                                      
      }                                                                                                                
    } catch (err) {                                                                                                    
      console.log("FAIL:", err.message);                                                                               
      failed++;                                                   
    }

    console.log(`\nResults: ${passed} passed, ${failed} failed`);                                                      
    server.close();
    process.exit(failed > 0 ? 1 : 0);                                                                                  
  }                                                               
                                                                                                                       
  runTests();
