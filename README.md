# **DockerNodeRedisDemo**  
*A beginner-friendly Docker + Node.js + Redis example*  

🚀 **Perfect for learning** how to containerize a Node.js app with Redis using Docker!  

---

## **📌 Table of Contents**  
1. [What This Project Does](#-what-this-project-does)  
2. [Prerequisites](#-prerequisites)  
3. [Setup & Run](#-setup--run)  
4. [Understanding the Code](#-understanding-the-code)  
5. [Common Errors & Fixes](#-common-errors--fixes)  
6. [Next Steps](#-next-steps)  

---

## **🎯 What This Project Does**  
This project demonstrates:  
✅ **Dockerizing** a Node.js app  
✅ Connecting Node.js to **Redis** (a fast in-memory database)  
✅ Using **Docker Compose** to manage multiple containers  
✅ Basic **port-binding** and **volume mounting**  

**Use Case**: A simple web server that counts how many times you visit the page (using Redis).  

---

## **📋 Prerequisites**  
Before starting, ensure you have:  
1. **Docker Desktop** installed ([Download here](https://www.docker.com/products/docker-desktop))  
2. **Node.js** (v14+) (Optional, for local testing) ([Download here](https://nodejs.org/))  
3. Basic familiarity with:  
   - Terminal/Command Prompt  
   - JavaScript  

---

## **🚀 Setup & Run**  

### **Step 1: Clone the Project**  
```bash
git clone https://github.com/yourusername/DockerNodeRedisDemo.git
cd DockerNodeRedisDemo
```

### **Step 2: Build & Run with Docker Compose**  
```bash
docker-compose up --build
```
- This will:  
  - Build the Node.js app (`Dockerfile`)  
  - Start a Redis container  
  - Link them together  

### **Step 3: Open in Browser**  
Visit:  
👉 [http://localhost:8080](http://localhost:8080)  

You should see:  
```
"Number of visits: 1"  
```
Refresh to increment the counter!  

---

## **🔍 Understanding the Code**  

### **1. `docker-compose.yml`**  
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:3000"  # Maps host:8080 → container:3000
    depends_on:
      - redis
  redis:
    image: redis:alpine  # Lightweight Redis
    ports:
      - "6379:6379"  # Default Redis port
```
- **`web`**: Your Node.js app (built using `Dockerfile`)  
- **`redis`**: A Redis database container  

### **2. `Dockerfile`**  
```dockerfile
FROM node:18-alpine  # Lightweight Node.js
WORKDIR /app         # Sets working directory
COPY package*.json ./
RUN npm install      # Installs dependencies
COPY . .            # Copies all files
EXPOSE 3000         # Node.js runs on port 3000
CMD ["node", "src/server.js"]  # Starts the app
```

### **3. `src/server.js`**  
```javascript
const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({ 
  host: 'redis'  // Connects to the Redis container
});

app.get('/', async (req, res) => {
  const visits = await client.incr('visits'); // Increments Redis counter
  res.send(`Number of visits: ${visits}`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
- **`redis.createClient({ host: 'redis' })`** → Connects to the Redis container (Docker networking!)  
- **`client.incr('visits')`** → Increments a counter in Redis  

---

## **⚠️ Common Errors & Fixes**  

| **Error** | **Likely Cause** | **Fix** |
|-----------|------------------|---------|
| `Error: Cannot find module 'express'` | Dependencies not installed | Run `npm install` or rebuild with `docker-compose up --build` |
| `Redis connection failed` | Redis container not running | Check `docker ps` and ensure Redis is listed |
| `Port 8080 already in use` | Another app is using 8080 | Change `ports: "8081:3000"` in `docker-compose.yml` |
| `Cannot start service web` | Dockerfile missing | Ensure `Dockerfile` is in the project root |
| `node:internal/modules/cjs/loader: Error` | Wrong file path in `CMD` | Check `Dockerfile`'s `CMD` points to the right file |

💡 **Pro Tip**: Always check logs with:  
```bash
docker logs <container-name>  # e.g., docker logs dockernoderedisdemo_web_1
```

---

## **🚀 Next Steps**  
Now that it works, try:  
1. **Modifying the code**: Change the response message in `server.js`  
2. **Adding a new endpoint**:  
   ```javascript
   app.get('/hello', (req, res) => {
     res.send("Hello from Docker!");
   });
   ```
3. **Scaling Redis**: Add a `redis-commander` service in `docker-compose.yml` to monitor Redis  

---

## **🎉 Congrats! You Just Learned:**  
✔ Docker + Node.js + Redis basics  
✔ How `docker-compose` links services  
✔ Debugging common Docker issues  

**Star this repo if you found it helpful!** ⭐  

🔗 **More Learning**:  
- [Docker Official Docs](https://docs.docker.com/)  
- [Redis with Node.js Guide](https://redis.io/docs/clients/nodejs/)  

--- 


### **Terminal Cheat Sheet (Windows/macOS/Linux)**

#### **1. Clone the Project**
```bash
git clone https://github.com/yourusername/DockerNodeRedisDemo.git
cd DockerNodeRedisDemo
```

#### **2. Build and Run with Docker Compose**
```bash
docker-compose up --build
```
- **Expected Output**:
  ```
  Building web
  Step 1/6 : FROM node:18-alpine
  ...
  Successfully built abc123
  Starting dockernoderedisdemo_redis_1 ... done
  Starting dockernoderedisdemo_web_1   ... done
  web_1    | Server running on port 3000
  ```

#### **3. Verify Containers Are Running**
```bash
docker ps
```
- **Expected Output**:
  ```
  CONTAINER ID   IMAGE                PORTS                    NAMES
  abc123        dockernoderedisdemo_web  0.0.0.0:8080->3000/tcp   dockernoderedisdemo_web_1
  def456        redis:alpine         0.0.0.0:6379->6379/tcp    dockernoderedisdemo_redis_1
  ```

#### **4. Test the Application**
```bash
curl http://localhost:8080
# Or open in browser: http://localhost:8080
```
- **Expected Output**:
  ```
  Number of visits: 1
  ```

#### **5. View Logs (If Errors Occur)**
```bash
# Web service logs
docker logs dockernoderedisdemo_web_1

# Redis logs
docker logs dockernoderedisdemo_redis_1
```

#### **6. Stop and Clean Up**
```bash
# Stop containers (keep data)
docker-compose down

# Stop and delete everything (including volumes)
docker-compose down -v
```

---

### **Debugging Commands**

#### **1. Check Redis Connection**
```bash
docker exec -it dockernoderedisdemo_redis_1 redis-cli
> GET visits  # Should return the visit count
> exit
```

#### **2. Enter the Node.js Container (For Debugging)**
```bash
docker exec -it dockernoderedisdemo_web_1 sh
/app # ls src/      # Verify server.js exists
/app # exit
```

#### **3. Rebuild After Code Changes**
```bash
# After modifying server.js or package.json:
docker-compose up --build
```

---

### **Common Errors and Fixes**

#### **Error: Port 8080 Already in Use**
```bash
# Find the conflicting process
netstat -ano | grep 8080  # Linux/macOS
netstat -ano | findstr 8080  # Windows

# Kill the process (Windows)
taskkill /PID <PID> /F
```

#### **Error: "Cannot find module"**
```bash
# Reinstall dependencies inside the container
docker exec dockernoderedisdemo_web_1 npm install
docker-compose restart web
```

#### **Error: Redis Connection Failed**
```bash
# Verify Redis is running
docker ps | grep redis

# Check network connectivity
docker exec dockernoderedisdemo_web_1 ping redis
```

---

### **Full Lifecycle Example**
```bash
# Start fresh
git clone https://github.com/yourusername/DockerNodeRedisDemo.git
cd DockerNodeRedisDemo
docker-compose up --build

# Test in another terminal
curl http://localhost:8080  # Should increment visits

# Clean up
docker-compose down -v
```

---


This workflow ensures you can experiment, debug, and clean up easily! 🐳💻

**Happy Coding!** 🐳🚀
