Add-Type -AssemblyName System.Drawing

$sourcePath = "d:\Node Apps\Print-Plaza\public\brand\print-plaza-icon.png"
$srcImg = [System.Drawing.Bitmap]::FromFile($sourcePath)

function Resize-Bitmap($img, [int]$width, [int]$height) {
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $destImg = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($destImg)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, $destRect, 0, 0, $img.Width, $img.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    return $destImg
}

# 32x32 PNG
$png32 = Resize-Bitmap $srcImg 32 32
$png32.Save("d:\Node Apps\Print-Plaza\public\favicon-32x32.png", [System.Drawing.Imaging.ImageFormat]::Png)
$png32.Dispose()

# 16x16 PNG
$png16 = Resize-Bitmap $srcImg 16 16
$png16.Save("d:\Node Apps\Print-Plaza\public\favicon-16x16.png", [System.Drawing.Imaging.ImageFormat]::Png)
$png16.Dispose()

# 180x180 Apple Touch Icon
$appleTouch = Resize-Bitmap $srcImg 180 180
$appleTouch.Save("d:\Node Apps\Print-Plaza\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$appleTouch.Save("d:\Node Apps\Print-Plaza\public\brand\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$appleTouch.Dispose()

# 192x192 Webmanifest Icon
$icon192 = Resize-Bitmap $srcImg 192 192
$icon192.Save("d:\Node Apps\Print-Plaza\public\brand\print-plaza-icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$icon192.Dispose()

# 512x512 Webmanifest Icon
$icon512 = Resize-Bitmap $srcImg 512 512
$icon512.Save("d:\Node Apps\Print-Plaza\public\brand\print-plaza-icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$icon512.Dispose()

# Favicon.ico from 32x32 bitmap
$png32Bmp = Resize-Bitmap $srcImg 32 32
$iconHandle = $png32Bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$fileStream = New-Object System.IO.FileStream("d:\Node Apps\Print-Plaza\public\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fileStream)
$fileStream.Close()
$icon.Dispose()
$png32Bmp.Dispose()

$srcImg.Dispose()
Write-Output "Generated all icons successfully"
