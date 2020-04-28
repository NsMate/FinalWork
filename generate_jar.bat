@echo off
cd .\business-frontend
echo "Compiling frontend..."
call ng build --prod
cd ..\BusinessBackend
cls
echo "Compiling backend of project..."
call mvn compile
cls
echo "Generating jar file..."
call mvn package
move target\*.jar, ..\
echo "Ready to use, just run the jar file and open localhost:8080/#/login in browser!"
pause