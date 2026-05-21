$files = @(
    "c:\Users\MML\Documents\projek2\projek2\index.html", 
    "c:\Users\MML\Documents\projek2\projek2\jscp\main.js", 
    "c:\Users\MML\Documents\projek2\projek2\jscp\settings.js", 
    "c:\Users\MML\Documents\projek2\projek2\jscp\ui.js", 
    "c:\Users\MML\Documents\projek2\projek2\lang.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        $newContent = $content -replace 'HAPPYBIRTHDAY', 'HAPPYANNIVERSARY'
        $newContent = $newContent -replace 'HAPPY\|BIRTHDAY', 'HAPPY|ANNIVERSARY'
        $newContent = $newContent -replace 'Happy Birthday', 'Happy Anniversary'
        $newContent = $newContent -replace 'happy birthday', 'happy anniversary'
        $newContent = $newContent -replace 'HAPPY BIRTHDAY', 'HAPPY ANNIVERSARY'
        
        if ($content -cne $newContent) {
            [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Updated $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}
