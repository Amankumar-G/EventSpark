# Set the root directory and the output file
$rootFolder = "E:\Codings\intern\eventspark/src/app/api"
$outputFile = "E:\Codings\intern\eventspark\CombinedFile.txt"

# Clear output file if it already exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Get all files recursively
$files = Get-ChildItem -Path $rootFolder -Recurse -File

foreach ($file in $files) {
    try {
        # Read content safely (skip binary files)
        $content = Get-Content -Path $file.FullName -ErrorAction Stop

        # Add the file path and content to the output file
        Add-Content -Path $outputFile -Value "### File: $($file.FullName) ###"
        Add-Content -Path $outputFile -Value $content
        Add-Content -Path $outputFile -Value "`n`n"  # Add spacing between files
    }
    catch {
        Write-Warning "Could not read $($file.FullName): $_"
    }
}

Write-Output "✅ All contents combined into: $outputFile"
