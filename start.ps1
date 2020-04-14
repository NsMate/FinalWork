cd BusinessBackend
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess
mvn spring-boot:run
#(cd frontend/morse-chat-client;lsof -ti tcp:8080 | xargs kill; npm install; npx ng serve) &&
