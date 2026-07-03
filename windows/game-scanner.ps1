# RQBBOX MODE - Game Scanner
# Scans common game folders and returns installed games

$gamePaths = @(
    # Steam
    "C:\Program Files (x86)\Steam\steamapps\common",
    "C:\Program Files\Steam\steamapps\common",
    "$env:ProgramFiles(x86)\Steam\steamapps\common",
    "$env:ProgramFiles\Steam\steamapps\common",
    "$env:LOCALAPPDATA\Steam\steamapps\common",
    
    # Epic Games
    "C:\Program Files\Epic Games",
    "$env:ProgramFiles\Epic Games",
    "$env:LOCALAPPDATA\Epic Games",
    
    # GOG
    "C:\GOG Games",
    "C:\Program Files (x86)\GOG Galaxy\Games",
    "$env:ProgramFiles(x86)\GOG Galaxy\Games",
    
    # Xbox Game Pass
    "C:\Program Files\ModifiableWindowsApps",
    "$env:LOCALAPPDATA\Packages",
    
    # Origin/EA
    "C:\Program Files (x86)\Origin Games",
    "$env:ProgramFiles(x86)\Origin Games",
    
    # Ubisoft
    "C:\Program Files (x86)\Ubisoft\Ubisoft Game Launcher\games",
    "$env:ProgramFiles(x86)\Ubisoft\Ubisoft Game Launcher\games",
    
    # Battle.net
    "C:\Program Files (x86)\Overwatch",
    "C:\Program Files\Overwatch",
    
    # Default Games folder
    "C:\Games",
    "$env:USERPROFILE\Documents\My Games"
)

$games = @()

foreach ($path in $gamePaths) {
    if (Test-Path $path) {
        $dirs = Get-ChildItem -Path $path -Directory -ErrorAction SilentlyContinue
        foreach ($dir in $dirs) {
            # Check for executable files
            $exes = Get-ChildItem -Path $dir.FullName -Filter "*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($exes) {
                $games += @{
                    id = $dir.Name.ToLower() -replace '[^a-z0-9]', '-'
                    title = $dir.Name
                    path = $dir.FullName
                    exe = $exes[0].FullName
                    icon = "🎮"
                    category = "Installed"
                    source = "Local"
                }
            }
        }
    }
}

# Return as JSON
$games | ConvertTo-Json -Depth 3
