@echo off
chcp 1251>nul
title ClosePort
if exist %SystemRoot%\NamePort ( set /p openname=<%SystemRoot%\NamePort ) else ( @echo off )
netsh advfirewall firewall show rule name=%openname%>nul
if %errorlevel% == 1 goto Create
if %errorlevel% == 0 goto Delete
goto end
:Create
set port=9090
echo %port%>%SystemRoot%\NamePort
netsh advfirewall firewall add rule name=%port% protocol=TCP localport=%port% action=deny dir=in
netsh advfirewall firewall add rule name=%port% protocol=UDP localport=%port% action=deny dir=in
netsh advfirewall firewall add rule name=%port% protocol=TCP localport=%port% action=deny dir=out
netsh advfirewall firewall add rule name=%port% protocol=UDP localport=%port% action=deny dir=out
goto end
:Delete
netsh advfirewall firewall delete rule name=%openname%
del %SystemRoot%\NamePort
goto end
:end