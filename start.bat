@echo off
chcp 65001 >nul
title Tsukiyo Blog - Start
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start.ps1" %*
if errorlevel 1 pause