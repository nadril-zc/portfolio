# Resize-Thumbnails.ps1

Add-Type -AssemblyName System.Drawing

$sourceDir = Resolve-Path ".\src\assets\photos"
$destDir   = ".\src\assets\thumbnails"
$maxWidth  = 600
$quality   = 80

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}
$destDir = Resolve-Path $destDir

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
if (-not $jpegCodec) {
    Write-Error "Could not find JPEG codec."
    exit 1
}

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)

Get-ChildItem -Path $sourceDir -Filter *.jpg | ForEach-Object {
    $srcPath = $_.FullName
    $destPath = Join-Path $destDir $_.Name

    try {
        # Read via FileStream + load into a fresh Bitmap so the file handle releases immediately
        $fs = [System.IO.File]::OpenRead($srcPath)
        $original = [System.Drawing.Image]::FromStream($fs)

        $ratio = $maxWidth / $original.Width
        $newWidth  = [int]$maxWidth
        $newHeight = [int]($original.Height * $ratio)

        $thumb = New-Object System.Drawing.Bitmap $newWidth, $newHeight, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $graphics = [System.Drawing.Graphics]::FromImage($thumb)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.DrawImage($original, 0, 0, $newWidth, $newHeight)

        $thumb.Save($destPath, $jpegCodec, $encoderParams)

        Write-Host "Created thumbnail: $($_.Name)"
    }
    catch {
        Write-Warning "Failed on $($_.Name): $($_.Exception.Message)"
    }
    finally {
        if ($graphics)  { $graphics.Dispose() }
        if ($thumb)     { $thumb.Dispose() }
        if ($original)  { $original.Dispose() }
        if ($fs)        { $fs.Close() }
    }
}

Write-Host "Done. $((Get-ChildItem $destDir).Count) thumbnails created."