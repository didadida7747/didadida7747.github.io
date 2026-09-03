[CmdletBinding()]
param(
    [ValidateScript({ $_ -match '^\d{4}-\d{2}-\d{2}$' })]
    [string]$Date = (Get-Date -Format 'yyyy-MM-dd'),

    [string]$ValidateReport
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$env:PYTHONUTF8 = '1'
$projectRoot = Split-Path -Parent $PSScriptRoot
$logDirectory = Join-Path $projectRoot 'logs'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$logPath = Join-Path $logDirectory ("{0}.log" -f $Date)

function Invoke-LoggedPython {
    param([string[]]$Arguments)

    $previousErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    & python @Arguments 2>&1 | Tee-Object -FilePath $logPath -Append
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorAction
    if ($exitCode -ne 0) {
        throw "Python command failed with exit code $exitCode. See $logPath"
    }
}

if ($ValidateReport) {
    $reportPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($ValidateReport)
    Invoke-LoggedPython -Arguments @(
        (Join-Path $PSScriptRoot 'validate.py'),
        '--root', $projectRoot,
        '--date', $Date,
        '--report', $reportPath
    )
    exit 0
}

Invoke-LoggedPython -Arguments @(
    (Join-Path $PSScriptRoot 'collect.py'),
    '--root', $projectRoot,
    '--date', $Date
)
Invoke-LoggedPython -Arguments @(
    (Join-Path $PSScriptRoot 'validate.py'),
    '--root', $projectRoot,
    '--date', $Date
)
