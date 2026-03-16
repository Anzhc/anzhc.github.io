@echo off
setlocal
cd /d "%~dp0"
title GitResume Dev Server
call npm run dev -- --open
