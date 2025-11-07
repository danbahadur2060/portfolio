$p = Start-Process node -ArgumentList 'server.js' -WorkingDirectory "$PSScriptRoot" -PassThru
Start-Sleep -Seconds 4

function GetStatus($url){
  try { (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5).StatusCode }
  catch { 0 }
}

$root = GetStatus 'http://localhost:3000/'
$about = GetStatus 'http://localhost:3000/api/getabout'
$homeStatus = GetStatus 'http://localhost:3000/api/gethomecontent'
$blogs = GetStatus 'http://localhost:3000/api/getblogs'
$projects = GetStatus 'http://localhost:3000/api/getallproject'

[PSCustomObject]@{
  RootStatus = $root
  AboutStatus = $about
  HomeStatus = $homeStatus
  BlogsStatus = $blogs
  ProjectsStatus = $projects
} | ConvertTo-Json -Compress

$p | Stop-Process -Force
